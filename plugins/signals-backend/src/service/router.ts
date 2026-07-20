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
import * as https from 'node:https';
import http, { IncomingMessage } from 'node:http';
import { SignalManager } from './SignalManager';
import { EventsService } from '@backstage/plugin-events-node';
import { WebSocket, WebSocketServer } from 'ws';
import { Duplex } from 'node:stream';
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

function readWebSocketToken(
  header: string | string[] | undefined,
): string | undefined {
  const value = Array.isArray(header) ? header[0] : header;
  if (!value) {
    return undefined;
  }
  // Sec-WebSocket-Protocol may list multiple protocols; the Backstage token is
  // expected to be the first (and typically only) value.
  const token = value.split(',')[0]?.trim();
  return token || undefined;
}

function rejectUpgrade(
  socket: Duplex,
  statusLine: string,
  logger: LoggerService,
  details: {
    remoteAddress?: string;
    reason: string;
  },
) {
  logger.warn('WebSocket upgrade rejected', {
    remoteAddress: details.remoteAddress,
    timestamp: new Date().toISOString(),
    reason: details.reason,
  });
  // Prefer end() so the HTTP response is flushed before the socket closes.
  socket.end(
    `${statusLine}\r\n` +
      'Connection: close\r\n' +
      'Content-Length: 0\r\n' +
      '\r\n',
  );
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

    // Authentication token is passed in Sec-WebSocket-Protocol header as there
    // is no other way to pass the token with plain websockets
    const token = readWebSocketToken(request.headers['sec-websocket-protocol']);
    if (!token) {
      rejectUpgrade(socket, 'HTTP/1.1 401 Unauthorized', logger, {
        remoteAddress: request.socket.remoteAddress,
        reason: 'missing_token',
      });
      return;
    }

    let userIdentity: BackstageUserInfo;
    try {
      const credentials = await auth.authenticate(token);
      if (!auth.isPrincipal(credentials, 'user')) {
        rejectUpgrade(socket, 'HTTP/1.1 401 Unauthorized', logger, {
          remoteAddress: request.socket.remoteAddress,
          reason: 'non_user_principal',
        });
        return;
      }
      userIdentity = await userInfo.getUserInfo(credentials);
    } catch (e) {
      rejectUpgrade(socket, 'HTTP/1.1 401 Unauthorized', logger, {
        remoteAddress: request.socket.remoteAddress,
        reason: 'invalid_token',
      });
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
      rejectUpgrade(socket, 'HTTP/1.1 500 Internal Server Error', logger, {
        remoteAddress: request.socket.remoteAddress,
        reason: 'upgrade_failed',
      });
    }
  };

  // The HTTP server is only available via the request socket, so the upgrade
  // listener is registered on the first request that reaches this router.
  // Until then, WebSocket upgrades for this plugin are not handled (same
  // constraint as before; registering on any first request is slightly more
  // reliable than waiting for an Upgrade request through Express).
  const upgradeMiddleware = async (
    req: Request,
    _: Response,
    next: NextFunction,
  ) => {
    if (!subscribedToUpgradeRequests) {
      const server: https.Server | http.Server = (req.socket as any)?.server;
      if (server) {
        subscribedToUpgradeRequests = true;
        server.on('upgrade', handleUpgrade);
      }
    }
    next();
  };

  const router = Router();
  router.use(express.json());
  router.use(upgradeMiddleware);

  router.get('/health', (_, response) => {
    response.json({ status: 'ok' });
  });

  return router;
}
