/* eslint-disable @backstage/no-undeclared-imports */
/*
 * Copyright 2026 The Backstage Authors
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

import express from 'express';
import Router from 'express-promise-router';
import { connectionsServiceRef } from '@backstage/connections-node';
import {
  connectionTypes,
  type ConnectionTypeKey,
} from '@backstage/connections';
import {
  type HttpAuthService,
  type LoggerService,
} from '@backstage/backend-plugin-api';
import { NotFoundError } from '@backstage/errors';

function isConnectionTypeKey(type: string): type is ConnectionTypeKey {
  return Object.prototype.hasOwnProperty.call(connectionTypes, type);
}

export async function createRouter({
  connections,
}: {
  connections: typeof connectionsServiceRef.T;
  httpAuth: HttpAuthService;
  logger: LoggerService;
}): Promise<express.Router> {
  const router = Router();
  router.use(express.json());

  router.get('/schema/:type', async (req, res) => {
    const type = req.params.type;
    if (!isConnectionTypeKey(type)) {
      res.status(404).json('Cannot find connection type');
      return;
    }

    res.status(200).json(connectionTypes[type].configSchema.schema().schema);
  });

  router.get('/find', async (req, res) => {
    const p: any = req.query;

    if (!p.type) {
      res.status(400).json('Connection type not specified');
      return;
    }

    if (!p.url) {
      res.status(400).json('URL not specified');
      return;
    }

    const rawAuth = p.auth;
    let authMethods: string[];
    if (!rawAuth) {
      authMethods = ['none'];
    } else if (Array.isArray(rawAuth)) {
      authMethods = rawAuth as string[];
    } else {
      authMethods = [rawAuth];
    }

    let connection;
    try {
      connection = await connections.find({
        type: p.type as ConnectionTypeKey,
        url: p.url,
        authMethods: authMethods as any,
      });
    } catch (e) {
      if (e instanceof NotFoundError) {
        res.status(404).json('Cannot find connection');
        return;
      }
      if (e instanceof Error && e.name === 'InputError') {
        res.status(400).json(e.message);
        return;
      }
      if (e instanceof Error && e.name === 'NotAllowedError') {
        res.status(403).json(e.message);
        return;
      }
      throw e;
    }
    res.status(200).json(connection);
  });

  return router;
}
