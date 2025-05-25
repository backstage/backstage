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
import { toResponseEvent } from './types';

export function bindGetEventsEndpoint(
  router: TypedRouter<EndpointMap>,
  model: GetEventsModel,
): void {
  router.get('/history/v1/events', async (req, res) => {
    let readOptions: ReadHistoryEventsOptions;
    let block: boolean = false;

    const controller = new AbortController();
    req.on('close', () => {
      controller.abort();
    });

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

    const result = await model.getEvents({
      readOptions,
      block,
      signal: controller.signal,
    });

    res.setHeader('Cache-Control', 'no-store');

    if (result.type === 'data') {
      res.json({
        items: result.events.map(toResponseEvent),
        pageInfo: {
          cursor: result.cursor ? stringifyCursor(result.cursor) : undefined,
        },
      });
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.status(202);
      res.flushHeaders();

      await result.wait();

      res.end(
        JSON.stringify({
          pageInfo: {
            cursor: stringifyCursor(result.cursor),
          },
        }),
      );
    }
  });
}
