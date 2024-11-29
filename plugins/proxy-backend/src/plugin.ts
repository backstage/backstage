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
  createBackendPlugin,
  coreServices,
} from '@backstage/backend-plugin-api';
import { createRouterInternal } from './service/router';

/**
 * The proxy backend plugin.
 *
 * @public
 */
export const proxyPlugin = createBackendPlugin({
  pluginId: 'proxy',
  register(env) {
    env.registerInit({
      deps: {
        config: coreServices.rootConfig,
        discovery: coreServices.discovery,
        logger: coreServices.logger,
        httpRouter: coreServices.httpRouter,
      },
      async init({ config, discovery, logger, httpRouter }) {
        await createRouterInternal({
          config,
          discovery,
          logger: loggerToWinstonLogger(logger),
          httpRouterService: httpRouter,
        });
      },
    });
  },
});
