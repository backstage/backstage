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
import { aiModelsServiceRef } from '@backstage/backend-plugin-api/alpha';
import { aiGatewayInvokePermission } from './permissions';
import { createRouter } from './service/router';

/**
 * The AI gateway backend plugin.
 *
 * @public
 */
export const aiGatewayPlugin = createBackendPlugin({
  pluginId: 'ai-gateway',
  register(env) {
    env.registerInit({
      deps: {
        config: coreServices.rootConfig,
        logger: coreServices.logger,
        httpAuth: coreServices.httpAuth,
        httpRouter: coreServices.httpRouter,
        permissions: coreServices.permissions,
        permissionsRegistry: coreServices.permissionsRegistry,
        aiModels: aiModelsServiceRef,
      },
      async init({
        config,
        logger,
        httpAuth,
        httpRouter,
        permissions,
        permissionsRegistry,
        aiModels,
      }) {
        permissionsRegistry.addPermissions([aiGatewayInvokePermission]);

        httpRouter.use(
          await createRouter({
            aiModels,
            httpAuth,
            permissions,
            logger,
            limits: {
              maxInputCharacters:
                config.getOptionalNumber('aiGateway.maxInputCharacters') ??
                100_000,
              maxSchemaCharacters:
                config.getOptionalNumber('aiGateway.maxSchemaCharacters') ??
                20_000,
              maxOutputTokens:
                config.getOptionalNumber('aiGateway.maxOutputTokens') ?? 4096,
            },
          }),
        );
      },
    });
  },
});
