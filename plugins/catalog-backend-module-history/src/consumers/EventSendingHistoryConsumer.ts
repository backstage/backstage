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

import { EventsService } from '@backstage/plugin-events-node';
import { HistoryConsumer, HistoryConsumerConnection } from './types';

export class EventSendingHistoryConsumer implements HistoryConsumer {
  static readonly EVENT_TOPIC = 'catalog.history';

  #events: EventsService;

  constructor(events: EventsService) {
    this.#events = events;
  }

  getConsumerName(): string {
    return 'EventSendingHistoryConsumer';
  }

  async connect(connection: HistoryConsumerConnection) {
    const subscription = connection.subscribe({
      subscriptionId: 'event-sender',
      startAt: 'beginning',
      maxPageSize: 10,
    });

    for await (const events of subscription) {
      for (const event of events) {
        await this.#events.publish({
          topic: EventSendingHistoryConsumer.EVENT_TOPIC,
          eventPayload: {
            id: event.id,
            eventAt: event.eventAt.toISOString(),
            eventType: event.eventType,
            entityRef: event.entityRef,
            entityJson: event.entityJson,
          },
        });
      }
    }
  }
}
