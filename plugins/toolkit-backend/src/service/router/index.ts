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

/**
 * @internal
 */
export type Toolkit = {
  id?: number;
  owner?: string;
  logo?: string;
  title?: string;
  url?: string;
  type?: string;
  toolkits?: number[];
  toolkit?: number;
};

/**
 * @internal
 */
export type User = {
  identity: {
    type: string;
    userEntityRef: string;
    ownershipEntityRefs: string[];
  };
};

/**
 *
 * @public
 * RouterOptions to construct Toolkit endpoints
 *
 */
export interface RouterOptions {
  /**
   * Implementation of Winston logger
   */
  logger: Logger;
  database?: PluginDatabaseManager;
  /**
   * Backstage config object
   */
  config?: Config;
  identity?: IdentityApi;
}

/**
 * @public
 *
 * Constructs a toolkit router.
 *
 * Exposes endpoints to handle facts
 * Exposes optional endpoints to handle checks if a FactChecker implementation is passed in
 *
 * @param options - RouterOptions object
 */
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, identity, database } = options;
  const dbClient = await databaseConnection({ database } as {
    database: PluginDatabaseManager;
  });

  dbClient.raw('select 1+1 as result').catch(err => {
    logger.error(err);
    process.exit(1);
  });

  const DEFAULT_USER = {
    identity: {
      type: 'guest',
      userEntityRef: 'user:default/guest',
      ownershipEntityRefs: ['user:default/guest'],
    },
  };

  const router = Router({ mergeParams: true });
  router.use(express.json());

  /**
   *
   * @public
   *
   */
  router.get('/myToolkits', async (req, res) => {
    try {
      const client = dbClient;
      const user =
        (identity && (await identity.getIdentity({ request: req }))) ||
        DEFAULT_USER;
      const userId = user?.identity?.userEntityRef;

      const data = await client('toolkit').where({ owner: userId });

      res.status(200).json({ data: data || [] });
    } catch (error) {
      res.status(500).send('Internal server error!');
    }
  });

  /**
   *
   * This API is used to get user toolkits created by the user.
   * @public
   *
   */
  router.get('/getToolkits', async (req, res: any) => {
    try {
      const client = dbClient;
      const user =
        (identity && (await identity.getIdentity({ request: req }))) ||
        DEFAULT_USER;
      const userId = user?.identity?.userEntityRef;

      const data = await client('toolkit').whereNot({
        owner: userId,
        type: 'private',
      });
      res.status(200).json({ data: data || [] });
    } catch (error) {
      res.status(500).send('Internal server error!');
    }
  });

  /**
   *
   * @public
   * This api is used to create a toolkit.
   *
   */
  router.post('/create', async (req, res) => {
    try {
      const client = dbClient;
      const user =
        (identity && (await identity.getIdentity({ request: req }))) ||
        DEFAULT_USER;
      const userId = user?.identity?.userEntityRef;

      req.body.owner = userId;
      const toolkit = await client
        .insert(req.body)
        .into('toolkit')
        .returning('id');
      if (toolkit.length) {
        res.status(200).send('Created');
      } else {
        res.status(400).send('Something went wrong');
      }
    } catch (error: any) {
      res.status(500).send('Internal server error!');
    }
  });

  /**
   *
   * @public
   *
   */
  router.get('/:id', async (req, res) => {
    try {
      const client = dbClient;
      const data = await client('toolkit').where({ id: req.params.id }).first();
      res.status(200).json({ data: data || [] });
    } catch (error) {
      res.status(500).send('Internal server error!');
    }
  });

  /**
   *
   * @public
   *
   */
  router.post('/add', async (req, res) => {
    try {
      const client = dbClient;
      const { toolkits } = req.body;

      const user =
        (identity && (await identity.getIdentity({ request: req }))) ||
        DEFAULT_USER;
      const userId = user?.identity?.userEntityRef;

      const toolkitData: Toolkit[] = [];

      if (toolkits) {
        const checkIsExists: Toolkit[] = await client('toolkit')
          .whereIn('id', toolkits)
          .where({ type: 'public' });

        toolkits.forEach((_id: number) => {
          const checkExists = checkIsExists.find(({ id }) => id === _id);
          if (checkExists) {
            toolkitData.push({
              title: checkExists.title,
              logo: checkExists.logo,
              url: checkExists.url,
              type: 'private',
              owner: userId,
            });
          }
        });
      }
      if (toolkitData?.length) {
        await client.insert([...toolkitData]).into('toolkit');
        res.send('Toolkits added successfully');
      } else {
        res.send('No Toolkits founded or already exists');
      }
    } catch (error: any) {
      res.status(500).send('Internal server error!');
    }
  });

  /**
   *
   * @public
   *
   */
  router.delete('/delete/:id', async (req, res) => {
    try {
      const client = dbClient;

      const user =
        (identity && (await identity.getIdentity({ request: req }))) ||
        DEFAULT_USER;
      const userId = user?.identity?.userEntityRef;

      const data = await client('toolkit')
        .where({ id: req.params.id, owner: userId })
        .delete();

      if (data) {
        res.status(200).send('Deleted Successfully');
      } else {
        res.status(400).send('Invalid request');
      }
    } catch (error) {
      res.status(500).send('Internal server error!');
    }
  });

  /**
   *
   * @public
   *
   */
  router.get('*', async (_, response) => {
    logger.info('404!');
    response.status(404).json({ message: 'Page Not Found!' });
  });

  router.use(errorHandler());
  return router;
}
