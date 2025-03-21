/*
 * Copyright 2021 The Backstage Authors
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

import { Span, trace } from '@opentelemetry/api';
import {
  Entity,
  EntityPolicy,
  LocationEntity,
  parseLocationRef,
  stringifyEntityRef,
  stringifyLocationRef,
} from '@backstage/catalog-model';
import {
  assertError,
  ConflictError,
  InputError,
  NotAllowedError,
} from '@backstage/errors';
import { JsonValue } from '@backstage/types';
import { ScmIntegrationRegistry } from '@backstage/integration';
import path from 'path';
import { LocationSpec } from '@backstage/plugin-catalog-common';
import {
  CatalogProcessor,
  CatalogProcessorParser,
  processingResult,
} from '@backstage/plugin-catalog-node';
import {
  CatalogProcessingOrchestrator,
  EntityProcessingRequest,
  EntityProcessingResult,
} from './types';
import { ProcessorOutputCollector } from './ProcessorOutputCollector';
import {
  getEntityLocationRef,
  getEntityOriginLocationRef,
  isLocationEntity,
  isObject,
  toAbsoluteUrl,
  validateEntity,
  validateEntityEnvelope,
} from './util';
import { CatalogRulesEnforcer } from '../ingestion/CatalogRules';
import { ProcessorCacheManager } from './ProcessorCacheManager';
import {
  addEntityAttributes,
  TRACER_ID,
  withActiveSpan,
} from '../util/opentelemetry';
import { LoggerService } from '@backstage/backend-plugin-api';

const tracer = trace.getTracer(TRACER_ID);

type Context = {
  entityRef: string;
  location: LocationSpec;
  originLocation: LocationSpec;
  collector: ProcessorOutputCollector;
  cache: ProcessorCacheManager;
};

function addProcessorAttributes(
  span: Span,
  stage: string,
  processor: CatalogProcessor,
) {
  span.setAttribute('backstage.catalog.processor.stage', stage);
  span.setAttribute(
    'backstage.catalog.processor.name',
    processor.getProcessorName(),
  );
}

/** @public */
export class DefaultCatalogProcessingOrchestrator
  implements CatalogProcessingOrchestrator
{
  constructor(
    private readonly options: {
      processors: CatalogProcessor[];
      integrations: ScmIntegrationRegistry;
      logger: LoggerService;
      parser: CatalogProcessorParser;
      policy: EntityPolicy;
      rulesEnforcer: CatalogRulesEnforcer;
      legacySingleProcessorValidation: boolean;
    },
  ) {}

  async process(
    request: EntityProcessingRequest,
  ): Promise<EntityProcessingResult> {
    return this.processSingleEntity(request.entity, request.state);
  }

  private async processSingleEntity(
    unprocessedEntity: Entity,
    state: JsonValue | undefined,
  ): Promise<EntityProcessingResult> {
    const collector = new ProcessorOutputCollector(
      this.options.logger,
      unprocessedEntity,
    );

    // Cache that is scoped to the entity and processor
    const cache = new ProcessorCacheManager(
      isObject(state) && isObject(state.cache) ? state.cache : {},
    );

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

      // TODO: which one do we actually use for the location?
      // source-location? - maybe probably doesn't exist yet?
      const context: Context = {
        entityRef: stringifyEntityRef(entity),
        location: parseLocationRef(getEntityLocationRef(entity)),
        originLocation: parseLocationRef(getEntityOriginLocationRef(entity)),
        cache,
        collector,
      };

      // Run the steps
      entity = await this.runPreProcessStep(entity, context);
      entity = await this.runPolicyStep(entity);
      await this.runValidateStep(entity, context);
      if (isLocationEntity(entity)) {
        await this.runSpecialLocationStep(entity, context);
      }
      entity = await this.runPostProcessStep(entity, context);

      // Check that any emitted entities are permitted to originate from that
      // particular location according to the catalog rules
      const collectorResults = context.collector.results();
      for (const deferredEntity of collectorResults.deferredEntities) {
        if (
          !this.options.rulesEnforcer.isAllowed(
            deferredEntity.entity,
            context.originLocation,
          )
        ) {
          throw new NotAllowedError(
            `Entity ${stringifyEntityRef(
              deferredEntity.entity,
            )} at ${stringifyLocationRef(
              context.location,
            )}, originated at ${stringifyLocationRef(
              context.originLocation,
            )}, is not of an allowed kind for that location`,
          );
        }
      }

      return {
        ...collectorResults,
        completedEntity: entity,
        state: { cache: cache.collect() },
        ok: collectorResults.errors.length === 0,
      };
    } catch (error) {
      assertError(error);
      return {
        ok: false,
        errors: collector.results().errors.concat(error),
      };
    }
  }

  // Pre-process phase, used to populate entities with data that is required
  // during the main processing step
  private async runPreProcessStep(
    entity: Entity,
    context: Context,
  ): Promise<Entity> {
    return await withActiveSpan(tracer, 'ProcessingStage', async stageSpan => {
      addEntityAttributes(stageSpan, entity);
      stageSpan.setAttribute('backstage.catalog.processor.stage', 'preProcess');
      let res = entity;

      for (const processor of this.options.processors) {
        if (processor.preProcessEntity) {
          let innerRes = res;
          res = await withActiveSpan(tracer, 'ProcessingStep', async span => {
            addEntityAttributes(span, entity);
            addProcessorAttributes(span, 'preProcessEntity', processor);
            try {
              innerRes = await processor.preProcessEntity!(
                innerRes,
                context.location,
                context.collector.forProcessor(processor),
                context.originLocation,
                context.cache.forProcessor(processor),
              );
            } catch (e) {
              throw new InputError(
                `Processor ${processor.constructor.name} threw an error while preprocessing`,
                e,
              );
            }
            return innerRes;
          });
        }
      }

      return res;
    });
  }

  /**
   * Enforce entity policies making sure that entities conform to a general schema
   */
  private async runPolicyStep(entity: Entity): Promise<Entity> {
    return await withActiveSpan(tracer, 'ProcessingStage', async stageSpan => {
      addEntityAttributes(stageSpan, entity);
      stageSpan.setAttribute(
        'backstage.catalog.processor.stage',
        'enforcePolicy',
      );
      let policyEnforcedEntity: Entity | undefined;

      try {
        policyEnforcedEntity = await this.options.policy.enforce(entity);
      } catch (e) {
        throw new InputError(
          `Policy check failed for ${stringifyEntityRef(entity)}`,
          e,
        );
      }

      if (!policyEnforcedEntity) {
        throw new Error(
          `Policy unexpectedly returned no data for ${stringifyEntityRef(
            entity,
          )}`,
        );
      }

      return policyEnforcedEntity;
    });
  }

  /**
   * Validate the given entity
   */
  private async runValidateStep(
    entity: Entity,
    context: Context,
  ): Promise<void> {
    return await withActiveSpan(tracer, 'ProcessingStage', async stageSpan => {
      addEntityAttributes(stageSpan, entity);
      stageSpan.setAttribute('backstage.catalog.processor.stage', 'validate');
      // Double check that none of the previous steps tried to change something
      // related to the entity ref, which would break downstream
      if (stringifyEntityRef(entity) !== context.entityRef) {
        throw new ConflictError(
          'Fatal: The entity kind, namespace, or name changed during processing',
        );
      }

      // Validate that the end result is a valid Entity at all
      try {
        validateEntity(entity);
      } catch (e) {
        throw new ConflictError(
          `Entity envelope for ${context.entityRef} failed validation after preprocessing`,
          e,
        );
      }

      let valid = false;

      for (const processor of this.options.processors) {
        if (processor.validateEntityKind) {
          try {
            const thisValid = await withActiveSpan(
              tracer,
              'ProcessingStep',
              async span => {
                addEntityAttributes(span, entity);
                addProcessorAttributes(span, 'validateEntityKind', processor);
                return await processor.validateEntityKind!(entity);
              },
            );
            if (thisValid) {
              valid = true;
              if (this.options.legacySingleProcessorValidation) {
                break;
              }
            }
          } catch (e) {
            throw new InputError(
              `Processor ${processor.constructor.name} threw an error while validating the entity ${context.entityRef}`,
              e,
            );
          }
        }
      }

      if (!valid) {
        throw new InputError(
          `No processor recognized the entity ${context.entityRef} as valid, possibly caused by a foreign kind or apiVersion`,
        );
      }
    });
  }

  /**
   * Backwards compatible processing of location entities
   */
  private async runSpecialLocationStep(
    entity: LocationEntity,
    context: Context,
  ): Promise<void> {
    return await withActiveSpan(tracer, 'ProcessingStage', async stageSpan => {
      addEntityAttributes(stageSpan, entity);
      stageSpan.setAttribute(
        'backstage.catalog.processor.stage',
        'readLocation',
      );
      const { type = context.location.type, presence = 'required' } =
        entity.spec;
      const targets = new Array<string>();
      if (entity.spec.target) {
        targets.push(entity.spec.target);
      }
      if (entity.spec.targets) {
        targets.push(...entity.spec.targets);
      }

      for (const maybeRelativeTarget of targets) {
        if (type === 'file' && maybeRelativeTarget.endsWith(path.sep)) {
          context.collector.generic()(
            processingResult.inputError(
              context.location,
              `LocationEntityProcessor cannot handle ${type} type location with target ${context.location.target} that ends with a path separator`,
            ),
          );
          continue;
        }
        const target = toAbsoluteUrl(
          this.options.integrations,
          context.location,
          type,
          maybeRelativeTarget,
        );

        let didRead = false;
        for (const processor of this.options.processors) {
          if (processor.readLocation) {
            try {
              const read = await withActiveSpan(
                tracer,
                'ProcessingStep',
                async span => {
                  addEntityAttributes(span, entity);
                  addProcessorAttributes(span, 'readLocation', processor);
                  return await processor.readLocation!(
                    {
                      type,
                      target,
                      presence,
                    },
                    presence === 'optional',
                    context.collector.forProcessor(processor),
                    this.options.parser,
                    context.cache.forProcessor(processor, target),
                  );
                },
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
    });
  }

  /**
   * Main processing step of the entity
   */
  private async runPostProcessStep(
    entity: Entity,
    context: Context,
  ): Promise<Entity> {
    return await withActiveSpan(tracer, 'ProcessingStage', async stageSpan => {
      addEntityAttributes(stageSpan, entity);
      stageSpan.setAttribute(
        'backstage.catalog.processor.stage',
        'postProcessEntity',
      );
      let res = entity;

      for (const processor of this.options.processors) {
        if (processor.postProcessEntity) {
          let innerRes = res;
          res = await withActiveSpan(tracer, 'ProcessingStep', async span => {
            addEntityAttributes(span, entity);
            addProcessorAttributes(span, 'postProcessEntity', processor);
            try {
              innerRes = await processor.postProcessEntity!(
                innerRes,
                context.location,
                context.collector.forProcessor(processor),
                context.cache.forProcessor(processor),
              );
            } catch (e) {
              throw new InputError(
                `Processor ${processor.constructor.name} threw an error while postprocessing`,
                e,
              );
            }
            return innerRes;
          });
        }
      }

      return res;
    });
  }
}
