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
import { Config } from '@backstage/config';
import { Server, Socket } from 'socket.io';
import { readCorsOptions } from '@backstage/backend-app-api';
import {
  IdentityApi,
  IdentityApiGetIdentityRequest,
} from '@backstage/plugin-auth-node';
import {
  ServiceOptions,
  SignalsClientSubscribeCommand,
  SignalsConnection,
} from './types';

/**
 * @public
 */
export class SignalsService implements EventSubscriber {
  private connections = new Map<string, SignalsConnection>();
  private server: Server;
  private eventBroker: EventBroker;
  private config: Config;
  private logger: Logger;
  private identity: IdentityApi;

  static create(options: ServiceOptions) {
    return new SignalsService(options);
  }

  private constructor(options: ServiceOptions) {
    ({
      eventBroker: this.eventBroker,
      config: this.config,
      logger: this.logger,
      identity: this.identity,
    } = options);

    const cors = readCorsOptions(this.config.getOptionalConfig('backend'));
    this.server = new Server(options.httpServer, {
      path: '/signals',
      cors,
    });

    this.server.on('connection', async (socket: Socket) => {
      await this.handleConnection(socket);
    });

    this.server.on('error', (err: Error) => {
      this.logger.error(`Signals service error occurred: ${err}, closing`);
      this.server.close();
    });

    this.server.on('close', () => {
      this.logger.info('Signals service closing, disconnecting all clients');
      for (const conn of this.connections.values()) {
        conn.ws.disconnect();
      }
      this.connections.clear();
    });

    this.eventBroker.subscribe(this);
    this.logger.info(
      `Signals service initialized at path ${this.server.path()}`,
    );
  }

  supportsEventTopics(): string[] {
    return ['signals'];
  }

  onEvent = async (params: EventParams) => {
    if (!params.metadata || !params.metadata.pluginId) {
      this.logger.info('Received event without pluginId, ignoring');
      return;
    }

    const pluginId = params.metadata.pluginId;
    const topic = params.metadata.topic;
    const targetOwnershipEntityRefs = params.metadata.targetOwnershipEntityRefs;
    const msg = { pluginId, topic, data: params.eventPayload };

    for (const c of this.connections.values()) {
      const subs = [...c.subscriptions.values()];
      if (
        !subs.find(
          subscription =>
            subscription.pluginId === pluginId &&
            (!subscription.topic || subscription.topic === topic),
        )
      ) {
        continue;
      }

      if (
        Array.isArray(targetOwnershipEntityRefs) &&
        !targetOwnershipEntityRefs.some(r => c.ownershipEntityRefs?.includes(r))
      ) {
        continue;
      }

      this.logger.debug(`Publishing message to ${c.ws.id}`);

      c.ws.emit('message', msg);
    }
  };

  private closeConnection = (conn: SignalsConnection) => {
    this.logger.info(`Closing connection ${conn.ws.id}`);
    conn.ws.disconnect();
    this.connections.delete(conn.ws.id);
  };

  private getConnectionObject = async (socket: Socket) => {
    const handshake = socket.handshake;
    const ip = handshake.address;
    const token = handshake.auth?.token;
    let identity;
    if (token) {
      identity = await this.identity.getIdentity({
        request: {
          headers: { authorization: token },
        },
      } as IdentityApiGetIdentityRequest);
    }
    return {
      ip,
      sub: identity?.identity.userEntityRef ?? 'user:default/guest',
      ws: socket,
      ownershipEntityRefs: identity?.identity.ownershipEntityRefs ?? [],
      subscriptions: new Map(),
    };
  };

  private handleConnection = async (socket: Socket) => {
    const conn = await this.getConnectionObject(socket);

    conn.ws.on('subscribe', (data: any) => {
      this.handleSubscribe(conn, data);
    });

    conn.ws.on('unsubscribe', (data: any) => {
      this.handleUnsubscribe(conn, data);
    });

    conn.ws.on('disconnect', () => {
      this.logger.info(`Connection ${conn.ws.id} disconnected`);
      this.closeConnection(conn);
    });

    conn.ws.on('error', (err: Error) => {
      this.logger.error(
        `Signals connection error occurred for ${conn.ws.id}: ${err}, disconnecting`,
      );
      this.closeConnection(conn);
    });

    this.connections.set(socket.id, conn);
  };

  private getSubscriptionKey = (cmd: SignalsClientSubscribeCommand) => {
    return cmd.topic ? `${cmd.pluginId}:${cmd.topic}` : cmd.pluginId;
  };

  private handleSubscribe = (
    conn: SignalsConnection,
    cmd: SignalsClientSubscribeCommand,
  ) => {
    const subscriptionKey = this.getSubscriptionKey(cmd);
    if (conn.subscriptions.has(subscriptionKey)) {
      return;
    }
    this.logger.info(`${conn.ws.id} subscribed to '${subscriptionKey}'`);
    conn.subscriptions.set(subscriptionKey, {
      pluginId: cmd.pluginId,
      topic: cmd.topic,
    });
  };

  private handleUnsubscribe = (
    conn: SignalsConnection,
    cmd: SignalsClientSubscribeCommand,
  ) => {
    const subscriptionKey = this.getSubscriptionKey(cmd);
    if (!conn.subscriptions.has(subscriptionKey)) {
      return;
    }
    this.logger.info(`${conn.ws.id} unsubscribed from '${subscriptionKey}'`);
    conn.subscriptions.delete(subscriptionKey);
  };
}
