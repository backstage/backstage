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
import { Config } from '@backstage/config';
import { DatabaseHandler } from './DatabaseHandler';

export interface RouterOptions {
  logger: Logger;
  database: PluginDatabaseManager;
  config: Config;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, database } = options;
  const db = await database.getClient();

  const dbHandler = await DatabaseHandler.create({ database: db });

  logger.info('Initializing Bazaar backend');

  const router = Router();
  router.use(express.json());

  router.get('/projects/:id/members', async (request, response) => {
    const members = await dbHandler.getMembers(request.params.id);

    if (members?.length) {
      response.json({ status: 'ok', data: members });
    } else {
      response.json({ status: 'ok', data: [] });
    }
  });

  router.put('/projects/:id/member/:userId', async (request, response) => {
    const { id, userId } = request.params;
    await dbHandler.addMember(parseInt(id, 10), userId, request.body?.picture);

    response.json({ status: 'ok' });
  });

  router.delete('/projects/:id/member/:userId', async (request, response) => {
    const { id, userId } = request.params;

    const count = await dbHandler.deleteMember(parseInt(id, 10), userId);

    if (count) {
      response.json({ status: 'ok' });
    } else {
      response.status(404).json({ message: 'Record not found' });
    }
  });

  router.get('/projects/:idOrRef', async (request, response) => {
    const idOrRef = decodeURIComponent(request.params.idOrRef);
    let data;

    if (/^-?\d+$/.test(idOrRef)) {
      data = await dbHandler.getMetadataById(parseInt(idOrRef, 10));
    } else {
      data = await dbHandler.getMetadataByRef(idOrRef);
    }

    response.json({ status: 'ok', data: data });
  });

  router.get('/projects', async (_, response) => {
    const data = await dbHandler.getProjects();

    response.json({ status: 'ok', data: data });
  });

  router.put('/projects', async (request, response) => {
    const bazaarProject = request.body;

    const count = await dbHandler.updateMetadata(bazaarProject);

    if (count) {
      response.json({ status: 'ok' });
    }
  });

  router.post('/projects', async (request, response) => {
    const bazaarProject = request.body;

    await dbHandler.insertMetadata(bazaarProject);
    response.json({ status: 'ok' });
  });

  router.delete('/projects/:id', async (request, response) => {
    const id = decodeURIComponent(request.params.id);

    const count = await dbHandler.deleteMetadata(parseInt(id, 10));

    if (count) {
      response.json({ status: 'ok' });
    } else {
      response.status(404).json({ message: 'Record not found' });
    }
  });

  router.use(errorHandler());
  return router;
}
