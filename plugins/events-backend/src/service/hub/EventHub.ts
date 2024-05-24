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

import {
  DatabaseService,
  HttpAuthService,
  LoggerService,
} from '@backstage/backend-plugin-api';
import { Handler } from 'express';
import Router from 'express-promise-router';
import { spec, createOpenApiRouter } from '../../schema/openapi.generated';
import { internal } from '@backstage/backend-openapi-utils';
import { MemoryEventHubStore } from './MemoryEventHubStore';
import { DatabaseEventHubStore } from './DatabaseEventHubStore';
import { EventHubStore } from './types';
import { EventParams } from '@backstage/plugin-events-node';

export class EventHub {
  static async create(options: {
    logger: LoggerService;
    database: DatabaseService;
    httpAuth: HttpAuthService;
  }) {
    const { database, httpAuth } = options;
    const logger = options.logger.child({ type: 'EventHub' });
    const router = Router();

    let store: EventHubStore;
    const db = await database.getClient();
    if (db.client.config.client === 'pg') {
      logger.info('Database is PostgreSQL, using database store');
      store = await DatabaseEventHubStore.create({
        database,
        logger,
      });
    } else {
      logger.info('Database is not PostgreSQL, using memory store');
      store = new MemoryEventHubStore();
    }

    const hub = new EventHub(router, logger, httpAuth, store);

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
    store: EventHubStore,
  ) {
    this.#handler = handler;
    this.#logger = logger;
    this.#httpAuth = httpAuth;
    this.#store = store;
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
    const result = await this.#store.publish({
      params: {
        topic: req.body.event.topic,
        eventPayload: req.body.event.payload,
      } as EventParams,
      subscriberIds: req.body.subscriptionIds ?? [],
    });
    if (result) {
      this.#logger.info(
        `Published event to '${req.body.event.topic}' with ID '${result.id}'`,
        {
          subject: credentials.principal.subject,
        },
      );
    }
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

    let resolveShouldNotify: (shouldNotify: boolean) => void;
    const shouldNotifyPromise = new Promise<boolean>(resolve => {
      resolveShouldNotify = resolve;
    });

    const { cancel } = await this.#store.listen(id, {
      onNotify() {
        shouldNotifyPromise.then(shouldNotify => {
          if (shouldNotify) {
            res.status(204).end();
          }
        });
      },
      onError() {
        shouldNotifyPromise.then(shouldNotify => {
          if (shouldNotify) {
            res.status(500).end();
          }
        });
      },
    });
    req.on('end', cancel);

    try {
      const { events } = await this.#store.readSubscription(id);

      this.#logger.info(
        `Reading subscription '${id}' resulted in ${events.length} events`,
        { subject: credentials.principal.subject },
      );

      if (events.length > 0) {
        res.json({ events });
        resolveShouldNotify!(false);
      } else {
        resolveShouldNotify!(true);
      }
    } finally {
      resolveShouldNotify!(false);
    }
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
