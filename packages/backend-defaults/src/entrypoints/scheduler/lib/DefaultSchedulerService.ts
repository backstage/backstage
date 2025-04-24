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
  DatabaseService,
  HttpRouterService,
  LoggerService,
  PluginMetadataService,
  RootLifecycleService,
  SchedulerService,
} from '@backstage/backend-plugin-api';
import { once } from 'lodash';
import { Duration } from 'luxon';
import { migrateBackendTasks } from '../database/migrateBackendTasks';
import { PluginTaskSchedulerImpl } from './PluginTaskSchedulerImpl';
import { PluginTaskSchedulerJanitor } from './PluginTaskSchedulerJanitor';

/**
 * Default implementation of the task scheduler service.
 *
 * @public
 */
export class DefaultSchedulerService {
  static create(options: {
    database: DatabaseService;
    logger: LoggerService;
    rootLifecycle: RootLifecycleService;
    httpRouter: HttpRouterService;
    pluginMetadata: PluginMetadataService;
  }): SchedulerService {
    const databaseFactory = once(async () => {
      const knex = await options.database.getClient();

      if (!options.database.migrations?.skip) {
        await migrateBackendTasks(knex);
      }

      if (process.env.NODE_ENV !== 'test') {
        const abortController = new AbortController();
        const janitor = new PluginTaskSchedulerJanitor({
          knex,
          waitBetweenRuns: Duration.fromObject({ minutes: 1 }),
          logger: options.logger,
        });

        options.rootLifecycle.addShutdownHook(() => abortController.abort());
        janitor.start(abortController.signal);
      }

      return knex;
    });

    const scheduler = new PluginTaskSchedulerImpl(
      options.pluginMetadata.getId(),
      databaseFactory,
      options.logger,
      options.rootLifecycle,
    );

    options.httpRouter.use(scheduler.getRouter());

    return scheduler;
  }
}
