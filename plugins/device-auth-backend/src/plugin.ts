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

import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { createRouter } from './service/router';

/**
 * deviceAuthPlugin backend plugin
 *
 * @public
 */
export const deviceAuthPlugin = createBackendPlugin({
  pluginId: 'device-auth',
  register(env) {
    env.registerInit({
      deps: {
        httpRouter: coreServices.httpRouter,
        logger: coreServices.logger,
        config: coreServices.rootConfig,
        database: coreServices.database,
        auth: coreServices.auth,
        httpAuth: coreServices.httpAuth,
      },
      async init({ httpRouter, logger, config, database, auth, httpAuth }) {
        httpRouter.use(
          await createRouter({
            logger,
            config,
            database,
            auth,
            httpAuth,
          }),
        );
        // Ensure unauthenticated access to the device authorization and token endpoints,
        // allowing device clients to generate new device codes and query for tokens.
        httpRouter.addAuthPolicy({
          path: '/device_authorization',
          allow: 'unauthenticated',
        });
        httpRouter.addAuthPolicy({
          path: '/token',
          allow: 'unauthenticated',
        });
        httpRouter.addAuthPolicy({
          path: '/health',
          allow: 'unauthenticated',
        });
      },
    });
  },
});
