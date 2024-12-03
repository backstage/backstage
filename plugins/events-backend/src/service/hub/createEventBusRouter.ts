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
  LifecycleService,
  LoggerService,
  SchedulerService,
} from '@backstage/backend-plugin-api';
import { Handler } from 'express';
import { createOpenApiRouter } from '../../schema/openapi';
import { MemoryEventBusStore } from './MemoryEventBusStore';
import { DatabaseEventBusStore } from './DatabaseEventBusStore';
import { EventBusStore } from './types';
import {
  EVENTS_NOTIFY_TIMEOUT_HEADER,
  EventParams,
} from '@backstage/plugin-events-node';

const DEFAULT_NOTIFY_TIMEOUT_MS = 55_000; // Just below 60s, which is a common HTTP timeout

/*

# Event Bus

This comment describes the event bus that is implemented here in the events
backend, and by default used by the events service.

## Overview

The events bus implements a subscription mechanism where subscribers must exist
upfront for events to be stored. It uses a single inbox for all events, with
each subscriber having its own pointer for how far into the inbox it has read.

In order to avoid busy polling, the API uses a long-polling mechanism where a
request is left hanging until the client should try to read again.

The event bus is not implemented with any guarantees of events being consumed,
but it does aim to make it unlikely that events are dropped

## API

### POST /bus/v1/events

This endpoint is used to publish new events to the event bus on a specific
topic. It can optionally include a set of subscription IDs for subscribers that
have already been notified of the event. This is to enable an optimization where
we notify subscribers locally if possible, and avoid the need for events to be
relayed through the events bus at all of possible.

For an event to be published and stored there must already exist a subscriber
that is subscribed to the event's topic, and that hasn't already been notified
of the event. If no such subscriber is found, the event will be discarded.

### PUT /bus/v1/subscriptions/:subscriptionId

This endpoint is used to create or update a subscriptions. Subscriptions are
shared across the entire bus and divided by subscription ID. Multiple clients
can be reading events from the same subscription at the same time, but only one
of those clients will receive each event. This enables division of work by using
the same subscriber ID across multiple instances, as well as broadcasting by
ensuring separate subscribers IDs.

### GET /bus/v1/subscriptions/:subscriptionId/events

This endpoint is used to read events from a subscription. It will return a batch
of events for the subscribed topics that have not yet been read by the
subscription. If no such events are available, the endpoint will return a 202
response and then hang end response until an event is available or a timeout is
reached. This allows clients to call this endpoint in a loop but will keep
traffic overhead fairly low.

## Delivery guarantees

When reading events from the event bus, clients should always implement a
graceful shutdown where they process any events that are received from the
events endpoint before shutting down. This is also the reason that the events
endpoint does not return any events when responding with a 202 blocking the
response, because there would otherwise be a race condition where the events
might be lost in transit if the client shuts down. By always sending an empty
response and requiring the client to send another request, we ensure that the
client is prepared to halt shutdown until the request had been fully processed.

## Local processing optimization

When possible, events will be processed locally before sent to the event bus.
The client will also inform the bus of which subscriptions have already been
notified of the event, so that the bus can completely avoid storing an event if
it has already been fully consumed by all subscribers.

## Automated cleanup & event window

Events are deleted once they are outside the guaranteed storage window. By
default the window 10 minutes for all events, and 24 hours for the last 10000
events. This ensures that the event log doesn't grow indefinitely, while still
allowing subscribers with restarts or outages to catch up to past events,
ensuring that events are likely not lost.

Subscriptions are also cleaned up if their read pointer falls outside of the
current event window. This ensures that stale subscribers don't accumulate and
cause unnecessary storage of events.

*/

async function createEventBusStore(deps: {
  logger: LoggerService;
  database: DatabaseService;
  scheduler: SchedulerService;
  lifecycle: LifecycleService;
  httpAuth: HttpAuthService;
}): Promise<EventBusStore> {
  const db = await deps.database.getClient();
  if (db.client.config.client === 'pg') {
    deps.logger.info('Database is PostgreSQL, using database store');
    return await DatabaseEventBusStore.create(deps);
  }

  deps.logger.info('Database is not PostgreSQL, using memory store');
  return new MemoryEventBusStore();
}

/**
 * Creates a new event bus router
 * @internal
 */
export async function createEventBusRouter(options: {
  logger: LoggerService;
  database: DatabaseService;
  scheduler: SchedulerService;
  lifecycle: LifecycleService;
  httpAuth: HttpAuthService;
  notifyTimeoutMs?: number; // for testing
}): Promise<Handler> {
  const { httpAuth, notifyTimeoutMs = DEFAULT_NOTIFY_TIMEOUT_MS } = options;
  const logger = options.logger.child({ type: 'EventBus' });

  const store = await createEventBusStore(options);

  const apiRouter = await createOpenApiRouter();

  apiRouter.post('/bus/v1/events', async (req, res) => {
    const credentials = await httpAuth.credentials(req, {
      allow: ['service'],
    });
    const topic = req.body.event.topic;
    const notifiedSubscribers = req.body.notifiedSubscribers;
    const result = await store.publish({
      event: {
        topic,
        eventPayload: req.body.event.payload,
      } as EventParams,
      notifiedSubscribers,
      credentials,
    });
    if (result) {
      logger.debug(
        `Published event to '${topic}' with ID '${result.eventId}'`,
        {
          subject: credentials.principal.subject,
        },
      );
      res.status(201).end();
    } else {
      if (notifiedSubscribers) {
        const notified = `'${notifiedSubscribers.join("', '")}'`;
        logger.debug(
          `Skipped publishing of event to '${topic}', subscribers have already been notified: ${notified}`,
          { subject: credentials.principal.subject },
        );
      } else {
        logger.debug(
          `Skipped publishing of event to '${topic}', no subscribers present`,
          { subject: credentials.principal.subject },
        );
      }
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
      // a notification, which we may ignore depending on the outcome of the read
      const listener = await store.setupListener(id, {
        signal: controller.signal,
      });

      // By timing out requests we make sure they don't stall or that events get stuck.
      // For the caller there's no difference between a timeout and a
      // notification, either way they should try reading again.
      const timeout = setTimeout(() => {
        controller.abort();
      }, notifyTimeoutMs);

      try {
        const { events } = await store.readSubscription(id);

        logger.debug(
          `Reading subscription '${id}' resulted in ${events.length} events`,
          { subject: credentials.principal.subject },
        );

        if (events.length > 0) {
          res.json({
            events: events.map(event => ({
              topic: event.topic,
              payload: event.eventPayload,
            })),
          });
        } else {
          res.setHeader(
            EVENTS_NOTIFY_TIMEOUT_HEADER,
            notifyTimeoutMs.toString(),
          );
          res.status(202);
          res.flushHeaders();

          try {
            const { topic } = await listener.waitForUpdate();
            logger.debug(
              `Received notification for subscription '${id}' for topic '${topic}'`,
              { subject: credentials.principal.subject },
            );
          } catch (error) {
            if (error !== controller.signal.reason) {
              logger.error(`Error listening for subscription '${id}'`, error);
            }
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

    await store.upsertSubscription(id, req.body.topics, credentials);

    logger.debug(
      `New subscription '${id}' for topics '${req.body.topics.join("', '")}'`,
      { subject: credentials.principal.subject },
    );

    res.status(201).end();
  });

  return apiRouter;
}
