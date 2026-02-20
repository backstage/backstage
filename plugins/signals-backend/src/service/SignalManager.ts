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
import crypto from 'node:crypto';
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
  private readonly instanceId: string;
  private readonly connections: Map<string, SignalConnection> = new Map<
    string,
    SignalConnection
  >();
  private readonly channelConnectionCount: Map<string, number> = new Map();
  private readonly events: EventsService;
  private readonly logger: LoggerService;
  private pingInterval: ReturnType<typeof setInterval> | undefined;

  static create(options: SignalManagerOptions) {
    return new SignalManager(options);
  }

  private constructor(options: SignalManagerOptions) {
    this.events = options.events;

    // Use a unique subscriber ID for each signals instance, in order to fan-out
    // all events to each signals instance. This ensures that events always
    // reach users in a scaled deployment.
    this.instanceId = `signals-${crypto.randomBytes(8).toString('hex')}`;
    this.logger = options.logger.child({ subscriberId: this.instanceId });
    this.logger.info(`Signals manager is subscribing to signals events`);

    options.lifecycle.addShutdownHook(() => this.onShutdown());
  }

  private ping() {
    this.connections.forEach(conn => {
      if (!conn.isAlive) {
        this.logger.debug(`Connection ${conn.id} is not alive, terminating`);
        this.terminateConnection(conn.id, conn.ws);
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

    this.connections.forEach(conn => {
      conn.ws.terminate();
    });
    this.connections.clear();
    // TODO: Unsubscribe from events?
    this.channelConnectionCount.clear();
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
      this.terminateConnection(id, ws);
    });

    ws.on('close', (code: number, reason: Buffer) => {
      this.logger.debug(
        `Connection ${id} closed with code ${code}, reason: ${reason}`,
      );
      this.terminateConnection(id, ws);
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
      const channel = message.channel as string;
      this.increaseChannelConnectionCount(channel);
      connection.subscriptions.add(channel);
    } else if (message.action === 'unsubscribe' && message.channel) {
      this.logger.debug(
        `Connection ${connection.id} unsubscribed from ${message.channel}`,
      );
      const channel = message.channel as string;
      this.decreaseChannelConnectionCount(channel);
      connection.subscriptions.delete(channel);
    }
  }

  private terminateConnection(id: string, ws: WebSocket) {
    const connection = this.connections.get(id);
    if (connection) {
      for (const subscription of connection.subscriptions) {
        this.decreaseChannelConnectionCount(subscription);
      }
      this.connections.delete(id);
    }
    ws.terminate();
  }

  private increaseChannelConnectionCount(channel: string) {
    const existingCount = this.channelConnectionCount.get(channel);
    // If the channel exists, even with zero count, we do not want to subscribe
    // again as EventsService does not handle the onEvent callback duplicates.
    // See comment in the decrease section.
    if (existingCount === undefined) {
      this.events.subscribe({
        id: this.instanceId,
        topics: [`signals:${channel}`],
        onEvent: (params: EventParams) =>
          this.onEventBrokerEvent(params.eventPayload as SignalPayload),
      });
      this.channelConnectionCount.set(channel, 1);
      return;
    }
    this.channelConnectionCount.set(channel, existingCount + 1);
  }

  private decreaseChannelConnectionCount(channel: string) {
    const cur = this.channelConnectionCount.get(channel);
    // TODO: If EventService would support unsubscribing, we could do it here. But as it
    //       doesn't, we just have to set the count to zero not to subscribe multiple callbacks
    //       when new subscription is added after the counter has reached zero.
    this.channelConnectionCount.set(channel, (cur ?? 1) - 1);
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
