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

import { loggerToWinstonLogger } from '@backstage/backend-common';
import {
  coreServices,
  createBackendPlugin,
  createExtensionPoint,
} from '@backstage/backend-plugin-api';
import { createRouter } from './service/router';
import { exampleTools } from './example/exampleTools';
import {
  ExporeProvidersExtensionPoint,
  StaticExploreToolProvider,
} from './tools';

/** @public */
export const exploreProvidersExtensionPoint =
  createExtensionPoint<ExporeProvidersExtensionPoint>({
    id: 'explore.providers',
  });

/**
 * Explore backend plugin
 *
 * @public
 */

export const explorePlugin = createBackendPlugin({
  pluginId: 'explore',
  register(env) {
    const providers = new Map<string, StaticExploreToolProvider>();
    env.registerExtensionPoint(exploreProvidersExtensionPoint, {
      registerProvider({ providerId, factory }) {
        if (providers.has(providerId)) {
          throw new Error(
            `Explore provider '${providerId}' was already registered`,
          );
        }
        providers.set(providerId, factory);
      },
    });
    env.registerInit({
      deps: {
        logger: coreServices.logger,
        httpRouter: coreServices.httpRouter,
      },
      async init({ logger, httpRouter }) {
        httpRouter.use(
          await createRouter({
            logger: loggerToWinstonLogger(logger),
            toolProvider: StaticExploreToolProvider.fromData(exampleTools),
            providerFactories: Object.fromEntries(providers),
          }),
        );
      },
    });
  },
});
