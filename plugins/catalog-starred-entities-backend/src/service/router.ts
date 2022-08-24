/*
 * Copyright 2022 The Backstage Authors
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
import { PluginDatabaseManager, errorHandler } from '@backstage/backend-common';
import express, { Request } from 'express';
import Router from 'express-promise-router';

import {
  DatabaseStarredEntitiesStore,
  StarredEntitiesStore,
} from '../database';

/**
 * @public
 */
export async function createStarredEntitiesStore(
  database: PluginDatabaseManager,
) {
  return await DatabaseStarredEntitiesStore.create(await database.getClient());
}

/**
 * @public
 */
export interface RouterOptions<T> {
  starredEntitiesStore: StarredEntitiesStore<T>;
  getUserIdFromRequest: (req: Request) => Promise<string>;
}

/**
 * Create the starred entity backend routes.
 *
 * @public
 */
export async function createRouter<T>(
  options: RouterOptions<T>,
): Promise<express.Router> {
  const { starredEntitiesStore, getUserIdFromRequest } = options;

  const router = Router();
  router.use(express.json());

  router.get('/', async (req, res) => {
    const callerUserId = await getUserIdFromRequest(req);

    const starredEntities = await starredEntitiesStore.transaction(tx =>
      starredEntitiesStore.getStarredEntities(tx, { userId: callerUserId }),
    );

    res.json({ starredEntities });
  });

  router.post('/:namespace/:kind/:name/star', async (req, res) => {
    const callerUserId = await getUserIdFromRequest(req);

    const { kind, name, namespace } = req.params;

    const starredEntities = await starredEntitiesStore.transaction(async tx => {
      await starredEntitiesStore.starEntity(tx, {
        userId: callerUserId,
        entity: { kind, namespace, name },
      });

      return await starredEntitiesStore.getStarredEntities(tx, {
        userId: callerUserId,
      });
    });

    res.json({ starredEntities });
  });

  router.post('/:namespace/:kind/:name/toggle', async (req, res) => {
    const callerUserId = await getUserIdFromRequest(req);

    const { kind, name, namespace } = req.params;

    const starredEntities = await starredEntitiesStore.transaction(async tx => {
      await starredEntitiesStore.toggleEntity(tx, {
        userId: callerUserId,
        entity: { kind, namespace, name },
      });

      return await starredEntitiesStore.getStarredEntities(tx, {
        userId: callerUserId,
      });
    });

    res.json({ starredEntities });
  });

  router.use(errorHandler());

  return router;
}
