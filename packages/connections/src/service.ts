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
  createServiceFactory,
  createServiceRef,
} from '@backstage/backend-plugin-api';
import { ConnectionsService, DefaultConnectionsService } from './api';

/** @public */
export const connectionsServiceRef = createServiceRef<ConnectionsService>({
  id: 'core.connections',
  scope: 'plugin',
});

/** @public */
export const connectionsServiceFactory = createServiceFactory({
  service: connectionsServiceRef,
  deps: {
    pluginMetadata: coreServices.pluginMetadata,
    rootLogger: coreServices.rootLogger,
    logger: coreServices.logger,
    config: coreServices.rootConfig,
  },
  async createRootContext({ rootLogger, config }) {
    return DefaultConnectionsService.create({ logger: rootLogger, config });
  },

  async factory({ logger, pluginMetadata }, connectionsService) {
    const pluginId = pluginMetadata.getId();
    return connectionsService.forPlugin(pluginId, { logger });
  },
});
