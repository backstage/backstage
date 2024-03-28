/*
 * Copyright 2024 The Backstage Authors
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
import { createRouter } from './service/router';
import { catalogServiceRef } from '@backstage/plugin-catalog-node/alpha';
import { AzureSitesApi } from './api';

/**
 * Azure Sites Backend Plugin
 *
 * @public
 */
export const azureSitesPlugin = createBackendPlugin({
  pluginId: 'azure-sites',
  register(env) {
    env.registerInit({
      deps: {
        config: coreServices.rootConfig,
        logger: coreServices.logger,
        httpRouter: coreServices.httpRouter,
        permissions: coreServices.permissions,
        discovery: coreServices.discovery,
        auth: coreServices.auth,
        httpAuth: coreServices.httpAuth,
        catalogApi: catalogServiceRef,
      },
      async init({
        config,
        logger,
        httpRouter,
        permissions,
        catalogApi,
        discovery,
        auth,
        httpAuth,
      }) {
        const azureSitesApi = AzureSitesApi.fromConfig(config);
        httpRouter.use(
          await createRouter({
            logger: loggerToWinstonLogger(logger),
            azureSitesApi,
            permissions,
            catalogApi,
            discovery,
            auth,
            httpAuth,
          }),
        );
        httpRouter.addAuthPolicy({
          path: '/health',
          allow: 'unauthenticated',
        });
      },
    });
  },
});
