/*
 * Copyright 2022 The Backstage Authors
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

import { createApiRef, ApiRef } from '../system';
import { Observable } from '@backstage/types';
import { EntityRef } from '@backstage/catalog-model';

export type Notification = {
  kind: string;
  metadata?: {
    targetEntityRefs?: EntityRef[];
    [key: string]: any;
  };
};

export type AlertNotification = Notification & {
  kind: 'alert';
  metadata: {
    message: string;
    severity: 'success' | 'info' | 'warning' | 'error';
  };
};

/**
 * The notification API is used to report messages to the app, and display them to the user.
 *
 * @public
 */
export type NotificationApi = {
  /**
   * Post a notification for handling by the application.
   */
  post(notification: Notification): void;

  /**
   * Observe notifications posted by other parts of the application.
   */
  notification$(): Observable<Notification>;
};

/**
 * The {@link ApiRef} of {@link NotificationApi}.
 *
 * @public
 */
export const notificationApiRef: ApiRef<NotificationApi> = createApiRef({
  id: 'core.notification',
});
