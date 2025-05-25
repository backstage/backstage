/*
 * Copyright 2025 The Backstage Authors
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
import { Knex } from 'knex';
import { HistoryConfig } from '../config';
import { ackHistorySubscription } from '../database/operations/ackHistorySubscription';
import { readHistorySubscription } from '../database/operations/readHistorySubscription';
import { upsertHistorySubscription } from '../database/operations/upsertHistorySubscription';
import { sleep } from '../helpers';
import { CATALOG_HISTORY_EVENT_TOPIC, CatalogHistoryEvent } from './types';
import { LifecycleService } from '@backstage/backend-plugin-api';

const SUBSCRIPTION_ID = 'backstage-catalog-history-events-emitter';

export class HistoryEventEmitter {
  #knexPromise: Promise<Knex>;
  #lifecycle: LifecycleService;
  #events: EventsService;
  #historyConfig: HistoryConfig;

  public static async create(options: {
    knexPromise: Promise<Knex>;
    lifecycle: LifecycleService;
    events: EventsService;
    historyConfig: HistoryConfig;
  }): Promise<HistoryEventEmitter> {
    const emitter = new HistoryEventEmitter(
      options.knexPromise,
      options.lifecycle,
      options.events,
      options.historyConfig,
    );

    emitter.start();

    return emitter;
  }

  constructor(
    knexPromise: Promise<Knex>,
    lifecycle: LifecycleService,
    events: EventsService,
    historyConfig: HistoryConfig,
  ) {
    this.#knexPromise = knexPromise;
    this.#lifecycle = lifecycle;
    this.#events = events;
    this.#historyConfig = historyConfig;
  }

  async start() {
    const knex = await this.#knexPromise;

    const controller = new AbortController();
    const signal = controller.signal;
    this.#lifecycle.addShutdownHook(() => {
      controller.abort();
    });

    const subscription = await upsertHistorySubscription(knex, {
      subscriptionId: SUBSCRIPTION_ID,
      _from: 'beginning',
    });

    while (!signal.aborted) {
      const data = await readHistorySubscription(knex, {
        subscriptionId: subscription.subscriptionId,
        operation: 'read',
        limit: 100,
        historyConfig: this.#historyConfig,
      });

      if (data) {
        for (const event of data.events) {
          const eventPayload: CatalogHistoryEvent = {
            eventId: event.eventId,
            eventAt: event.eventAt.toISOString(),
            eventType: event.eventType,
            entityId: event.entityId,
            entityRef: event.entityRef,
            entityJson: event.entityJson
              ? JSON.parse(event.entityJson)
              : undefined,
            locationId: event.locationId,
            locationRef: event.locationRef,
          };
          await this.#events.publish({
            topic: CATALOG_HISTORY_EVENT_TOPIC,
            eventPayload,
            metadata: {
              eventType: event.eventType,
            },
          });
        }
        await ackHistorySubscription(knex, {
          subscriptionId: subscription.subscriptionId,
          ackId: data.ackId,
        });
      } else {
        await sleep(this.#historyConfig.blockPollFrequency, signal);
      }
    }
  }
}
