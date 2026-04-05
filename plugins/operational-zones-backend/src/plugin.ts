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
import { DefaultOperationalZoneService } from './service/DefaultOperationalZoneService';

/**
 * Backend plugin for managing operational zones.
 *
 * @public
 */
export const operationalZonesPlugin = createBackendPlugin({
  pluginId: 'operational-zones',
  register(env) {
    env.registerInit({
      deps: {
        config: coreServices.rootConfig,
        httpAuth: coreServices.httpAuth,
        httpRouter: coreServices.httpRouter,
        logger: coreServices.logger,
        scheduler: coreServices.scheduler,
      },
      async init({ config, httpAuth, httpRouter, logger, scheduler }) {
        const service = DefaultOperationalZoneService.fromConfig(config, {
          logger,
        });

        httpRouter.use(await createRouter({ httpAuth, service }));
        httpRouter.addAuthPolicy({
          path: '/zones',
          allow: 'unauthenticated',
        });

        const taskRunner = scheduler.createScheduledTaskRunner({
          frequency: { minutes: 1 },
          timeout: { seconds: 30 },
          initialDelay: { seconds: 5 },
          scope: 'global',
        });

        await taskRunner.run({
          id: 'operational-zones-heartbeat',
          fn: async () => {
            await service.evaluateAll();
          },
        });
      },
    });
  },
});
