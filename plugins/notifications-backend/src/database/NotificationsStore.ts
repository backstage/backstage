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
  Notification,
  NotificationStatus,
  NotificationType,
} from '@backstage/plugin-notifications-common';

/** @internal */
export type NotificationGetOptions = {
  user: string;
  ids?: string[];
  type?: NotificationType;
  offset?: number;
  limit?: number;
  search?: string;
  sort?: 'created' | 'read' | 'updated' | null;
  sortOrder?: 'asc' | 'desc';
};

/** @internal */
export type NotificationModifyOptions = {
  ids: string[];
} & NotificationGetOptions;

/** @internal */
export interface NotificationsStore {
  getNotifications(options: NotificationGetOptions): Promise<Notification[]>;

  saveNotification(notification: Notification): Promise<void>;

  getExistingScopeNotification(options: {
    user: string;
    scope: string;
    origin: string;
  }): Promise<Notification | null>;

  restoreExistingNotification(options: {
    id: string;
    notification: Notification;
  }): Promise<Notification | null>;

  getNotification(options: { id: string }): Promise<Notification | null>;

  getStatus(options: NotificationGetOptions): Promise<NotificationStatus>;

  markRead(options: NotificationModifyOptions): Promise<void>;

  markUnread(options: NotificationModifyOptions): Promise<void>;

  markDone(options: NotificationModifyOptions): Promise<void>;

  markUndone(options: NotificationModifyOptions): Promise<void>;

  markSaved(options: NotificationModifyOptions): Promise<void>;

  markUnsaved(options: NotificationModifyOptions): Promise<void>;
}
