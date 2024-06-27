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
  coreServices,
  createServiceFactory,
} from '@backstage/backend-plugin-api';
import { ConfigReader } from '@backstage/config';
import { DatabaseManager } from './DatabaseManager';

/**
 * Database access and management via `knex`.
 *
 * See {@link @backstage/code-plugin-api#DatabaseService}
 * and {@link https://backstage.io/docs/backend-system/core-services/database | the service docs}
 * for more information.
 *
 * @public
 */
export const databaseServiceFactory = createServiceFactory({
  service: coreServices.database,
  deps: {
    config: coreServices.rootConfig,
    lifecycle: coreServices.lifecycle,
    pluginMetadata: coreServices.pluginMetadata,
  },
  async createRootContext({ config }) {
    return config.getOptional('backend.database')
      ? DatabaseManager.fromConfig(config)
      : DatabaseManager.fromConfig(
          new ConfigReader({
            backend: {
              database: { client: 'better-sqlite3', connection: ':memory:' },
            },
          }),
        );
  },
  async factory({ pluginMetadata, lifecycle }, databaseManager) {
    return databaseManager.forPlugin(pluginMetadata.getId(), {
      pluginMetadata,
      lifecycle,
    });
  },
});
