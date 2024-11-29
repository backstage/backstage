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

import { LoggerService } from '@backstage/backend-plugin-api';
import {
  DefaultEventsService,
  EventBroker,
  EventParams,
  EventsService,
  EventSubscriber,
} from '@backstage/plugin-events-node';

/**
 * In process event broker which will pass the event to all registered subscribers
 * interested in it.
 * Events will not be persisted in any form.
 *
 * @public
 * @deprecated use `DefaultEventsService` from `@backstage/plugin-events-node` instead
 */
export class DefaultEventBroker implements EventBroker {
  private readonly events: EventsService;

  /**
   *
   * @param logger - logger
   * @param events - replacement that gets wrapped to support not yet migrated implementations.
   * An instance can be passed (required for a mixed mode), otherwise a new instance gets created internally.
   * @deprecated use `DefaultEventsService` directly instead
   */
  constructor(logger: LoggerService, events?: EventsService) {
    this.events =
      events ?? DefaultEventsService.create({ logger, useEventBus: 'never' });
  }

  async publish(params: EventParams): Promise<void> {
    return this.events.publish(params);
  }

  subscribe(
    ...subscribers: Array<EventSubscriber | Array<EventSubscriber>>
  ): void {
    subscribers.flat().forEach(async subscriber => {
      await this.events.subscribe({
        id: subscriber.constructor.name,
        topics: subscriber.supportsEventTopics(),
        onEvent: subscriber.onEvent.bind(subscriber),
      });
    });
  }
}
