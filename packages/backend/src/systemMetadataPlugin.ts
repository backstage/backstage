/*
 * Copyright 2025 The Backstage Authors
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
import Router from 'express-promise-router';

/**
 * Example plugin that shows how to reveal all installed plugins with the
 * system metadata API.
 */
export default createBackendPlugin({
  pluginId: 'system-metadata-router',
  register: reg => {
    reg.registerInit({
      deps: {
        systemMetadata: coreServices.rootSystemMetadata,
        rootHttpRouter: coreServices.rootHttpRouter,
      },
      async init({ systemMetadata, rootHttpRouter }) {
        const router = Router();
        router.get('/plugins', async (_, res) => {
          const plugins = (await systemMetadata.getInstalledPlugins()).toSorted(
            (a, b) => a.pluginId.localeCompare(b.pluginId),
          );
          res.json(plugins);
        });

        rootHttpRouter.use('/.backstage/systemMetadata', router);
      },
    });
  },
});
