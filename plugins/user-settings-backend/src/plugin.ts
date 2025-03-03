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

import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { createRouter } from './service/router';
import { signalsServiceRef } from '@backstage/plugin-signals-node';
import { DatabaseUserSettingsStore } from './database/DatabaseUserSettingsStore';

/**
 * The user settings backend plugin.
 *
 * @public
 */
export default createBackendPlugin({
  pluginId: 'user-settings',
  register(env) {
    env.registerInit({
      deps: {
        database: coreServices.database,
        httpAuth: coreServices.httpAuth,
        httpRouter: coreServices.httpRouter,
        signals: signalsServiceRef,
      },
      async init({ database, httpAuth, httpRouter, signals }) {
        const userSettingsStore = await DatabaseUserSettingsStore.create({
          database,
        });
        httpRouter.use(
          await createRouter({ userSettingsStore, httpAuth, signals }),
        );
      },
    });
  },
});
