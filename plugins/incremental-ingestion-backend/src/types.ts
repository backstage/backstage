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
import type { PermissionAuthorizer } from '@backstage/plugin-permission-common';
import type { DurationObjectUnits } from 'luxon';
import type { Logger } from 'winston';
import { IncrementalIngestionDatabaseManager } from './database/IncrementalIngestionDatabaseManager';
/**
 * Entity annotation containing the incremental entity provider.
 *
 * @public
 */
export const INCREMENTAL_ENTITY_PROVIDER_ANNOTATION =
  'backstage.io/incremental-provider-name';

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
 */
export interface IncrementalEntityProvider<TCursor, TContext> {
  /**
   * This name must be unique between all of the entity providers
   * operating in the catalog.
   */
  getProviderName(): string;

  /**
   * Return a function to register the end of the metric that was
   * initialized before the fisrt burst call.
   */
  prometheusRegister?: { markIngestionCompleted: (result: string) => void };

  /**
   * Return a single page of entities from a specific point in the
   * ingestion.
   *
   * @param context - anything needed in order to fetch a single page.
   * @param cursor - a uniqiue value identifying the page to ingest.
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
 * Value returned by an @{link IncrementalEntityProvider} to provide a
 * single page of entities to ingest.
 */
export interface EntityIteratorResult<T> {
  /**
   * Indicates whether there are any further pages of entities to
   * ingest after this one.
   */
  done: boolean;

  /**
   * A value that marks the page of entities after this one. It will
   * be used to pass into the following invocation of `next()`
   */
  cursor: T;

  /**
   * The entities to ingest.
   */
  entities: DeferredEntity[];
}

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
   * [{ minutes: 1}, { minutes: 5}, {minutes: 30 }, { hours: 3 }]
   */
  backoff?: DurationObjectUnits[];
}

export type PluginEnvironment = {
  logger: Logger;
  database: PluginDatabaseManager;
  scheduler: PluginTaskScheduler;
  config: Config;
  reader: UrlReader;
  permissions: PermissionAuthorizer;
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
}

/**
 * The shape of data inserted into or updated in the `ingestion.ingestions` table.
 */
export interface IngestionUpsertIFace {
  /**
   * The ingestion record id.
   */
  id?: string;
  /**
   * The next action the incremental entity provider will take.
   */
  next_action:
    | 'rest'
    | 'ingest'
    | 'backoff'
    | 'cancel'
    | 'nothing (done)'
    | 'nothing (canceled)';
  /**
   * Current status of the incremental entity provider.
   */
  status:
    | 'complete'
    | 'bursting'
    | 'resting'
    | 'canceling'
    | 'interstitial'
    | 'backing off';
  /**
   * The name of the incremental entity provider being updated.
   */
  provider_name: string;
  /**
   * Date/time stamp for when the next action will trigger.
   */
  next_action_at?: Date;
  /**
   * A record of the last error generated by the incremental entity provider.
   */
  last_error?: string | null;
  /**
   * The number of attempts the provider has attempted during the current cycle.
   */
  attempts?: number;
  /**
   * Date/time stamp for the completion of ingestion.
   */
  ingestion_completed_at?: Date | string | null;
  /**
   * Date/time stamp for the end of the rest cycle before the next ingestion.
   */
  rest_completed_at?: Date | string | null;
  /**
   * A record of the finalized status of the ingestion record. Values are either 'open' or a uuid.
   */
  completion_ticket: string;
}

/**
 * This interface is for updating an existing ingestion record.
 */
export interface IngestionRecordUpdate {
  ingestionId: string;
  update: Partial<IngestionUpsertIFace>;
}

/**
 * The expected response from the `ingestion.ingestion_marks` table.
 */
export interface MarkRecord {
  id: string;
  sequence: number;
  ingestion_id: string;
  cursor: string;
  created_at: string;
}

/**
 * The expected response from the `ingestion.ingestions` table.
 */
export interface IngestionRecord extends IngestionUpsertIFace {
  id: string;
  next_action_at: Date;
  /**
   * The date/time the ingestion record was created.
   */
  created_at: string;
}

/**
 * This interface supplies all the values for adding an ingestion mark.
 */
export interface MarkRecordInsert {
  record: {
    id: string;
    ingestion_id: string;
    cursor: unknown;
    sequence: number;
  };
}
