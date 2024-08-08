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

/** @public */
export type NotificationSeverity = 'critical' | 'high' | 'normal' | 'low';

/** @public */
export type NotificationPayload = {
  /**
   * Notification title
   */
  title: string;
  /**
   * Optional longer description for the notification
   */
  description?: string;
  /**
   * Optional link where the notification is pointing to
   */
  link?: string;
  // TODO: Add support for additional links
  // additionalLinks?: string[];
  /**
   * Notification severity, defaults to 'normal'
   */
  severity?: NotificationSeverity;
  /**
   * Optional notification topic
   */
  topic?: string;
  /**
   * Notification scope, can be used to re-send same notifications in case
   * the scope and origin matches.
   */
  scope?: string;
  /**
   * Optional notification icon
   */
  icon?: string;
};

/** @public */
export type Notification = {
  /**
   * Unique identifier for the notification
   */
  id: string;
  /**
   * The user entity reference that the notification is targeted to or null
   * for broadcast notifications
   */
  user: string | null;
  /**
   * Notification creation date
   */
  created: Date;
  /**
   * If user has saved the notification, the date when it was saved
   */
  saved?: Date;
  /**
   * If user has read the notification, the date when it was read
   */
  read?: Date;
  /**
   * If the notification has been updated due to it being in the same scope
   * and from same origin as previous notification, the date when it was updated
   */
  updated?: Date;
  /**
   * Origin of the notification as in the reference to sender
   */
  origin: string;
  /**
   * Actual notification payload
   */
  payload: NotificationPayload;
};

/** @public */
export type NotificationStatus = {
  /**
   * Total number of unread notifications for the user
   */
  unread: number;
  /**
   * Total number of read notifications for the user
   */
  read: number;
};

/** @public */
export type NewNotificationSignal = {
  action: 'new_notification';
  notification_id: string;
};

/** @public */
export type NotificationReadSignal = {
  action: 'notification_read' | 'notification_unread';
  notification_ids: string[];
};

/** @public */
export type NotificationSignal = NewNotificationSignal | NotificationReadSignal;

/**
 * @public
 */
export type NotificationProcessorFilters = {
  minSeverity?: NotificationSeverity;
  maxSeverity?: NotificationSeverity;
  excludedTopics?: string[];
};

/**
 * @public
 */
export type NotificationSettings = {
  channels: {
    id: string;
    origins: {
      id: string;
      enabled: boolean;
    }[];
  }[];
};
