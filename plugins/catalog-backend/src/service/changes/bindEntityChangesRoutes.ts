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

import { HttpAuthService } from '@backstage/backend-plugin-api';
import { InputError } from '@backstage/errors';
import express from 'express';
import {
  parseEntityChangeScope,
  stringifyEntityChangeScope,
} from '../../database/operations/changes/scope';
import { EntityChangeSubscription } from '../../database/operations/changes/subscriptions';
import { createOpenApiRouter } from '../../schema/openapi';
import { decodeEntityChangesCursor, encodeEntityChangesCursor } from './cursor';
import { EntityChangesService } from './EntityChangesService';

const DEFAULT_LIMIT = 100;

/**
 * Binds the experimental entity change endpoints.
 */
export function bindEntityChangesRoutes(
  router: Awaited<ReturnType<typeof createOpenApiRouter>>,
  options: {
    entityChanges: EntityChangesService;
    httpAuth: HttpAuthService;
  },
) {
  const { entityChanges, httpAuth } = options;

  router
    .get('/entities/changes', async (req, res) => {
      const cursor = req.query.cursor
        ? decodeEntityChangesCursor(req.query.cursor)
        : undefined;
      if (!cursor && req.query.afterGeneration === undefined) {
        throw new InputError('Either cursor or afterGeneration is required');
      }

      const scope = parseEntityChangeScope(cursor?.scope ?? req.query.scope);
      const limit = cursor?.limit ?? req.query.limit ?? DEFAULT_LIMIT;
      const block = cursor?.block ?? req.query.block ?? false;

      const result = await entityChanges.readChanges({
        afterGeneration: cursor?.afterGeneration ?? req.query.afterGeneration!,
        scope,
        limit,
        block,
        credentials: await httpAuth.credentials(req),
        signal: abortOnDisconnect(res),
      });

      const pageInfo = {
        cursor: encodeEntityChangesCursor({
          afterGeneration: result.nextGeneration,
          scope: stringifyEntityChangeScope(scope),
          limit,
          block,
        }),
        ...(result.filtered && { filtered: true }),
      };

      res.setHeader('Cache-Control', 'no-store');
      if (result.type === 'data') {
        res.json({
          items: result.entityRefs.map(entityRef => ({ entityRef })),
          pageInfo,
        });
      } else {
        await respondAfterWait(res, result.wait, { pageInfo });
      }
    })
    .post('/entities/changes/subscriptions', async (req, res) => {
      const body = req.body ?? {};
      const subscription = await entityChanges.upsertSubscription({
        subscriptionId: body.subscriptionId,
        afterGeneration: body.afterGeneration,
        scope: parseEntityChangeScope(body.scope),
        credentials: await httpAuth.credentials(req),
      });
      res.json({ subscription: toResponseSubscription(subscription) });
    })
    .get(
      '/entities/changes/subscriptions/:subscriptionId/read',
      async (req, res) => {
        const result = await entityChanges.readSubscription({
          subscriptionId: req.params.subscriptionId,
          limit: req.query.limit ?? DEFAULT_LIMIT,
          block: req.query.block ?? false,
          credentials: await httpAuth.credentials(req),
          signal: abortOnDisconnect(res),
        });

        res.setHeader('Cache-Control', 'no-store');
        if (result.type === 'data') {
          res.json({
            items: result.entityRefs.map(entityRef => ({ entityRef })),
            ...(result.ackId && { ackId: result.ackId }),
            ...(result.filtered && { filtered: true }),
          });
        } else {
          await respondAfterWait(res, result.wait);
        }
      },
    )
    .post(
      '/entities/changes/subscriptions/:subscriptionId/ack/:ackId',
      async (req, res) => {
        await entityChanges.ackSubscription({
          subscriptionId: req.params.subscriptionId,
          ackId: req.params.ackId,
          credentials: await httpAuth.credentials(req),
        });
        res.status(200).end();
      },
    )
    .post(
      '/entities/changes/subscriptions/:subscriptionId/nack/:ackId',
      async (req, res) => {
        await entityChanges.nackSubscription({
          subscriptionId: req.params.subscriptionId,
          ackId: req.params.ackId,
          credentials: await httpAuth.credentials(req),
        });
        res.status(200).end();
      },
    );
}

/**
 * Aborts when the client goes away before the response is finished.
 */
function abortOnDisconnect(res: express.Response): AbortSignal {
  const controller = new AbortController();
  res.on('close', () => {
    if (!res.writableFinished) {
      controller.abort();
    }
  });
  return controller.signal;
}

/**
 * Sends a 202 right away and ends the body once there may be new data, or the
 * wait times out. The client then reads again.
 */
async function respondAfterWait(
  res: express.Response,
  wait: () => Promise<unknown>,
  body?: object,
) {
  res.status(202);
  if (body) {
    res.setHeader('Content-Type', 'application/json');
  }
  res.flushHeaders();
  await wait();
  res.end(body ? JSON.stringify(body) : undefined);
}

function toResponseSubscription(subscription: EntityChangeSubscription) {
  return {
    subscriptionId: subscription.subscriptionId,
    createdAt: subscription.createdAt.toISOString(),
    lastActiveAt: subscription.activeAt.toISOString(),
    afterGeneration: subscription.lastAcknowledgedGeneration,
    ...(subscription.scope && {
      scope: stringifyEntityChangeScope(subscription.scope),
    }),
  };
}
