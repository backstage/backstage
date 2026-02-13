/*
 * Copyright 2026 The Backstage Authors
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
  CatalogScmEvent,
  CatalogScmEventsService,
  CatalogScmEventsServiceSubscriber,
} from './types';

/**
 * The default implementation of the {@link CatalogScmEventsService}/{@link catalogScmEventsServiceRef}.
 *
 * @internal
 * @remarks
 *
 * This implementation is in-memory, which requires the producers and consumer
 * (the catalog backend) to be deployed together.
 */
export class DefaultCatalogScmEventsService implements CatalogScmEventsService {
  readonly #subscribers: Set<CatalogScmEventsServiceSubscriber>;

  constructor() {
    this.#subscribers = new Set();
  }

  subscribe(subscriber: CatalogScmEventsServiceSubscriber): {
    unsubscribe: () => void;
  } {
    this.#subscribers.add(subscriber);
    return {
      unsubscribe: () => {
        this.#subscribers.delete(subscriber);
      },
    };
  }

  async publish(events: CatalogScmEvent[]): Promise<void> {
    await Promise.all(
      Array.from(this.#subscribers).map(async subscriber => {
        try {
          await subscriber.onEvents(events);
        } catch (error) {
          // The subscribers are expected to handle errors themselves.
        }
      }),
    );
  }
}
