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
import { ConfigApi, IdentityApi, SignalsApi } from '@backstage/core-plugin-api';

type SignalsSubscription = {
  pluginId: string;
  topic?: string;
  onMessage: (data: any) => void;
};

export type SignalsMessage = {
  pluginId: string;
  topic?: string;
  targetEntityRefs?: string[];
  data: unknown;
};

/**
 * An default implementation of the signals API
 *
 * @public
 */
export class SignalsClient implements SignalsApi {
  private endpoint: string;
  private ws?: Socket;
  private signalsEnabled: boolean;
  private subscriptions: Map<string, SignalsSubscription>;
  private readonly messageQueue: Set<{ channel: string; message: any }>;
  private readonly identity: IdentityApi;

  static create(options: { configApi: ConfigApi; identityApi: IdentityApi }) {
    const { configApi, identityApi } = options;
    return new SignalsClient(configApi, identityApi);
  }

  private constructor(config: ConfigApi, identity: IdentityApi) {
    this.subscriptions = new Map();
    this.messageQueue = new Set();
    this.signalsEnabled = false;
    this.endpoint = '';
    this.identity = identity;
    this.readConfig(config);
  }

  private readConfig(config: ConfigApi) {
    const baseUrl =
      config.getOptionalString('backend.baseUrl') ?? 'http://localhost/';
    const ws = config.getOptional('backend.signals');
    if (ws === true) {
      this.signalsEnabled = true;
      this.endpoint = baseUrl;
      return;
    }

    this.signalsEnabled =
      config.getOptionalBoolean('backend.signals.enabled') ?? false;
    this.endpoint =
      config.getOptionalString('backend.signals.endpoint') ?? baseUrl;
  }

  private async connect() {
    const url = new URL(this.endpoint);
    const { token } = await this.identity.getCredentials();

    if (!this.ws) {
      this.ws = io(url.toString(), {
        path: '/signals',
        auth: { token: token },
        multiplex: true,
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
  }

  private async send(channel: string, message: any) {
    if (!this.ws) {
      await this.connect();
      this.messageQueue.add({ channel, message });
      return;
    }

    try {
      this.ws.emit(channel, message);
    } catch (_e) {
      this.messageQueue.add({ channel, message });
    }
  }

  async subscribe(
    pluginId: string,
    onMessage: (data: unknown) => void,
    topic?: string,
  ) {
    if (!this.signalsEnabled) {
      return;
    }

    const subscriptionKey = `${pluginId}:${topic}`;
    if (this.subscriptions.has(subscriptionKey)) {
      return;
    }

    this.subscriptions.set(subscriptionKey, { pluginId, onMessage, topic });
    await this.send('subscribe', { pluginId, topic });
  }

  async unsubscribe(pluginId: string, topic?: string) {
    if (!this.signalsEnabled) {
      return;
    }

    const subscriptionKey = `${pluginId}:${topic}`;
    if (!this.subscriptions.has(subscriptionKey)) {
      return;
    }

    this.subscriptions.delete(subscriptionKey);
    await this.send('unsubscribe', { pluginId, topic });
  }
}
