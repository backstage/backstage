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
  createServiceRef,
} from '@backstage/backend-plugin-api';
import { DeploymentMetadataService } from './types';
import type { DynamicDiscoveryService } from '@backstage/plugin-dynamic-discovery-backend';

export const deploymentMetadataServiceRef =
  createServiceRef<DeploymentMetadataService>({
    id: 'deployment.metadata',
  });

export const deploymentMetadataServiceFactory = createServiceFactory({
  service: deploymentMetadataServiceRef,
  deps: {
    rootLogger: coreServices.rootLogger,
    instanceMetadata: coreServices.instanceMetadata,
    rootHttpRouter: coreServices.rootHttpRouter,
    discovery: coreServices.discovery,
  },
  async factory({ rootLogger, discovery }) {
    const logger = rootLogger.child({ plugin: 'deployment-metadata' });
    logger.info('Creating deployment metadata service');
    if (!('isGateway' in discovery) || discovery.isGateway === undefined) {
      throw new Error(
        'You must use this plugin with the dynamic-discovery-backend plugin',
      );
    }
    return discovery as DynamicDiscoveryService;
  },
});

export default deploymentMetadataServiceFactory;
