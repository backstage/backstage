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

import express from 'express';
import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { createRouter } from './router';
import {
  configSchemaExtensionPoint,
  staticFallbackHandlerExtensionPoint,
} from '@backstage/plugin-app-node';
import { ConfigSchema } from '@backstage/config-loader';

/**
 * The App plugin is responsible for serving the frontend app bundle and static assets.
 * @public
 */
export const appPlugin = createBackendPlugin({
  pluginId: 'app',
  register(env) {
    let staticFallbackHandler: express.Handler | undefined;
    let schema: ConfigSchema | undefined;

    env.registerExtensionPoint(staticFallbackHandlerExtensionPoint, {
      setStaticFallbackHandler(handler) {
        if (staticFallbackHandler) {
          throw new Error(
            'Attempted to install a static fallback handler for the app-backend twice',
          );
        }
        staticFallbackHandler = handler;
      },
    });

    env.registerExtensionPoint(configSchemaExtensionPoint, {
      setConfigSchema(configSchema) {
        if (schema) {
          throw new Error(
            'Attempted to set config schema for the app-backend twice',
          );
        }
        schema = configSchema;
      },
    });

    env.registerInit({
      deps: {
        logger: coreServices.logger,
        config: coreServices.rootConfig,
        database: coreServices.database,
        httpRouter: coreServices.httpRouter,
        auth: coreServices.auth,
        httpAuth: coreServices.httpAuth,
      },
      async init({ logger, config, database, httpRouter, auth, httpAuth }) {
        const appPackageName =
          config.getOptionalString('app.packageName') ?? 'app';

        const router = await createRouter({
          logger,
          config,
          database,
          auth,
          httpAuth,
          appPackageName,
          staticFallbackHandler,
          schema,
        });
        httpRouter.use(router);

        // Access control is handled within the router
        httpRouter.addAuthPolicy({
          allow: 'unauthenticated',
          path: '/',
        });
      },
    });
  },
});
