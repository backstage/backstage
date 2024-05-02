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
  createBackendModule,
} from '@backstage/backend-plugin-api';
import { NotificationsTeamsProcessor } from './processor';
import { CatalogClient } from '@backstage/catalog-client';
import { notificationsProcessingExtensionPoint } from '@backstage/plugin-notifications-node';

/**
 * @public
 */
export const notificationsModuleTeams = createBackendModule({
  pluginId: 'notifications',
  moduleId: 'teams',
  register(reg) {
    reg.registerInit({
      deps: {
        auth: coreServices.auth,
        config: coreServices.rootConfig,
        discovery: coreServices.discovery,
        logger: coreServices.logger,
        cache: coreServices.cache,
        notifications: notificationsProcessingExtensionPoint,
      },
      async init({ auth, config, discovery, logger, cache, notifications }) {
        const catalogClient = new CatalogClient({
          discoveryApi: discovery,
        });

        notifications.addProcessor(
          NotificationsTeamsProcessor.fromConfig(config, {
            auth,
            discovery,
            logger,
            cache,
            catalogClient,
          }),
        );
      },
    });
  },
});
