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

import { EventParams, EventsService } from '@backstage/plugin-events-node';
import { SignalPayload } from '@backstage/plugin-signals-node';
import crypto from 'crypto';
import { RawData, WebSocket } from 'ws';
import { v4 as uuid } from 'uuid';
import { JsonObject } from '@backstage/types';
import {
  BackstageUserInfo,
  LifecycleService,
  LoggerService,
} from '@backstage/backend-plugin-api';
import { Config } from '@backstage/config';

/**
 * @internal
 */
export type SignalConnection = {
  id: string;
  user: string;
  ws: WebSocket;
  ownershipEntityRefs: string[];
  subscriptions: Set<string>;
  isAlive: boolean;
};

/**
 * @internal
 */
export type SignalManagerOptions = {
  events: EventsService;
  config: Config;
  logger: LoggerService;
  lifecycle: LifecycleService;
};

/** @internal */
export class SignalManager {
  private connections: Map<string, SignalConnection> = new Map<
    string,
    SignalConnection
  >();
  private events: EventsService;
  private logger: LoggerService;
  private pingInterval: ReturnType<typeof setInterval> | undefined;

  static create(options: SignalManagerOptions) {
    return new SignalManager(options);
  }

  private constructor(options: SignalManagerOptions) {
    this.events = options.events;

    // Use a unique subscriber ID for each signals instance, in order to fan-out
    // all events to each signals instance. This ensures that events always
    // reach users in a scaled deployment.
    const id = `signals-${crypto.randomBytes(8).toString('hex')}`;
    this.logger = options.logger.child({ subscriberId: id });
    this.logger.info(`Signals manager is subscribing to signals events`);

    this.events.subscribe({
      id,
      topics: ['signals'],
      onEvent: (params: EventParams) =>
        this.onEventBrokerEvent(params.eventPayload as SignalPayload),
    });

    options.lifecycle.addShutdownHook(() => this.onShutdown());
  }

  private ping() {
    this.connections.forEach(conn => {
      if (!conn.isAlive) {
        this.logger.debug(`Connection ${conn.id} is not alive, terminating`);
        conn.ws.terminate();
        return;
      }

      conn.isAlive = false;
      conn.ws.ping();
    });
  }

  private onShutdown() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }

    // TODO: Unsubscribe from events?

    this.connections.forEach(conn => {
      conn.ws.terminate();
    });
    this.connections.clear();
  }

  addConnection(ws: WebSocket, identity?: BackstageUserInfo) {
    // Start pinging on first connection
    if (!this.pingInterval) {
      this.pingInterval = setInterval(() => this.ping(), 30000);
    }

    const id = uuid();
    const conn = {
      id,
      user: identity?.userEntityRef ?? 'user:default/guest',
      ws,
      ownershipEntityRefs: identity?.ownershipEntityRefs ?? [
        'user:default/guest',
      ],
      subscriptions: new Set<string>(),
      isAlive: true,
    };

    this.connections.set(id, conn);

    this.logger.debug(`Connection ${id} connected`);
    ws.on('error', (err: Error) => {
      this.logger.error(
        `Error occurred with connection ${id}: ${err}, closing connection`,
      );
      ws.terminate();
      this.connections.delete(id);
    });

    ws.on('close', (code: number, reason: Buffer) => {
      this.logger.debug(
        `Connection ${id} closed with code ${code}, reason: ${reason}`,
      );
      ws.terminate();
      this.connections.delete(id);
    });

    ws.on('ping', () => {
      conn.isAlive = true;
      ws.pong();
    });

    ws.on('pong', () => {
      conn.isAlive = true;
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
    if (message.action === 'subscribe' && message.channel) {
      this.logger.debug(
        `Connection ${connection.id} subscribed to ${message.channel}`,
      );
      connection.subscriptions.add(message.channel as string);
    } else if (message.action === 'unsubscribe' && message.channel) {
      this.logger.debug(
        `Connection ${connection.id} unsubscribed from ${message.channel}`,
      );
      connection.subscriptions.delete(message.channel as string);
    }
  }

  private async onEventBrokerEvent(eventPayload: SignalPayload): Promise<void> {
    if (!eventPayload.channel || !eventPayload.message) {
      return;
    }

    const { channel, recipients, message } = eventPayload;
    const jsonMessage = JSON.stringify({ channel, message });
    let users: string[] = [];
    if (recipients.type === 'user') {
      users = Array.isArray(recipients.entityRef)
        ? recipients.entityRef
        : [recipients.entityRef];
    }

    // Actual websocket message sending
    this.connections.forEach(conn => {
      if (!conn.subscriptions.has(channel)) {
        return;
      }

      // Sending to all users can be done with broadcast
      if (
        recipients.type !== 'broadcast' &&
        !conn.ownershipEntityRefs.some((ref: string) => users.includes(ref))
      ) {
        return;
      }

      if (conn.ws.readyState !== WebSocket.OPEN) {
        return;
      }

      conn.ws.send(jsonMessage, err => {
        if (err) {
          this.logger.error(`Failed to send message to ${conn.id}: ${err}`);
        }
      });
    });
  }
}
