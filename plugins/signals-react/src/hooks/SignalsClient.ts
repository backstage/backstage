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
import { io, Socket } from 'socket.io-client';
import { DiscoveryApi, IdentityApi } from '@backstage/core-plugin-api';
import * as uuid from 'uuid';
import { UseSignalsOptions } from './types';

type SignalsSubscription = {
  pluginId: string;
  topic?: string;
  onMessage: (data: any) => void;
};

export type SignalsMessage = {
  pluginId: string;
  topic?: string;
  data: unknown;
};

/**
 * Signals client for frontend plugins.
 *
 * @private
 */
export class SignalsClient {
  private ws?: Socket;
  private subscriptions: Map<string, SignalsSubscription>;
  private readonly messageQueue: Set<{ channel: string; message: any }>;
  private readonly identity: IdentityApi;
  private readonly discovery: DiscoveryApi;

  static create(options: {
    identityApi: IdentityApi;
    discoveryApi: DiscoveryApi;
  }) {
    const { identityApi, discoveryApi } = options;
    return new SignalsClient(identityApi, discoveryApi);
  }

  private constructor(identity: IdentityApi, discoveryApi: DiscoveryApi) {
    this.subscriptions = new Map();
    this.messageQueue = new Set();
    this.identity = identity;
    this.discovery = discoveryApi;
  }

  private async connect() {
    const endpoint = new URL(await this.discovery.getBaseUrl('signals'));
    const { token } = await this.identity.getCredentials();

    if (!this.ws) {
      this.ws = io(endpoint.origin, {
        path: '/signals',
        auth: { token: token },
      });
    } else if (!this.ws.connected) {
      this.ws.connect();
    }

    this.ws.on('connect', () => {
      for (const msg of this.messageQueue) {
        this.send(msg.channel, msg.message);
      }
      this.messageQueue.clear();
    });

    this.ws.on('message', (msg: SignalsMessage) => {
      for (const subscription of this.subscriptions.values()) {
        if (
          subscription.pluginId === msg.pluginId &&
          (!msg.topic || subscription.topic === msg.topic)
        ) {
          try {
            subscription.onMessage(msg.data);
          } catch (_) {
            // ignore callback errors
          }
        }
      }
    });

    this.ws.on('reconnect', () => {
      for (const subscription of this.subscriptions.values()) {
        this.send('subscribe', {
          pluginId: subscription.pluginId,
          topic: subscription.topic,
        });
      }
    });
  }

  private async send(channel: string, message: any) {
    if (!this.ws) {
      this.messageQueue.add({ channel, message });
      await this.connect();
      return;
    }

    try {
      this.ws.emit(channel, message);
    } catch (_e) {
      this.messageQueue.add({ channel, message });
    }
  }

  async subscribe(options: UseSignalsOptions) {
    const { pluginId, onMessage, topic } = options;
    const subscriptionKey = uuid.v4();
    this.subscriptions.set(subscriptionKey, {
      pluginId,
      onMessage,
      topic,
    });
    await this.send('subscribe', { pluginId, topic });
    return subscriptionKey;
  }

  async unsubscribe(subscriptionKey: string) {
    const sub = this.subscriptions.get(subscriptionKey);
    if (sub) {
      await this.send('unsubscribe', {
        pluginId: sub?.pluginId,
        topic: sub?.topic,
      });
      this.subscriptions.delete(subscriptionKey);
    }
  }
}
