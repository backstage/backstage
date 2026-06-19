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
  createBackendModule,
} from '@backstage/backend-plugin-api';
import { StarsDatabase } from './database/StarsDatabase';
import { createRouter } from './router';
import express from 'express';

/**
 * Catalog Module for Opt-in database-backed Starred Entities
 *
 * @public
 */
export const catalogModuleStars = createBackendModule({
  pluginId: 'catalog',
  moduleId: 'stars',
  register(env) {
    env.registerInit({
      deps: {
        database: coreServices.database,
        httpRouter: coreServices.httpRouter,
        httpAuth: coreServices.httpAuth,
        userInfo: coreServices.userInfo,
        logger: coreServices.logger,
      },
      async init({ database, httpRouter, httpAuth, userInfo, logger }) {
        const dbClient = await database.getClient();
        const starsDatabase = await StarsDatabase.create(dbClient);

        const router = await createRouter({
          database: starsDatabase,
          httpAuth,
          userInfo,
        });

        const baseRouter = express.Router();
        baseRouter.use('/starred-entities', router);
        httpRouter.use(baseRouter);
        logger.info('Registered catalog module stars endpoints');
      },
    });
  },
});
