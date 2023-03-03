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
import { Config } from '@backstage/config';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { IdentityApi } from '@backstage/plugin-auth-node';
import { databaseConnection } from '../DatabaseHandler';
import ToolkitRoute from './toolkit';

export interface RouterOptions {
  logger: Logger;
  database?: PluginDatabaseManager;
  config?: Config;
  identity?: IdentityApi;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, identity, database } = options;
  const dbClient = await databaseConnection({ database } as any);

  dbClient.raw('select 1+1 as result').catch(err => {
    logger.error(err);
    process.exit(1);
  });

  const router = Router({ mergeParams: true });
  router.use(async (req: any, _, next) => {
    const user = identity && (await identity.getIdentity({ request: req }));
    req.user = user || {
      identity: {
        type: 'guest',
        userEntityRef: 'user:default/guest',
        ownershipEntityRefs: ['user:default/guest'],
      },
    };
    req.dbClient = dbClient;
    next();
  });
  router.use(express.json());
  router.use('/', ToolkitRoute);

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.json({ status: 'ok' });
  });

  router.get('*', async (_, response) => {
    logger.info('404!');
    response.status(404).json({ message: 'Page Not Found!' });
  });

  router.use(errorHandler());
  return router;
}
