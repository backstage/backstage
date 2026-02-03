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

import { createExtensionPoint } from '@backstage/backend-plugin-api';
import {
  EventBroker,
  EventPublisher,
  EventSubscriber,
  HttpBodyParserOptions,
  HttpPostIngressOptions,
} from '@backstage/plugin-events-node';

/**
 * @alpha
 */
export interface EventsExtensionPoint {
  /**
   * @deprecated use `eventsServiceRef` and `eventsServiceFactory` instead
   */
  setEventBroker(eventBroker: EventBroker): void;

  /**
   * @deprecated use `EventsService.publish` instead
   */
  addPublishers(
    ...publishers: Array<EventPublisher | Array<EventPublisher>>
  ): void;

  /**
   * @deprecated use `EventsService.subscribe` instead
   */
  addSubscribers(
    ...subscribers: Array<EventSubscriber | Array<EventSubscriber>>
  ): void;

  addHttpPostIngress(options: HttpPostIngressOptions): void;

  addHttpPostBodyParser(options: HttpBodyParserOptions): void;
}

/**
 * @alpha
 */
export const eventsExtensionPoint = createExtensionPoint<EventsExtensionPoint>({
  id: 'events',
});
