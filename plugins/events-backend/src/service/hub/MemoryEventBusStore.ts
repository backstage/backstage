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

const MAX_BATCH_SIZE = 10;

export class MemoryEventBusStore implements EventBusStore {
  #events = new Array<EventParams & { seq: number; consumedBy: Set<string> }>();
  #subscribers = new Map<
    string,
    { id: string; seq: number; topics: Set<string> }
  >();
  #listeners = new Set<{
    topics: Set<string>;
    resolve(result: { topic: string }): void;
  }>();

  async publish(options: {
    params: EventParams;
    consumedBy: string[];
  }): Promise<{ id: string } | undefined> {
    const topic = options.params.topic;
    const consumedBy = new Set(options.consumedBy);

    let hasOtherSubscribers = false;
    for (const sub of this.#subscribers.values()) {
      if (sub.topics.has(topic) && !consumedBy.has(sub.id)) {
        hasOtherSubscribers = true;
        break;
      }
    }
    if (!hasOtherSubscribers) {
      return undefined;
    }

    const nextSeq = this.#getMaxSeq() + 1;
    this.#events.push({ ...options.params, consumedBy, seq: nextSeq });

    for (const listener of this.#listeners) {
      if (listener.topics.has(topic)) {
        listener.resolve({ topic });
        this.#listeners.delete(listener);
      }
    }
    return { id: String(nextSeq) };
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
          !event.consumedBy.has(id),
      )
      .slice(0, MAX_BATCH_SIZE);

    sub.seq = events[events.length - 1]?.seq ?? sub.seq;

    return { events: events.map(event => ({ ...event, seq: undefined })) };
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
          const listener = { topics: sub.topics, resolve };
          this.#listeners.add(listener);

          options.signal.addEventListener('abort', () => {
            this.#listeners.delete(listener);
            reject(options.signal.reason);
          });
        });
      },
    };
  }
}
