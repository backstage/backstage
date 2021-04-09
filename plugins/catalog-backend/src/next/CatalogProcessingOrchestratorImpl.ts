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
  EntityPolicy,
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

export class CatalogProcessingOrchestratorImpl
  implements CatalogProcessingOrchestrator {
  constructor(
    private readonly options: {
      processors: CatalogProcessor[];
      logger: Logger;
      parser: CatalogProcessorParser;
      policy: EntityPolicy;
    },
  ) {}

  async process(
    request: EntityProcessingRequest,
  ): Promise<EntityProcessingResult> {
    const { entity, eager, state } = request;

    const result = await this.processSingleEntity(entity);

    console.log('result', JSON.stringify(result));
    return result;
  }

  private async processSingleEntity(
    unprocessedEntity: Entity,
  ): Promise<EntityProcessingResult> {
    // TODO: validate that this doesn't change during processing
    const entityRef = stringifyEntityRef(unprocessedEntity);
    // TODO: which one do we actually use here? source-location? - maybe probably doesn't exist yet?
    const locationRef =
      unprocessedEntity.metadata?.annotations?.[LOCATION_ANNOTATION];

    const emitter = createEmitter(this.options.logger);

    try {
      // Pre-process phase, used to populate entities with data that is required during main processing step
      let entity = unprocessedEntity;
      for (const processor of this.options.processors) {
        if (processor.preProcessEntity) {
          try {
            entity = await processor.preProcessEntity({
              entity,
              emit: emitter.emit,
            });
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

      // Main processing step of the entity
      for (const processor of this.options.processors) {
        if (processor.processEntity) {
          try {
            entity = await processor.processEntity({
              entity,
              emit: emitter.emit,
            });
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

function createEmitter(logger: Logger) {
  let done = false;

  const errors = new Array<Error>();
  const relations = new Array<EntityRelationSpec>();
  const deferredEntites = new Array<Entity>();

  const emit = (i: CatalogProcessorResult) => {
    console.log('CatalogProcessorResult', i);
    if (done) {
      logger.warn(
        `Item if type ${i.type} was emitted after processing had completed at ${
          new Error().stack
        }`,
      );
      return;
    }
    if (i.type === 'entity') {
      deferredEntites.push(i.entity);
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
        deferredEntites,
      };
    },
  };
}
