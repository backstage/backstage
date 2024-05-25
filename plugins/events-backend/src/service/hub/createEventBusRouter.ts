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
  SchedulerService,
} from '@backstage/backend-plugin-api';
import { Handler } from 'express';
import Router from 'express-promise-router';
import { createOpenApiRouter } from '../../schema/openapi.generated';
import { MemoryEventBusStore } from './MemoryEventBusStore';
import { DatabaseEventBusStore } from './DatabaseEventBusStore';
import { EventBusStore } from './types';
import { EventParams } from '@backstage/plugin-events-node';

const DEFAULT_NOTIFY_TIMEOUT_MS = 55_000; // Just below 60s, which is a common HTTP timeout

export async function createEventBusRouter(options: {
  logger: LoggerService;
  database: DatabaseService;
  scheduler: SchedulerService;
  httpAuth: HttpAuthService;
  notifyTimeoutMs?: number; // for testing
}): Promise<Handler> {
  const {
    database,
    httpAuth,
    scheduler,
    notifyTimeoutMs = DEFAULT_NOTIFY_TIMEOUT_MS,
  } = options;
  const logger = options.logger.child({ type: 'EventBus' });
  const router = Router();

  let store: EventBusStore;
  const db = await database.getClient();
  if (db.client.config.client === 'pg') {
    logger.info('Database is PostgreSQL, using database store');
    store = await DatabaseEventBusStore.create({
      database,
      logger,
      scheduler,
    });
  } else {
    logger.info('Database is not PostgreSQL, using memory store');
    store = new MemoryEventBusStore();
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

      const controller = new AbortController();
      req.on('end', () => controller.abort());

      // By setting up the listener first we make sure we don't miss any events
      // that are published while reading. If an event is published we'll receive
      // a notification, which depending on the outcome of the read we may ignore
      const listener = await store.setupListener(id, {
        signal: controller.signal,
      });

      // By timing out requests we make sure they don't stall or that events get stuck.
      // For the caller there's no difference between a timeout and a
      // notifications, either way they should try reading again.
      const timeout = setTimeout(() => {
        controller.abort();
      }, notifyTimeoutMs);

      try {
        const { events } = await store.readSubscription(id);

        logger.info(
          `Reading subscription '${id}' resulted in ${events.length} events`,
          { subject: credentials.principal.subject },
        );

        if (events.length > 0) {
          res.json({ events });
        } else {
          res.status(202);
          res.flushHeaders();

          try {
            const { topic } = await listener.waitForUpdate();
            logger.info(
              `Received notification for subscription '${id}' for topic '${topic}'`,
              { subject: credentials.principal.subject },
            );
          } finally {
            // A small extra delay ensures a more even spread of events across
            // consumers in case some consumers are faster than others
            await new Promise(resolve =>
              setTimeout(resolve, 1 + Math.random() * 9),
            );
            res.end();
          }
        }
      } finally {
        controller.abort();
        clearTimeout(timeout);
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
