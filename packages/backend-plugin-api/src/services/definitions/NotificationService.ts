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

import { NotificationPayload } from '@backstage/plugin-notifications-common';

/** @public */
export type NotificationRecipients =
  | {
      type: 'entity';
      /**
       * Entity references to send the notifications to
       */
      entityRef: string | string[];
      /**
       * Optional entity reference(s) to filter out of the resolved recipients.
       * Usually the currently logged-in user for preventing sending notification
       * of user action to him/herself.
       */
      excludeEntityRef?: string | string[];
    }
  | { type: 'broadcast' };

/** @public */
export type NotificationSendOptions = {
  recipients: NotificationRecipients;
  payload: NotificationPayload;
};

/** @public */
export interface NotificationService {
  send(options: NotificationSendOptions): Promise<void>;
}
