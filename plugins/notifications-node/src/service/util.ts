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
import { Config } from '@backstage/config';
import { NotificationSendOptions } from './DefaultNotificationService';
import { Notification } from '@backstage/plugin-notifications-common';

const stripLeadingSlash = (s: string) => s.replace(/^\//, '');
const ensureTrailingSlash = (s: string) => s.replace(/\/?$/, '/');

/**
 * Converts notification payload link to absolute address
 * @public
 */
export const getAbsoluteNotificationLink = (
  config: Config,
  notification: Notification | NotificationSendOptions,
) => {
  const frontendBaseUrl = config.getString('app.baseUrl');
  if (!notification?.payload.link) {
    return `${frontendBaseUrl}/notifications`;
  }

  try {
    const url = new URL(
      stripLeadingSlash(notification.payload.link),
      ensureTrailingSlash(frontendBaseUrl),
    );

    // Only allow http and https protocols for links
    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new Error('Invalid protocol');
    }
    return url.toString();
  } catch (_e) {
    // noop: fallback to relative URL
  }

  // If we don't get safe URL, we return the default URL to notifications
  return `${frontendBaseUrl}/notifications`;
};
