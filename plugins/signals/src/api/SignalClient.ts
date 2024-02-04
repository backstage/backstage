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
import { SignalApi } from '@backstage/plugin-signals-react';
import { JsonObject } from '@backstage/types';
import { DiscoveryApi, IdentityApi } from '@backstage/core-plugin-api';
import { v4 as uuid } from 'uuid';

type Subscription = {
  channel: string;
  callback: (message: JsonObject) => void;
};

const WS_CLOSE_NORMAL = 1000;
const WS_CLOSE_GOING_AWAY = 1001;

/** @public */
export class SignalClient implements SignalApi {
  static readonly DEFAULT_CONNECT_TIMEOUT_MS: number = 1000;
  static readonly DEFAULT_RECONNECT_TIMEOUT_MS: number = 5000;
  private ws: WebSocket | null = null;
  private subscriptions: Map<string, Subscription> = new Map();
  private messageQueue: string[] = [];
  private reconnectTo: any;

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

  private constructor(
    private identity: IdentityApi,
    private discoveryApi: DiscoveryApi,
    private connectTimeout: number,
    private reconnectTimeout: number,
  ) {}

  subscribe(
    channel: string,
    onMessage: (message: JsonObject) => void,
  ): { unsubscribe: () => void } {
    const subscriptionId = uuid();
    const exists = [...this.subscriptions.values()].find(
      sub => sub.channel === channel,
    );
    this.subscriptions.set(subscriptionId, {
      channel: channel,
      callback: onMessage,
    });

    this.connect()
      .then(() => {
        // Do not subscribe twice to same channel even there is multiple callbacks
        if (!exists) {
          this.send({ action: 'subscribe', channel });
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
      const multipleExists = [...this.subscriptions.values()].find(
        s => s.channel === channel,
      );
      // If there are subscriptions still listening to this channel, do not
      // unsubscribe from the server
      if (!multipleExists) {
        this.send({ action: 'unsubscribe', channel: sub.channel });
      }

      // If there are no subscriptions, close the connection
      if (this.subscriptions.size === 0) {
        this.ws?.close(WS_CLOSE_NORMAL);
        this.ws = null;
      }
    };

    return { unsubscribe };
  }

  private send(data?: JsonObject): void {
    const jsonMessage = JSON.stringify(data);
    if (jsonMessage.length === 0) {
      return;
    }

    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      if (data) {
        this.messageQueue.unshift(jsonMessage);
      }
      return;
    }

    // First send queue
    for (const msg of this.messageQueue) {
      this.ws!.send(msg);
    }
    this.messageQueue = [];
    if (data) {
      this.ws!.send(jsonMessage);
    }
  }

  private async connect() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return;
    }

    const apiUrl = await this.discoveryApi.getBaseUrl('signals');
    const { token } = await this.identity.getCredentials();

    const url = new URL(apiUrl);
    url.protocol = url.protocol === 'http:' ? 'ws:' : 'wss:';
    this.ws = new WebSocket(url.toString(), token);

    // Wait until connection is open
    let connectSleep = 0;
    while (
      this.ws &&
      this.ws.readyState !== WebSocket.OPEN &&
      connectSleep < this.connectTimeout
    ) {
      await new Promise(r => setTimeout(r, 100));
      connectSleep += 100;
    }

    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('Connect timeout');
    }

    this.ws.onmessage = (data: MessageEvent) => {
      this.handleMessage(data);
    };

    this.ws.onerror = () => {
      this.reconnect();
    };

    this.ws.onclose = (ev: CloseEvent) => {
      if (ev.code !== WS_CLOSE_NORMAL && ev.code !== WS_CLOSE_GOING_AWAY) {
        this.reconnect();
      }
    };
  }

  private handleMessage(data: MessageEvent) {
    try {
      const json = JSON.parse(data.data) as JsonObject;
      if (json.channel) {
        for (const sub of this.subscriptions.values()) {
          if (sub.channel === json.channel) {
            sub.callback(json.message as JsonObject);
          }
        }
      }
    } catch (e) {
      // NOOP
    }
  }

  private reconnect() {
    if (this.reconnectTo) {
      clearTimeout(this.reconnectTo);
    }

    this.reconnectTo = setTimeout(() => {
      this.reconnectTo = null;
      if (this.ws) {
        this.ws.close();
      }
      this.ws = null;
      this.connect()
        .then(() => {
          // Resubscribe to existing channels in case we lost connection
          for (const sub of this.subscriptions.values()) {
            this.send({ action: 'subscribe', channel: sub.channel });
          }
        })
        .catch(() => {
          this.reconnect();
        });
    }, this.reconnectTimeout);
  }
}
