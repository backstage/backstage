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
import { z, ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { JsonObject, JsonValue } from '@backstage/types';
import { serializeError } from '@backstage/errors';

/*

# Protocol

## Request/Response

General request/response format used for all communication:

-> [type: 'req', id: number, method: string, params: JsonObject]
<- [type: 'res', id: number, status: 'resolved' | 'rejected', result: JsonObject]

## Client -> Server

### Subscribe

-> method: 'subscribe', params: { id: string, topics: string[] }
<- result: void

### Publish

-> method: 'publish', params: { topic: string, payload: JsonObject }
<- result: void

## Server -> Client

### Event

-> method: 'event', params: { topic: string, payload: JsonObject }
<- result: void

*/

const messageSchema = z.union([
  z.tuple([
    z.literal('req'),
    z.number().int().gt(0),
    z.string().min(1),
    z.any(),
  ]),
  z.tuple([
    z.literal('res'),
    z.number().int().gt(0),
    z.enum(['resolved', 'rejected']),
    z.any(),
  ]),
]);
const subscribeParamsSchema = z.object({
  id: z.string().min(1),
  topics: z.array(z.string().min(1)),
});
const publishParamsSchema = z.object({
  topic: z.string().min(1),
  payload: z.any(),
});
const eventParamsSchema = z.object({
  topic: z.string().min(1),
  payload: z.any(),
});

function errorToJson(error: Error): JsonObject {
  if (error.name === 'ZodError') {
    return serializeError(fromZodError(error as ZodError));
  }
  return serializeError(error);
}

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

    logger.info(
      `New event client connection from '${options.socket.remoteAddress}'`,
    );

    return conn;
  }

  readonly #id: string;
  readonly #ws: WebSocket;
  readonly #logger: LoggerService;
  readonly #credentials: BackstageCredentials<BackstageServicePrincipal>;

  #seq = 1;
  readonly #pendingRequests = new Map<
    number,
    { resolve(result: unknown): void; reject(error: unknown): void }
  >();
  readonly #requestHandlers = new Map<
    string,
    {
      schema: z.ZodType;
      handler: (params: any) => unknown;
    }
  >();

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

  #handleMessage = (rawData: RawData, isBinary: boolean) => {
    if (isBinary) {
      return;
    }
    try {
      const data = Array.isArray(rawData)
        ? Buffer.concat(rawData)
        : Buffer.from(rawData);
      const message = messageSchema.parse(JSON.parse(data.toString('utf8')));

      if (message[0] === 'req') {
        const [, seq, method, params] = message;
        const handler = this.#requestHandlers.get(method);
        if (!handler) {
          throw new Error(`Unknown method '${method}'`);
        }

        try {
          const parsedParams = handler.schema.parse(params);

          Promise.resolve(handler.handler(parsedParams)).then(
            result => {
              this.#sendMessage('res', seq, 'resolved', result ?? null);
            },
            error => {
              this.#sendMessage('res', seq, 'rejected', errorToJson(error));
            },
          );
        } catch (error) {
          this.#sendMessage('res', seq, false, errorToJson(error));
        }
      } else if (message[0] === 'res') {
        const [, seq, success, result] = message;
        const pendingRequest = this.#pendingRequests.get(seq);
        if (!pendingRequest) {
          throw new Error(`Received response for unknown request seq=${seq}`);
        }
        this.#pendingRequests.delete(seq);
        if (success) {
          pendingRequest.resolve(result);
        } else {
          pendingRequest.reject(result);
        }
      }
    } catch (error) {
      this.#logger.error('Invalid message received', error);
    }
  };

  addRequestHandler<TParams>(
    method: string,
    schema: z.ZodType<TParams>,
    handler: (params: TParams) => unknown,
  ) {
    this.#requestHandlers.set(method, { schema, handler });
  }

  async request<TReq extends JsonObject, TRes extends JsonObject>(
    method: string,
    params: TReq,
  ): Promise<TRes> {
    return new Promise<TRes>((resolve, reject) => {
      const seq = this.#seq++;
      this.#pendingRequests.set(seq, { resolve, reject });
      this.#sendMessage('req', seq, method, params);
    });
  }

  #sendMessage(...message: JsonValue[]) {
    this.#ws.send(JSON.stringify(message));
  }

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

  #handleGetConnect: Handler = async (req, _res, next) => {
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
          conn.addRequestHandler(
            'subscribe',
            subscribeParamsSchema,
            async params => {
              console.log(`DEBUG: subscribe req`, params);
            },
          );
          conn.addRequestHandler(
            'publish',
            publishParamsSchema,
            async params => {
              console.log(`DEBUG: publish req`, params);
            },
          );
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
