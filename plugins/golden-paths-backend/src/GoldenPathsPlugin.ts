/*
 * Copyright 2026 The Backstage Authors
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
 * goldenPathPlugin backend plugin
 *
 * @public
 */
export const goldenPathsPlugin = createBackendPlugin({
  pluginId: 'golden-paths',
  register(env) {
    env.registerInit({
      deps: {
        database: coreServices.database,
        logger: coreServices.logger,
        config: coreServices.rootConfig,
        httpRouter: coreServices.httpRouter,
        auth: coreServices.auth,
        permissions: coreServices.permissions,
        permissionsRegistry: coreServices.permissionsRegistry,
        httpAuth: coreServices.httpAuth,
        discovery: coreServices.discovery,
      },
      async init({
        database,
        httpRouter,
        logger,
        config,
        auth,
        permissions,
        permissionsRegistry,
        httpAuth,
        discovery,
      }) {
        const router = await createRouter({
          database,
          logger,
          config,
          auth,
          permissions,
          permissionsRegistry,
          httpAuth,
          discovery,
        });
        httpRouter.use(router);
      },
    });
  },
});
