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
  IncrementalEntityProvider,
  IncrementalEntityProviderOptions,
  PluginEnvironment,
} from '../types';
import { CatalogBuilder as CoreCatalogBuilder } from '@backstage/plugin-catalog-backend';
import { createDeferred } from '@backstage/types';
import { Duration } from 'luxon';
import { Knex } from 'knex';
import { IncrementalIngestionEngine } from '../engine/IncrementalIngestionEngine';
import { applyDatabaseMigrations } from '../database/migrations';
import { IncrementalIngestionDatabaseManager } from '../database/IncrementalIngestionDatabaseManager';
import { IncrementalProviderRouter } from '../router/routes';
import { EventParams, EventSubscriber } from '@backstage/plugin-events-node';

/**
 * @public
 * @deprecated Please migrate to the new backend system and import `@backstage/plugin-catalog-backend-module-incremental-ingestion` as a module, and add providers to the `incrementalIngestionProvidersExtensionPoint` instead
 */
export class IncrementalCatalogBuilder {
  /**
   * Creates the incremental catalog builder, which extends the regular catalog builder.
   * @param env - PluginEnvironment
   * @param builder - CatalogBuilder
   * @returns IncrementalCatalogBuilder
   */
  static async create(env: PluginEnvironment, builder: CoreCatalogBuilder) {
    const client = await env.database.getClient();
    const manager = new IncrementalIngestionDatabaseManager({ client });
    return new IncrementalCatalogBuilder(env, builder, client, manager);
  }

  private ready = createDeferred();

  private constructor(
    private env: PluginEnvironment,
    private builder: CoreCatalogBuilder,
    private client: Knex,
    private manager: IncrementalIngestionDatabaseManager,
  ) {}

  async build() {
    await applyDatabaseMigrations(this.client);
    this.ready.resolve();

    const routerLogger = this.env.logger.child({
      router: 'IncrementalProviderAdmin',
    });

    const incrementalAdminRouter = await new IncrementalProviderRouter(
      this.manager,
      routerLogger,
      this.env.config,
    ).createRouter();

    return { incrementalAdminRouter };
  }

  addIncrementalEntityProvider<TCursor, TContext>(
    provider: IncrementalEntityProvider<TCursor, TContext>,
    options: IncrementalEntityProviderOptions,
  ): EventSubscriber {
    const { burstInterval, burstLength, restLength } = options;
    const { logger: catalogLogger, scheduler } = this.env;
    const ready = this.ready;

    const manager = this.manager;

    let engine: IncrementalIngestionEngine;

    this.builder.addEntityProvider({
      getProviderName: provider.getProviderName.bind(provider),
      async connect(connection) {
        const logger = catalogLogger.child({
          entityProvider: provider.getProviderName(),
        });

        engine = new IncrementalIngestionEngine({
          ...options,
          ready,
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

        await scheduler.scheduleTask({
          id: provider.getProviderName(),
          fn: engine.taskFn.bind(engine),
          frequency,
          timeout: length,
        });
      },
    });

    return {
      onEvent: (params: EventParams) => engine.onEvent(params),
      supportsEventTopics() {
        return engine.supportsEventTopics();
      },
    };
  }
}
