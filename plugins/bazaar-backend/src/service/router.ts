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

import {
  errorHandler,
  PluginDatabaseManager,
  resolvePackagePath,
} from '@backstage/backend-common';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { Config } from '@backstage/config';

export interface RouterOptions {
  logger: Logger;
  database: PluginDatabaseManager;
  config: Config;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger } = options;
  const db = await options.database.getClient();

  logger.info('Initializing Bazaar backend');

  const migrationsDir = resolvePackagePath(
    '@backstage/plugin-bazaar-backend',
    'migrations',
  );

  await db.migrate.latest({
    directory: migrationsDir,
  });

  const router = Router();
  router.use(express.json());

  router.get('/members', async (request, response) => {
    const entityRef = request.headers.entity_ref;

    const data = await db
      .select('*')
      .from('public.members')
      .where({ entity_ref: entityRef });

    if (data?.length) {
      response.json({ status: 'ok', data: data });
    } else {
      response.json({ status: 'ok', data: [] });
    }
  });

  router.put('/member', async (request, response) => {
    const userId = request.headers.user_id;
    const entityRef = request.headers.entity_ref;

    await db
      .insert({
        entity_ref: entityRef,
        user_id: userId,
      })
      .into('public.members');
    response.json({ status: 'ok' });
  });

  router.delete('/member', async (request, response) => {
    const userId = request.headers.user_id;
    const entityRef = request.headers.entity_ref;

    const count = await db('public.members')
      .where({ entity_ref: entityRef })
      .andWhere('user_id', userId)
      .del();

    if (count) {
      response.json({ status: 'ok' });
    } else {
      response.status(404).json({ message: 'Record not found' });
    }
  });

  router.delete('/members', async (request, response) => {
    const entityRef = request.headers.entity_ref;

    const count = await db('public.members')
      .where({ entity_ref: entityRef })
      .del();

    if (count) {
      response.json({ status: 'ok' });
    } else {
      response.status(404).json({ message: 'Record not found' });
    }
  });

  router.get('/metadata', async (request, response) => {
    const entityRef = request.headers.entity_ref;

    const data = await db
      .select('*')
      .from('public.metadata')
      .where({ entity_ref: entityRef });

    if (data?.length) {
      response.json({ status: 'ok', data: data });
    } else {
      response.status(404).json({ message: 'Record not found' });
    }
  });

  router.get('/entities', async (_, response) => {
    const coalesce = db.raw(
      'coalesce(count(members.entity_ref), 0) as members_count',
    );

    const columns = [
      'members.entity_ref',
      'metadata.entity_ref',
      'metadata.name',
      'metadata.announcement',
      'metadata.status',
      'metadata.updated_at',
    ];

    const data = await db('public.members as members')
      .select([...columns, coalesce])
      .groupBy(columns)
      .rightJoin(
        'public.metadata as metadata',
        'metadata.entity_ref',
        '=',
        'members.entity_ref',
      );

    response.json({ status: 'ok', data: data });
  });

  router.put('/metadata', async (request, response) => {
    const entityRef = request.headers.entity_ref;
    const { name, announcement, status, community } = request.body;

    const count = await db('public.metadata')
      .where({ entity_ref: entityRef })
      .update({
        announcement: announcement,
        community: community,
        status: status,
      });

    if (count) {
      response.json({ status: 'ok' });
    } else {
      await db
        .insert({
          name: name,
          entity_ref: entityRef,
          community: community,
          announcement: announcement,
          status: status,
        })
        .into('public.metadata');
      response.json({ status: 'ok' });
    }
  });

  router.delete('/metadata', async (request, response) => {
    const entityRef = request.headers.entity_ref;

    const count = await db('public.metadata')
      .where({ entity_ref: entityRef })
      .del();

    if (count) {
      response.json({ status: 'ok' });
    } else {
      response.status(404).json({ message: 'Record not found' });
    }
  });

  router.use(errorHandler());
  return router;
}
