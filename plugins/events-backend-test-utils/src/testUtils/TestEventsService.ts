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

import {
  EventParams,
  EventsService,
  EventsServiceSubscribeOptions,
} from '@backstage/plugin-events-node';

/** @public */
export class TestEventsService implements EventsService {
  #published: EventParams[] = [];
  #subscribed: EventsServiceSubscribeOptions[] = [];

  async publish(params: EventParams): Promise<void> {
    this.#published.push(params);
  }

  async subscribe(options: EventsServiceSubscribeOptions): Promise<void> {
    this.#subscribed.push(options);
  }

  get published(): EventParams[] {
    return this.#published;
  }

  get subscribed(): EventsServiceSubscribeOptions[] {
    return this.#subscribed;
  }

  reset(): void {
    this.#published = [];
    this.#subscribed = [];
  }
}
