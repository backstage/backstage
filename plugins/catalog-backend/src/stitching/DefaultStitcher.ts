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

import { Config } from '@backstage/config';
import { Knex } from 'knex';
import { DateTime } from 'luxon';
import { performStitching } from '../database/operations/stitcher/performStitching';
import { DbRefreshStateRow } from '../database/tables';
import { progressTracker } from './progressTracker';
import {
  DeferredStitchQueuePayload,
  Stitcher,
  STITCHER_QUEUE_NAME,
  StitchingStrategy,
  stitchingStrategyFromConfig,
} from './types';
import { LoggerService } from '@backstage/backend-plugin-api';
import {
  Job,
  MetricsService,
  Queue,
  QueueService,
} from '@backstage/backend-plugin-api/alpha';

type StitchProgressTracker = ReturnType<typeof progressTracker>;

/**
 * Performs the act of stitching - to take all of the various outputs from the
 * ingestion process, and stitching them together into the final entity JSON
 * shape.
 */
export class DefaultStitcher implements Stitcher {
  private readonly knex: Knex;
  private readonly logger: LoggerService;
  private readonly queue: QueueService;
  private readonly strategy: StitchingStrategy;
  private readonly tracker: StitchProgressTracker;
  private workQueue?: Queue<DeferredStitchQueuePayload>;

  static fromConfig(
    config: Config,
    options: {
      knex: Knex;
      logger: LoggerService;
      metrics: MetricsService;
      queue: QueueService;
    },
  ): DefaultStitcher {
    return new DefaultStitcher({
      knex: options.knex,
      logger: options.logger,
      metrics: options.metrics,
      queue: options.queue,
      strategy: stitchingStrategyFromConfig(config),
    });
  }

  constructor(options: {
    knex: Knex;
    logger: LoggerService;
    metrics: MetricsService;
    queue: QueueService;
    strategy: StitchingStrategy;
  }) {
    this.knex = options.knex;
    this.logger = options.logger;
    this.queue = options.queue;
    this.strategy = options.strategy;
    this.tracker = progressTracker(options.logger, options.metrics, async () =>
      this.#getPendingStitchCount(),
    );
  }

  async stitch(options: {
    entityRefs?: Iterable<string>;
    entityIds?: Iterable<string>;
  }) {
    const { entityRefs, entityIds } = options;

    if (this.strategy.mode === 'deferred') {
      await this.#enqueueEntities({ entityRefs, entityIds });
      return;
    }

    if (entityRefs) {
      for (const entityRef of entityRefs) {
        await this.#stitchOne({ entityRef });
      }
    }

    if (entityIds) {
      for (const chunk of chunkArray(
        Array.isArray(entityIds) ? entityIds : [...entityIds],
        100,
      )) {
        const rows = await this.knex<DbRefreshStateRow>('refresh_state')
          .select('entity_ref')
          .whereIn('entity_id', chunk);
        for (const row of rows) {
          await this.#stitchOne({ entityRef: row.entity_ref });
        }
      }
    }
  }

  async start() {
    if (this.strategy.mode === 'deferred') {
      if (this.workQueue) {
        throw new Error('Stitcher is already started');
      }

      const workQueue = await this.#getWorkQueue();
      workQueue.process(async (job: Job<DeferredStitchQueuePayload>) => {
        await this.#stitchOne({
          entityRef: job.payload.entityRef,
          stitchRequestedAt: DateTime.fromISO(job.payload.stitchRequestedAt),
        });
      });

      this.workQueue = workQueue;
    }
  }

  async stop() {
    if (this.strategy.mode === 'deferred') {
      if (this.workQueue) {
        await this.workQueue.disconnect();
        this.workQueue = undefined;
      }
    }
  }

  async #getWorkQueue(): Promise<Queue<DeferredStitchQueuePayload>> {
    return this.workQueue ?? this.queue.getQueue(STITCHER_QUEUE_NAME);
  }

  async #getPendingStitchCount(): Promise<number> {
    if (this.strategy.mode === 'deferred') {
      const queue = await this.#getWorkQueue();
      return queue.getJobCount();
    }

    const total = await this.knex<DbRefreshStateRow>('refresh_state')
      .count({ count: '*' })
      .where({ result_hash: 'force-stitching' });

    return Number(total[0].count);
  }

  async #enqueueEntities(options: {
    entityRefs?: Iterable<string>;
    entityIds?: Iterable<string>;
  }): Promise<void> {
    const queue = await this.#getWorkQueue();
    const entityRefs = await this.#resolveEntityRefs(options);
    const stitchRequestedAt = new Date().toISOString();

    for (const entityRef of entityRefs) {
      await queue.add({ entityRef, stitchRequestedAt });
    }
  }

  async #resolveEntityRefs(options: {
    entityRefs?: Iterable<string>;
    entityIds?: Iterable<string>;
  }): Promise<string[]> {
    const collected = new Set<string>();

    for (const entityRef of options.entityRefs ?? []) {
      collected.add(entityRef);
    }

    let entityIds: string[] = [];
    if (options.entityIds) {
      entityIds = Array.isArray(options.entityIds)
        ? options.entityIds
        : [...options.entityIds];
    }

    if (entityIds.length === 0) {
      return Array.from(collected).sort();
    }

    for (const chunk of chunkArray(entityIds, 100)) {
      let query = this.knex<DbRefreshStateRow>('refresh_state')
        .select('entity_ref')
        .whereIn('entity_id', chunk);

      const existingRefs = Array.from(collected);
      if (existingRefs.length > 0) {
        query = query.whereNotIn('entity_ref', existingRefs);
      }

      const rows = await query;
      for (const row of rows) {
        collected.add(row.entity_ref);
      }
    }

    return Array.from(collected).sort();
  }

  async #stitchOne(options: {
    entityRef: string;
    stitchTicket?: string;
    stitchRequestedAt?: DateTime;
  }): Promise<void> {
    const track = this.tracker.stitchStart({
      entityRef: options.entityRef,
      stitchRequestedAt: options.stitchRequestedAt,
    });

    try {
      const result = await performStitching({
        knex: this.knex,
        logger: this.logger,
        strategy: this.strategy,
        entityRef: options.entityRef,
      });
      track.markComplete(result);
    } catch (error) {
      track.markFailed(error);
    }
  }
}

function chunkArray<T>(items: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];

  for (let index = 0; index < items.length; index += chunkSize) {
    chunks.push(items.slice(index, index + chunkSize));
  }

  return chunks;
}
