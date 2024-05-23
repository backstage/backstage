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

import { HttpAuthService, LoggerService } from '@backstage/backend-plugin-api';
import { Handler } from 'express';
import Router from 'express-promise-router';
import { EventParams } from '@backstage/plugin-events-node';
import { spec, createOpenApiRouter } from '../../schema/openapi.generated';
import { internal } from '@backstage/backend-openapi-utils';

type EventHubStore = {
  publish(options: {
    params: EventParams;
    subscriberIds: string[];
  }): Promise<void>;

  upsertSubscription(id: string, topics: string[]): Promise<void>;

  readSubscription(id: string): Promise<{ events: EventParams[] }>;

  listen(
    subscriptionId: string,
    onNotify: (topicId: string) => void,
  ): Promise<() => void>;
};

const MAX_BATCH_SIZE = 5;

class MemoryEventHubStore implements EventHubStore {
  #events = new Array<
    EventParams & { seq: number; subscriberIds: Set<string> }
  >();
  #subscribers = new Map<
    string,
    { id: string; seq: number; topics: Set<string> }
  >();
  #listeners = new Set<{
    topics: Set<string>;
    notify(topicId: string): void;
  }>();

  async publish(options: {
    params: EventParams;
    subscriberIds: string[];
  }): Promise<void> {
    const topicId = options.params.topic;
    const subscriberIds = new Set(options.subscriberIds);

    let hasOtherSubscribers = false;
    for (const sub of this.#subscribers.values()) {
      if (sub.topics.has(topicId) && !subscriberIds.has(sub.id)) {
        hasOtherSubscribers = true;
        break;
      }
    }
    if (!hasOtherSubscribers) {
      return;
    }

    const nextSeq = this.#getMaxSeq() + 1;
    this.#events.push({ ...options.params, subscriberIds, seq: nextSeq });

    for (const listener of this.#listeners) {
      if (listener.topics.has(topicId)) {
        listener.notify(topicId);
      }
    }
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
      throw new Error(`Subscription not found`);
    }
    const events = this.#events
      .filter(
        event =>
          event.seq > sub.seq &&
          sub.topics.has(event.topic) &&
          !event.subscriberIds.has(id),
      )
      .slice(0, MAX_BATCH_SIZE);

    sub.seq = events[events.length - 1]?.seq ?? sub.seq;

    return { events: events.map(event => ({ ...event, seq: undefined })) };
  }

  async listen(
    subscriptionId: string,
    onNotify: (topicId: string) => void,
  ): Promise<() => void> {
    const sub = this.#subscribers.get(subscriptionId);
    if (!sub) {
      throw new Error(`Subscription not found`);
    }
    const listener = { topics: sub.topics, notify: onNotify };
    this.#listeners.add(listener);
    return () => {
      this.#listeners.delete(listener);
    };
  }
}

export class EventHub {
  static async create(options: {
    logger: LoggerService;
    httpAuth: HttpAuthService;
  }) {
    const { httpAuth } = options;
    const logger = options.logger.child({ type: 'EventHub' });
    const router = Router();

    const hub = new EventHub(router, logger, httpAuth);

    const apiRouter = await createOpenApiRouter();

    router.use(apiRouter);

    apiRouter.post('/hub/events', hub.#handlePostEvents);

    // Long-polling
    apiRouter.get(
      '/hub/subscriptions/:subscriptionId/events',
      hub.#handleGetSubscription,
    );
    apiRouter.put(
      '/hub/subscriptions/:subscriptionId',
      hub.#handlePutSubscription,
    );

    return hub;
  }

  readonly #handler: Handler;
  readonly #logger: LoggerService;
  readonly #httpAuth: HttpAuthService;
  readonly #store: EventHubStore;

  private constructor(
    handler: Handler,
    logger: LoggerService,
    httpAuth: HttpAuthService,
  ) {
    this.#handler = handler;
    this.#logger = logger;
    this.#httpAuth = httpAuth;
    this.#store = new MemoryEventHubStore();
  }

  handler(): Handler {
    return this.#handler;
  }

  #handlePostEvents: internal.DocRequestHandler<
    typeof spec,
    '/hub/events',
    'post'
  > = async (req, res) => {
    const credentials = await this.#httpAuth.credentials(req, {
      allow: ['service'],
    });
    await this.#store.publish({
      params: {
        topic: req.body.event.topic,
        eventPayload: req.body.event.payload,
      },
      subscriberIds: req.body.subscriptionIds ?? [],
    });
    this.#logger.info(`Published event to '${req.body.event.topic}'`, {
      subject: credentials.principal.subject,
    });
    res.status(201).end();
  };

  #handleGetSubscription: internal.DocRequestHandler<
    typeof spec,
    '/hub/subscriptions/{subscriptionId}/events',
    'get'
  > = async (req, res) => {
    const credentials = await this.#httpAuth.credentials(req, {
      allow: ['service'],
    });
    const id = req.params.subscriptionId;

    const { events } = await this.#store.readSubscription(id);

    this.#logger.info(
      `Reading subscription '${id}' resulted in ${events.length} events`,
      { subject: credentials.principal.subject },
    );

    if (events.length > 0) {
      res.json({ events });
      return;
    }

    this.#store.listen(id, () => {
      res.status(204).end();
    });
  };

  #handlePutSubscription: internal.DocRequestHandler<
    typeof spec,
    '/hub/subscriptions/{subscriptionId}',
    'put'
  > = async (req, res) => {
    const credentials = await this.#httpAuth.credentials(req, {
      allow: ['service'],
    });
    const id = req.params.subscriptionId;

    await this.#store.upsertSubscription(id, req.body.topics);

    this.#logger.info(
      `New subscription '${id}' topics='${req.body.topics.join("', '")}'`,
      { subject: credentials.principal.subject },
    );

    res.status(201).end();
  };
}
