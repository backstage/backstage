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
import { EventParams } from '@backstage/plugin-events-node';
import { EventBusStore } from './types';
import { NotFoundError } from '@backstage/errors';
import {
  BackstageCredentials,
  BackstageServicePrincipal,
} from '@backstage/backend-plugin-api';

const MAX_BATCH_SIZE = 10;
const MAX_EVENTS_DEFAULT = 1_000;

export class MemoryEventBusStore implements EventBusStore {
  #maxEvents: number;
  #events = new Array<
    EventParams & { seq: number; notifiedSubscribers: Set<string> }
  >();
  #subscribers = new Map<
    string,
    { id: string; seq: number; topics: Set<string> }
  >();
  #listeners = new Set<{
    topics: Set<string>;
    resolve(result: { topic: string }): void;
  }>();

  constructor(options: { maxEvents?: number } = {}) {
    this.#maxEvents = options.maxEvents ?? MAX_EVENTS_DEFAULT;
  }

  async publish(options: {
    event: EventParams;
    notifiedSubscribers: string[];
    credentials: BackstageCredentials<BackstageServicePrincipal>;
  }): Promise<{ eventId: string } | undefined> {
    const topic = options.event.topic;
    const notifiedSubscribers = new Set(options.notifiedSubscribers);

    let hasOtherSubscribers = false;
    for (const sub of this.#subscribers.values()) {
      if (sub.topics.has(topic) && !notifiedSubscribers.has(sub.id)) {
        hasOtherSubscribers = true;
        break;
      }
    }
    if (!hasOtherSubscribers) {
      return undefined;
    }

    const nextSeq = this.#getMaxSeq() + 1;
    this.#events.push({ ...options.event, notifiedSubscribers, seq: nextSeq });

    for (const listener of this.#listeners) {
      if (listener.topics.has(topic)) {
        listener.resolve({ topic });
        this.#listeners.delete(listener);
      }
    }

    // Trim old events
    if (this.#events.length > this.#maxEvents) {
      this.#events.shift();
    }

    return { eventId: String(nextSeq) };
  }

  #getMaxSeq() {
    return this.#events[this.#events.length - 1]?.seq ?? 0;
  }

  async upsertSubscription(id: string, topics: string[]): Promise<void> {
    const existing = this.#subscribers.get(id);
    if (existing) {
      existing.topics = new Set(topics);
      return;
    }
    const sub = {
      id: id,
      seq: this.#getMaxSeq(),
      topics: new Set(topics),
    };
    this.#subscribers.set(id, sub);
  }

  async readSubscription(id: string): Promise<{ events: EventParams[] }> {
    const sub = this.#subscribers.get(id);
    if (!sub) {
      throw new NotFoundError(`Subscription not found`);
    }
    const events = this.#events
      .filter(
        event =>
          event.seq > sub.seq &&
          sub.topics.has(event.topic) &&
          !event.notifiedSubscribers.has(id),
      )
      .slice(0, MAX_BATCH_SIZE);

    sub.seq = events[events.length - 1]?.seq ?? sub.seq;

    return {
      events: events.map(({ topic, eventPayload }) => ({
        topic,
        eventPayload,
      })),
    };
  }

  async setupListener(
    subscriptionId: string,
    options: {
      signal: AbortSignal;
    },
  ): Promise<{ waitForUpdate(): Promise<{ topic: string }> }> {
    return {
      waitForUpdate: async () => {
        options.signal.throwIfAborted();

        const sub = this.#subscribers.get(subscriptionId);
        if (!sub) {
          throw new NotFoundError(`Subscription not found`);
        }

        return new Promise<{ topic: string }>((resolve, reject) => {
          const listener = {
            topics: sub.topics,
            resolve(result: { topic: string }) {
              resolve(result);
              cleanup();
            },
          };
          this.#listeners.add(listener);

          const onAbort = () => {
            this.#listeners.delete(listener);
            reject(options.signal.reason);
            cleanup();
          };

          function cleanup() {
            options.signal.removeEventListener('abort', onAbort);
          }

          options.signal.addEventListener('abort', onAbort);
        });
      },
    };
  }
}
