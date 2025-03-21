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
import { catalogServiceRef } from '@backstage/plugin-catalog-node/alpha';
import { notificationsProcessingExtensionPoint } from '@backstage/plugin-notifications-node';
import { NotificationsEmailProcessor } from './processor';
import {
  notificationsEmailTemplateExtensionPoint,
  NotificationTemplateRenderer,
} from './extensions';

/**
 * @public
 */
export const notificationsModuleEmail = createBackendModule({
  pluginId: 'notifications',
  moduleId: 'email',
  register(reg) {
    let templateRenderer: NotificationTemplateRenderer | undefined;
    reg.registerExtensionPoint(notificationsEmailTemplateExtensionPoint, {
      setTemplateRenderer(renderer) {
        if (templateRenderer) {
          throw new Error(`Email template renderer was already registered`);
        }
        templateRenderer = renderer;
      },
    });

    reg.registerInit({
      deps: {
        config: coreServices.rootConfig,
        notifications: notificationsProcessingExtensionPoint,
        logger: coreServices.logger,
        auth: coreServices.auth,
        cache: coreServices.cache,
        catalog: catalogServiceRef,
      },
      async init({ config, notifications, logger, auth, cache, catalog }) {
        notifications.addProcessor(
          new NotificationsEmailProcessor(
            logger,
            config,
            catalog,
            auth,
            cache,
            templateRenderer,
          ),
        );
      },
    });
  },
});
