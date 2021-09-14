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
  useHotMemoize,
} from '@backstage/backend-common';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import Knex from 'knex';
import { Config } from '@backstage/config';

export interface RouterOptions {
  logger: Logger;
  database?: PluginDatabaseManager;
  config: Config;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, config } = options;
  const db = await options.database?.getClient();

  const connection = config
    .getConfig('backend')
    .getConfig('database')
    .getConfig('connection');

  logger.info('Initializing Bazaar backend');

  const database = useHotMemoize(module, () => {
    const knex = Knex({
      client: 'postgresql',
      connection: {
        database: 'backstage_plugin_bazaar',
        user: connection.getString('user'),
        password: connection.getString('password'),
      },
      useNullAsDefault: true,
    });

    knex.client.pool.on('createSuccess', (_eventId: any, resource: any) => {
      resource.run('PRAGMA foreign_keys = ON', () => {});
    });
    return knex;
  });

  const migrationsDir = resolvePackagePath(
    '@internal/plugin-bazaar-backend',
    'migrations',
  );

  await database?.migrate.latest({
    directory: migrationsDir,
  });

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.send({ status: 'ok' });
  });

  router.get('/members', async (request, response) => {
    const entityRef = request.headers.entity_ref;

    const data = await db
      ?.select('*')
      .from('public.members')
      .where({ entity_ref: entityRef });

    if (data?.length) {
      response.send({ status: 'ok', data: data });
    } else {
      response.send({ status: 'ok', data: [] });
    }
  });

  router.put('/members/add', async (request, response) => {
    const userId = request.headers.user_id;
    const entityRef = request.headers.entity_ref;

    await db
      ?.insert({
        entity_ref: entityRef,
        user_id: userId,
      })
      .into('public.members');
    response.send({ status: 'ok' });
  });

  router.delete('/members/remove', async (request, response) => {
    const userId = request.headers.user_id;
    const entityRef = request.headers.entity_ref;

    const count = await db?.('public.members')
      .where({ entity_ref: entityRef })
      .andWhere('user_id', userId)
      .del();

    if (count) {
      response.send({ status: 'ok' });
    } else {
      response.status(404).json({ message: 'Record not found' });
    }
  });

  router.get('/metadata', async (request, response) => {
    const entityRef = request.headers.entity_ref;

    const data = await db
      ?.select('*')
      .from('public.metadata')
      .where({ entity_ref: entityRef });

    if (data?.length) {
      response.send({ status: 'ok', data: data });
    } else {
      response.status(404).json({ message: 'Record not found' });
    }
  });

  router.get('/entities', async (_, response) => {
    const data = await db?.select('*').from('public.metadata');

    response.send({ status: 'ok', data: data });
  });

  router.put('/metadata', async (request, response) => {
    const entityRef = request.headers.entity_ref;
    const { name, announcement, status } = request.body;

    const count = await db?.('public.metadata')
      .where({ entity_ref: entityRef })
      .update({
        announcement: announcement,
        status: status,
      });

    if (count) {
      response.send({ status: 'ok' });
    } else {
      await db
        ?.insert({
          name: name,
          entity_ref: entityRef,
          announcement: announcement,
          status: status,
        })
        .into('public.metadata');
      response.send({ status: 'ok' });
    }
  });

  router.delete('/metadata', async (request, response) => {
    const entityRef = request.headers.entity_ref;

    const count = await db?.('public.metadata')
      .where({ entity_ref: entityRef })
      .del();

    if (count) {
      response.send({ status: 'ok' });
    } else {
      response.status(404).json({ message: 'Record not found' });
    }
  });

  router.use(errorHandler());
  return router;
}
