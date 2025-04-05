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

import {
  coreServices,
  createServiceFactory,
} from '@backstage/backend-plugin-api';
import { DefaultSchedulerService } from './lib/DefaultSchedulerService';
import Router from 'express-promise-router';

/**
 * Scheduling of distributed background tasks.
 *
 * See {@link @backstage/code-plugin-api#SchedulerService}
 * and {@link https://backstage.io/docs/backend-system/core-services/scheduler | the service docs}
 * for more information.
 *
 * @public
 */
export const schedulerServiceFactory = createServiceFactory({
  service: coreServices.scheduler,
  deps: {
    database: coreServices.database,
    logger: coreServices.logger,
    rootLifecycle: coreServices.rootLifecycle,
    http: coreServices.httpRouter,
  },
  async factory({ database, logger, rootLifecycle, http }) {
    const schedulerService = DefaultSchedulerService.create({
      database,
      logger,
      rootLifecycle,
    });
    const router = Router();
    router.get('/.backstage/scheduler/v1/tasks', async (_, res) => {
      res.json(await schedulerService.getScheduledTasks());
    });
    http.use(router);
    schedulerService.scheduleTask({
      id: 'test',
      scope: 'local',
      frequency: { minutes: 1 },
      fn: async () => {
        logger.info('Hello from the scheduler!');
      },
      timeout: { seconds: 10 },
    });
    return schedulerService;
  },
});
