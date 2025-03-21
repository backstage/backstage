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

import {
  ANNOTATION_LOCATION,
  Entity,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { assertError, serializeError, stringifyError } from '@backstage/errors';
import { Hash } from 'crypto';
import stableStringify from 'fast-json-stable-stringify';
import { Knex } from 'knex';
import { metrics, trace } from '@opentelemetry/api';
import { ProcessingDatabase, RefreshStateItem } from '../database/types';
import { createCounterMetric, createSummaryMetric } from '../util/metrics';
import { CatalogProcessingOrchestrator, EntityProcessingResult } from './types';
import { Stitcher, stitchingStrategyFromConfig } from '../stitching/types';
import { startTaskPipeline } from './TaskPipeline';
import { Config } from '@backstage/config';
import {
  addEntityAttributes,
  TRACER_ID,
  withActiveSpan,
} from '../util/opentelemetry';
import { deleteOrphanedEntities } from '../database/operations/util/deleteOrphanedEntities';
import { EventBroker, EventsService } from '@backstage/plugin-events-node';
import { CATALOG_ERRORS_TOPIC } from '../constants';
import { LoggerService, SchedulerService } from '@backstage/backend-plugin-api';

const CACHE_TTL = 5;

const tracer = trace.getTracer(TRACER_ID);

export type ProgressTracker = ReturnType<typeof progressTracker>;

// NOTE(freben): Perhaps surprisingly, this class does not implement the
// CatalogProcessingEngine type. That type is externally visible and its name is
// the way it is for historic reasons. This class has no particular reason to
// implement that precise interface; nowadays there are several different
// engines "hiding" behind the CatalogProcessingEngine interface, of which this
// is just one.
export class DefaultCatalogProcessingEngine {
  private readonly config: Config;
  private readonly scheduler?: SchedulerService;
  private readonly logger: LoggerService;
  private readonly knex: Knex;
  private readonly processingDatabase: ProcessingDatabase;
  private readonly orchestrator: CatalogProcessingOrchestrator;
  private readonly stitcher: Stitcher;
  private readonly createHash: () => Hash;
  private readonly pollingIntervalMs: number;
  private readonly orphanCleanupIntervalMs: number;
  private readonly onProcessingError?: (event: {
    unprocessedEntity: Entity;
    errors: Error[];
  }) => Promise<void> | void;
  private readonly tracker: ProgressTracker;
  private readonly eventBroker?: EventBroker | EventsService;

  private stopFunc?: () => void;

  constructor(options: {
    config: Config;
    scheduler?: SchedulerService;
    logger: LoggerService;
    knex: Knex;
    processingDatabase: ProcessingDatabase;
    orchestrator: CatalogProcessingOrchestrator;
    stitcher: Stitcher;
    createHash: () => Hash;
    pollingIntervalMs?: number;
    orphanCleanupIntervalMs?: number;
    onProcessingError?: (event: {
      unprocessedEntity: Entity;
      errors: Error[];
    }) => Promise<void> | void;
    tracker?: ProgressTracker;
    eventBroker?: EventBroker | EventsService;
  }) {
    this.config = options.config;
    this.scheduler = options.scheduler;
    this.logger = options.logger;
    this.knex = options.knex;
    this.processingDatabase = options.processingDatabase;
    this.orchestrator = options.orchestrator;
    this.stitcher = options.stitcher;
    this.createHash = options.createHash;
    this.pollingIntervalMs = options.pollingIntervalMs ?? 1_000;
    this.orphanCleanupIntervalMs = options.orphanCleanupIntervalMs ?? 30_000;
    this.onProcessingError = options.onProcessingError;
    this.tracker = options.tracker ?? progressTracker();
    this.eventBroker = options.eventBroker;

    this.stopFunc = undefined;
  }

  async start() {
    if (this.stopFunc) {
      throw new Error('Processing engine is already started');
    }

    const stopPipeline = this.startPipeline();
    const stopCleanup = this.startOrphanCleanup();

    this.stopFunc = () => {
      stopPipeline();
      stopCleanup();
    };
  }

  async stop() {
    if (this.stopFunc) {
      this.stopFunc();
      this.stopFunc = undefined;
    }
  }

  private startPipeline(): () => void {
    return startTaskPipeline<RefreshStateItem>({
      lowWatermark: 5,
      highWatermark: 10,
      pollingIntervalMs: this.pollingIntervalMs,
      loadTasks: async count => {
        try {
          const { items } =
            await this.processingDatabase.getProcessableEntities(this.knex, {
              processBatchSize: count,
            });
          return items;
        } catch (error) {
          this.logger.warn('Failed to load processing items', error);
          return [];
        }
      },
      processTask: async item => {
        await withActiveSpan(tracer, 'ProcessingRun', async span => {
          const track = this.tracker.processStart(item, this.logger);
          addEntityAttributes(span, item.unprocessedEntity);

          try {
            const {
              id,
              state,
              unprocessedEntity,
              entityRef,
              locationKey,
              resultHash: previousResultHash,
            } = item;
            const result = await this.orchestrator.process({
              entity: unprocessedEntity,
              state,
            });

            track.markProcessorsCompleted(result);

            if (result.ok) {
              const { ttl: _, ...stateWithoutTtl } = state ?? {};
              if (
                stableStringify(stateWithoutTtl) !==
                stableStringify(result.state)
              ) {
                await this.processingDatabase.transaction(async tx => {
                  await this.processingDatabase.updateEntityCache(tx, {
                    id,
                    state: {
                      ttl: CACHE_TTL,
                      ...result.state,
                    },
                  });
                });
              }
            } else {
              const maybeTtl = state?.ttl;
              const ttl = Number.isInteger(maybeTtl) ? (maybeTtl as number) : 0;
              await this.processingDatabase.transaction(async tx => {
                await this.processingDatabase.updateEntityCache(tx, {
                  id,
                  state: ttl > 0 ? { ...state, ttl: ttl - 1 } : {},
                });
              });
            }

            const location =
              unprocessedEntity?.metadata?.annotations?.[ANNOTATION_LOCATION];
            if (result.errors.length) {
              this.eventBroker?.publish({
                topic: CATALOG_ERRORS_TOPIC,
                eventPayload: {
                  entity: entityRef,
                  location,
                  errors: result.errors,
                },
              });
            }
            const errorsString = JSON.stringify(
              result.errors.map(e => serializeError(e)),
            );

            let hashBuilder = this.createHash().update(errorsString);

            if (result.ok) {
              const { entityRefs: parents } =
                await this.processingDatabase.transaction(tx =>
                  this.processingDatabase.listParents(tx, {
                    entityRefs: [
                      entityRef,
                      ...result.deferredEntities.map(e =>
                        stringifyEntityRef(e.entity),
                      ),
                    ],
                  }),
                );

              hashBuilder = hashBuilder
                .update(stableStringify({ ...result.completedEntity }))
                .update(stableStringify([...result.deferredEntities]))
                .update(stableStringify([...result.relations]))
                .update(stableStringify([...result.refreshKeys]))
                .update(stableStringify([...parents]));
            }

            const resultHash = hashBuilder.digest('hex');
            if (resultHash === previousResultHash) {
              // If nothing changed in our produced outputs, we cannot have any
              // significant effect on our surroundings; therefore, we just abort
              // without any updates / stitching.
              track.markSuccessfulWithNoChanges();
              return;
            }

            // If the result was marked as not OK, it signals that some part of the
            // processing pipeline threw an exception. This can happen both as part of
            // non-catastrophic things such as due to validation errors, as well as if
            // something fatal happens inside the processing for other reasons. In any
            // case, this means we can't trust that anything in the output is okay. So
            // just store the errors and trigger a stich so that they become visible to
            // the outside.
            if (!result.ok) {
              // notify the error listener if the entity can not be processed.
              Promise.resolve(undefined)
                .then(() =>
                  this.onProcessingError?.({
                    unprocessedEntity,
                    errors: result.errors,
                  }),
                )
                .catch(error => {
                  this.logger.debug(
                    `Processing error listener threw an exception, ${stringifyError(
                      error,
                    )}`,
                  );
                });

              await this.processingDatabase.transaction(async tx => {
                await this.processingDatabase.updateProcessedEntityErrors(tx, {
                  id,
                  errors: errorsString,
                  resultHash,
                });
              });

              await this.stitcher.stitch({
                entityRefs: [stringifyEntityRef(unprocessedEntity)],
              });

              track.markSuccessfulWithErrors();
              return;
            }

            result.completedEntity.metadata.uid = id;
            let oldRelationSources: Map<string, string>;
            await this.processingDatabase.transaction(async tx => {
              const { previous } =
                await this.processingDatabase.updateProcessedEntity(tx, {
                  id,
                  processedEntity: result.completedEntity,
                  resultHash,
                  errors: errorsString,
                  relations: result.relations,
                  deferredEntities: result.deferredEntities,
                  locationKey,
                  refreshKeys: result.refreshKeys,
                });
              oldRelationSources = new Map(
                previous.relations.map(r => [
                  `${r.source_entity_ref}:${r.type}->${r.target_entity_ref}`,
                  r.source_entity_ref,
                ]),
              );
            });

            const newRelationSources = new Map<string, string>(
              result.relations.map(relation => {
                const sourceEntityRef = stringifyEntityRef(relation.source);
                const targetEntityRef = stringifyEntityRef(relation.target);
                return [
                  `${sourceEntityRef}:${relation.type}->${targetEntityRef}`,
                  sourceEntityRef,
                ];
              }),
            );

            const setOfThingsToStitch = new Set<string>([
              stringifyEntityRef(result.completedEntity),
            ]);
            newRelationSources.forEach((sourceEntityRef, uniqueKey) => {
              if (!oldRelationSources.has(uniqueKey)) {
                setOfThingsToStitch.add(sourceEntityRef);
              }
            });
            oldRelationSources!.forEach((sourceEntityRef, uniqueKey) => {
              if (!newRelationSources.has(uniqueKey)) {
                setOfThingsToStitch.add(sourceEntityRef);
              }
            });

            await this.stitcher.stitch({
              entityRefs: setOfThingsToStitch,
            });

            track.markSuccessfulWithChanges();
          } catch (error) {
            assertError(error);
            track.markFailed(error);
          }
        });
      },
    });
  }

  private startOrphanCleanup(): () => void {
    const orphanStrategy =
      this.config.getOptionalString('catalog.orphanStrategy') ?? 'keep';
    if (orphanStrategy !== 'delete') {
      return () => {};
    }

    const stitchingStrategy = stitchingStrategyFromConfig(this.config);

    const runOnce = async () => {
      try {
        const n = await deleteOrphanedEntities({
          knex: this.knex,
          strategy: stitchingStrategy,
        });
        if (n > 0) {
          this.logger.info(`Deleted ${n} orphaned entities`);
        }
      } catch (error) {
        this.logger.warn(`Failed to delete orphaned entities`, error);
      }
    };

    if (this.scheduler) {
      const abortController = new AbortController();

      this.scheduler.scheduleTask({
        id: 'catalog_orphan_cleanup',
        frequency: { milliseconds: this.orphanCleanupIntervalMs },
        timeout: { milliseconds: this.orphanCleanupIntervalMs * 0.8 },
        fn: runOnce,
        signal: abortController.signal,
      });

      return () => {
        abortController.abort();
      };
    }

    const intervalKey = setInterval(runOnce, this.orphanCleanupIntervalMs);
    return () => {
      clearInterval(intervalKey);
    };
  }
}

// Helps wrap the timing and logging behaviors
function progressTracker() {
  // prom-client metrics are deprecated in favour of OpenTelemetry metrics.
  const promProcessedEntities = createCounterMetric({
    name: 'catalog_processed_entities_count',
    help: 'Amount of entities processed, DEPRECATED, use OpenTelemetry metrics instead',
    labelNames: ['result'],
  });
  const promProcessingDuration = createSummaryMetric({
    name: 'catalog_processing_duration_seconds',
    help: 'Time spent executing the full processing flow, DEPRECATED, use OpenTelemetry metrics instead',
    labelNames: ['result'],
  });
  const promProcessorsDuration = createSummaryMetric({
    name: 'catalog_processors_duration_seconds',
    help: 'Time spent executing catalog processors, DEPRECATED, use OpenTelemetry metrics instead',
    labelNames: ['result'],
  });
  const promProcessingQueueDelay = createSummaryMetric({
    name: 'catalog_processing_queue_delay_seconds',
    help: 'The amount of delay between being scheduled for processing, and the start of actually being processed, DEPRECATED, use OpenTelemetry metrics instead',
  });

  const meter = metrics.getMeter('default');
  const processedEntities = meter.createCounter(
    'catalog.processed.entities.count',
    { description: 'Amount of entities processed' },
  );

  const processingDuration = meter.createHistogram(
    'catalog.processing.duration',
    {
      description: 'Time spent executing the full processing flow',
      unit: 'seconds',
    },
  );

  const processorsDuration = meter.createHistogram(
    'catalog.processors.duration',
    {
      description: 'Time spent executing catalog processors',
      unit: 'seconds',
    },
  );

  const processingQueueDelay = meter.createHistogram(
    'catalog.processing.queue.delay',
    {
      description:
        'The amount of delay between being scheduled for processing, and the start of actually being processed',
      unit: 'seconds',
    },
  );

  function processStart(item: RefreshStateItem, logger: LoggerService) {
    const startTime = process.hrtime();
    const endOverallTimer = promProcessingDuration.startTimer();
    const endProcessorsTimer = promProcessorsDuration.startTimer();

    logger.debug(`Processing ${item.entityRef}`);

    if (item.nextUpdateAt) {
      const seconds = -item.nextUpdateAt.diffNow().as('seconds');
      promProcessingQueueDelay.observe(seconds);
      processingQueueDelay.record(seconds);
    }

    function endTime() {
      const delta = process.hrtime(startTime);
      return delta[0] + delta[1] / 1e9;
    }

    function markProcessorsCompleted(result: EntityProcessingResult) {
      endProcessorsTimer({ result: result.ok ? 'ok' : 'failed' });
      processorsDuration.record(endTime(), {
        result: result.ok ? 'ok' : 'failed',
      });
    }

    function markSuccessfulWithNoChanges() {
      endOverallTimer({ result: 'unchanged' });
      promProcessedEntities.inc({ result: 'unchanged' }, 1);

      processingDuration.record(endTime(), { result: 'unchanged' });
      processedEntities.add(1, { result: 'unchanged' });
    }

    function markSuccessfulWithErrors() {
      endOverallTimer({ result: 'errors' });
      promProcessedEntities.inc({ result: 'errors' }, 1);

      processingDuration.record(endTime(), { result: 'errors' });
      processedEntities.add(1, { result: 'errors' });
    }

    function markSuccessfulWithChanges() {
      endOverallTimer({ result: 'changed' });
      promProcessedEntities.inc({ result: 'changed' }, 1);

      processingDuration.record(endTime(), { result: 'changed' });
      processedEntities.add(1, { result: 'changed' });
    }

    function markFailed(error: Error) {
      promProcessedEntities.inc({ result: 'failed' }, 1);
      processedEntities.add(1, { result: 'failed' });
      logger.warn(`Processing of ${item.entityRef} failed`, error);
    }

    return {
      markProcessorsCompleted,
      markSuccessfulWithNoChanges,
      markSuccessfulWithErrors,
      markSuccessfulWithChanges,
      markFailed,
    };
  }

  return { processStart };
}
