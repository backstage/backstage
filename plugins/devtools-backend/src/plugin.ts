/*
 * Copyright 2023 The Backstage Authors
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
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { createRouter } from './service/router';
import { devToolsPermissions } from '@backstage/plugin-devtools-common';

/**
 * DevTools backend plugin
 *
 * @public
 */
export const devtoolsPlugin = createBackendPlugin({
  pluginId: 'devtools',
  register(env) {
    env.registerInit({
      deps: {
        config: coreServices.rootConfig,
        logger: coreServices.logger,
        permissions: coreServices.permissions,
        httpRouter: coreServices.httpRouter,
        discovery: coreServices.discovery,
        httpAuth: coreServices.httpAuth,
        auth: coreServices.auth,
        permissionsRegistry: coreServices.permissionsRegistry,
      },
      async init({
        config,
        logger,
        permissions,
        httpRouter,
        discovery,
        httpAuth,
        permissionsRegistry,
      }) {
        httpRouter.use(
          await createRouter({
            config,
            logger,
            permissions,
            discovery,
            httpAuth,
          }),
        );
        httpRouter.addAuthPolicy({
          path: '/health',
          allow: 'unauthenticated',
        });
        permissionsRegistry.addPermissions(devToolsPermissions);
      },
    });
  },
});
