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
import {
  errorHandler,
  PluginEndpointDiscovery,
} from '@backstage/backend-common';
import express, { NextFunction, Request, Response } from 'express';
import Router from 'express-promise-router';
import { LoggerService } from '@backstage/backend-plugin-api';
import * as https from 'https';
import http, { IncomingMessage } from 'http';
import { SignalManager } from './SignalManager';
import {
  BackstageIdentityResponse,
  IdentityApi,
  IdentityApiGetIdentityRequest,
} from '@backstage/plugin-auth-node';
import { EventBroker } from '@backstage/plugin-events-node';
import { WebSocket, WebSocketServer } from 'ws';

/** @public */
export interface RouterOptions {
  logger: LoggerService;
  eventBroker?: EventBroker;
  identity: IdentityApi;
  discovery: PluginEndpointDiscovery;
}

/** @public */
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, identity, discovery } = options;
  const manager = SignalManager.create(options);
  let subscribedToUpgradeRequests = false;

  const webSocketServer = new WebSocketServer({
    noServer: true,
    clientTracking: false,
  });

  const upgradeMiddleware = async (
    req: Request,
    _: Response,
    next: NextFunction,
  ) => {
    const server: https.Server | http.Server = (req.socket as any)?.server;
    if (
      subscribedToUpgradeRequests ||
      !server ||
      !req.headers ||
      req.headers.upgrade === undefined ||
      req.headers.upgrade.toLowerCase() !== 'websocket'
    ) {
      next();
      return;
    }

    subscribedToUpgradeRequests = true;
    const apiUrl = await discovery.getBaseUrl('signals');
    server.on('upgrade', async (request, socket, head) => {
      if (!request.url || !apiUrl.endsWith(request.url)) {
        return;
      }

      let userIdentity: BackstageIdentityResponse | undefined = undefined;

      // Authentication token is passed in Sec-WebSocket-Protocol header as there
      // is no other way to pass the token with plain websockets
      const token = req.headers['sec-websocket-protocol'];
      if (token) {
        userIdentity = await identity.getIdentity({
          request: {
            headers: { authorization: token },
          },
        } as IdentityApiGetIdentityRequest);
      }

      webSocketServer.handleUpgrade(
        request,
        socket,
        head,
        (ws: WebSocket, __: IncomingMessage) => {
          manager.addConnection(ws, userIdentity);
        },
      );
    });
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
