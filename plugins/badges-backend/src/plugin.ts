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
} from '@backstage/backend-plugin-api';
import { createRouter } from './service/router';
import { createDefaultBadgeFactories } from './badges';

/**
 * Badges backend plugin
 *
 * @public
 */
export const badgesPlugin = createBackendPlugin({
  pluginId: 'badges',
  register(env) {
    env.registerInit({
      deps: {
        config: coreServices.rootConfig,
        logger: coreServices.logger,
        discovery: coreServices.discovery,
        tokenManager: coreServices.tokenManager,
        identity: coreServices.identity,
        httpRouter: coreServices.httpRouter,
        httpAuth: coreServices.httpAuth,
        auth: coreServices.auth,
      },
      async init({
        config,
        logger,
        discovery,
        tokenManager,
        identity,
        httpRouter,
        httpAuth,
        auth,
      }) {
        httpRouter.use(
          await createRouter({
            config,
            logger: loggerToWinstonLogger(logger),
            badgeFactories: createDefaultBadgeFactories(),
            discovery,
            tokenManager,
            identity,
            httpAuth,
            auth,
          }),
        );
      },
    });
  },
});
