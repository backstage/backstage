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
import { createApiRef } from '@backstage/core-plugin-api';
import {
  Notification,
  NotificationStatus,
  NotificationType,
} from '@backstage/plugin-notifications-common';

/** @public */
export const notificationsApiRef = createApiRef<NotificationsApi>({
  id: 'plugin.notifications.service',
});

/** @public */
export type GetNotificationsOptions = {
  type?: NotificationType;
  offset?: number;
  limit?: number;
  search?: string;
};

/** @public */
export type UpdateNotificationsOptions = {
  ids: string[];
  done?: boolean;
  read?: boolean;
  saved?: boolean;
};

/** @public */
export interface NotificationsApi {
  getNotifications(options?: GetNotificationsOptions): Promise<Notification[]>;

  getStatus(): Promise<NotificationStatus>;

  updateNotifications(
    options: UpdateNotificationsOptions,
  ): Promise<Notification[]>;
}
