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

import { AlertApi, AlertMessage } from '@backstage/core-plugin-api';
import { Observable } from '@backstage/types';
import { PublishSubject } from '../../../lib/subjects';
import ObservableImpl from 'zen-observable';

/**
 * Base implementation for the AlertApi that simply forwards alerts to consumers.
 *
 * Recent alerts are buffered and replayed to new subscribers to prevent
 * missing alerts that were posted before subscription.
 *
 * @public
 */
export class AlertApiForwarder implements AlertApi {
  private readonly subject = new PublishSubject<AlertMessage>();
  private readonly recentAlerts: AlertMessage[] = [];
  private readonly maxBufferSize = 10;

  post(alert: AlertMessage) {
    this.recentAlerts.push(alert);
    if (this.recentAlerts.length > this.maxBufferSize) {
      this.recentAlerts.shift();
    }
    this.subject.next(alert);
  }

  alert$(): Observable<AlertMessage> {
    return new ObservableImpl<AlertMessage>(subscriber => {
      for (const alert of this.recentAlerts) {
        subscriber.next(alert);
      }
      return this.subject.subscribe(subscriber);
    });
  }
}
