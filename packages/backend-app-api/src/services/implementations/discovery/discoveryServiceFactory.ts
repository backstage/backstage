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
import { MultipleBackendHostDiscovery } from './MultipleBackendHostDiscovery';
import { InstanceRegistration } from './InstanceRegistration';
import { createRouter } from './service/router';

/** @public */
export const discoveryServiceFactory = createServiceFactory({
  service: coreServices.discovery,
  deps: {
    config: coreServices.rootConfig,
    rootFeatureRegistry: coreServices.rootFeatureRegistry,
    lifecycle: coreServices.rootLifecycle,
    tokenManager: coreServices.tokenManager,
    rootHttpRouter: coreServices.rootHttpRouter,
    rootLogger: coreServices.rootLogger,
  },
  async createRootContext({
    config,
    lifecycle,
    rootFeatureRegistry,
    rootHttpRouter,
    rootLogger,
    tokenManager,
  }) {
    const discovery = MultipleBackendHostDiscovery.fromConfig(config, {
      rootFeatureRegistry,
      tokenManager,
    });
    lifecycle.addStartupHook(() => {
      if (!discovery.isGateway) {
        const registration = InstanceRegistration.fromConfig(config, {
          rootFeatureRegistry,
          discovery,
          tokenManager,
        });

        registration.startHeartbeat();
      } else if (discovery.isGateway && !discovery.isInitialized) {
        discovery.initialize();
      }
    });

    if (discovery.isGateway) {
      const logger = rootLogger.child({
        service: 'discovery',
      });
      rootHttpRouter.use(
        '/api/discovery',
        createRouter({
          tokenManager,
          logger,
          discovery,
        }),
      );
    }

    return discovery;
  },
  async factory(_deps, discovery) {
    return discovery;
  },
});
