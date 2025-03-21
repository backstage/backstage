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

import { EventBroker } from './EventBroker';

/**
 * Publishes events to be consumed by subscribers for their topic.
 * The events can come from different (external) sources
 * like emitted themselves, received via HTTP endpoint (i.e. webhook)
 * or from event brokers, queues, etc.
 *
 * @public
 * @deprecated use the `EventsService` via the constructor, setter, or other means instead
 */
export interface EventPublisher {
  /**
   * @deprecated use the `EventsService` via the constructor, setter, or other means instead
   */
  setEventBroker(eventBroker: EventBroker): Promise<void>;
}
