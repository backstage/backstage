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

import {
  Notification,
  NotificationApi,
  NotificationFilter,
} from '@backstage/core-plugin-api';
import { Observable } from '@backstage/types';
import { PublishSubject } from '../../../lib/subjects';

/**
 * Base implementation for the NotificationApi that simply forwards alerts to consumers.
 *
 * @public
 */
export class NotificationApiForwarder implements NotificationApi {
  private readonly subject = new PublishSubject<Notification>();
  private notifications: Notification[] = [];

  constructor() {
    this.subject.subscribe(notification => {
      this.notifications.push(notification);
    });
  }

  post(notification: Notification) {
    this.subject.next(notification);
  }

  notification$(): Observable<Notification> {
    return this.subject;
  }

  async query(filter: NotificationFilter): Promise<Notification[]> {
    const offset = filter.offset ?? 0;
    return Promise.resolve(
      this.notifications
        .filter(n =>
          filter.targetEntityRefs
            ? (n.spec?.targetEntityRefs ?? []).some(t =>
                filter.targetEntityRefs!.includes(t),
              )
            : true,
        )
        .filter(n =>
          filter.originatingEntityRef
            ? n.spec?.originatingEntityRef === filter.originatingEntityRef
            : true,
        )
        .filter(n =>
          filter.since ? n.metadata.timestamp >= filter.since : true,
        )
        .slice(offset ?? 0, filter.limit ? offset + filter.limit : undefined),
    );
  }
}
