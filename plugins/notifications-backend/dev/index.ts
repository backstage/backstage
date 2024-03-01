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

import { createBackend } from '@backstage/backend-defaults';
import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { notificationService } from '@backstage/plugin-notifications-node';

const notificationsDebug = createBackendPlugin({
  pluginId: 'notifications-debug',
  register(env) {
    env.registerInit({
      deps: {
        notifications: notificationService,
        lifecycle: coreServices.lifecycle,
      },
      async init({ notifications, lifecycle }) {
        let interval: NodeJS.Timeout | undefined;
        lifecycle.addStartupHook(async () => {
          interval = setInterval(async () => {
            await notifications.send({
              recipients: {
                type: 'entity',
                entityRef: 'user:development/guest',
              },
              payload: { title: 'Test notification' },
            });
          }, 5000);
        });

        lifecycle.addShutdownHook(async () => {
          if (interval) {
            clearInterval(interval);
          }
        });
      },
    });
  },
});

const backend = createBackend();
backend.add(import('@backstage/plugin-events-backend/alpha'));
backend.add(import('@backstage/plugin-signals-backend'));
backend.add(import('@backstage/plugin-auth-backend'));
backend.add(import('@backstage/plugin-auth-backend-module-guest-provider'));
backend.add(import('../src'));
backend.add(notificationsDebug);

backend.start();
