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
import { EndpointMap } from '../../schema/openapi';
import {
  ReadSubscriptionModel,
  ReadSubscriptionOptions,
} from './ReadSubscription.model';

export function bindReadSubscriptionEndpoint(
  router: TypedRouter<EndpointMap>,
  model: ReadSubscriptionModel,
): void {
  router.get(
    '/history/v1/subscriptions/:subscriptionId/read',
    async (req, res) => {
      const { subscriptionId } = req.params;
      const { limit = 100, block = false } = req.query;

      const readOptions: ReadSubscriptionOptions = {
        subscriptionId,
        limit,
      };

      res.setHeader('Cache-Control', 'no-store');

      const result = await model.readSubscriptionNonblocking({ readOptions });
      if (result) {
        res.json({
          items: result.events.map(row => ({
            id: row.id,
            eventAt: row.eventAt.toISOString(),
            eventType: row.eventType,
            entityRef: row.entityRef,
            entityId: row.entityId,
            entityJson: row.entityJson,
          })),
          ackId: result.ackId,
        });
      } else if (!block) {
        res.json({ items: [] });
      } else {
        res.status(202);
        res.flushHeaders();

        const controller = new AbortController();
        req.on('close', () => {
          controller.abort();
        });

        await model.blockUntilDataIsReady({
          readOptions,
          signal: controller.signal,
        });

        res.end();
      }
    },
  );
}
