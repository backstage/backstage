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

import type {
  HttpRouterServiceWebSocketHandler,
  HttpRouterServiceWebSocketContext,
  LifecycleService,
  LoggerService,
} from '@backstage/backend-plugin-api';
import type { IncomingMessage } from 'node:http';
import WebSocket, { WebSocketServer } from 'ws';

/**
 * Options for {@link createWebSocketHandler}.
 *
 * @public
 */
export interface WebSocketHandlerOptions {
  /** Lifecycle used to terminate connections when the plugin shuts down. */
  lifecycle: LifecycleService;
  /** Logger for connection and handler errors. */
  logger: LoggerService;
  /**
   * Verify authentication and origin before the handshake. Throw or reject to
   * close the connection. HTTP middleware and auth policies do not apply.
   * For intentionally public routes, explicitly supply a no-op callback.
   */
  verifyClient(
    request: IncomingMessage,
    context: HttpRouterServiceWebSocketContext,
  ): void | Promise<void>;
  /**
   * Supported protocols in server preference order. If the client offers
   * protocols, at least one must match. Without this option, only clients
   * that do not offer protocols are accepted.
   */
  protocols?: readonly string[];
  /**
   * Receives an accepted ws connection. Thrown errors or rejected promises
   * terminate the connection. Connections are also terminated on shutdown.
   */
  onConnection(
    connection: WebSocket,
    request: IncomingMessage,
    context: HttpRouterServiceWebSocketContext,
  ): void | Promise<void>;
}

/**
 * Creates an optional ws-based adapter for
 * {@link @backstage/backend-plugin-api#HttpRouterService.addWebSocketHandler}.
 * Plugins can instead supply their own adapter or forward upgrades upstream.
 *
 * @public
 */
export function createWebSocketHandler(
  options: WebSocketHandlerOptions,
): HttpRouterServiceWebSocketHandler {
  const { lifecycle, logger, verifyClient, onConnection } = options;
  const supportedProtocols = options.protocols ? [...options.protocols] : [];
  const server = new WebSocketServer({
    noServer: true,
    handleProtocols: offered =>
      supportedProtocols.find(protocol => offered.has(protocol)) ?? false,
  });
  let stopped = false;
  lifecycle.addShutdownHook(() => {
    stopped = true;
    for (const connection of server.clients) {
      connection.terminate();
    }
    server.close();
  });

  return async context => {
    const { request, socket, head } = context;
    if (stopped || socket.destroyed) {
      socket.destroy();
      return;
    }
    await verifyClient(request, context);
    if (stopped || socket.destroyed) {
      socket.destroy();
      return;
    }
    const offeredProtocols = request.headers['sec-websocket-protocol']
      ?.split(',')
      .map(protocol => protocol.trim());
    if (
      offeredProtocols &&
      !supportedProtocols.some(protocol => offeredProtocols.includes(protocol))
    ) {
      socket.end(
        'HTTP/1.1 400 Bad Request\r\nConnection: close\r\nContent-Length: 0\r\n\r\n',
        () => socket.destroy(),
      );
      return;
    }
    server.handleUpgrade(request, socket, head, connection => {
      const onError = (error: unknown) => {
        logger.warn(
          'WebSocket connection failed',
          error instanceof Error ? error : new Error(String(error)),
        );
        connection.terminate();
      };
      connection.on('error', onError);
      try {
        Promise.resolve(onConnection(connection, request, context)).catch(
          onError,
        );
      } catch (error) {
        onError(error);
      }
    });
  };
}
