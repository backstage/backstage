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
import { createBackendModule } from '@backstage/backend-plugin-api';
import { notificationService } from '@backstage/plugin-notifications-node';
import { scaffolderActionsExtensionPoint } from '@backstage/plugin-scaffolder-node/alpha';
import { createSendNotificationAction } from './actions';

/**
 * @public
 * The Notifications module for the Scaffolder Backend
 */
export const scaffolderModuleNotifications = createBackendModule({
  pluginId: 'scaffolder',
  moduleId: 'notifications',
  register(reg) {
    reg.registerInit({
      deps: {
        notifications: notificationService,
        scaffolder: scaffolderActionsExtensionPoint,
      },
      async init({ notifications, scaffolder }) {
        scaffolder.addActions(createSendNotificationAction({ notifications }));
      },
    });
  },
});
