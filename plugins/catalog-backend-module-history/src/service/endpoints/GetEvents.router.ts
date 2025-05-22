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

import { TypedRouter } from '@backstage/backend-openapi-utils';
import { ReadHistoryEventsOptions } from '../../database/operations/readHistoryEvents';
import { EndpointMap } from '../../schema/openapi';
import { GetEventsModel } from './GetEvents.model';
import { parseCursor, stringifyCursor } from './GetEvents.utils';

export function bindGetEventsEndpoint(
  router: TypedRouter<EndpointMap>,
  model: GetEventsModel,
): void {
  router.get('/history/v1/events', async (req, res) => {
    let readOptions: ReadHistoryEventsOptions;
    let block: boolean = false;

    if (req.query.cursor) {
      const cursor = parseCursor(req.query.cursor);
      readOptions = {
        afterEventId: cursor.afterEventId,
        entityRef: cursor.entityRef,
        entityId: cursor.entityId,
        order: cursor.order,
        limit: cursor.limit,
      };
      block = cursor.block;
    } else {
      readOptions = {
        afterEventId: req.query.afterEventId,
        entityRef: req.query.entityRef,
        entityId: req.query.entityId,
        order: req.query.order ?? 'asc',
        limit: req.query.limit ?? 100,
      };
      block = req.query.block ?? false;
    }

    const result = await model.readEventsNonblocking({
      readOptions,
      block,
    });

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-store');

    if (result.events.length === 0 && result.cursor) {
      res.status(202);
      res.flushHeaders();

      const controller = new AbortController();
      req.on('close', () => {
        controller.abort();
      });

      await model.blockUntilDataIsReady({
        readOptions: {
          ...readOptions,
          // If it was specified as "last" in the request, the cursor contains
          // the real last ID
          afterEventId: result.cursor.afterEventId,
        },
        signal: controller.signal,
      });
    }

    if (!res.closed) {
      res.end(
        JSON.stringify({
          items: result.events.map(row => ({
            eventId: row.eventId,
            eventAt: row.eventAt.toISOString(),
            eventType: row.eventType,
            entityRef: row.entityRef,
            entityId: row.entityId,
            entityJson: row.entityJson,
          })),
          pageInfo: {
            cursor: result.cursor ? stringifyCursor(result.cursor) : undefined,
          },
        }),
      );
    }
  });
}
