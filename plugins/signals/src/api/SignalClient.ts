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
  private ws: WebSocket | null = null;
  private connecting?: Promise<boolean>;
  private connectionGeneration = 0;
  private subscriptions: Map<string, Subscription> = new Map();
  private subscribedChannels = new Set<string>();
  private reconnectTo: ReturnType<typeof setTimeout> | undefined;

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
  private reconnectTimeout: number;

  private constructor(
    identity: IdentityApi,
    discoveryApi: DiscoveryApi,
    connectTimeout: number,
    reconnectTimeout: number,
  ) {
    this.identity = identity;
    this.discoveryApi = discoveryApi;
    this.connectTimeout = connectTimeout;
    this.reconnectTimeout = reconnectTimeout;
  }

  subscribe<TMessage extends JsonObject = JsonObject>(
    channel: string,
    onMessage: (message: TMessage) => void,
  ): SignalSubscriber {
    const subscriptionId = globalThis.crypto.randomUUID();
    this.subscriptions.set(subscriptionId, {
      channel,
      callback: onMessage,
    });

    this.connect()
      .then(connected => {
        if (connected) {
          this.syncSubscriptions();
        }
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
      this.syncSubscriptions();

      // If there are no subscriptions, close the connection
      if (this.subscriptions.size === 0) {
        if (this.reconnectTo) {
          clearTimeout(this.reconnectTo);
          this.reconnectTo = undefined;
        }
        this.connectionGeneration += 1;
        this.connecting = undefined;
        const ws = this.ws;
        this.ws = null;
        ws?.close(WS_CLOSE_NORMAL);
        this.subscribedChannels.clear();
      }
    };

    return { unsubscribe };
  }

  private syncSubscriptions(): void {
    if (this.ws?.readyState !== WebSocket.OPEN) {
      return;
    }

    const desiredChannels = new Set(
      [...this.subscriptions.values()].map(sub => sub.channel),
    );
    for (const channel of this.subscribedChannels) {
      if (!desiredChannels.has(channel)) {
        this.ws.send(JSON.stringify({ action: 'unsubscribe', channel }));
        this.subscribedChannels.delete(channel);
      }
    }
    for (const channel of desiredChannels) {
      if (!this.subscribedChannels.has(channel)) {
        this.ws.send(JSON.stringify({ action: 'subscribe', channel }));
        this.subscribedChannels.add(channel);
      }
    }
  }

  private connect(): Promise<boolean> {
    if (this.connecting) {
      return this.connecting;
    }
    if (this.ws?.readyState === WebSocket.OPEN) {
      return Promise.resolve(true);
    }

    const generation = ++this.connectionGeneration;
    this.connecting = this.openConnection(generation)
      .catch(error => {
        if (generation !== this.connectionGeneration) {
          return false;
        }
        throw error;
      })
      .finally(() => {
        if (generation === this.connectionGeneration) {
          this.connecting = undefined;
        }
      });
    return this.connecting;
  }

  private async openConnection(generation: number): Promise<boolean> {
    const { token } = await this.identity.getCredentials();
    if (!token || generation !== this.connectionGeneration) {
      return false;
    }

    const apiUrl = await this.discoveryApi.getBaseUrl('signals');
    if (generation !== this.connectionGeneration) {
      return false;
    }

    const url = new URL(apiUrl);
    url.protocol = url.protocol === 'http:' ? 'ws:' : 'wss:';
    const ws = new WebSocket(url.toString(), token);
    this.ws = ws;
    this.subscribedChannels.clear();
    ws.onopen = () => {
      if (this.ws !== ws || this.subscriptions.size === 0) {
        ws.close(WS_CLOSE_NORMAL);
      }
    };

    // Wait until connection is open
    let connectSleep = 0;
    while (
      this.ws === ws &&
      ws.readyState === WebSocket.CONNECTING &&
      connectSleep < this.connectTimeout
    ) {
      await new Promise(r => setTimeout(r, 100));
      connectSleep += 100;
    }

    if (this.ws !== ws || ws.readyState !== WebSocket.OPEN) {
      ws.close(WS_CLOSE_NORMAL);
      if (this.ws === ws) {
        this.ws = null;
      }
      if (generation !== this.connectionGeneration) {
        return false;
      }
      throw new Error('Connect timeout');
    }

    ws.onmessage = (data: MessageEvent) => {
      this.handleMessage(data);
    };

    ws.onerror = () => {
      if (this.ws !== ws) {
        return;
      }
      ws.close();
      this.ws = null;
      this.subscribedChannels.clear();
      this.reconnect();
    };

    ws.onclose = (ev: CloseEvent) => {
      if (this.ws !== ws) {
        return;
      }
      this.ws = null;
      this.subscribedChannels.clear();
      if (ev.code !== WS_CLOSE_NORMAL && ev.code !== WS_CLOSE_GOING_AWAY) {
        this.reconnect();
      }
    };

    return true;
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
    if (this.reconnectTo || this.subscriptions.size === 0) {
      return;
    }

    this.reconnectTo = setTimeout(() => {
      this.reconnectTo = undefined;
      if (this.subscriptions.size === 0) {
        return;
      }
      this.connect()
        .then(connected => {
          if (connected) {
            this.syncSubscriptions();
          }
        })
        .catch(() => {
          this.reconnect();
        });
    }, this.reconnectTimeout);
  }
}
