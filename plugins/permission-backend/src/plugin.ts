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

import { loggerToWinstonLogger } from '@backstage/backend-common';
import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { PermissionPolicy } from '@backstage/plugin-permission-node';
import { createRouter } from './service';

/**
 * Permission plugin options
 *
 * @alpha
 */
export type PermissionPluginOptions = {
  policy: PermissionPolicy;
};

/**
 * Permission plugin
 *
 * @alpha
 */
export const permissionPlugin = createBackendPlugin(
  (options: PermissionPluginOptions) => ({
    pluginId: 'permission',
    register(env) {
      env.registerInit({
        deps: {
          http: coreServices.httpRouter,
          config: coreServices.config,
          logger: coreServices.logger,
          discovery: coreServices.discovery,
          identity: coreServices.identity,
        },
        async init({ http, config, logger, discovery, identity }) {
          const winstonLogger = loggerToWinstonLogger(logger);
          http.use(
            await createRouter({
              config,
              discovery,
              identity,
              logger: winstonLogger,
              policy: options.policy,
            }),
          );
        },
      });
    },
  }),
);
