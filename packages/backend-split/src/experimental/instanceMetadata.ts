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
import { instanceMetadataServiceRef } from '@backstage/backend-plugin-api/alpha';
import Router from 'express-promise-router';

// Example usage of the instance metadata service to log the installed features.
export default createBackendPlugin({
  pluginId: 'instance-metadata-logging',
  register(env) {
    env.registerInit({
      deps: {
        instanceMetadata: instanceMetadataServiceRef,
        logger: coreServices.logger,
        httpRouter: coreServices.rootHttpRouter,
      },
      async init({ instanceMetadata, logger, httpRouter }) {
        logger.info(
          `Installed features on this instance: ${instanceMetadata
            .getInstalledFeatures()
            .join(', ')}`,
        );

        const router = Router();

        router.get('/features/installed', (_, res) => {
          res.json({ items: instanceMetadata.getInstalledFeatures() });
        });

        httpRouter.use('/.backstage/instanceInfo', router);
      },
    });
  },
});
