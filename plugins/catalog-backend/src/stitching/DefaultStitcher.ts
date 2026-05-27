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
import { DateTime } from 'luxon';
import { getDeferredStitchableEntities } from '../database/operations/stitcher/getDeferredStitchableEntities';
import { performStitching } from '../database/operations/stitcher/performStitching';
import { startTaskPipeline } from '../processing/TaskPipeline';
import { progressTracker } from './progressTracker';
import { StitchingStrategy, stitchingStrategyFromConfig } from './types';
import { LoggerService } from '@backstage/backend-plugin-api';
import { MetricsService } from '@backstage/backend-plugin-api/alpha';

type DeferredStitchItem = Awaited<
  ReturnType<typeof getDeferredStitchableEntities>
>[0];

type StitchProgressTracker = ReturnType<typeof progressTracker>;

/**
 * Performs the act of stitching - to take all of the various outputs from the
 * ingestion process, and stitching them together into the final entity JSON
 * shape.
 */
export class DefaultStitcher {
  private readonly knex: Knex;
  private readonly logger: LoggerService;
  private readonly strategy: StitchingStrategy;
  private readonly tracker: StitchProgressTracker;
  private stopFunc?: () => void;

  static fromConfig(
    config: Config,
    options: {
      knex: Knex;
      logger: LoggerService;
      metrics: MetricsService;
    },
  ): DefaultStitcher {
    return new DefaultStitcher({
      knex: options.knex,
      logger: options.logger,
      metrics: options.metrics,
      strategy: stitchingStrategyFromConfig(config, {
        logger: options.logger,
      }),
    });
  }

  constructor(options: {
    knex: Knex;
    logger: LoggerService;
    metrics: MetricsService;
    strategy: StitchingStrategy;
  }) {
    this.knex = options.knex;
    this.logger = options.logger;
    this.strategy = options.strategy;
    this.tracker = progressTracker(
      options.knex,
      options.logger,
      options.metrics,
    );
  }

  async start() {
    if (this.stopFunc) {
      throw new Error('Stitcher is already started');
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

  async stop() {
    if (this.stopFunc) {
      this.stopFunc();
      this.stopFunc = undefined;
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
    stitchTicket: string;
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
        entityRef: options.entityRef,
        stitchTicket: options.stitchTicket,
      });
      track.markComplete(result);
    } catch (error) {
      track.markFailed(error);
    }
  }
}
