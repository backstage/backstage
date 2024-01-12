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
import { errorHandler } from '@backstage/backend-common';
import express, { NextFunction, Request, Response } from 'express';
import Router from 'express-promise-router';
import { LoggerService } from '@backstage/backend-plugin-api';
import * as https from 'https';
import http from 'http';
import { SignalManager } from './SignalManager';
import { IdentityApi } from '@backstage/plugin-auth-node';
import { EventBroker } from '@backstage/plugin-events-node';

/** @public */
export interface RouterOptions {
  logger: LoggerService;
  eventBroker?: EventBroker;
  identity: IdentityApi;
}

/** @public */
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger } = options;
  const manager = SignalManager.create(options);
  let subscribed = false;

  const upgradeMiddleware = (req: Request, _: Response, next: NextFunction) => {
    const server: https.Server | http.Server = (req.socket as any)?.server;
    if (
      !server ||
      !req.headers ||
      req.headers.upgrade === undefined ||
      req.headers.upgrade.toLowerCase() !== 'websocket'
    ) {
      next();
      return;
    }

    if (!subscribed) {
      subscribed = true;
      server.on('upgrade', async (request, socket, head) => {
        // TODO: Find a way to make this more generic
        if (request.url === '/api/signals') {
          await manager.handleUpgrade({ request, socket, head });
        }
      });
    }
  };

  const router = Router();
  router.use(express.json());
  router.use(upgradeMiddleware);

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.json({ status: 'ok' });
  });

  router.use(errorHandler());
  return router;
}
