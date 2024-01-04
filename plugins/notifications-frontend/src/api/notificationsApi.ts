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
  CreateBody,
  GetNotificationsCountRequest,
  GetNotificationsRequest,
  Notification,
  SetReadRequest,
} from '../openapi';

export type NotificationsCreateRequest = CreateBody;

export type NotificationsQuery = Omit<GetNotificationsRequest, 'user'>;

export type NotificationsCountQuery = Omit<
  GetNotificationsCountRequest,
  'user'
>;

export type NotificationMarkAsRead = Omit<SetReadRequest, 'user'>;
export interface NotificationsApi {
  /** Create a notification. Returns its new ID. */
  createNotification(notification: NotificationsCreateRequest): Promise<string>;

  /** Read a list of notifications based on filter parameters. */
  getNotifications(query?: NotificationsQuery): Promise<Notification[]>;

  /** Returns the count of notifications for the user. */
  getNotificationsCount(query?: NotificationsCountQuery): Promise<number>;

  /** Marks the notification as read by the user. */
  markAsRead(params: NotificationMarkAsRead): Promise<void>;
}

export const notificationsApiRef = createApiRef<NotificationsApi>({
  id: 'plugin.notifications',
});
