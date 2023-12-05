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
  EventBroker,
  EventParams,
  EventSubscriber,
} from '@backstage/plugin-events-node';
import { Logger } from 'winston';
import {
  ServiceOptions,
  SignalConnection,
  SignalEventBrokerPayload,
} from './types';
import { RawData, WebSocket, WebSocketServer } from 'ws';
import { IncomingMessage } from 'http';
import { v4 as uuid } from 'uuid';
import { Request } from 'express';
import { JsonObject } from '@backstage/types';
import {
  BackstageIdentityResponse,
  IdentityApi,
  IdentityApiGetIdentityRequest,
} from '@backstage/plugin-auth-node';

/** @public */
export class SignalService implements EventSubscriber {
  private readonly serverId: string;
  private connections: Map<string, SignalConnection> = new Map<
    string,
    SignalConnection
  >();
  private eventBroker?: EventBroker;
  private logger: Logger;
  private identity: IdentityApi;
  private server: WebSocketServer;

  static create(options: ServiceOptions) {
    return new SignalService(options);
  }

  private constructor(options: ServiceOptions) {
    ({
      eventBroker: this.eventBroker,
      logger: this.logger,
      identity: this.identity,
    } = options);

    this.serverId = uuid();
    this.server = new WebSocketServer({
      noServer: true,
    });

    this.server.on('close', () => {
      this.logger.info('Closing signals server');
      this.connections.forEach(conn => {
        conn.ws.close();
      });
      this.connections = new Map();
    });

    this.eventBroker?.subscribe(this);
  }

  /**
   * Handles request upgrade to websocket and adds the connection to internal
   * list for publish/subscribe functionality
   * @param req - Request
   */
  handleUpgrade = async (req: Request) => {
    let identity: BackstageIdentityResponse | undefined = undefined;

    // Authentication token is passed in Sec-WebSocket-Protocol header as there
    // is no other way to pass the token with plain websockets
    const token = req.headers['sec-websocket-protocol'];
    if (token) {
      identity = await this.identity.getIdentity({
        request: {
          headers: { authorization: token },
        },
      } as IdentityApiGetIdentityRequest);
    }

    this.server.handleUpgrade(
      req,
      req.socket,
      Buffer.from(''),
      (ws: WebSocket, __: IncomingMessage) => {
        this.addConnection(ws, identity);
      },
    );
  };

  private addConnection(ws: WebSocket, identity?: BackstageIdentityResponse) {
    const id = uuid();

    const conn = {
      id,
      user: identity?.identity.userEntityRef ?? 'user:default/guest',
      ws,
      ownershipEntityRefs: identity?.identity.ownershipEntityRefs ?? [],
      subscriptions: new Set<string>(),
    };

    this.connections.set(id, conn);

    ws.on('error', (err: Error) => {
      this.logger.info(
        `Error occurred with connection ${id}: ${err}, closing connection`,
      );
      ws.close();
      this.connections.delete(id);
    });

    ws.on('close', (code: number, reason: Buffer) => {
      this.logger.info(
        `Connection ${id} closed with code ${code}, reason: ${reason}`,
      );
      this.connections.delete(id);
    });

    ws.on('ping', () => {
      this.logger.debug(`Ping from connection ${id}`);
      ws.pong();
    });

    ws.on('message', (data: RawData, isBinary: boolean) => {
      this.logger.debug(`Received message from connection ${id}: ${data}`);
      if (isBinary) {
        return;
      }

      try {
        const json = JSON.parse(data.toString()) as JsonObject;
        this.handleMessage(conn, json);
      } catch (err: any) {
        this.logger.error(
          `Invalid message received from connection ${id}: ${err}`,
        );
      }
    });
  }

  private handleMessage(connection: SignalConnection, message: JsonObject) {
    if (message.action === 'subscribe' && message.topic) {
      this.logger.info(
        `Connection ${connection.id} subscribed to ${message.topic}`,
      );
      connection.subscriptions.add(message.topic as string);
    }

    if (message.action === 'unsubscribe' && message.topic) {
      this.logger.info(
        `Connection ${connection.id} unsubscribed from ${message.topic}`,
      );
      connection.subscriptions.delete(message.topic as string);
    }
  }

  /**
   * Publishes a message to user refs to specific topic
   * @param to - string or array of user ref strings to publish message to
   * @param topic - message topic
   * @param message - message to publish
   */
  async publish(to: string | string[], topic: string, message: JsonObject) {
    await this.publishInternal(
      Array.isArray(to) ? to : [to],
      topic,
      message,
      false,
    );
  }

  /**
   * Checks if there is active subscriptions to specific topic.
   * This can be useful to skip heavy processing before publishing messages if there are no subscriptions.
   * @param topic - topic to check for subscriptions
   */
  hasSubscribers(topic: string): boolean {
    return (
      [...this.connections.values()].find(conn =>
        conn.subscriptions.has(topic),
      ) !== undefined
    );
  }

  private async publishInternal(
    recipients: string[],
    topic: string,
    message: JsonObject,
    brokedEvent: boolean,
  ) {
    const jsonMessage = JSON.stringify({ topic, message });
    if (jsonMessage.length === 0) {
      return;
    }

    this.connections.forEach(conn => {
      if (!conn.subscriptions.has(topic)) {
        return;
      }
      // Sending to all users can be done with '*'
      if (
        !recipients.includes('*') &&
        !conn.ownershipEntityRefs.some(ref => recipients.includes(ref))
      ) {
        return;
      }

      if (conn.ws.readyState !== WebSocket.OPEN) {
        return;
      }

      conn.ws.send(jsonMessage);
    });

    // If this event has not been broadcasted to all servers, then use
    // EventBroker to do that
    if (this.eventBroker && !brokedEvent) {
      await this.eventBroker.publish({
        topic: 'signals',
        eventPayload: {
          recipients,
          message,
          topic,
        },
        metadata: { server: this.serverId },
      });
    }
  }

  async onEvent(params: EventParams<SignalEventBrokerPayload>): Promise<void> {
    const { eventPayload, metadata } = params;
    // Discard message from same server to prevent duplicate messages
    if (!metadata?.server || metadata.server === this.serverId) {
      return;
    }

    if (
      !eventPayload?.recipients ||
      !eventPayload.topic ||
      !eventPayload.message
    ) {
      return;
    }

    await this.publishInternal(
      eventPayload.recipients,
      eventPayload.topic,
      eventPayload.message,
      true,
    );
  }

  supportsEventTopics(): string[] {
    return ['signals'];
  }
}
