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
import { GatewayDiscoveryService } from './GatewayDiscoveryService';
import { LeafNodeDiscoveryService } from './LeafNodeDiscoveryService';
import { LeafNodeRegistration } from '../registration/LeafNodeRegistration';

/**
 * @public
 */
export const dynamicDiscoveryServiceFactory = createServiceFactory({
  service: coreServices.discovery,
  deps: {
    config: coreServices.rootConfig,
    rootLogger: coreServices.rootLogger,
    instanceMetadata: coreServices.instanceMetadata,
    rootLifecycle: coreServices.rootLifecycle,
  },
  async createRootContext({ config, instanceMetadata, rootLogger }) {
    const logger = rootLogger.child({ plugin: 'discovery' });
    let discovery: LeafNodeDiscoveryService | GatewayDiscoveryService;
    if (config.getOptional('discovery.gateway')) {
      discovery = LeafNodeDiscoveryService.fromConfig(config, {
        instanceMetadata,
      });
    } else {
      discovery = await GatewayDiscoveryService.fromConfig(config, {
        instanceMetadata,
      });
    }
    if (discovery instanceof LeafNodeDiscoveryService) {
      const registration = LeafNodeRegistration.fromConfig(config, {
        instanceMetadata,
        logger,
      });
      registration.register();
    }
    return discovery;
  },
  factory(_, discovery) {
    return discovery;
  },
});
