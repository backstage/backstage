/*
 * Copyright 2020 The Backstage Authors
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

import { errorHandler, PluginDatabaseManager } from '@backstage/backend-common';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { UserProfileStore } from '../database/UserProfileStore';

export interface RouterOptions {
  logger: Logger;
  database: PluginDatabaseManager;
}

// TODO(chase/ainhoa): Move this somewhere else, a database?
// key: entityref
// value: github.com username
const mapData: Record<string, string> = {
  'user:default/breanna.davison': 'orkohunter',
  'user:default/amelia.park': 'ainhoaL',
};

export async function createRouter({
  logger,
  database,
}: RouterOptions): Promise<express.Router> {
  const knex = await database.getClient();
  const store = await UserProfileStore.create(knex);

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.send({ status: 'ok' });
  });

  router.get('/v1/user-profile', (request, response) => {
    const githubUsername = mapData[`${request.query.entity}`];
    // TODO (himanshu/ainhoa): get github data with username
    response.json({ user: githubUsername });
  });

  router.put('/v1/user-profile', async (req, res) => {
    await store.saveProfile({ id: '1234', name: 'vincenzo' });
    res.json({});
  });

  router.use(errorHandler());
  return router;
}
