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
import { EventParams } from '@backstage/plugin-events-node';
import { spec, createOpenApiRouter } from '../../schema/openapi.generated';
import { internal } from '@backstage/backend-openapi-utils';

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
  events: z.array(
    z.object({
      topic: z.string().min(1),
      payload: z.any(),
      metadata: z.any().optional(),
    }),
  ),
});

function errorToJson(error: Error): JsonObject {
  if (error.name === 'ZodError') {
    return serializeError(fromZodError(error as ZodError));
  }
  return serializeError(error);
}

type EventHubStore = {
  publish(options: {
    params: EventParams;
    subscriberIds: string[];
  }): Promise<void>;

  upsertSubscription(id: string, topics: string[]): Promise<void>;

  readSubscription(id: string): Promise<{ events: EventParams[] }>;

  listen(
    subscriptionId: string,
    onNotify: (topicId: string) => void,
  ): Promise<() => void>;
};

const MAX_BATCH_SIZE = 5;

class MemoryEventHubStore implements EventHubStore {
  #events = new Array<
    EventParams & { seq: number; subscriberIds: Set<string> }
  >();
  #subscribers = new Map<
    string,
    { id: string; seq: number; topics: Set<string> }
  >();
  #listeners = new Set<{
    topics: Set<string>;
    notify(topicId: string): void;
  }>();

  async publish(options: {
    params: EventParams;
    subscriberIds: string[];
  }): Promise<void> {
    const topicId = options.params.topic;
    const subscriberIds = new Set(options.subscriberIds);

    let hasOtherSubscribers = false;
    for (const sub of this.#subscribers.values()) {
      if (sub.topics.has(topicId) && !subscriberIds.has(sub.id)) {
        hasOtherSubscribers = true;
        break;
      }
    }
    if (!hasOtherSubscribers) {
      return;
    }

    const nextSeq = this.#getMaxSeq() + 1;
    this.#events.push({ ...options.params, subscriberIds, seq: nextSeq });

    for (const listener of this.#listeners) {
      if (listener.topics.has(topicId)) {
        listener.notify(topicId);
      }
    }
  }

  #getMaxSeq() {
    return this.#events[this.#events.length - 1]?.seq ?? 0;
  }

  async upsertSubscription(id: string, topics: string[]): Promise<void> {
    const existing = this.#subscribers.get(id);
    if (existing) {
      existing.topics = new Set(topics);
      return;
    }
    const sub = {
      id: id,
      seq: this.#getMaxSeq(),
      topics: new Set(topics),
    };
    this.#subscribers.set(id, sub);
  }

  async readSubscription(id: string): Promise<{ events: EventParams[] }> {
    const sub = this.#subscribers.get(id);
    if (!sub) {
      throw new Error(`Subscription not found`);
    }
    const events = this.#events
      .filter(
        event =>
          event.seq > sub.seq &&
          sub.topics.has(event.topic) &&
          !event.subscriberIds.has(id),
      )
      .slice(0, MAX_BATCH_SIZE);

    sub.seq = events[events.length - 1]?.seq ?? sub.seq;

    return { events: events.map(event => ({ ...event, seq: undefined })) };
  }

  async listen(
    subscriptionId: string,
    onNotify: (topicId: string) => void,
  ): Promise<() => void> {
    const sub = this.#subscribers.get(subscriptionId);
    if (!sub) {
      throw new Error(`Subscription not found`);
    }
    const listener = { topics: sub.topics, notify: onNotify };
    this.#listeners.add(listener);
    return () => {
      this.#listeners.delete(listener);
    };
  }
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

  async request<TReq extends JsonObject, TRes extends JsonObject | void>(
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

    // WS
    router.get('/hub/connect', hub.#handleGetConnect);

    const apiRouter = await createOpenApiRouter();

    router.use(apiRouter);

    apiRouter.post('/hub/events', hub.#handlePostEvents);

    // Long-polling
    apiRouter.get(
      '/hub/subscriptions/:subscriptionId/events',
      hub.#handleGetSubscription,
    );
    apiRouter.put(
      '/hub/subscriptions/:subscriptionId',
      hub.#handlePutSubscription,
    );

    return hub;
  }

  readonly #server: WebSocketServer;
  readonly #handler: Handler;
  readonly #logger: LoggerService;
  readonly #httpAuth: HttpAuthService;
  readonly #store: EventHubStore;

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
    this.#store = new MemoryEventHubStore();
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
          conn.addRequestHandler(
            'subscribe',
            subscribeParamsSchema,
            async params => {
              await this.#store.upsertSubscription(params.id, params.topics);

              this.#logger.info(
                `New subscription '${params.id}' topics='${params.topics.join(
                  "', '",
                )}'`,
              );

              const read = () =>
                this.#store.readSubscription(params.id).then(
                  ({ events }) => {
                    if (events.length > 0) {
                      conn
                        .request<z.TypeOf<typeof eventParamsSchema>, void>(
                          'events',
                          { events },
                        )
                        .catch(error => {
                          this.#logger.error(
                            `Failed to send events to subscription ${params.id}`,
                            error,
                          );
                        });
                    }
                  },
                  error => {
                    this.#logger.error(
                      `Failed to read subscription ${params.id}`,
                      error,
                    );
                  },
                );

              const removeListener = await this.#store.listen(params.id, read);
              ws.addListener('close', removeListener);

              await read();
            },
          );
          conn.addRequestHandler(
            'publish',
            publishParamsSchema,
            async params => {
              await this.#store.publish({
                params: {
                  topic: params.topic,
                  eventPayload: params.payload,
                },
                subscriberIds: [],
              });
              this.#logger.info(`Published event to '${params.topic}'`);
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

  #handlePostEvents: internal.DocRequestHandler<
    typeof spec,
    '/hub/events',
    'post'
  > = async (req, res) => {
    const credentials = await this.#httpAuth.credentials(req, {
      allow: ['service'],
    });
    await this.#store.publish({
      params: {
        topic: req.body.event.topic,
        eventPayload: req.body.event.payload,
      },
      subscriberIds: req.body.subscriptionIds ?? [],
    });
    this.#logger.info(`Published event to '${req.body.event.topic}'`, {
      subject: credentials.principal.subject,
    });
    res.status(201).end();
  };

  #handleGetSubscription: internal.DocRequestHandler<
    typeof spec,
    '/hub/subscriptions/{subscriptionId}/events',
    'get'
  > = async (req, res) => {
    const credentials = await this.#httpAuth.credentials(req, {
      allow: ['service'],
    });
    const id = req.params.subscriptionId;

    const { events } = await this.#store.readSubscription(id);

    this.#logger.info(
      `Reading subscription '${id}' resulted in ${events.length} events`,
      { subject: credentials.principal.subject },
    );

    if (events.length > 0) {
      res.json({ events });
      return;
    }

    this.#store.listen(id, () => {
      res.status(204).end();
    });
  };

  #handlePutSubscription: internal.DocRequestHandler<
    typeof spec,
    '/hub/subscriptions/{subscriptionId}',
    'put'
  > = async (req, res) => {
    const credentials = await this.#httpAuth.credentials(req, {
      allow: ['service'],
    });
    const id = req.params.subscriptionId;

    await this.#store.upsertSubscription(id, req.body.topics);

    this.#logger.info(
      `New subscription '${id}' topics='${req.body.topics.join("', '")}'`,
      { subject: credentials.principal.subject },
    );

    res.status(201).end();
  };

  close() {
    this.#connections.forEach(conn => conn.close());
    this.#connections.clear();
    this.#server.close();
  }
}
