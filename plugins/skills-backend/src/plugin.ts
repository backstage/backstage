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
import { createApiRouter, createWellKnownRouter } from './service/router';
import { DatabaseSkillsStore } from './database';

/**
 * Skills backend plugin.
 *
 * @public
 */
export const skillsPlugin = createBackendPlugin({
  pluginId: 'skills',
  register(env) {
    env.registerInit({
      deps: {
        httpAuth: coreServices.httpAuth,
        httpRouter: coreServices.httpRouter,
        rootHttpRouter: coreServices.rootHttpRouter,
        logger: coreServices.logger,
        database: coreServices.database,
      },
      async init({ httpAuth, httpRouter, rootHttpRouter, logger, database }) {
        const store = await DatabaseSkillsStore.create({ database });

        rootHttpRouter.use(
          '/.well-known/skills',
          await createWellKnownRouter({
            store,
          }),
        );

        httpRouter.use(
          await createApiRouter({
            httpAuth,
            logger,
            store,
          }),
        );
      },
    });
  },
});
