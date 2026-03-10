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
  createBackendModule,
} from '@backstage/backend-plugin-api';
import { notificationsProcessingExtensionPoint } from '@backstage/plugin-notifications-node';
import { SlackNotificationProcessor } from './lib/SlackNotificationProcessor';
import { catalogServiceRef } from '@backstage/plugin-catalog-node';
import {
  notificationsSlackBlockKitExtensionPoint,
  SlackBlockKitRenderer,
} from './extensions';

/**
 * The Slack notification processor for use with the notifications plugin.
 * This allows sending of notifications via Slack DMs or to channels.
 *
 * @public
 */
export const notificationsModuleSlack = createBackendModule({
  pluginId: 'notifications',
  moduleId: 'slack',
  register(reg) {
    let blockKitRenderer: SlackBlockKitRenderer | undefined;
    reg.registerExtensionPoint(notificationsSlackBlockKitExtensionPoint, {
      setBlockKitRenderer(renderer) {
        if (blockKitRenderer) {
          throw new Error(`Slack block kit renderer was already registered`);
        }
        blockKitRenderer = renderer;
      },
    });

    reg.registerInit({
      deps: {
        auth: coreServices.auth,
        config: coreServices.rootConfig,
        logger: coreServices.logger,
        catalog: catalogServiceRef,
        notifications: notificationsProcessingExtensionPoint,
      },
      async init({ auth, config, logger, catalog, notifications }) {
        notifications.addProcessor(
          SlackNotificationProcessor.fromConfig(config, {
            auth,
            logger,
            catalog,
            blockKitRenderer,
          }),
        );
      },
    });
  },
});
