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
  EventBroker,
  EventParams,
  EventSubscriber,
} from '@backstage/plugin-events-node';

/** @public */
export class TestEventBroker implements EventBroker {
  readonly published: EventParams[] = [];
  readonly subscribed: EventSubscriber[] = [];

  async publish(params: EventParams): Promise<void> {
    this.published.push(params);
  }

  subscribe(
    ...subscribers: Array<EventSubscriber | Array<EventSubscriber>>
  ): void {
    this.subscribed.push(...subscribers.flat());
  }
}
