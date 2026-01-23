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
import { SignalApi, SignalSubscriber } from '@backstage/plugin-signals-react';
import { JsonObject } from '@backstage/types';
import { DiscoveryApi, IdentityApi } from '@backstage/core-plugin-api';
import { v4 as uuid } from 'uuid';

type Subscription = {
  channel: string;
  callback: (message: any) => void;
};

const WS_CLOSE_NORMAL = 1000;
const WS_CLOSE_GOING_AWAY = 1001;

/** @public */
export class SignalClient implements SignalApi {
  static readonly DEFAULT_CONNECT_TIMEOUT_MS: number = 1000;
  static readonly DEFAULT_RECONNECT_TIMEOUT_MS: number = 5000;
  private wsPromise: Promise<WebSocket> | null = null;
  private subscriptions: Map<string, Subscription> = new Map();
  private readonly subscribedChannels: Set<string> = new Set();
  private messageQueue: Array<JsonObject> = [];
  private reconnectTimer: NodeJS.Timeout | null = null;

  static create(options: {
    identity: IdentityApi;
    discoveryApi: DiscoveryApi;
    connectTimeout?: number;
    reconnectTimeout?: number;
  }) {
    const {
      identity,
      discoveryApi,
      connectTimeout = SignalClient.DEFAULT_CONNECT_TIMEOUT_MS,
      reconnectTimeout = SignalClient.DEFAULT_RECONNECT_TIMEOUT_MS,
    } = options;
    return new SignalClient(
      identity,
      discoveryApi,
      connectTimeout,
      reconnectTimeout,
    );
  }

  private identity: IdentityApi;
  private discoveryApi: DiscoveryApi;
  private connectTimeout: number;
  private reconnectTimeoutMs: number;

  private constructor(
    identity: IdentityApi,
    discoveryApi: DiscoveryApi,
    connectTimeout: number,
    reconnectTimeout: number,
  ) {
    this.identity = identity;
    this.discoveryApi = discoveryApi;
    this.connectTimeout = connectTimeout;
    this.reconnectTimeoutMs = reconnectTimeout;
  }

  subscribe<TMessage extends JsonObject = JsonObject>(
    channel: string,
    onMessage: (message: TMessage) => void,
  ): SignalSubscriber {
    const subscriptionId = uuid();

    this.subscriptions.set(subscriptionId, {
      channel,
      callback: onMessage,
    });

    this.ensureConnection()
      .then(ws => {
        this.resubscribe(ws);
        this.sendQueue(ws);
      })
      .catch(() => {
        this.reconnect();
      });

    const unsubscribe = () => {
      const sub = this.subscriptions.get(subscriptionId);
      if (!sub) {
        return;
      }
      this.subscriptions.delete(subscriptionId);

      const multipleExists = [...this.subscriptions.values()].find(
        s => s.channel === channel,
      );

      if (!multipleExists) {
        this.subscribedChannels.delete(channel);

        // Send unsubscribe if we have an active connection, otherwise just forget about it
        if (this.wsPromise) {
          this.wsPromise
            .then(ws =>
              this.send(ws, { action: 'unsubscribe', channel: sub.channel }),
            )
            .catch(() => {});
        }
      }

      if (this.subscriptions.size === 0) {
        if (this.reconnectTimer) {
          clearTimeout(this.reconnectTimer);
          this.reconnectTimer = null;
        }
        if (this.wsPromise) {
          this.wsPromise.then(ws => ws.close(WS_CLOSE_NORMAL)).catch(() => {});
        }
        this.wsPromise = null;
        this.subscribedChannels.clear();
        this.messageQueue = [];
      }
    };

    return { unsubscribe };
  }

  private send(ws: WebSocket, data: JsonObject): void {
    const jsonMessage = JSON.stringify(data);
    if (jsonMessage.length === 0) {
      return;
    }

    if (ws.readyState !== WebSocket.OPEN) {
      // Queue the message for later
      this.messageQueue.push(data);
      return;
    }

    ws.send(jsonMessage);
  }

  private resubscribe(ws: WebSocket): void {
    const allChannels = new Set(
      [...this.subscriptions.values()].map(sub => sub.channel),
    );

    for (const ch of allChannels) {
      if (this.subscribedChannels.has(ch)) {
        continue;
      }
      this.subscribedChannels.add(ch);
      this.send(ws, { action: 'subscribe', channel: ch });
    }
  }

  private sendQueue(ws: WebSocket) {
    if (this.messageQueue.length === 0) {
      return;
    }

    const queuedMessages = [...this.messageQueue];
    this.messageQueue = [];

    for (const data of queuedMessages) {
      this.send(ws, data);
    }
  }

  private async ensureConnection(): Promise<WebSocket> {
    this.wsPromise ??= this.createConnection();

    try {
      const ws = await this.wsPromise;

      if (ws.readyState !== WebSocket.OPEN) {
        this.wsPromise = null;
        return this.ensureConnection();
      }

      return ws;
    } catch (error) {
      this.wsPromise = null;
      throw error;
    }
  }

  private async createConnection(): Promise<WebSocket> {
    const apiUrl = await this.discoveryApi.getBaseUrl('signals');
    const { token } = await this.identity.getCredentials();

    const url = new URL(apiUrl);
    url.protocol = url.protocol === 'http:' ? 'ws:' : 'wss:';
    const ws = new WebSocket(url.toString(), token);

    const connectionPromise = this.wsPromise;

    const startTime = Date.now();
    while (
      ws.readyState !== WebSocket.OPEN &&
      ws.readyState !== WebSocket.CLOSED &&
      Date.now() - startTime < this.connectTimeout
    ) {
      // TODO: Replace with a event based solution
      await new Promise(r => setTimeout(r, 100));
    }

    if (ws.readyState !== WebSocket.OPEN) {
      ws.close();
      throw new Error('Connect timeout');
    }

    if (this.wsPromise !== connectionPromise) {
      ws.close();
      throw new Error('Connection superseded');
    }

    ws.onmessage = (data: MessageEvent) => {
      this.handleMessage(data);
    };

    ws.onerror = () => {
      if (this.wsPromise === connectionPromise) {
        ws.close();
      }
    };

    ws.onclose = (ev: CloseEvent) => {
      if (this.wsPromise === connectionPromise) {
        this.wsPromise = null;
        this.subscribedChannels.clear();
        if (ev.code !== WS_CLOSE_NORMAL && ev.code !== WS_CLOSE_GOING_AWAY) {
          this.reconnect();
        }
      }
    };

    return ws;
  }

  private handleMessage(data: MessageEvent) {
    try {
      const json = JSON.parse(data.data);
      if (!json.channel) {
        return;
      }

      for (const sub of this.subscriptions.values()) {
        if (sub.channel === json.channel) {
          sub.callback(json.message);
        }
      }
    } catch (e) {
      // NOOP
    }
  }

  private reconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
    if (this.subscriptions.size === 0) {
      return;
    }

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      if (this.subscriptions.size === 0) {
        return;
      }

      // Close any existing connection if we have one
      if (this.wsPromise) {
        this.wsPromise.then(ws => ws.close(WS_CLOSE_NORMAL)).catch(() => {});
        this.wsPromise = null;
      }

      this.subscribedChannels.clear();

      this.ensureConnection()
        .then(ws => {
          this.resubscribe(ws);
          this.sendQueue(ws);
        })
        .catch(() => {
          this.reconnect();
        });
    }, this.reconnectTimeoutMs);
  }
}
