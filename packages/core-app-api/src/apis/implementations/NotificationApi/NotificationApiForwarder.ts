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

import { Notification, NotificationApi } from '@backstage/core-plugin-api';
import { Observable } from '@backstage/types';
import { PublishSubject } from '../../../lib/subjects';
import { StorageApi } from '@backstage/core-plugin-api';

type NotificationStorage = {
  timestamp: number;
};
/**
 * Base implementation for the NotificationApi that simply forwards alerts to consumers.
 *
 * @public
 */
export class NotificationApiForwarder implements NotificationApi {
  private readonly subject = new PublishSubject<Notification>();
  constructor(private readonly storageApi: StorageApi) {}

  post(notification: Notification) {
    this.subject.next(notification);
  }

  notification$(): Observable<Notification> {
    return this.subject;
  }

  acknowledge(notification: Notification): void {
    if (notification.spec?.targetEntityRefs) {
      this.storageApi.set('notifications', {
        timestamp: notification.metadata?.timestamp,
      });
    }
  }

  getLastAcknowledge(): number | undefined {
    const data = this.storageApi.snapshot<NotificationStorage>('notifications');
    return data.value?.timestamp;
  }
}
