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
import splitToChunks from 'lodash/chunk';
import { DateTime } from 'luxon';
import { Logger } from 'winston';
import { performStitching } from '../database/operations/stitcher/performStitching';
import { DbRefreshStateRow } from '../database/tables';
import { progressTracker } from './progressTracker';
import { Stitcher, StitchingStrategy } from './types';

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

  static fromConfig(
    _config: Config,
    options: {
      knex: Knex;
      logger: Logger;
    },
  ): DefaultStitcher {
    return new DefaultStitcher({
      knex: options.knex,
      logger: options.logger,
      strategy: { mode: 'immediate' },
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
    // Only called immediately for now
  }

  async stop() {
    // Only called immediately for now
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
