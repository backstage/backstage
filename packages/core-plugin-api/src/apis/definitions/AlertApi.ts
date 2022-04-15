/*
 * Copyright 2020 The Backstage Authors
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

/**
 * Deprecated. Message handled by the {@link AlertApi}.
 *
 * @public
 * @deprecated Use {@link AlertNotification} instead.
 */
export type AlertMessage = {
  message: string;
  // Severity will default to success since that is what material ui defaults the value to.
  severity?: 'success' | 'info' | 'warning' | 'error';
};

/**
 * Deprecated. The alert API is used to report alerts to the app, and display them to the user.
 *
 * @public
 * @deprecated Use {@link NotificationApi} instead.
 */
export type AlertApi = {
  /**
   * Post an alert for handling by the application.
   */
  post(alert: AlertMessage): void;

  /**
   * Observe alerts posted by other parts of the application.
   */
  alert$(): Observable<AlertMessage>;
};

/**
 * Deprecated. The {@link ApiRef} of {@link AlertApi}.
 *
 * @public
 * @deprecated Use {@link notificationApiRef} instead.
 */
export const alertApiRef: ApiRef<AlertApi> = createApiRef({
  id: 'core.alert',
});
