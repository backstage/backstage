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
import { GatewayDiscoveryService } from './implementations/discovery/GatewayDiscoveryService';
import { isDynamicDiscoveryService } from '.';

/**
 * dynamicDiscoveryPlugin backend plugin
 *
 * @public
 */
export default createBackendPlugin({
  pluginId: 'dynamic-discovery',
  register(env) {
    env.registerInit({
      deps: {
        httpRouter: coreServices.httpRouter,
        logger: coreServices.logger,
        discovery: coreServices.discovery,
      },
      async init({ httpRouter, logger, discovery }) {
        console.log(discovery);
        if (!isDynamicDiscoveryService(discovery)) {
          throw new Error(
            'Invalid discovery service, you must install the dynamicDiscoveryServiceFactory as well.',
          );
        }
        if (discovery.isGateway) {
          httpRouter.use(
            await createRouter({
              logger,
              discovery: discovery as GatewayDiscoveryService,
            }),
          );
          httpRouter.addAuthPolicy({
            path: '/health',
            allow: 'unauthenticated',
          });
        }
      },
    });
  },
});
