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
import { Logger } from 'winston';

/**
 * In-memory event broker which will pass the event to all registered subscribers
 * interested in it.
 * Events will not be persisted in any form.
 */
// TODO(pjungermann): add prom metrics? (see plugins/catalog-backend/src/util/metrics.ts, etc.)
export class InMemoryEventBroker implements EventBroker {
  constructor(private readonly logger: Logger) {}

  private readonly subscribers: {
    [topic: string]: EventSubscriber[];
  } = {};

  async publish(params: EventParams): Promise<void> {
    this.logger.debug(
      `Event received: topic=${params.topic}, metadata=${JSON.stringify(
        params.metadata,
      )}, payload=${JSON.stringify(params.eventPayload)}`,
    );

    const subscribed = this.subscribers[params.topic] ?? [];
    await Promise.all(
      subscribed.map(async subscriber => {
        try {
          await subscriber.onEvent(params);
        } catch (error) {
          this.logger.error(
            `Subscriber "${subscriber.constructor.name}" failed to process event`,
            error,
          );
        }
      }),
    );
  }

  subscribe(
    ...subscribers: Array<EventSubscriber | Array<EventSubscriber>>
  ): void {
    subscribers.flat().forEach(subscriber => {
      subscriber.supportsEventTopics().forEach(topic => {
        this.subscribers[topic] = this.subscribers[topic] ?? [];
        this.subscribers[topic].push(subscriber);
      });
    });
  }
}
