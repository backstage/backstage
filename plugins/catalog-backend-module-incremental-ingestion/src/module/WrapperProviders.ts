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
  LoggerService,
  RootConfigService,
  SchedulerService,
} from '@backstage/backend-plugin-api';
import { stringifyError } from '@backstage/errors';
import {
  EntityProvider,
  EntityProviderConnection,
} from '@backstage/plugin-catalog-node';
import { createDeferred } from '@backstage/types';
import express from 'express';
import { Knex } from 'knex';
import { Duration } from 'luxon';
import { IncrementalIngestionDatabaseManager } from '../database/IncrementalIngestionDatabaseManager';
import { applyDatabaseMigrations } from '../database/migrations';
import { IncrementalIngestionEngine } from '../engine/IncrementalIngestionEngine';
import { IncrementalProviderRouter } from '../router/routes';
import {
  IncrementalEntityProvider,
  IncrementalEntityProviderOptions,
} from '../types';
import { EventsService } from '@backstage/plugin-events-node';

/**
 * Helps in the creation of the catalog entity providers that wrap the
 * incremental ones.
 */
export class WrapperProviders {
  private migrate: Promise<void> | undefined;
  private numberOfProvidersToConnect = 0;
  private readonly readySignal = createDeferred();

  constructor(
    private readonly options: {
      config: RootConfigService;
      logger: LoggerService;
      client: Knex;
      scheduler: SchedulerService;
      applyDatabaseMigrations?: typeof applyDatabaseMigrations;
      events: EventsService;
    },
  ) {}

  wrap(
    provider: IncrementalEntityProvider<unknown, unknown>,
    options: IncrementalEntityProviderOptions,
  ): EntityProvider {
    this.numberOfProvidersToConnect += 1;
    return {
      getProviderName: () => provider.getProviderName(),
      connect: async connection => {
        await this.startProvider(provider, options, connection);
        this.numberOfProvidersToConnect -= 1;
        if (this.numberOfProvidersToConnect === 0) {
          this.readySignal.resolve();
        }
      },
    };
  }

  adminRouter(): express.Router {
    return new IncrementalProviderRouter(
      new IncrementalIngestionDatabaseManager({ client: this.options.client }),
      this.options.logger,
    ).createRouter();
  }

  private async startProvider(
    provider: IncrementalEntityProvider<unknown, unknown>,
    providerOptions: IncrementalEntityProviderOptions,
    connection: EntityProviderConnection,
  ) {
    const logger = this.options.logger.child({
      entityProvider: provider.getProviderName(),
    });

    try {
      if (!this.migrate) {
        this.migrate = Promise.resolve().then(async () => {
          const apply =
            this.options.applyDatabaseMigrations ?? applyDatabaseMigrations;
          await apply(this.options.client);
        });
      }

      await this.migrate;

      const { burstInterval, burstLength, restLength } = providerOptions;

      logger.info(`Connecting`);

      const manager = new IncrementalIngestionDatabaseManager({
        client: this.options.client,
      });
      const engine = new IncrementalIngestionEngine({
        ...providerOptions,
        ready: this.readySignal,
        manager,
        logger,
        provider,
        restLength,
        connection,
      });

      let frequency = Duration.isDuration(burstInterval)
        ? burstInterval
        : Duration.fromObject(burstInterval);
      if (frequency.as('milliseconds') < 5000) {
        frequency = Duration.fromObject({ seconds: 5 }); // don't let it be silly low, to not overload the scheduler
      }

      let length = Duration.isDuration(burstLength)
        ? burstLength
        : Duration.fromObject(burstLength);
      length = length.plus(Duration.fromObject({ minutes: 1 })); // some margin from the actual completion

      await this.options.scheduler.scheduleTask({
        id: provider.getProviderName(),
        fn: engine.taskFn.bind(engine),
        frequency,
        timeout: length,
      });

      const topics = engine.supportsEventTopics();
      if (topics.length > 0) {
        logger.info(
          `Provider ${provider.getProviderName()} subscribing to events for topics: ${topics.join(
            ',',
          )}`,
        );
        await this.options.events.subscribe({
          topics,
          id: `catalog-backend-module-incremental-ingestion:${provider.getProviderName()}`,
          onEvent: evt => engine.onEvent(evt),
        });
      }
    } catch (error) {
      logger.warn(
        `Failed to initialize incremental ingestion provider ${provider.getProviderName()}, ${stringifyError(
          error,
        )}`,
      );
      throw error;
    }
  }
}
