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
  cacheManagerDep,
  DatabaseManager,
  databaseManagerDep,
  pluginEndpointDiscoveryDep,
  ServerTokenManager,
  SingleHostDiscovery,
  tokenManagerDep,
  urlReaderDep,
  UrlReaders,
} from '@backstage/backend-common';
import { createDependencyConfig } from '@backstage/app-context-common';
import { Config, configDep } from '@backstage/config';
import { Logger } from 'winston';
import { permissionAuthorizerDep } from '@backstage/plugin-permission-common';
import { ServerPermissionClient } from '@backstage/plugin-permission-node';
import { TaskScheduler, taskSchedulerDep } from '@backstage/backend-tasks';

export const rootDependencies = (config: Config, root: Logger) => {
  return [
    createDependencyConfig({
      id: configDep,
      factory({}) {
        return config;
      },
    }),
    createDependencyConfig({
      id: urlReaderDep,
      dependencies: {
        config: configDep,
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
      id: pluginEndpointDiscoveryDep,
      dependencies: {
        config: configDep,
      },
      factory: ({ config: conf }) => {
        return SingleHostDiscovery.fromConfig(conf);
      },
    }),
    createDependencyConfig({
      id: tokenManagerDep,
      dependencies: {
        config: configDep,
      },
      factory: ({ config: conf }) => {
        return ServerTokenManager.fromConfig(conf, { logger: root });
      },
    }),
    createDependencyConfig({
      id: permissionAuthorizerDep,
      dependencies: {
        config: configDep,
        discovery: pluginEndpointDiscoveryDep,
        tokenManager: tokenManagerDep,
      },
      factory: ({ config: conf, discovery, tokenManager }) => {
        return ServerPermissionClient.fromConfig(conf, {
          discovery: discovery,
          tokenManager: tokenManager,
        });
      },
    }),
    createDependencyConfig({
      id: databaseManagerDep,
      dependencies: {
        config: configDep,
      },
      factory: ({ config: conf }) => {
        console.log('constructing db manager');
        return DatabaseManager.fromConfig(conf);
      },
    }),
    createDependencyConfig({
      id: cacheManagerDep,
      dependencies: {
        config: configDep,
      },
      factory: ({ config: conf }) => {
        return CacheManager.fromConfig(conf);
      },
    }),
    createDependencyConfig({
      id: taskSchedulerDep,
      dependencies: {
        config: configDep,
      },
      factory: ({ config: conf }) => {
        return TaskScheduler.fromConfig(conf);
      },
    }),
  ];
};
