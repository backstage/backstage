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
import {
  SignalChannelRegistration,
  SignalPayload,
} from '@backstage/plugin-signals-node';
import { RawData, WebSocket } from 'ws';
import { v4 as uuid } from 'uuid';
import { JsonObject } from '@backstage/types';
import {
  BackstageCredentials,
  BackstageUserInfo,
  LoggerService,
  PermissionsService,
} from '@backstage/backend-plugin-api';
import { AuthorizeResult } from '@backstage/plugin-permission-common';

/**
 * @internal
 */
export type SignalConnection = {
  id: string;
  user: string;
  credentials?: BackstageCredentials;
  ws: WebSocket;
  ownershipEntityRefs: string[];
  subscriptions: Set<string>;
};

/**
 * @internal
 */
export type SignalManagerOptions = {
  events: EventsService;
  logger: LoggerService;
  permissions?: PermissionsService;
};

type EventBrokerEvent = {
  type: 'signal' | 'registration';
} & SignalPayload &
  SignalChannelRegistration;

/** @internal */
export class SignalManager {
  private connections: Map<string, SignalConnection> = new Map<
    string,
    SignalConnection
  >();
  private registeredChannels: Map<string, SignalChannelRegistration> = new Map<
    string,
    SignalChannelRegistration
  >();
  private events: EventsService;
  private logger: LoggerService;
  private permissions?: PermissionsService;

  static create(options: SignalManagerOptions) {
    return new SignalManager(options);
  }

  private constructor(options: SignalManagerOptions) {
    ({
      events: this.events,
      logger: this.logger,
      permissions: this.permissions,
    } = options);

    this.events.subscribe({
      id: 'signals',
      topics: ['signals'],
      onEvent: (params: EventParams) =>
        this.onEventBrokerEvent(params.eventPayload as EventBrokerEvent),
    });
  }

  addConnection(
    ws: WebSocket,
    identity?: BackstageUserInfo,
    credentials?: BackstageCredentials,
  ) {
    const id = uuid();
    const conn = {
      id,
      user: identity?.userEntityRef ?? 'user:default/guest',
      credentials,
      ws,
      ownershipEntityRefs: identity?.ownershipEntityRefs ?? [
        'user:default/guest',
      ],
      subscriptions: new Set<string>(),
    };

    this.connections.set(id, conn);

    ws.on('error', (err: Error) => {
      this.logger.error(
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

    ws.on('message', (data: RawData, isBinary: boolean) => {
      this.logger.debug(`Received message from connection ${id}: ${data}`);
      if (isBinary) {
        return;
      }

      const json = JSON.parse(data.toString()) as JsonObject;
      this.handleMessage(conn, json).catch(err => {
        this.logger.error(
          `Invalid message received from connection ${id}: ${err}`,
        );
      });
    });
  }

  private async authorizeSubscribe(
    connection: SignalConnection,
    channel: string,
  ) {
    if (!this.registeredChannels.has(channel)) {
      return true;
    }

    const registration = this.registeredChannels.get(channel);

    if (!registration?.permissions) {
      return true;
    }

    if (!connection.credentials || !this.permissions) {
      return false;
    }

    const decisions = await this.permissions.authorize(
      registration.permissions,
      {
        credentials: connection.credentials,
      },
    );
    const denied = decisions.some(
      decision => decision.result === AuthorizeResult.DENY,
    );
    return !denied;
  }

  private async handleMessage(
    connection: SignalConnection,
    message: JsonObject,
  ) {
    if (message.action === 'subscribe' && message.channel) {
      const channel = message.channel as string;
      if (!(await this.authorizeSubscribe(connection, channel))) {
        return;
      }

      this.logger.info(`Connection ${connection.id} subscribed to ${channel}`);
      connection.subscriptions.add(channel);
    } else if (message.action === 'unsubscribe' && message.channel) {
      this.logger.info(
        `Connection ${connection.id} unsubscribed from ${message.channel}`,
      );
      connection.subscriptions.delete(message.channel as string);
    }
  }

  private async onEventBrokerEvent(
    eventPayload: EventBrokerEvent,
  ): Promise<void> {
    // Handle signal channel registration
    if (eventPayload.type === 'registration') {
      this.registeredChannels.set(eventPayload.channel, eventPayload);
      return;
    }

    // Handle signal publish
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
    for (const conn of this.connections.values()) {
      if (conn.ws.readyState !== WebSocket.OPEN) {
        continue;
      }

      if (!conn.subscriptions.has(channel)) {
        continue;
      }

      if (
        recipients.type !== 'broadcast' &&
        !conn.ownershipEntityRefs.some((ref: string) => users.includes(ref))
      ) {
        continue;
      }

      conn.ws.send(jsonMessage, err => {
        if (err) {
          this.logger.error(`Failed to send message to ${conn.id}: ${err}`);
        }
      });
    }
  }
}
