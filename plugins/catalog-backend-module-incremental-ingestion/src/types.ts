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

import {
  DatabaseService,
  LoggerService,
  PermissionsService,
  RootConfigService,
  RootLoggerService,
  SchedulerService,
  SchedulerServiceTaskFunction,
  UrlReaderService,
} from '@backstage/backend-plugin-api';
import type {
  DeferredEntity,
  EntityProviderConnection,
} from '@backstage/plugin-catalog-node';
import { EventParams } from '@backstage/plugin-events-node';
import { HumanDuration } from '@backstage/types';
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

  /**
   * If set, the IncrementalEntityProvider will receive and respond to
   * events.
   *
   * This system acts as a wrapper for the Backstage events bus, and
   * requires the events backend to function. It does not provide its
   * own events backend. See {@link https://github.com/backstage/backstage/tree/master/plugins/events-backend}.
   */
  eventHandler?: {
    /**
     * This method accepts an incoming event for the provider, and
     * optionally maps the payload to an object containing a delta
     * mutation.
     *
     * If a delta result is returned by this method, it will be ingested
     * automatically by the provider. Alternatively, if an "ignored" result is
     * returned, then it is understood that this event should not cause anything
     * to be ingested.
     */
    onEvent: (params: EventParams) => Promise<IncrementalEntityEventResult>;

    /**
     * This method returns an array of topics for the IncrementalEntityProvider
     * to respond to.
     */
    supportsEventTopics: () => string[];
  };
}

/**
 * An object returned by event handler to indicate whether to ignore the event
 * or to apply a delta in response to the event.
 *
 * @public
 */
export type IncrementalEntityEventResult =
  | {
      type: 'ignored';
    }
  | {
      type: 'delta';
      added: DeferredEntity[];
      removed: { entityRef: string }[];
    };

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
  burstInterval: HumanDuration;

  /**
   * Entities are ingested in bursts. This value determines how long
   * to keep ingesting within each burst.
   */
  burstLength: HumanDuration;

  /**
   * After a successful ingestion, the incremental entity provider
   * will rest for this period of time before starting to ingest
   * again.
   */
  restLength: HumanDuration;

  /**
   * In the event of an error during an ingestion burst, the backoff
   * determines how soon it will be retried. E.g.
   * `[{ minutes: 1}, { minutes: 5}, {minutes: 30 }, { hours: 3 }]`
   */
  backoff?: HumanDuration[];

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
  logger: RootLoggerService;
  database: DatabaseService;
  scheduler: SchedulerService;
  config: RootConfigService;
  reader: UrlReaderService;
  permissions: PermissionsService;
};

export interface IterationEngine {
  taskFn: SchedulerServiceTaskFunction;
}

export interface IterationEngineOptions {
  logger: LoggerService;
  connection: EntityProviderConnection;
  manager: IncrementalIngestionDatabaseManager;
  provider: IncrementalEntityProvider<unknown, unknown>;
  restLength: HumanDuration;
  ready: Promise<void>;
  backoff?: IncrementalEntityProviderOptions['backoff'];
  rejectRemovalsAbovePercentage?: number;
  rejectEmptySourceCollections?: boolean;
}
