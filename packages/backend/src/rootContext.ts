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
  CacheManager,
  DatabaseManager,
  ServerTokenManager,
  SingleHostDiscovery,
  UrlReaders,
  commonModule,
} from '@backstage/backend-common';
import { createDependencyConfig } from '@backstage/app-context-common';
import { Config, configModule } from '@backstage/config';
import { Logger } from 'winston';
import { permissionModule } from '@backstage/plugin-permission-common';
import { ServerPermissionClient } from '@backstage/plugin-permission-node';
import { TaskScheduler, tasksModule } from '@backstage/backend-tasks';

export const rootDependencies = (config: Config, root: Logger) => {
  return [
    createDependencyConfig({
      id: configModule.definitions.config,
      factory({}) {
        return config;
      },
    }),
    createDependencyConfig({
      id: commonModule.definitions.urlReader,
      dependencies: {
        config: configModule.definitions.config,
      },
      factory: ({ config: conf }) => {
        const reader = UrlReaders.default({
          logger: root,
          config: conf,
        });
        root.info(`Created UrlReader ${reader}`);
        return reader;
      },
    }),
    createDependencyConfig({
      id: commonModule.definitions.pluginEndpointDiscovery,
      dependencies: {
        config: configModule.definitions.config,
      },
      factory: ({ config: conf }) => SingleHostDiscovery.fromConfig(conf),
    }),
    createDependencyConfig({
      id: commonModule.definitions.tokenManager,
      dependencies: {
        config: configModule.definitions.config,
      },
      factory: ({ config: conf }) =>
        ServerTokenManager.fromConfig(conf, { logger: root }),
    }),
    createDependencyConfig({
      id: permissionModule.definitions.permissionAuthorizer,
      dependencies: {
        config: configModule.definitions.config,
        discovery: commonModule.definitions.pluginEndpointDiscovery,
        tokenManager: commonModule.definitions.tokenManager,
      },
      factory: ({ config: conf, discovery, tokenManager }) =>
        ServerPermissionClient.fromConfig(conf, {
          discovery: discovery,
          tokenManager: tokenManager,
        }),
    }),
    createDependencyConfig({
      id: commonModule.definitions.databaseManager,
      dependencies: {
        config: configModule.definitions.config,
      },
      factory: ({ config: conf }) => DatabaseManager.fromConfig(conf),
    }),
    createDependencyConfig({
      id: commonModule.definitions.cacheManager,
      dependencies: {
        config: configModule.definitions.config,
      },
      factory: ({ config: conf }) => CacheManager.fromConfig(conf),
    }),
    createDependencyConfig({
      id: tasksModule.definitions.taskScheduler,
      dependencies: {
        config: configModule.definitions.config,
      },
      factory: ({ config: conf }) => TaskScheduler.fromConfig(conf),
    }),
  ];
};
