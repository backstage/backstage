/*
 * Copyright 2021 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  Entity,
  entityEnvelopeSchemaValidator,
  EntityPolicy,
  EntityRelationSpec,
  entitySchemaValidator,
  LocationEntity,
  LocationSpec,
  LOCATION_ANNOTATION,
  ORIGIN_LOCATION_ANNOTATION,
  parseLocationReference,
  stringifyEntityRef,
  stringifyLocationReference,
} from '@backstage/catalog-model';
import { ConflictError, InputError } from '@backstage/errors';
import { ScmIntegrationRegistry } from '@backstage/integration';
import path from 'path';
import { Logger } from 'winston';
import {
  CatalogProcessor,
  CatalogProcessorParser,
  CatalogProcessorResult,
} from '../ingestion/processors';
import * as results from '../ingestion/processors/results';
import {
  CatalogProcessingOrchestrator,
  EntityProcessingRequest,
  EntityProcessingResult,
} from './types';
import { locationSpecToLocationEntity } from './util';

const validateEntity = entitySchemaValidator();
const validateEntityEnvelope = entityEnvelopeSchemaValidator();

function isLocationEntity(entity: Entity): entity is LocationEntity {
  return entity.kind === 'Location';
}

function getEntityLocationRef(entity: Entity): string {
  const ref = entity.metadata.annotations?.[LOCATION_ANNOTATION];
  if (!ref) {
    const entityRef = stringifyEntityRef(entity);
    throw new InputError(`Entity '${entityRef}' does not have a location`);
  }
  return ref;
}

function getEntityOriginLocationRef(entity: Entity): string {
  const ref = entity.metadata.annotations?.[ORIGIN_LOCATION_ANNOTATION];
  if (!ref) {
    const entityRef = stringifyEntityRef(entity);
    throw new InputError(
      `Entity '${entityRef}' does not have an origin location`,
    );
  }
  return ref;
}

function toAbsoluteUrl(
  integrations: ScmIntegrationRegistry,
  base: LocationSpec,
  type: string,
  target: string,
): string {
  if (base.type !== type) {
    return target;
  }
  try {
    if (type === 'file') {
      if (target.startsWith('.')) {
        return path.join(path.dirname(base.target), target);
      }
      return target;
    } else if (type === 'url') {
      return integrations.resolveUrl({ url: target, base: base.target });
    }
    return target;
  } catch (e) {
    return target;
  }
}

export class DefaultCatalogProcessingOrchestrator
  implements CatalogProcessingOrchestrator {
  constructor(
    private readonly options: {
      processors: CatalogProcessor[];
      integrations: ScmIntegrationRegistry;
      logger: Logger;
      parser: CatalogProcessorParser;
      policy: EntityPolicy;
    },
  ) {}

  async process(
    request: EntityProcessingRequest,
  ): Promise<EntityProcessingResult> {
    // TODO: implement dryRun/eager
    return this.processSingleEntity(request.entity);
  }

  private async processSingleEntity(
    unprocessedEntity: Entity,
  ): Promise<EntityProcessingResult> {
    const emitter = createEmitter(this.options.logger, unprocessedEntity);
    try {
      // This will be checked and mutated step by step below
      let entity: Entity = unprocessedEntity;

      // NOTE: At this early point, we can only rely on the envelope having to
      // be valid; full entity + kind validation happens after the (potentially
      // mutative) pre-steps. This means that the code below can't make a lot
      // of assumptions about the data despite it using the Entity type.
      try {
        validateEntityEnvelope(entity);
      } catch (e) {
        throw new InputError(
          `Entity envelope failed validation before processing`,
          e,
        );
      }

      const entityRef = stringifyEntityRef(entity);
      // TODO: which one do we actually use here? source-location? - maybe probably doesn't exist yet?
      const locationRef = getEntityLocationRef(entity);
      const location = parseLocationReference(locationRef);
      const originLocation = parseLocationReference(
        getEntityOriginLocationRef(entity),
      );

      // Pre-process phase, used to populate entities with data that is required during main processing step
      for (const processor of this.options.processors) {
        if (processor.preProcessEntity) {
          try {
            entity = await processor.preProcessEntity(
              entity,
              location,
              emitter.emit,
              originLocation,
            );
          } catch (e) {
            throw new InputError(
              `Processor ${processor.constructor.name} threw an error while preprocessing`,
              e,
            );
          }
        }
      }

      // Enforce entity policies making sure that entities conform to a general schema
      let policyEnforcedEntity: Entity | undefined;
      try {
        policyEnforcedEntity = await this.options.policy.enforce(entity);
      } catch (e) {
        throw new InputError('Policy check failed', e);
      }
      if (!policyEnforcedEntity) {
        throw new Error('Policy unexpectedly returned no data');
      }
      entity = policyEnforcedEntity;

      // Validate that the end result is a valid Entity at all
      try {
        validateEntity(entity);
      } catch (e) {
        throw new ConflictError(
          `Entity envelope failed validation after preprocessing`,
          e,
        );
      }

      // Validate the given entity kind against its schema
      let didValidate = false;
      for (const processor of this.options.processors) {
        if (processor.validateEntityKind) {
          try {
            didValidate = await processor.validateEntityKind(entity);
            if (didValidate) {
              break;
            }
          } catch (e) {
            throw new InputError(
              `Processor ${processor.constructor.name} threw an error while validating the entity`,
              e,
            );
          }
        }
      }
      if (!didValidate) {
        throw new InputError(
          'No processor recognized the entity as valid, possibly caused by a foreign kind or apiVersion',
        );
      }

      // Double check that none of the previous steps tried to change something
      // related to the entity ref, which would break downstream
      if (stringifyEntityRef(entity) !== entityRef) {
        throw new ConflictError(
          'Fatal: The entity kind, namespace, or name changed during processing',
        );
      }

      // Backwards compatible processing of location entities
      if (isLocationEntity(entity)) {
        const { type = location.type } = entity.spec;
        const targets = new Array<string>();
        if (entity.spec.target) {
          targets.push(entity.spec.target);
        }
        if (entity.spec.targets) {
          targets.push(...entity.spec.targets);
        }

        for (const maybeRelativeTarget of targets) {
          if (type === 'file' && maybeRelativeTarget.endsWith(path.sep)) {
            emitter.emit(
              results.inputError(
                location,
                `LocationEntityProcessor cannot handle ${type} type location with target ${location.target} that ends with a path separator`,
              ),
            );
            continue;
          }
          const target = toAbsoluteUrl(
            this.options.integrations,
            location,
            type,
            maybeRelativeTarget,
          );

          let didRead = false;
          for (const processor of this.options.processors) {
            if (processor.readLocation) {
              try {
                const read = await processor.readLocation(
                  {
                    type,
                    target,
                    presence: 'required',
                  },
                  false,
                  emitter.emit,
                  this.options.parser,
                );
                if (read) {
                  didRead = true;
                  break;
                }
              } catch (e) {
                throw new InputError(
                  `Processor ${processor.constructor.name} threw an error while reading ${type}:${target}`,
                  e,
                );
              }
            }
          }
          if (!didRead) {
            throw new InputError(
              `No processor was able to handle reading of ${type}:${target}`,
            );
          }
        }
      }

      // Main processing step of the entity
      for (const processor of this.options.processors) {
        if (processor.postProcessEntity) {
          try {
            entity = await processor.postProcessEntity(
              entity,
              location,
              emitter.emit,
            );
          } catch (e) {
            throw new InputError(
              `Processor ${processor.constructor.name} threw an error while postprocessing`,
              e,
            );
          }
        }
      }

      return {
        ...emitter.results(),
        completedEntity: entity,
        state: new Map(),
        ok: true,
      };
    } catch (error) {
      this.options.logger.warn(error.message);
      return {
        ok: false,
        errors: emitter.results().errors.concat(error),
      };
    }
  }
}

function createEmitter(logger: Logger, parentEntity: Entity) {
  let done = false;

  const errors = new Array<Error>();
  const relations = new Array<EntityRelationSpec>();
  const deferredEntities = new Array<Entity>();

  const emit = (i: CatalogProcessorResult) => {
    if (done) {
      logger.warn(
        `Item if type ${i.type} was emitted after processing had completed at ${
          new Error().stack
        }`,
      );
      return;
    }

    if (i.type === 'entity') {
      let entity: Entity;
      try {
        entity = validateEntityEnvelope(i.entity);
      } catch (e) {
        logger.debug(`Envelope validation failed at ${i.location}, ${e}`);
        errors.push(e);
        return;
      }

      // Note that at this point, we have only validated the envelope part of
      // the entity data. Annotations are not part of that, so we have to be
      // defensive. If the annotations were malformed (e.g. were not a valid
      // object), we just skip over this step and let the full entity
      // validation at the next step of processing catch that.
      const annotations = entity.metadata.annotations || {};
      if (typeof annotations === 'object' && !Array.isArray(annotations)) {
        const originLocation = getEntityOriginLocationRef(parentEntity);
        const location = stringifyLocationReference(i.location);
        entity = {
          ...entity,
          metadata: {
            ...entity.metadata,
            annotations: {
              ...annotations,
              [ORIGIN_LOCATION_ANNOTATION]: originLocation,
              [LOCATION_ANNOTATION]: location,
            },
          },
        };
      }

      deferredEntities.push(entity);
    } else if (i.type === 'location') {
      deferredEntities.push(
        locationSpecToLocationEntity(i.location, parentEntity),
      );
    } else if (i.type === 'relation') {
      relations.push(i.relation);
    } else if (i.type === 'error') {
      errors.push(i.error);
    }
  };

  return {
    emit,
    results() {
      done = true;
      return {
        errors,
        relations,
        deferredEntities,
      };
    },
  };
}
