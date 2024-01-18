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
import { DefaultJenkinsInfoProvider } from './service/jenkinsInfoProvider';
import { createRouter } from './service/router';
import { catalogServiceRef } from '@backstage/plugin-catalog-node/alpha';

/**
 * Jenkins backend plugin
 *
 * @public
 */
export const jenkinsPlugin = createBackendPlugin({
  pluginId: 'jenkins',
  register(env) {
    env.registerInit({
      deps: {
        logger: coreServices.logger,
        permissions: coreServices.permissions,
        httpRouter: coreServices.httpRouter,
        config: coreServices.rootConfig,
        catalogClient: catalogServiceRef,
      },
      async init({ logger, permissions, httpRouter, config, catalogClient }) {
        const winstonLogger = loggerToWinstonLogger(logger);
        const jenkinsInfoProvider = DefaultJenkinsInfoProvider.fromConfig({
          config,
          catalog: catalogClient,
        });
        httpRouter.use(
          await createRouter({
            permissions,
            /**
             * Logger for logging purposes
             */
            logger: winstonLogger,
            /**
             * Info provider to be able to get all necessary information for the APIs
             */
            jenkinsInfoProvider,
          }),
        );
      },
    });
  },
});
