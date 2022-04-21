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
import {
  ErrorApi,
  ErrorApiError,
  ErrorApiErrorContext,
  NotificationApi,
  Notification,
} from '@backstage/core-plugin-api';
import { v4 as uuid } from 'uuid';

/**
 * Decorates an ErrorApi by also forwarding error messages
 * to the alertApi with an 'error' severity.
 *
 * @public
 */
export class ErrorAlerter implements ErrorApi {
  constructor(
    private readonly notificationApi: NotificationApi,
    private readonly errorApi: ErrorApi,
  ) {}

  post(error: ErrorApiError, context?: ErrorApiErrorContext) {
    if (!context?.hidden) {
      const alertNotification: Notification = {
        kind: 'alert',
        metadata: {
          title: '',
          message: error.message,
          uuid: uuid(),
          timestamp: Date.now(),
          severity: 'error',
        },
      };
      this.notificationApi.post(alertNotification);
    }

    return this.errorApi.post(error, context);
  }

  error$() {
    return this.errorApi.error$();
  }
}
