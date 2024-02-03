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
  createServiceFactory,
} from '@backstage/backend-plugin-api';
import { DefaultRootFeatureRegistryService } from './DefaultRootFeatureRegistry';
import { HostDiscovery } from '../discovery';
import { InstanceRegistration } from './InstanceRegistration';

/** @public */
export const rootFeatureRegistryServiceFactory = createServiceFactory({
  service: coreServices.rootFeatureRegistry,
  deps: {
    rootConfig: coreServices.rootConfig,
    lifecycle: coreServices.rootLifecycle,
  },
  async factory({ rootConfig, lifecycle }) {
    const baseUrl = rootConfig.getString('backend.baseUrl');
    const gatewayUrl = rootConfig.getOptionalString('discovery.gatewayUrl');
    const isGateway = !gatewayUrl;
    const registry = new DefaultRootFeatureRegistryService();
    const discovery = HostDiscovery.fromConfig(rootConfig);

    lifecycle.addStartupHook(() => {
      if (!isGateway) {
        const registration = new InstanceRegistration({
          discovery,
          rootFeatureRegistry: registry,
          gatewayUrl,
          instanceUrl: baseUrl,
        });

        registration.startHeartbeat();
      }
    });

    return registry;
  },
});
