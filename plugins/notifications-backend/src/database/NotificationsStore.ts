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
  NotificationSettings,
  NotificationSeverity,
  NotificationStatus,
} from '@backstage/plugin-notifications-common';

/** @internal */
export type EntityOrder = {
  field: string;
  order: 'asc' | 'desc';
};

// TODO: reuse the common part of the type with front-end
/** @internal */
export type NotificationGetOptions = {
  user: string;
  ids?: string[];
  offset?: number;
  limit?: number;
  search?: string;
  orderField?: EntityOrder[];
  topic?: string;
  read?: boolean;
  saved?: boolean;
  createdAfter?: Date;
  minimumSeverity?: NotificationSeverity;
};

/** @internal */
export type NotificationModifyOptions = {
  ids: string[];
} & NotificationGetOptions;

/** @internal */
export type TopicGetOptions = {
  user: string;
  search?: string;
  read?: boolean;
  saved?: boolean;
  createdAfter?: Date;
  minimumSeverity?: NotificationSeverity;
};

/** @internal */
export interface NotificationsStore {
  getNotifications(options: NotificationGetOptions): Promise<Notification[]>;
  getNotificationsCount(options: NotificationGetOptions): Promise<number>;

  saveNotification(notification: Notification): Promise<void>;

  saveBroadcast(notification: Notification): Promise<void>;

  getExistingScopeNotification(options: {
    user: string;
    scope: string;
    origin: string;
  }): Promise<Notification | null>;

  getExistingScopeBroadcast(options: {
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

  markSaved(options: NotificationModifyOptions): Promise<void>;

  markUnsaved(options: NotificationModifyOptions): Promise<void>;

  getUserNotificationOrigins(options: {
    user: string;
  }): Promise<{ origins: string[] }>;

  getNotificationSettings(options: {
    user: string;
  }): Promise<NotificationSettings>;

  saveNotificationSettings(options: {
    user: string;
    settings: NotificationSettings;
  }): Promise<void>;

  getTopics(options: TopicGetOptions): Promise<{ topics: string[] }>;
}
