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
  EventPublisher,
  EventSubscriber,
} from '@backstage/plugin-events-node';
import { Logger } from 'winston';
import { InMemoryEventBroker } from './InMemoryEventBroker';

/**
 * A builder that helps wire up all component parts of the event management.
 *
 * @public
 */
export class EventsBackend {
  private eventBroker: EventBroker;
  private publishers: EventPublisher[] = [];
  private subscribers: EventSubscriber[] = [];

  constructor(logger: Logger) {
    this.eventBroker = new InMemoryEventBroker(logger);
  }

  setEventBroker(eventBroker: EventBroker): EventsBackend {
    this.eventBroker = eventBroker;
    return this;
  }

  addPublishers(
    ...publishers: Array<EventPublisher | Array<EventPublisher>>
  ): EventsBackend {
    this.publishers.push(...publishers.flat());
    return this;
  }

  addSubscribers(
    ...subscribers: Array<EventSubscriber | Array<EventSubscriber>>
  ): EventsBackend {
    this.subscribers.push(...subscribers.flat());
    return this;
  }

  /**
   * Wires up and returns all component parts of the event management.
   */
  async start(): Promise<void> {
    this.eventBroker.subscribe(this.subscribers);
    this.publishers.forEach(publisher =>
      publisher.setEventBroker(this.eventBroker),
    );
  }
}
