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

import { InputError } from '@backstage/errors';
import { Request } from 'express';
import { Knex } from 'knex';
import { z } from 'zod';
import {
  readEventsTableRows,
  ReadEventsTableRowsOptions,
} from '../database/readEventsTableRows';
import { createOpenApiRouter, EndpointMap } from '../schema/openapi';
import { getMaxId } from '../database/getMaxId';
import { durationToMilliseconds, HumanDuration } from '@backstage/types';

const cursorSchema = z.object({
  version: z.literal(1),
  afterEventId: z.string().optional(),
  entityRef: z.string().optional(),
  entityId: z.string().optional(),
  order: z.enum(['asc', 'desc']),
  limit: z.number().positive().int(),
  block: z.boolean(),
});

type Cursor = z.TypeOf<typeof cursorSchema>;

export async function createRouter(options: {
  knexPromise: Promise<Knex>;
  signal: AbortSignal;
  pollFrequency?: HumanDuration;
  blockDuration?: HumanDuration;
}) {
  const router = await createOpenApiRouter();
  const pollFrequencyMs = durationToMilliseconds(
    options.pollFrequency ?? { seconds: 1 },
  );
  const blockDurationMs = durationToMilliseconds(
    options.blockDuration ?? { seconds: 10 },
  );

  router.get('/history/v1/events', async (req, res) => {
    const knex = await options.knexPromise;
    const { readOptions, block } = await readGetEventsQuery(knex, req);
    const rows = await readEventsTableRows(knex, readOptions);

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-store');

    if (rows.length === 0 && block) {
      res.status(202);
      res.flushHeaders();

      // TODO(freben): Implement a more efficient way to wait for new events.
      // See the events backend using LISTEN/NOTIFY for inspiration. For now,
      // wait for up to 10 seconds and stop early if the request closes, or if
      // we are shutting down, or we start finding some rows.
      const deadline = Date.now() + blockDurationMs;
      while (Date.now() < deadline) {
        await new Promise<void>(resolve => {
          const timer = setTimeout(done, pollFrequencyMs);
          req.on('close', done);
          options.signal.addEventListener('abort', done);
          function done() {
            clearTimeout(timer);
            req.off('close', done);
            options.signal.removeEventListener('abort', done);
            resolve();
          }
        });
        if (
          options.signal.aborted ||
          req.closed ||
          (await readEventsTableRows(knex, { ...readOptions, limit: 1 })).length
        ) {
          break;
        }
      }
    }

    // Let's generate a cursor for continuing to read, if we got some rows OR if
    // we were reading in ascending order (because then there might be more
    // events next time around)
    const shouldReturnCursor = rows.length > 0 || readOptions.order === 'asc';
    let nextCursor: Cursor | undefined;
    if (shouldReturnCursor) {
      nextCursor = {
        version: 1,
        afterEventId:
          rows.length > 0 ? rows[rows.length - 1].id : readOptions.afterEventId,
        entityRef: readOptions.entityRef,
        entityId: readOptions.entityId,
        order: readOptions.order,
        limit: readOptions.limit,
        block,
      };
    }

    res.end(
      JSON.stringify({
        items: rows.map(row => ({
          id: row.id,
          eventAt: row.eventAt.toISOString(),
          eventType: row.eventType,
          entityRef: row.entityRef,
          entityId: row.entityId,
          entityJson: row.entityJson,
        })),
        pageInfo: {
          cursor: nextCursor ? writeResponseCursorInfo(nextCursor) : undefined,
        },
      }),
    );
  });

  return router;
}

async function readGetEventsQuery(
  knex: Knex,
  request: Request<
    any,
    any,
    any,
    EndpointMap['#get|/history/v1/events']['query']
  >,
): Promise<{ readOptions: ReadEventsTableRowsOptions; block: boolean }> {
  let readOptions: ReadEventsTableRowsOptions;
  let block: boolean = false;

  if (request.query.cursor) {
    try {
      const cursor = cursorSchema.parse(
        JSON.parse(
          Buffer.from(request.query.cursor, 'base64url').toString('utf-8'),
        ),
      );
      readOptions = {
        afterEventId: cursor.afterEventId,
        entityRef: cursor.entityRef,
        entityId: cursor.entityId,
        order: cursor.order,
        limit: cursor.limit,
      };
      block = cursor.block;
    } catch {
      throw new InputError('Invalid cursor');
    }
  } else {
    readOptions = {
      afterEventId: request.query.afterEventId,
      entityRef: request.query.entityRef,
      entityId: request.query.entityId,
      order: request.query.order ?? 'asc',
      limit: request.query.limit ?? 100,
    };
    block = request.query.block ?? false;
  }

  if (!Number.isSafeInteger(readOptions.limit) || readOptions.limit < 1) {
    throw new InputError('Invalid limit, expected a positive integer');
  } else if (!['asc', 'desc'].includes(readOptions.order)) {
    throw new InputError('Invalid order, expected "asc" or "desc"');
  }

  if (readOptions.afterEventId === 'last') {
    readOptions.afterEventId = await getMaxId(knex);
  }

  return {
    readOptions,
    block,
  };
}

function writeResponseCursorInfo(cursor: Cursor) {
  return Buffer.from(JSON.stringify(cursor), 'utf-8').toString('base64url');
}
