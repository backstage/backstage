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
import { ConfigApi, IdentityApi, EventsApi } from '@backstage/core-plugin-api';

type EventsSubscription = {
  pluginId: string;
  topic?: string;
  onMessage: (data: any) => void;
};

export type EventsMessage = {
  pluginId: string;
  topic?: string;
  targetEntityRefs?: string[];
  data: unknown;
};

/**
 * An default implementation of the events API
 *
 * @public
 */
export class EventsClient implements EventsApi {
  connected: boolean = false;
  private endpoint: string;
  private ws?: Socket;
  private eventsEnabled: boolean;
  private subscriptions: Map<string, EventsSubscription>;
  private readonly messageQueue: Set<{ channel: string; message: any }>;
  private readonly identity: IdentityApi;

  static create(options: { configApi: ConfigApi; identityApi: IdentityApi }) {
    const { configApi, identityApi } = options;
    return new EventsClient(configApi, identityApi);
  }

  private constructor(config: ConfigApi, identity: IdentityApi) {
    this.subscriptions = new Map();
    this.messageQueue = new Set();
    this.eventsEnabled = false;
    this.endpoint = '';
    this.identity = identity;
    this.readConfig(config);
  }

  private readConfig(config: ConfigApi) {
    const baseUrl =
      config.getOptionalString('backend.baseUrl') ?? 'http://localhost/';
    const ws = config.getOptional('backend.events');
    if (ws === true) {
      this.eventsEnabled = true;
      const url = new URL(baseUrl);
      const https = config.getOptional('backend.https');
      url.protocol = https ? 'wss' : 'ws';
      this.endpoint = url.toString();
      return;
    }

    const eventsConfig = config.getOptionalConfig('backend.events');
    if (eventsConfig) {
      this.eventsEnabled = eventsConfig.getOptionalBoolean('enabled') || false;
      this.endpoint = eventsConfig.getOptionalString('endpoint') ?? baseUrl;
    }
  }

  private async connect() {
    const url = new URL(this.endpoint);
    const { token } = await this.identity.getCredentials();

    if (!this.ws) {
      this.ws = io(url.toString(), {
        path: '/events',
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

    this.ws.on('message', (msg: EventsMessage) => {
      for (const subscription of this.subscriptions.values()) {
        if (
          subscription.pluginId === msg.pluginId &&
          (!msg.topic || subscription.topic === msg.topic)
        ) {
          try {
            subscription.onMessage(msg.data);
          } catch (_) {
            // ignore
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
    if (!this.eventsEnabled) {
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
    if (!this.eventsEnabled) {
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
