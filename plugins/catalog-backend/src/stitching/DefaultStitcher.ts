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
import { durationToMilliseconds, HumanDuration } from '@backstage/types';
import { Knex } from 'knex';
import splitToChunks from 'lodash/chunk';
import { DateTime } from 'luxon';
import { Logger } from 'winston';
import { getDeferredStitchableEntities } from '../database/operations/stitcher/getDeferredStitchableEntities';
import { markForStitching } from '../database/operations/stitcher/markForStitching';
import { performStitching } from '../database/operations/stitcher/performStitching';
import { DbRefreshStateRow } from '../database/tables';
import { startTaskPipeline } from '../processing/TaskPipeline';
import { progressTracker } from './progressTracker';
import {
  Stitcher,
  StitchingStrategy,
  stitchingStrategyFromConfig,
} from './types';

type DeferredStitchItem = Awaited<
  ReturnType<typeof getDeferredStitchableEntities>
>[0];

type StitchProgressTracker = ReturnType<typeof progressTracker>;

/**
 * Performs the act of stitching - to take all of the various outputs from the
 * ingestion process, and stitching them together into the final entity JSON
 * shape.
 */
export class DefaultStitcher implements Stitcher {
  private readonly knex: Knex;
  private readonly logger: Logger;
  private readonly strategy: StitchingStrategy;
  private readonly tracker: StitchProgressTracker;
  private stopFunc?: () => void;

  static fromConfig(
    config: Config,
    options: {
      knex: Knex;
      logger: Logger;
    },
  ): DefaultStitcher {
    return new DefaultStitcher({
      knex: options.knex,
      logger: options.logger,
      strategy: stitchingStrategyFromConfig(config),
    });
  }

  constructor(options: {
    knex: Knex;
    logger: Logger;
    strategy: StitchingStrategy;
  }) {
    this.knex = options.knex;
    this.logger = options.logger;
    this.strategy = options.strategy;
    this.tracker = progressTracker(options.knex, options.logger);
  }

  async stitch(options: {
    entityRefs?: Iterable<string>;
    entityIds?: Iterable<string>;
  }) {
    const { entityRefs, entityIds } = options;

    if (this.strategy.mode === 'deferred') {
      await markForStitching({
        knex: this.knex,
        strategy: this.strategy,
        entityRefs,
        entityIds,
      });
      return;
    }

    if (entityRefs) {
      for (const entityRef of entityRefs) {
        await this.#stitchOne({ entityRef });
      }
    }

    if (entityIds) {
      const chunks = splitToChunks(
        Array.isArray(entityIds) ? entityIds : [...entityIds],
        100,
      );
      for (const chunk of chunks) {
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
      if (this.stopFunc) {
        throw new Error('Processing engine is already started');
      }

      const { pollingInterval, stitchTimeout } = this.strategy;

      const stopPipeline = startTaskPipeline<DeferredStitchItem>({
        lowWatermark: 2,
        highWatermark: 5,
        pollingIntervalMs: durationToMilliseconds(pollingInterval),
        loadTasks: async count => {
          return await this.#getStitchableEntities(count, stitchTimeout);
        },
        processTask: async item => {
          return await this.#stitchOne({
            entityRef: item.entityRef,
            stitchTicket: item.stitchTicket,
            stitchRequestedAt: item.stitchRequestedAt,
          });
        },
      });

      this.stopFunc = () => {
        stopPipeline();
      };
    }
  }

  async stop() {
    if (this.strategy.mode === 'deferred') {
      if (this.stopFunc) {
        this.stopFunc();
        this.stopFunc = undefined;
      }
    }
  }

  async #getStitchableEntities(count: number, stitchTimeout: HumanDuration) {
    try {
      return await getDeferredStitchableEntities({
        knex: this.knex,
        batchSize: count,
        stitchTimeout: stitchTimeout,
      });
    } catch (error) {
      this.logger.warn('Failed to load stitchable entities', error);
      return [];
    }
  }

  async #stitchOne(options: {
    entityRef: string;
    stitchTicket?: string;
    stitchRequestedAt?: DateTime;
  }) {
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
        stitchTicket: options.stitchTicket,
      });
      track.markComplete(result);
    } catch (error) {
      track.markFailed(error);
    }
  }
}
