import { CatalogClient } from '@backstage/catalog-client';
import { Config } from '@backstage/config';

import { fullFormats } from 'ajv-formats/dist/formats';
import express from 'express';
import Router from 'express-promise-router';
import { Context, OpenAPIBackend, Request } from 'openapi-backend';
import { Logger } from 'winston';

import { Paths } from '../openapi';
import { initDB } from './db';
import {
  createNotification,
  getNotifications,
  getNotificationsCount,
  setRead,
} from './handlers';

interface RouterOptions {
  logger: Logger;
  dbConfig: Config;
  catalogClient: CatalogClient;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, dbConfig, catalogClient } = options;

  // create DB client and tables
  if (!dbConfig) {
    logger.error('Missing dbConfig');
    throw new Error('Missing database config');
  }

  const dbClient = await initDB(dbConfig);

  // create openapi requests handler

  const api = new OpenAPIBackend({
    ajvOpts: {
      formats: fullFormats, // open issue: https://github.com/openapistack/openapi-backend/issues/280
    },
    validate: true,
    definition: '../../plugins/notifications-backend/src/openapi.yaml',
  });

  await api.init();

  api.register(
    'createNotification',
    (
      c: Context<Paths.CreateNotification.RequestBody>,
      _,
      res: express.Response,
      next,
    ) => {
      createNotification(dbClient, catalogClient, c.request.requestBody)
        .then(result => res.json(result))
        .catch(next);
    },
  );

  api.register('getNotifications', (c, _, res: express.Response, next) => {
    const q: Paths.GetNotifications.QueryParameters = Object.assign(
      {},
      c.request.query,
    );

    // we need to convert strings to real types due to open PR https://github.com/openapistack/openapi-backend/pull/571
    q.pageNumber = stringToNumber(q.pageNumber);
    q.pageSize = stringToNumber(q.pageSize);
    q.read = stringToBool(q.read);

    getNotifications(dbClient, catalogClient, q, q.pageSize, q.pageNumber, q)
      .then(notifications => res.json(notifications))
      .catch(next);
  });

  api.register('getNotificationsCount', (c, _, res: express.Response, next) => {
    const q: Paths.GetNotificationsCount.QueryParameters = Object.assign(
      {},
      c.request.query,
    );

    // we need to convert strings to real types due to open PR https://github.com/openapistack/openapi-backend/pull/571
    q.read = q.read = stringToBool(q.read);

    getNotificationsCount(dbClient, catalogClient, q)
      .then(result => res.json(result))
      .catch(next);
  });

  api.register('setRead', (c, _, res: express.Response, next) => {
    const messageId = c.request.query.messageId.toString();
    const user = c.request.query.user.toString();
    const read = c.request.query.read.toString() === 'true';

    setRead(dbClient, messageId, user, read)
      .then(result => res.json(result))
      .catch(next);
  });

  // create router

  const router = Router();
  router.use(express.json());
  router.use((req, res, next) => {
    if (!next) {
      throw new Error('next is undefined');
    }
    const validation = api.validateRequest(req as Request);
    if (!validation.valid) {
      throw validation.errors;
    }

    api.handleRequest(req as Request, req, res, next);
  });

  return router;
}

function stringToNumber(s: number | undefined): number | undefined {
  return s ? Number.parseInt(s.toString(), 10) : undefined;
}

function stringToBool(s: boolean | undefined): boolean | undefined {
  if (!s) {
    return undefined;
  }

  return s.toString() === 'true' ? true : false;
}
