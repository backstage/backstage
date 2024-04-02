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
import { notificationsProcessingExtensionPoint } from '@backstage/plugin-notifications-node';
import { signalsServiceRef } from '@backstage/plugin-signals-node';
import { createRouter } from './service/router';
import { DatabaseNotificationsStore } from './database';
import { WebNotificationProcessor } from './service/WebNotificationProcessor';

/**
 * Notifications module to show notifications in the Backstage UI.
 *
 * @public
 */
export const notificationsModuleWeb = createBackendModule({
  pluginId: 'notifications',
  moduleId: 'web',
  register(reg) {
    reg.registerInit({
      deps: {
        httpAuth: coreServices.httpAuth,
        userInfo: coreServices.userInfo,
        httpRouter: coreServices.httpRouter,
        logger: coreServices.logger,
        database: coreServices.database,
        signals: signalsServiceRef,
        notifications: notificationsProcessingExtensionPoint,
      },
      async init({
        httpAuth,
        userInfo,
        httpRouter,
        logger,
        database,
        signals,
        notifications,
      }) {
        const store = await DatabaseNotificationsStore.create({ database });
        const processor = new WebNotificationProcessor(store, signals);
        notifications.addProcessor(processor);

        httpRouter.use(
          await createRouter({
            httpAuth,
            userInfo,
            logger,
            store,
            signals,
          }),
        );
        httpRouter.addAuthPolicy({
          path: '/health',
          allow: 'unauthenticated',
        });
      },
    });
  },
});
