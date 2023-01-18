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

import { DatabaseManager } from '@backstage/backend-common';
import {
  coreServices,
  createServiceFactory,
} from '@backstage/backend-plugin-api';
import { ConfigReader } from '@backstage/config';

/** @public */
export const databaseFactory = createServiceFactory({
  service: coreServices.database,
  deps: {
    config: coreServices.config,
    plugin: coreServices.pluginMetadata,
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
  async factory({ plugin }, databaseManager) {
    return databaseManager.forPlugin(plugin.getId());
  },
});
