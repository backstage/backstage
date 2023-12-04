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
import { ServiceOptions, SignalConnection } from './types';
import { RawData, WebSocket, WebSocketServer } from 'ws';
import { IncomingMessage } from 'http';
import { v4 as uuid } from 'uuid';
import { Request } from 'express';
import { JsonObject } from '@backstage/types';
import {
  BackstageIdentityResponse,
  IdentityApi,
} from '@backstage/plugin-auth-node';

/** @public */
export type SignalsEventBrokerPayload = {
  recipients?: string[];
  topic?: string;
  message?: JsonObject;
};

/** @public */
export class SignalsService implements EventSubscriber {
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
    return new SignalsService(options);
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

  handleUpgrade = async (req: Request) => {
    const identity = await this.identity.getIdentity({
      request: req,
    });

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

  async publish(to: string | string[], message: JsonObject, topic?: string) {
    await this.publishInternal(
      Array.isArray(to) ? to : [to],
      message,
      false,
      topic,
    );
  }

  private async publishInternal(
    recipients: string[],
    message: JsonObject,
    brokedEvent: boolean,
    topic?: string,
  ) {
    this.connections.forEach(conn => {
      if (topic && !conn.subscriptions.has(topic)) {
        return;
      }
      // Sending to all users can be done with '*'
      if (
        !recipients.includes('*') &&
        !conn.ownershipEntityRefs.some(ref => recipients.includes(ref))
      ) {
        return;
      }
      conn.ws.send(JSON.stringify({ topic, message }));
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

  async onEvent(params: EventParams<SignalsEventBrokerPayload>): Promise<void> {
    const { eventPayload, metadata } = params;
    // Discard message from same server to prevent duplicate messages
    if (!metadata?.server || metadata.server === this.serverId) {
      return;
    }

    if (!eventPayload?.recipients || !eventPayload.message) {
      return;
    }

    await this.publishInternal(
      eventPayload.recipients,
      eventPayload.message,
      true,
      eventPayload.topic,
    );
  }

  supportsEventTopics(): string[] {
    return ['signals'];
  }
}
