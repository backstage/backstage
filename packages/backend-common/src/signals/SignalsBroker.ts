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

import { Server, Socket } from 'socket.io';
import jwt_decode from 'jwt-decode';
import { LoggerService } from '@backstage/backend-plugin-api';
import {
  SignalsClientMessage,
  SignalsClientRegisterCommand,
  SignalsClientSubscribeCommand,
} from './types';
import { JWTPayload } from 'jose';
import { Handshake } from 'socket.io/dist/socket';
import { Emitter } from '@socket.io/postgres-emitter';

type SignalsConnectionType = 'frontend' | 'backend';

type SignalsSubscription = {
  pluginId: string;
  topic?: string;
};

type SignalsConnection = {
  ws: Socket;
  type: SignalsConnectionType;
  ip?: string;
  sub?: string;
  entityRefs: string[];
  subscriptions: Map<string, SignalsSubscription>;
  pluginId?: string;
  topic?: string;
};

const stringifyConnection = (conn: SignalsConnection) => {
  return `(id: ${conn.ws.id}, type: ${conn.type}, sub: ${conn.sub}, plugin: ${conn.pluginId}, ip: ${conn.ip})`;
};

/**
 * Implements a signals broker which will take care of connections and distributing
 * messages to the connected clients.
 *
 * @private
 */
export class SignalsBroker {
  private readonly logger: LoggerService;
  private readonly connections: Map<string, SignalsConnection>;
  private readonly emitter?: Emitter;

  static create(
    server: Server,
    logger: LoggerService,
    emitter?: Emitter,
  ): SignalsBroker {
    return new SignalsBroker(server, logger, emitter);
  }

  private constructor(
    server: Server,
    logger: LoggerService,
    emitter?: Emitter,
  ) {
    this.logger = logger;
    this.connections = new Map();
    this.emitter = emitter;

    server.on('connection', this.handleConnection);
    server.on('close', () => {
      for (const conn of this.connections.values()) {
        conn.ws.disconnect();
      }
      this.connections.clear();
    });
  }

  private closeConnection = (conn: SignalsConnection) => {
    this.logger.info(`Closing connection ${stringifyConnection(conn)}`);
    conn.ws.disconnect();
    this.connections.delete(conn.ws.id);
  };

  private parseConnectionRequest = (handshake: Handshake) => {
    const ip = handshake.address;
    let token = undefined;
    if (handshake.auth.token) {
      token = handshake.auth.token;
    }

    if (typeof handshake.headers.authorization === 'string') {
      const matches =
        handshake.headers.authorization.match(/^Bearer[ ]+(\S+)$/i);
      token = matches?.[1];
    }

    let type: SignalsConnectionType = 'frontend';
    let entities: string[] = [];
    let sub;
    if (token) {
      const decoded = jwt_decode<JWTPayload>(token);
      sub = decoded.sub;
      if (decoded.sub === 'backstage-server') {
        type = 'backend';
      }
      if (Array.isArray(decoded.ent)) {
        entities = decoded.ent;
      }
    }
    return { ip, type, entities, sub };
  };

  private handleConnection = (ws: Socket) => {
    let ip;
    let type;
    let entities;
    let sub;

    try {
      ({ ip, type, entities, sub } = this.parseConnectionRequest(ws.handshake));
    } catch (e) {
      this.logger.error(`Failed to authenticate connection: ${e}`);
      ws.disconnect();
      return;
    }

    const conn: SignalsConnection = {
      ws,
      sub,
      entityRefs: entities,
      subscriptions: new Map(),
      ip,
      type,
    };

    this.connections.set(ws.id, conn);

    conn.ws.on('register', (data: SignalsClientRegisterCommand) => {
      this.handleRegister(conn, data);
    });
    conn.ws.on('publish', (data: SignalsClientMessage) => {
      this.handlePublish(conn, data);
    });
    conn.ws.on('subscribe', (data: SignalsClientSubscribeCommand) => {
      this.logger.info(`Subscribing to ${stringifyConnection(conn)}`);
      this.handleSubscribe(conn, data);
    });
    conn.ws.on('unsubscribe', (data: SignalsClientSubscribeCommand) => {
      this.handleUnsubscribe(conn, data);
    });
    conn.ws.on('disconnect', () => {
      this.closeConnection(conn);
    });
    conn.ws.on('error', (err: Error) => {
      this.logger.error(`Signals error occurred: ${err}`);
    });
  };

  private handleRegister = (
    conn: SignalsConnection,
    cmd: SignalsClientRegisterCommand,
  ) => {
    const connStr = stringifyConnection(conn);
    if (conn.type !== 'backend') {
      this.logger.warn(`Invalid signals register request from ${connStr}`);
      return;
    }

    conn.pluginId = cmd.pluginId;
    this.logger.info(
      `Plugin '${cmd.pluginId}' registered to signals broker ${connStr}`,
    );
  };

  private handlePublish = (
    conn: SignalsConnection,
    cmd: SignalsClientMessage,
  ) => {
    const connStr = stringifyConnection(conn);
    if (!conn.pluginId || conn.type !== 'backend') {
      this.logger.warn(`Invalid signals publish request from ${connStr}`);
      return;
    }

    // Emit the message to all other backends
    if (this.emitter) {
      this.emitter.serverSideEmit('publish', cmd);
    }

    for (const c of this.connections.values()) {
      const subs = [...c.subscriptions.values()];

      // Check that the connection has subscription to plugin and optional topic
      if (
        !subs.find(
          subscription =>
            subscription.pluginId === cmd.pluginId &&
            (!subscription.topic || subscription.topic === cmd.topic),
        )
      ) {
        continue;
      }

      // If the message is intended to specific users or groups by entityRefs,
      // check that the connection has been established using those
      if (
        cmd.targetEntityRefs &&
        cmd.targetEntityRefs.some(r => c.entityRefs.includes(r))
      ) {
        continue;
      }

      c.ws.emit('message', cmd);
    }
  };

  private handleSubscribe = (
    conn: SignalsConnection,
    cmd: SignalsClientSubscribeCommand,
  ) => {
    const connStr = stringifyConnection(conn);
    const subscriptionKey = `${cmd.pluginId}:${cmd.topic}`;
    if (conn.subscriptions.has(subscriptionKey)) {
      return;
    }
    this.logger.info(`${connStr} subscribed to ${subscriptionKey}`);
    conn.subscriptions.set(subscriptionKey, {
      pluginId: cmd.pluginId,
      topic: cmd.topic,
    });
  };

  private handleUnsubscribe = (
    conn: SignalsConnection,
    cmd: SignalsClientSubscribeCommand,
  ) => {
    const connStr = stringifyConnection(conn);
    const subscriptionKey = `${cmd.pluginId}:${cmd.topic}`;
    if (!conn.subscriptions.has(subscriptionKey)) {
      return;
    }
    this.logger.info(`${connStr} unsubscribed from ${subscriptionKey}`);
    conn.subscriptions.delete(subscriptionKey);
  };
}
