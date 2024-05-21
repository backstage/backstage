/*
 * Copyright 2024 The Backstage Authors
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
  BackstageCredentials,
  BackstageServicePrincipal,
  HttpAuthService,
  LoggerService,
} from '@backstage/backend-plugin-api';
import { Handler } from 'express';
import Router from 'express-promise-router';
import { Socket } from 'net';
import { STATUS_CODES } from 'http';
import { WebSocketServer, type WebSocket, RawData } from 'ws';

/**
 * Manages a single WebSocket connection.
 *
 * @internal
 */
class EventClientConnection {
  static create(options: {
    ws: WebSocket;
    socket: Socket;
    logger: LoggerService;
    credentials: BackstageCredentials<BackstageServicePrincipal>;
  }) {
    const { ws, credentials } = options;

    const id = Math.random().toString(36).slice(2, 10);
    const logger = options.logger.child({
      connection: id,
      subject: credentials.principal.subject,
    });

    const conn = new EventClientConnection(id, ws, logger, credentials);

    ws.addListener('close', conn.#handleClose);
    ws.addListener('error', conn.#handleError);
    ws.addListener('message', conn.#handleMessage);
    ws.addListener('ping', () => ws.pong());

    logger.info(
      `New event client connection from '${options.socket.remoteAddress}'`,
    );

    return conn;
  }

  readonly #id: string;
  readonly #ws: WebSocket;
  readonly #logger: LoggerService;
  readonly #credentials: BackstageCredentials<BackstageServicePrincipal>;

  constructor(
    id: string,
    ws: WebSocket,
    logger: LoggerService,
    credentials: BackstageCredentials<BackstageServicePrincipal>,
  ) {
    this.#id = id;
    this.#ws = ws;
    this.#logger = logger;
    this.#credentials = credentials;
  }

  get id() {
    return this.#id;
  }

  #handleClose = (code: number, reason: Buffer) => {
    this.#removeListeners();
    this.#logger.info(`Remote closed code=${code} reason=${reason}`);
  };

  #handleError = (error: Error) => {
    this.#removeListeners();
    this.#logger.error(`WebSocket error`, error);
  };

  #handleMessage = (data: RawData, isBinary: boolean) => {
    console.log(`DEBUG: isBinary=${isBinary} data=${data}`);
  };

  close() {
    this.#removeListeners();
    this.#ws.close();
    this.#logger.info(`Closed connection`);
  }

  #removeListeners() {
    this.#ws.removeListener('close', this.#handleClose);
    this.#ws.removeListener('error', this.#handleError);
    this.#ws.removeListener('message', this.#handleMessage);
  }

  toString() {
    return `eventClientConnection{id=${this.#id},subject=${
      this.#credentials.principal.subject
    }}`;
  }
}

export class EventHub {
  static async create(options: {
    logger: LoggerService;
    httpAuth: HttpAuthService;
  }) {
    const { httpAuth } = options;
    const logger = options.logger.child({ type: 'EventHub' });
    const router = Router();

    const server = new WebSocketServer({
      noServer: true,
      clientTracking: false,
    });

    server.on('error', error => {
      logger.error(`WebSocket server error`, error);
    });

    const hub = new EventHub(server, router, logger, httpAuth);

    router.get('/connect', hub.#handleGetConnect);

    return hub;
  }

  readonly #server: WebSocketServer;
  readonly #handler: Handler;
  readonly #logger: LoggerService;
  readonly #httpAuth: HttpAuthService;

  #connections = new Map<string, EventClientConnection>();

  private constructor(
    server: WebSocketServer,
    handler: Handler,
    logger: LoggerService,
    httpAuth: HttpAuthService,
  ) {
    this.#server = server;
    this.#handler = handler;
    this.#logger = logger;
    this.#httpAuth = httpAuth;
  }

  handler(): Handler {
    return this.#handler;
  }

  #handleGetConnect: Handler = async (req, _res) => {
    try {
      const credentials = await this.#httpAuth.credentials(req, {
        allow: ['service'],
      });

      this.#server.handleUpgrade(
        req,
        req.socket,
        Buffer.alloc(0),
        (ws, { socket }) => {
          const conn = EventClientConnection.create({
            ws,
            socket,
            logger: this.#logger,
            credentials,
          });
          this.#connections.set(conn.id, conn);
        },
      );
    } catch (error) {
      let status = 500;
      if (error.name === 'AuthenticationError') {
        status = 401;
      } else if (error.name === 'NotAllowedError') {
        status = 403;
      }
      req.socket.write(
        `HTTP/1.1 ${status} ${STATUS_CODES[status]}\r\n` +
          'Upgrade: WebSocket\r\n' +
          'Connection: Upgrade\r\n' +
          '\r\n',
      );
      req.socket.destroy();
      this.#logger.info('WebSocket upgrade failed', error);
    }
  };

  close() {
    this.#connections.forEach(conn => conn.close());
    this.#connections.clear();
    this.#server.close();
  }
}
