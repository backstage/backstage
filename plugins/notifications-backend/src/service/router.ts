/*
 * Copyright 2023 The Backstage Authors
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
import { fullFormats } from 'ajv-formats/dist/formats';
import express from 'express';
import Router from 'express-promise-router';
import { Context, OpenAPIBackend, Request } from 'openapi-backend';

import { Paths } from '../openapi';
import { checkUserPermission } from './auth';
import { initDB } from './db';
import {
  createNotification,
  getNotifications,
  getNotificationsCount,
  setRead,
} from './handlers';
import {
  notificationsCreatePermission,
  notificationsReadPermission,
  notificationsSetReadPermission,
} from './permissions';
import { RouterOptions } from './types';

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
      req: express.Request,
      res: express.Response,
    ) =>
      checkUserPermission(req, options, notificationsCreatePermission).then(
        () =>
          createNotification(
            dbClient,
            catalogClient,
            c.request.requestBody,
          ).then(result => res.json(result)),
      ),
  );

  api.register(
    'getNotifications',
    (c, req: express.Request, res: express.Response) =>
      checkUserPermission(req, options, notificationsReadPermission).then(
        loggedInUser => {
          const q: Paths.GetNotifications.QueryParameters = Object.assign(
            {},
            c.request.query,
          );
          // we need to convert strings to real types due to open PR https://github.com/openapistack/openapi-backend/pull/571
          q.pageNumber = stringToNumber(q.pageNumber);
          q.pageSize = stringToNumber(q.pageSize);
          q.read = stringToBool(q.read);

          return getNotifications(
            dbClient,
            loggedInUser,
            catalogClient,
            q,
            q.pageSize,
            q.pageNumber,
            q,
          ).then(notifications => res.json(notifications));
        },
      ),
  );

  api.register(
    'getNotificationsCount',
    (c, req: express.Request, res: express.Response) =>
      checkUserPermission(req, options, notificationsReadPermission).then(
        loggedInUser => {
          const q: Paths.GetNotificationsCount.QueryParameters = Object.assign(
            {},
            c.request.query,
          );

          // we need to convert strings to real types due to open PR https://github.com/openapistack/openapi-backend/pull/571
          q.read = q.read = stringToBool(q.read);

          return getNotificationsCount(
            dbClient,
            loggedInUser,
            catalogClient,
            q,
          ).then(result => res.json(result));
        },
      ),
  );

  api.register('setRead', (c, req: express.Request, res: express.Response) =>
    checkUserPermission(req, options, notificationsSetReadPermission).then(
      loggedInUser => {
        const messageId = c.request.query.messageId.toString();
        const read = c.request.query.read.toString() === 'true';

        return setRead(dbClient, loggedInUser, messageId, read).then(result =>
          res.json(result),
        );
      },
    ),
  );

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

    api.handleRequest(req as Request, req, res).catch(next);
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
