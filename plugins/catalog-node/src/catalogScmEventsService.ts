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

import {
  createServiceFactory,
  createServiceRef,
} from '@backstage/backend-plugin-api';

/**
 * @alpha
 *
 * Voluntary contextual information related to a {@link CatalogScmEvent}.
 */
export type CatalogScmEventContext = {
  /**
   * URL to a commit related to this event being generated, if relevant.
   */
  commitUrl?: string;
};

/**
 * @alpha
 *
 * Represents a high level change event that happened in a source control
 * management system. THese are usually produced as a distilled version of an
 * incoming webhook event or similar.
 */
export type CatalogScmEvent =
  | {
      type: 'location.created' | 'location.updated' | 'location.deleted';
      url: string;
      context?: CatalogScmEventContext;
    }
  | {
      type: 'location.moved';
      fromUrl: string;
      toUrl: string;
      context?: CatalogScmEventContext;
    }
  | {
      type: 'repository.created' | 'repository.updated' | 'repository.deleted';
      url: string;
      context?: CatalogScmEventContext;
    }
  | {
      type: 'repository.moved';
      fromUrl: string;
      toUrl: string;
      context?: CatalogScmEventContext;
    };

/**
 * @alpha
 *
 * A subscriber of the {@link CatalogScmEventsService}.
 */
export interface CatalogScmEventsServiceSubscriber {
  /**
   * Receives a number of events.
   */
  onEvents: (events: CatalogScmEvent[]) => Promise<void>;
}

/**
 * @alpha
 *
 * A publish/subscribe service for source control management system events. This
 * allows different producers of interesting events in a multi-SCM environment
 * communicate those events to multiple interested parties. As an example, one
 * entity provider might automatically register and unregister locations as an
 * effect of these events.
 */
export interface CatalogScmEventsService {
  /**
   * Subscribes to events, and returns a function to unsubscribe.
   */
  subscribe(subscriber: CatalogScmEventsServiceSubscriber): {
    unsubscribe: () => void;
  };

  /**
   * Publish an event to all subscribers. Returns once all subscribers have
   * acknowledged that they have received and handled the event.
   */
  publish(events: CatalogScmEvent[]): Promise<void>;
}

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

/**
 * @alpha
 *
 * A service that allows publishing and subscribing to source control management
 * system events.
 */
export const catalogScmEventsServiceRef =
  createServiceRef<CatalogScmEventsService>({
    id: 'catalog-scm-events',
    defaultFactory: async service =>
      createServiceFactory({
        service,
        deps: {},
        factory() {
          return new DefaultCatalogScmEventsService();
        },
      }),
  });
