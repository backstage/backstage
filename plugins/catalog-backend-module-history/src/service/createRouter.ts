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

import { Knex } from 'knex';
import { createOpenApiRouter } from '../schema/openapi';

export async function createRouter(options: {
  knexPromise: Promise<Knex>;
  signal: AbortSignal;
}) {
  const router = await createOpenApiRouter();

  router.get('/history/v1/events', async (req, res) => {
    let from = req.query._from;
    const _order = req.query.order;
    const _limit = req.query.limit;
    const _entityRef = req.query.entityRef;
    const _cursor = req.query.cursor;
    const _block = req.query.block;
    const _knex = await options.knexPromise;

    if (!from) {
      from = 'start';
    }

    res.json({
      items: [],
      pageInfo: {},
    });
  });

  return router;
}
