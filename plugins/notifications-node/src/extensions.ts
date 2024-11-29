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
import { createExtensionPoint } from '@backstage/backend-plugin-api';
import {
  Notification,
  NotificationProcessorFilters as NotificationProcessorFiltersCommon,
} from '@backstage/plugin-notifications-common';
import { NotificationSendOptions } from './service';

/**
 * Notification processors are used to modify the notification parameters or sending the notifications
 * to external systems.
 *
 * Notification modules should utilize the `notificationsProcessingExtensionPoint` to add new processors
 * to the system.
 *
 * Notification processing flow:
 *
 * 1. New notification send request is received
 * 2. For all notification processors registered, processOptions function is called to process the notification options
 * 3. Notification recipients are resolved from the options
 * 4. For each recipient, preProcess function is called to pre-process the notification
 * 5. Notification is saved to the database and sent to the Backstage UI
 * 6. For each recipient, postProcess function is called to post-process the notification
 *
 * @public
 */
export interface NotificationProcessor {
  /**
   * Human-readable name of this processor like Email, Slack, etc.
   */
  getName(): string;

  /**
   * Process the notification options.
   *
   * Can be used to override the default recipient resolving, sending the notification to an
   * external service or modify other notification options necessary.
   *
   * processOptions functions are called only once for each notification before the recipient resolving,
   * pre-process, sending and post-process of the notification.
   *
   * @param options - The original options to send the notification
   */
  processOptions?(
    options: NotificationSendOptions,
  ): Promise<NotificationSendOptions>;

  /**
   * Pre-process notification before sending it to Backstage UI.
   *
   * Can be used to send the notification to external services or to decorate the notification with additional
   * information. The notification is saved to database and sent to Backstage UI after all pre-process functions
   * have run. The notification options passed here are already processed by processOptions functionality.
   *
   * preProcess functions are called for each notification recipient individually or once for broadcast
   * notification BEFORE the notification has been sent to the Backstage UI.
   *
   * @param notification - The notification to send
   * @param options - The options to send the notification
   * @returns The same notification or a modified version of it
   */
  preProcess?(
    notification: Notification,
    options: NotificationSendOptions,
  ): Promise<Notification>;

  /**
   * Post process notification after sending it to Backstage UI.
   *
   * Can be used to send the notification to external services.
   *
   * postProcess functions are called for each notification recipient individually or once for
   * broadcast notification AFTER the notification has been sent to the Backstage UI.
   *
   * @param notification - The notification to send
   * @param options - The options to send the notification
   */
  postProcess?(
    notification: Notification,
    options: NotificationSendOptions,
  ): Promise<void>;

  /**
   * notification filters are used to call the processor only in certain conditions
   */
  getNotificationFilters?(): NotificationProcessorFilters;
}

/**
 * @public
 */
export interface NotificationsProcessingExtensionPoint {
  addProcessor(
    ...processors: Array<NotificationProcessor | Array<NotificationProcessor>>
  ): void;
}

/**
 * @public
 */
export const notificationsProcessingExtensionPoint =
  createExtensionPoint<NotificationsProcessingExtensionPoint>({
    id: 'notifications.processing',
  });

/**
 * @public
 * @deprecated Please import from `@backstage/plugin-notifications-common` instead
 */
export type NotificationProcessorFilters = NotificationProcessorFiltersCommon;
