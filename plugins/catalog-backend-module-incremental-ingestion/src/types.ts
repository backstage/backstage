/*
 * Copyright 2022 The Backstage Authors
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

import type {
  PluginDatabaseManager,
  UrlReader,
} from '@backstage/backend-common';
import type {
  PluginTaskScheduler,
  TaskFunction,
} from '@backstage/backend-tasks';
import type { Config } from '@backstage/config';
import type {
  DeferredEntity,
  EntityProviderConnection,
} from '@backstage/plugin-catalog-backend';
import type { PermissionEvaluator } from '@backstage/plugin-permission-common';
import type { DurationObjectUnits } from 'luxon';
import type { Logger } from 'winston';
import { IncrementalIngestionDatabaseManager } from './database/IncrementalIngestionDatabaseManager';

/**
 * Ingest entities into the catalog in bite-sized chunks.
 *
 * A Normal `EntityProvider` allows you to introduce entities into the
 * processing pipeline by calling an `applyMutation()` on the full set
 * of entities. However, this is not great when the number of entities
 * that you have to keep track of is extremely large because it
 * entails having all of them in memory at once. An
 * `IncrementalEntityProvider` by contrast allows you to provide
 * batches of entities in sequence so that you never need to have more
 * than a few hundred in memory at a time.
 *
 * @public
 */
export interface IncrementalEntityProvider<TCursor, TContext> {
  /**
   * This name must be unique between all of the entity providers
   * operating in the catalog.
   */
  getProviderName(): string;

  /**
   * Return a single page of entities from a specific point in the
   * ingestion.
   *
   * @param context - anything needed in order to fetch a single page.
   * @param cursor - a unique value identifying the page to ingest.
   * @returns The entities to be ingested, as well as the cursor of
   * the next page after this one.
   */
  next(
    context: TContext,
    cursor?: TCursor,
  ): Promise<EntityIteratorResult<TCursor>>;

  /**
   * Do any setup and teardown necessary in order to provide the
   * context for fetching pages. This should always invoke `burst` in
   * order to fetch the individual pages.
   *
   * @param burst - a function which performs a series of iterations
   */
  around(burst: (context: TContext) => Promise<void>): Promise<void>;
}

/**
 * Value returned by an {@link IncrementalEntityProvider} to provide a
 * single page of entities to ingest.
 *
 * @public
 */
export type EntityIteratorResult<T> =
  | {
      done: false;
      entities: DeferredEntity[];
      cursor: T;
    }
  | {
      done: true;
      entities?: DeferredEntity[];
      cursor?: T;
    };

/** @public */
export interface IncrementalEntityProviderOptions {
  /**
   * Entities are ingested in bursts. This interval determines how
   * much time to wait in between each burst.
   */
  burstInterval: DurationObjectUnits;

  /**
   * Entities are ingested in bursts. This value determines how long
   * to keep ingesting within each burst.
   */
  burstLength: DurationObjectUnits;

  /**
   * After a successful ingestion, the incremental entity provider
   * will rest for this period of time before starting to ingest
   * again.
   */
  restLength: DurationObjectUnits;

  /**
   * In the event of an error during an ingestion burst, the backoff
   * determines how soon it will be retried. E.g.
   * `[{ minutes: 1}, { minutes: 5}, {minutes: 30 }, { hours: 3 }]`
   */
  backoff?: DurationObjectUnits[];

  /**
   * If an error occurs at a data source that results in a large
   * number of assets being inadvertently removed, it will result in
   * Backstage removing all associated entities. To avoid that, set
   * a percentage of entities past which removal will be disallowed.
   */
  rejectRemovalsAbovePercentage?: number;

  /**
   * Similar to the rejectRemovalsAbovePercentage, this option
   * prevents removals in circumstances where a data source has
   * improperly returned 0 assets. If set to `true`, Backstage will
   * reject removals when that happens.
   */
  rejectEmptySourceCollections?: boolean;
}

/** @public */
export type PluginEnvironment = {
  logger: Logger;
  database: PluginDatabaseManager;
  scheduler: PluginTaskScheduler;
  config: Config;
  reader: UrlReader;
  permissions: PermissionEvaluator;
};

export interface IterationEngine {
  taskFn: TaskFunction;
}

export interface IterationEngineOptions {
  logger: Logger;
  connection: EntityProviderConnection;
  manager: IncrementalIngestionDatabaseManager;
  provider: IncrementalEntityProvider<unknown, unknown>;
  restLength: DurationObjectUnits;
  ready: Promise<void>;
  backoff?: IncrementalEntityProviderOptions['backoff'];
  rejectRemovalsAbovePercentage?: number;
  rejectEmptySourceCollections?: boolean;
}
