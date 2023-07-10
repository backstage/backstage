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
import { CatalogClient } from '@backstage/catalog-client';
import { createScheduler } from './service/createScheduler';

/**
 * Lighthouse backend plugin
 *
 * @public
 */
export const lighthousePlugin = createBackendPlugin({
  pluginId: 'lighthouse',
  register(env) {
    env.registerInit({
      deps: {
        config: coreServices.config,
        discovery: coreServices.discovery,
        logger: coreServices.logger,
        scheduler: coreServices.scheduler,
        tokenManager: coreServices.tokenManager,
      },
      async init({ config, discovery, logger, scheduler, tokenManager }) {
        const winstonLogger = loggerToWinstonLogger(logger);
        const catalogClient = new CatalogClient({ discoveryApi: discovery });

        await createScheduler({
          catalogClient,
          config,
          logger: winstonLogger,
          scheduler,
          tokenManager,
        });
      },
    });
  },
});
