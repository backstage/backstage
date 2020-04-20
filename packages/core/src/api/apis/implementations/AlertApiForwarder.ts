/*
 * Copyright 2020 Spotify AB
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
import { AlertApi, AlertMessage } from '../../../';

type SubscriberFunc = (message: AlertMessage) => void;
type Unsubscribe = () => void;

export class AlertApiForwarder implements AlertApi {
  private readonly subscribers = new Set<SubscriberFunc>();

  post(alert: AlertMessage) {
    this.subscribers.forEach(subscriber => subscriber(alert));
  }

  subscribe(func: SubscriberFunc): Unsubscribe {
    this.subscribers.add(func);

    return () => {
      this.subscribers.delete(func);
    };
  }
}
