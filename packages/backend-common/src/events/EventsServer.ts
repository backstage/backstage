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

import { Server, WebSocket, RawData } from 'ws';
import jwt_decode from 'jwt-decode';
import { LoggerService } from '@backstage/backend-plugin-api';
import { EventClientCommand } from './types';
import { IncomingMessage } from 'http';
import { JWTPayload } from 'jose';

type EventsServerSubscription = {
  pluginId: string;
  topic?: string;
};

type EventsServerConnectionType = 'frontend' | 'backend';

type EventsServerConnection = {
  ws: WebSocket;
  isAlive: boolean;
  type: EventsServerConnectionType;
  ip?: string;
  sub?: string;
  entityRefs: string[];
  subscriptions: Map<string, EventsServerSubscription>;
  pluginId?: string;
  topic?: string;
};

const stringifyConnection = (conn: EventsServerConnection) => {
  return `(type: ${conn.type}, sub: ${conn.sub}, plugin: ${conn.pluginId}, ip: ${conn.ip})`;
};

/**
 * Implements a Events Manager which will take care of connections and distributing
 * messages to the connected clients.
 *
 * @private
 */
export class EventsServer {
  private readonly logger: LoggerService;
  private readonly connections: EventsServerConnection[];
  private heartbeatInterval: ReturnType<typeof setInterval> | null;

  static create(server: Server, logger: LoggerService): EventsServer {
    return new EventsServer(server, logger);
  }

  private constructor(server: Server, logger: LoggerService) {
    this.logger = logger;
    this.heartbeatInterval = null;
    this.connections = [];

    server.on('connection', this.handleConnection);
    server.on('close', () => {
      if (this.heartbeatInterval) {
        clearInterval(this.heartbeatInterval);
        this.heartbeatInterval = null;
      }
    });
  }

  private startHeartbeat = () => {
    if (this.heartbeatInterval) {
      return;
    }
    this.heartbeatInterval = setInterval(() => {
      // If all connections are closed, stop the heartbeat
      if (this.connections.length === 0) {
        if (this.heartbeatInterval) {
          clearInterval(this.heartbeatInterval);
        }
        this.heartbeatInterval = null;
        return;
      }

      for (let i = 0; i < this.connections.length; i++) {
        const conn = this.connections[i];
        // Missed two heartbeats, close and clean the connection
        if (!conn.isAlive) {
          this.closeConnection(conn);
          return;
        }
        conn.isAlive = false;
        conn.ws.ping();
      }
    }, 30000);
  };

  private closeConnection = (conn: EventsServerConnection) => {
    const idx = this.connections.findIndex(c => c === conn);
    if (idx >= 0) {
      this.logger.info(`Closing connection ${stringifyConnection(conn)}`);
      conn.ws.close();
      this.connections.splice(idx, 1);
    }
  };

  private parseConnectionRequest = (req: IncomingMessage) => {
    const ip =
      req.socket.remoteAddress ??
      req.headers?.['x-forwarded-for']?.toString().split(',')[0].trim();
    const url = new URL(req.url ?? '', `https://${req.headers.host}`);
    let token = undefined;

    if (url.searchParams.has('access_token')) {
      token = url.searchParams.get('access_token');
    }

    if (typeof req.headers.authorization === 'string') {
      const matches = req.headers.authorization.match(/^Bearer[ ]+(\S+)$/i);
      token = matches?.[1];
    }

    let type: EventsServerConnectionType = 'frontend';
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

  private handleConnection = (ws: WebSocket, req: IncomingMessage) => {
    let ip;
    let type;
    let entities;
    let sub;

    try {
      ({ ip, type, entities, sub } = this.parseConnectionRequest(req));
    } catch (e) {
      this.logger.error(`Failed to authenticate connection: ${e}`);
      ws.close();
      return;
    }

    this.startHeartbeat();

    const conn: EventsServerConnection = {
      ws,
      isAlive: true,
      sub,
      entityRefs: entities,
      ip,
      type,
      subscriptions: new Map(),
    };

    this.connections.push(conn);

    conn.ws.on('pong', () => {
      conn.isAlive = true;
    });

    conn.ws.on('message', (data: RawData) => {
      this.handleMessage(conn, data.toString());
    });

    conn.ws.on('close', () => {
      this.closeConnection(conn);
    });

    conn.ws.on('error', (err: Error) => {
      this.logger.error(`Events error occurred: ${err}`);
    });
  };

  private handleMessage = (conn: EventsServerConnection, data: string) => {
    const connStr = stringifyConnection(conn);
    try {
      const cmd = JSON.parse(data) as EventClientCommand;
      if (cmd.command === 'register') {
        if (conn.type !== 'backend') {
          this.logger.warn(`Invalid events register request from ${connStr}`);
          return;
        }

        conn.pluginId = cmd.pluginId;
        this.logger.info(
          `Plugin '${cmd.pluginId}' registered to events server ${connStr}`,
        );
      } else if (cmd.command === 'publish') {
        if (!conn.pluginId || conn.type !== 'backend') {
          this.logger.warn(`Invalid events publish request from ${connStr}`);
          return;
        }

        for (const c of this.connections) {
          if (c.ws === conn.ws) {
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
            `${connStr} sent message to ${stringifyConnection(c)}`,
          );
          c.ws.send(JSON.stringify(cmd));
        }
      } else if (cmd.command === 'subscribe') {
        const subscriptionKey = `${cmd.pluginId}:${cmd.topic}`;
        if (conn.subscriptions.has(subscriptionKey)) {
          return;
        }
        this.logger.info(`${connStr} subscribed to ${subscriptionKey}`);
        conn.subscriptions.set(subscriptionKey, {
          pluginId: cmd.pluginId,
          topic: cmd.topic,
        });
      } else if (cmd.command === 'unsubscribe') {
        const subscriptionKey = `${cmd.pluginId}:${cmd.topic}`;
        if (conn.subscriptions.has(subscriptionKey)) {
          return;
        }
        this.logger.info(`${connStr} unsubscribed from ${subscriptionKey}`);
        conn.subscriptions.delete(subscriptionKey);
      }
    } catch (e) {
      this.logger.error(
        `Invalid events message received from ${connStr}: ${data}: ${e}`,
      );
    }
  };
}
