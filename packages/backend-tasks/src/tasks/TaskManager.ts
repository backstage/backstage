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

import { DatabaseManager, getRootLogger } from '@backstage/backend-common';
import { Config } from '@backstage/config';
import { memoize } from 'lodash';
import { Duration } from 'luxon';
import { Logger } from 'winston';
import { migrateBackendTasks } from '../database/migrateBackendTasks';
import { PluginTaskManagerImpl } from './PluginTaskManagerImpl';
import { PluginTaskManagerJanitor } from './PluginTaskManagerJanitor';
import { PluginTaskManager } from './types';

/**
 * Deals with management and locking related to distributed tasks.
 *
 * @public
 */
export class TaskManager {
  static fromConfig(
    config: Config,
    options?: {
      databaseManager?: DatabaseManager;
      logger?: Logger;
    },
  ): TaskManager {
    const databaseManager =
      options?.databaseManager ?? DatabaseManager.fromConfig(config);
    const logger = (options?.logger || getRootLogger()).child({
      type: 'taskManager',
    });
    return new TaskManager(databaseManager, logger);
  }

  constructor(
    private readonly databaseManager: DatabaseManager,
    private readonly logger: Logger,
  ) {}

  /**
   * Instantiates a task manager instance for the given plugin.
   *
   * @param pluginId - The unique ID of the plugin, for example "catalog"
   * @returns A {@link PluginTaskManager} instance
   */
  forPlugin(pluginId: string): PluginTaskManager {
    const databaseFactory = memoize(async () => {
      const knex = await this.databaseManager.forPlugin(pluginId).getClient();

      await migrateBackendTasks(knex);

      const janitor = new PluginTaskManagerJanitor({
        knex,
        waitBetweenRuns: Duration.fromObject({ minutes: 1 }),
        logger: this.logger,
      });
      janitor.start();

      return knex;
    });

    return new PluginTaskManagerImpl(
      databaseFactory,
      this.logger.child({ plugin: pluginId }),
    );
  }
}
