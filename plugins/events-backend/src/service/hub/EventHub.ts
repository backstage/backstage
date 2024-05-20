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

import { LoggerService } from '@backstage/backend-plugin-api';
import { Handler } from 'express';
import Router from 'express-promise-router';
import { Socket } from 'net';
import { WebSocketServer, type WebSocket } from 'ws';

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
  }) {
    const { ws } = options;

    const id = Math.random().toString(36).slice(2, 10);
    const logger = options.logger.child({ connection: id });

    ws.addListener('ping', () => {
      ws.pong();
    });

    ws.onmessage = event => {
      logger.debug(`Message from client: ${JSON.stringify(event.data)}`);
    };
    ws.send('hello there!');

    const conn = new EventClientConnection(id, ws, options.socket, logger);

    logger.info(`New ${conn}`);

    return conn;
  }

  readonly #id: string;
  readonly #ws: WebSocket;
  readonly #socket: Socket;
  readonly #logger: LoggerService;

  constructor(
    id: string,
    ws: WebSocket,
    socket: Socket,
    logger: LoggerService,
  ) {
    this.#id = id;
    this.#ws = ws;
    this.#socket = socket;
    this.#logger = logger;
  }

  get id() {
    return this.#id;
  }

  close() {
    this.#ws.close();
    this.#logger.info(`Closed ${this}`);
  }

  toString() {
    return `EventClientConnection{id=${this.#id},addr=${
      this.#socket.remoteAddress
    }}`;
  }
}

export class EventHub {
  static async create(options: { logger: LoggerService }) {
    const logger = options.logger.child({ type: 'EventHub' });
    const router = Router();

    const server = new WebSocketServer({
      noServer: true,
      clientTracking: false,
    });
    server.on('error', error => {
      logger.error(`WebSocket server error`, error);
    });

    const hub = new EventHub(server, router, logger);

    router.get('/connect', hub.#handleGetConnect);

    return hub;
  }

  readonly #server: WebSocketServer;
  readonly #handler: Handler;
  readonly #logger: LoggerService;

  #connections = new Map<string, EventClientConnection>();

  private constructor(
    server: WebSocketServer,
    handler: Handler,
    logger: LoggerService,
  ) {
    this.#server = server;
    this.#handler = handler;
    this.#logger = logger;
  }

  handler(): Handler {
    return this.#handler;
  }

  #handleGetConnect: Handler = (req, _res) => {
    this.#server.handleUpgrade(
      req,
      req.socket,
      Buffer.alloc(0),
      (ws, { socket }) => {
        const conn = EventClientConnection.create({
          ws,
          socket,
          logger: this.#logger,
        });
        this.#connections.set(conn.id, conn);
      },
    );
  };

  close() {
    this.#connections.forEach(conn => conn.close());
    this.#connections.clear();
    this.#server.close();
  }
}
