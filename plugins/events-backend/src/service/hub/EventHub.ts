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
import { WebSocketServer, type WebSocket } from 'ws';

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

  #connections = new Set<WebSocket>();

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
    this.#server.handleUpgrade(req, req.socket, Buffer.alloc(0), conn => {
      const id = Math.random().toString(36).slice(2, 10);
      const logger = this.#logger.child({ connection: id });

      logger.info(`New connection from '${req.socket.remoteAddress}'`);
      this.#connections.add(conn);

      conn.onmessage = event => {
        logger.debug(`Message from client: ${JSON.stringify(event.data)}`);
      };
      conn.send('hello there!');

      conn.addListener('ping', () => {
        conn.pong();
      });
    });
  };

  close() {
    this.#connections.forEach(conn => conn.close());
    this.#connections.clear();
    this.#server.close();
  }
}
