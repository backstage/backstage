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
import * as uuid from 'uuid';
import { Handshake } from 'socket.io/dist/socket';
import { Emitter } from '@socket.io/postgres-emitter';

type SignalsSubscription = {
  pluginId: string;
  topic?: string;
};

type SignalsBaseConnection = {
  ws: Socket;
  ip?: string;
  sub?: string;
};

type SignalsFrontendConnection = {
  type: 'frontend';
  entityRefs: string[];
  subscriptions: Map<string, SignalsSubscription>;
} & SignalsBaseConnection;

type SignalsBackendConnection = {
  type: 'backend';
  pluginId?: string;
} & SignalsBaseConnection;

type SignalsConnection = SignalsFrontendConnection | SignalsBackendConnection;

type SignalsSyncMessage = {
  uid: string;
  message: SignalsClientMessage;
};

const stringifyConnection = (conn: SignalsConnection) => {
  return `(id: ${conn.ws.id}, type: ${conn.type}, sub: ${conn.sub}, ip: ${conn.ip})`;
};

/**
 * Implements a signals broker which will take care of connections and distributing
 * messages to the connected clients.
 *
 * @private
 */
export class SignalsBroker {
  private readonly uid: string;
  private readonly server: Server;
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
    this.uid = uuid.v4();
    this.server = server;
    this.logger = logger;
    this.connections = new Map();
    this.emitter = emitter;

    this.server.on('connection', this.handleConnection);
    this.server.on('close', () => {
      for (const conn of this.connections.values()) {
        conn.ws.disconnect();
      }
      this.connections.clear();
    });

    if (this.emitter) {
      // This handles publish messages from other backend instances
      this.server.on('broker:publish', (cmd: SignalsSyncMessage) => {
        // Skip own instance messages as those are already sent to the clients
        if (cmd.uid === this.uid) {
          this.logger.debug('Received sync message from self, rejecting');
          return;
        }

        this.logger.debug(
          `Received sync message from broker ${cmd.uid}, sending!`,
        );
        this.publishToClients(cmd.message, cmd.uid);
      });
    }
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

    let type = 'frontend';
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
    let conn: SignalsConnection;
    if (type === 'backend') {
      conn = { ws, sub, ip } as SignalsBackendConnection;
    } else {
      conn = {
        ws,
        sub,
        ip,
        type,
        entityRefs: entities,
        subscriptions: new Map(),
      } as SignalsFrontendConnection;
    }

    this.connections.set(ws.id, conn);
    this.logger.info(`New connection from ${stringifyConnection(conn)}`);

    conn.ws.on('register', (data: SignalsClientRegisterCommand) => {
      this.handleRegister(conn, data);
    });
    conn.ws.on('publish', (data: SignalsClientMessage) => {
      this.handlePublish(conn, data);
    });
    conn.ws.on('subscribe', (data: SignalsClientSubscribeCommand) => {
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
    if (conn.type !== 'backend' || !conn.pluginId) {
      this.logger.warn(`Invalid signals publish request from ${connStr}`);
      return;
    }

    // Emit the message to all other backends
    if (this.emitter) {
      const sync: SignalsSyncMessage = { uid: this.uid, message: cmd };
      this.emitter.serverSideEmit('broker:publish', sync);
    }

    this.publishToClients(cmd, this.uid);
  };

  private publishToClients = (cmd: SignalsClientMessage, brokerUid: string) => {
    // We don't want to leak the receivers to the frontends
    const msg = { ...cmd, targetEntityRefs: undefined };

    for (const c of this.connections.values()) {
      // Backend subscriptions are disabled
      if (c.type !== 'frontend') {
        continue;
      }
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

      this.logger.debug(
        `Publishing message to ${stringifyConnection(
          c,
        )} initiated by broker ${brokerUid}, this broker is ${this.uid}`,
      );

      c.ws.emit('message', msg);
    }
  };

  private getSubscriptionKey = (cmd: SignalsClientSubscribeCommand) => {
    return cmd.topic ? `${cmd.pluginId}:${cmd.topic}` : cmd.pluginId;
  };

  private handleSubscribe = (
    conn: SignalsConnection,
    cmd: SignalsClientSubscribeCommand,
  ) => {
    // Backend subscriptions are disabled for now
    if (conn.type !== 'frontend') {
      return;
    }
    const connStr = stringifyConnection(conn);
    const subscriptionKey = this.getSubscriptionKey(cmd);
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
    // Backend subscriptions are disabled for now
    if (conn.type !== 'frontend') {
      return;
    }
    const connStr = stringifyConnection(conn);
    const subscriptionKey = this.getSubscriptionKey(cmd);
    if (!conn.subscriptions.has(subscriptionKey)) {
      return;
    }
    this.logger.info(`${connStr} unsubscribed from ${subscriptionKey}`);
    conn.subscriptions.delete(subscriptionKey);
  };
}
