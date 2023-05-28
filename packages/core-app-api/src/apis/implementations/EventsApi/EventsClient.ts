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

import { JsonValue } from '@backstage/types';
import { ConfigApi, IdentityApi, EventsApi } from '@backstage/core-plugin-api';

type EventsSubscription = {
  pluginId: string;
  topic?: string;
  onMessage: (data: JsonValue) => void;
};

/**
 * An default implementation of the events API
 *
 * @public
 */
export class EventsClient implements EventsApi {
  private endpoint: string;
  private ws: WebSocket | null;
  private eventsEnabled: boolean;
  private subscriptions: Map<string, EventsSubscription>;
  private readonly messageQueue: Set<string>;
  private readonly identity: IdentityApi;

  static create(options: { configApi: ConfigApi; identityApi: IdentityApi }) {
    const { configApi, identityApi } = options;
    return new EventsClient(configApi, identityApi);
  }

  private constructor(config: ConfigApi, identity: IdentityApi) {
    this.ws = null;
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
    if (this.ws) {
      return;
    }

    const url = new URL(this.endpoint);
    url.pathname = '/events';

    const { token } = await this.identity.getCredentials();
    if (token) {
      // WebSocket does not support setting custom headers for the Upgrade request
      // thus setting the token in query parameter as described in
      // https://www.rfc-editor.org/rfc/rfc6750#section-2.3
      url.searchParams.set('access_token', token);
    }

    this.ws = new WebSocket(url.toString());
    this.ws.onopen = () => {
      for (const msg of this.messageQueue) {
        this.send(msg);
      }
      this.messageQueue.clear();
    };

    this.ws.onerror = () => {
      this.subscriptions.clear();
      this.ws = null;
    };

    this.ws.onmessage = (data: MessageEvent) => {
      if (!data.data || !this.ws) {
        return;
      }

      if (data.data === 'ping') {
        this.ws.send('pong');
        return;
      }

      try {
        const msg = JSON.parse(data.data.toString());
        for (const subscription of this.subscriptions.values()) {
          if (
            subscription.pluginId === msg.pluginId &&
            (!msg.topic || subscription.topic === msg.topic)
          ) {
            subscription.onMessage(msg.data);
          }
        }
      } catch (_e) {
        // NOOP
      }
    };

    this.ws.onclose = () => {
      this.ws = null;
    };
  }

  private async disconnect() {
    if (!this.ws) {
      return;
    }

    this.ws.close();
    this.subscriptions.clear();
    this.ws = null;
  }

  private async send(msg: string) {
    if (!this.ws) {
      await this.connect();
      this.messageQueue.add(msg);
      return;
    }

    try {
      this.ws.send(msg);
    } catch (_e) {
      this.messageQueue.add(msg);
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
    const cmd = JSON.stringify({ command: 'subscribe', pluginId, topic });
    await this.send(cmd);
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
    const cmd = JSON.stringify({ command: 'unsubscribe', pluginId, topic });
    await this.send(cmd);

    if (this.subscriptions.size === 0) {
      await this.disconnect();
    }
  }
}
