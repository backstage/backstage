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

import express, { NextFunction, Request, Response } from 'express';
import Router from 'express-promise-router';
import {
  AuthService,
  BackstageUserInfo,
  DiscoveryService,
  LifecycleService,
  LoggerService,
  UserInfoService,
} from '@backstage/backend-plugin-api';
import * as https from 'https';
import http, { IncomingMessage } from 'http';
import { SignalManager } from './SignalManager';
import { EventsService } from '@backstage/plugin-events-node';
import { WebSocket, WebSocketServer } from 'ws';
import { Duplex } from 'stream';
import { Config } from '@backstage/config';

export interface RouterOptions {
  logger: LoggerService;
  events: EventsService;
  discovery: DiscoveryService;
  config: Config;
  lifecycle: LifecycleService;
  userInfo: UserInfoService;
  auth: AuthService;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, discovery, auth, userInfo } = options;

  const manager = SignalManager.create(options);
  let subscribedToUpgradeRequests = false;
  let apiUrl: string | undefined = undefined;

  const webSocketServer = new WebSocketServer({
    noServer: true, // handle upgrade manually
    clientTracking: false, // handle connections in SignalManager
  });

  webSocketServer.on('error', (error: Error) => {
    logger.error(`WebSocket server error: ${error}`);
  });

  const handleUpgrade = async (
    request: Request<any, any, any, any, any>,
    socket: Duplex,
    head: Buffer,
  ) => {
    if (!apiUrl) {
      apiUrl = await discovery.getBaseUrl('signals');
    }

    if (!request.url || !apiUrl || !apiUrl.endsWith(request.url)) {
      return;
    }

    let userIdentity: BackstageUserInfo | undefined = undefined;

    // Authentication token is passed in Sec-WebSocket-Protocol header as there
    // is no other way to pass the token with plain websockets
    try {
      const token = request.headers['sec-websocket-protocol'];
      if (token) {
        const credentials = await auth.authenticate(token);
        if (auth.isPrincipal(credentials, 'user')) {
          userIdentity = await userInfo.getUserInfo(credentials);
        }
      }
    } catch (e) {
      logger.error(`Failed to authenticate WebSocket connection: ${e}`);
      socket.write(
        'HTTP/1.1 401 Web Socket Protocol Handshake\r\n' +
          'Upgrade: WebSocket\r\n' +
          'Connection: Upgrade\r\n' +
          '\r\n',
      );
      socket.destroy();
      return;
    }

    try {
      webSocketServer.handleUpgrade(
        request,
        socket,
        head,
        (ws: WebSocket, __: IncomingMessage) => {
          manager.addConnection(ws, userIdentity);
        },
      );
    } catch (e) {
      logger.error(`Failed to handle WebSocket upgrade: ${e}`);
      socket.write(
        'HTTP/1.1 500 Web Socket Protocol Handshake\r\n' +
          'Upgrade: WebSocket\r\n' +
          'Connection: Upgrade\r\n' +
          '\r\n',
      );
      socket.destroy();
    }
  };

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
    server.on('upgrade', handleUpgrade);
  };

  const router = Router();
  router.use(express.json());
  router.use(upgradeMiddleware);

  router.get('/health', (_, response) => {
    response.json({ status: 'ok' });
  });

  return router;
}
