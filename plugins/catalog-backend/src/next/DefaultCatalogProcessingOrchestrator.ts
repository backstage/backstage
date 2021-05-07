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
  EntityRelationSpec,
  stringifyEntityRef,
  LOCATION_ANNOTATION,
  LocationSpec,
  LocationEntity,
  EntityPolicy,
  ORIGIN_LOCATION_ANNOTATION,
  stringifyLocationReference,
  parseLocationReference,
} from '@backstage/catalog-model';
import {
  CatalogProcessor,
  CatalogProcessorParser,
  CatalogProcessorResult,
} from '../ingestion/processors';
import {
  CatalogProcessingOrchestrator,
  EntityProcessingRequest,
  EntityProcessingResult,
} from './types';
import { Logger } from 'winston';
import { InputError } from '@backstage/errors';
import { locationSpecToLocationEntity } from './util';
import path from 'path';
import * as results from '../ingestion/processors/results';
import { ScmIntegrationRegistry } from '@backstage/integration';

function isLocationEntity(entity: Entity): entity is LocationEntity {
  return entity.kind === 'Location';
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
    // TODO: validate that this doesn't change during processing
    const entityRef = stringifyEntityRef(unprocessedEntity);
    // TODO: which one do we actually use here? source-location? - maybe probably doesn't exist yet?
    const locationRef =
      unprocessedEntity.metadata?.annotations?.[LOCATION_ANNOTATION];
    if (!locationRef) {
      throw new InputError(`Entity '${entityRef}' does not have a location`);
    }
    const location = parseLocationReference(locationRef);
    const originLocation = parseLocationReference(
      getEntityOriginLocationRef(unprocessedEntity),
    );

    const emitter = createEmitter(this.options.logger, unprocessedEntity);
    try {
      // Pre-process phase, used to populate entities with data that is required during main processing step
      let entity = unprocessedEntity;
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
            throw new Error(
              `Processor ${processor.constructor.name} threw an error while preprocessing entity ${entityRef} at ${locationRef}, ${e}`,
            );
          }
        }
      }

      // Enforce entity policies making sure that entities conform to a general schema
      let policyEnforcedEntity;
      try {
        policyEnforcedEntity = await this.options.policy.enforce(entity);
      } catch (e) {
        throw new InputError(
          `Policy check failed while analyzing entity ${entityRef} at ${locationRef}, ${e}`,
        );
      }
      if (!policyEnforcedEntity) {
        throw new Error(
          `Policy unexpectedly returned no data while analyzing entity ${entityRef} at ${locationRef}`,
        );
      }
      entity = policyEnforcedEntity;

      // Validate the given entity kind against its schema
      let handled = false;
      for (const processor of this.options.processors) {
        if (processor.validateEntityKind) {
          try {
            handled = await processor.validateEntityKind(entity);
            if (handled) {
              break;
            }
          } catch (e) {
            throw new InputError(
              `Processor ${processor.constructor.name} threw an error while validating the entity ${entityRef} at ${locationRef}, ${e}`,
            );
          }
        }
      }
      if (!handled) {
        throw new InputError(
          `No processor recognized the entity ${entityRef} at ${locationRef}`,
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
                  break;
                }
              } catch (e) {
                throw new Error(
                  `Processor ${processor.constructor.name} threw an error while postprocessing entity ${entityRef} at ${locationRef}, ${e}`,
                );
              }
            }
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
            throw new Error(
              `Processor ${processor.constructor.name} threw an error while postprocessing entity ${entityRef} at ${locationRef}, ${e}`,
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
      return { ok: false, errors: emitter.results().errors.concat(error) };
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
      const originLocation = getEntityOriginLocationRef(parentEntity);

      deferredEntities.push({
        ...i.entity,
        metadata: {
          ...i.entity.metadata,
          annotations: {
            ...i.entity.metadata.annotations,
            [ORIGIN_LOCATION_ANNOTATION]: originLocation,
            [LOCATION_ANNOTATION]: stringifyLocationReference(i.location),
          },
        },
      });
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
