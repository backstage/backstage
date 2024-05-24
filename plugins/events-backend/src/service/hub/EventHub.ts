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
import { createOpenApiRouter } from '../../schema/openapi.generated';
import { MemoryEventHubStore } from './MemoryEventHubStore';
import { DatabaseEventHubStore } from './DatabaseEventHubStore';
import { EventHubStore } from './types';
import { EventParams } from '@backstage/plugin-events-node';

export async function createEventBusRouter(options: {
  logger: LoggerService;
  database: DatabaseService;
  httpAuth: HttpAuthService;
}): Promise<Handler> {
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

  const apiRouter = await createOpenApiRouter();

  router.use(apiRouter);

  apiRouter.post('/bus/v1/events', async (req, res) => {
    const credentials = await httpAuth.credentials(req, {
      allow: ['service'],
    });
    const topic = req.body.event.topic;
    const subscriberIds = req.body.subscriptionIds ?? [];
    const result = await store.publish({
      params: {
        topic,
        eventPayload: req.body.event.payload,
      } as EventParams,
      subscriberIds,
    });
    if (result) {
      logger.info(`Published event to '${topic}' with ID '${result.id}'`, {
        subject: credentials.principal.subject,
      });
      res.status(201).end();
    } else {
      logger.info(
        `Skipped publishing of event to '${topic}', subscribers have already been notified: '${subscriberIds.join(
          "', '",
        )}'`,
        {
          subject: credentials.principal.subject,
        },
      );
      res.status(204).end();
    }
  });

  apiRouter.get(
    '/bus/v1/subscriptions/:subscriptionId/events',
    async (req, res) => {
      const credentials = await httpAuth.credentials(req, {
        allow: ['service'],
      });
      const id = req.params.subscriptionId;

      let resolveShouldNotify: (shouldNotify: boolean) => void;
      const shouldNotifyPromise = new Promise<boolean>(resolve => {
        resolveShouldNotify = resolve;
      });

      const { cancel } = await store.listen(id, {
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
        const { events } = await store.readSubscription(id);

        logger.info(
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
    },
  );

  apiRouter.put('/bus/v1/subscriptions/:subscriptionId', async (req, res) => {
    const credentials = await httpAuth.credentials(req, {
      allow: ['service'],
    });
    const id = req.params.subscriptionId;

    await store.upsertSubscription(id, req.body.topics);

    logger.info(
      `New subscription '${id}' topics='${req.body.topics.join("', '")}'`,
      { subject: credentials.principal.subject },
    );

    res.status(201).end();
  });

  return apiRouter;
}
