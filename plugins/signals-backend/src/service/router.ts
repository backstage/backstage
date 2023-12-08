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
import { Logger } from 'winston';
import { SignalService } from '@backstage/plugin-signals-node';
import * as https from 'https';
import http from 'http';

/** @public */
export interface RouterOptions {
  logger: Logger;
  service: SignalService;
}

/** @public */
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, service } = options;
  let subscribed = false;

  const upgradeMiddleware = (req: Request, _: Response, next: NextFunction) => {
    const server: https.Server | http.Server = (
      (req.socket ?? req.connection) as any
    )?.server;
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
      server.on('upgrade', async (request, socket, head) => {
        await service.handleUpgrade(request, socket, head);
      });
      subscribed = true;
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
