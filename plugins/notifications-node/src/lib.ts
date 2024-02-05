/*
 * Copyright 2023 The Backstage Authors
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
import { DefaultNotificationService } from './service';
import { NotificationService } from './service/NotificationService';

/** @public */
export const notificationService = createServiceRef<NotificationService>({
  id: 'notifications.service',
  scope: 'plugin',
  defaultFactory: async service =>
    createServiceFactory({
      service,
      deps: {
        discovery: coreServices.discovery,
        tokenManager: coreServices.tokenManager,
        pluginMetadata: coreServices.pluginMetadata,
      },
      factory({ discovery, tokenManager, pluginMetadata }) {
        return DefaultNotificationService.create({
          discovery,
          tokenManager,
          pluginId: pluginMetadata.getId(),
        });
      },
    }),
});
