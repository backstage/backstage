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
import { SignalsApi } from '@backstage/plugin-signals-react';
import { JsonObject } from '@backstage/types';
import { DiscoveryApi } from '@backstage/core-plugin-api';

/** @public */
export class SignalsClient implements SignalsApi {
  static instance: SignalsClient | null = null;
  private ws: WebSocket | null = null;
  private discoveryApi: DiscoveryApi;
  private cbs: Map<string, (message: JsonObject) => void> = new Map();
  private queue: JsonObject[] = [];
  private reconnectTimeout: any;

  static create(options: { discoveryApi: DiscoveryApi }) {
    if (!SignalsClient.instance) {
      SignalsClient.instance = new SignalsClient(options);
    }
    return SignalsClient.instance;
  }

  private constructor(options: { discoveryApi: DiscoveryApi }) {
    this.discoveryApi = options.discoveryApi;
  }

  subscribe(onMessage: (message: JsonObject) => void, topic: string): void {
    // Do not allow to subscribe to same topic multiple times
    if (this.cbs.has(topic)) {
      return;
    }

    this.cbs.set(topic, onMessage);
    this.connect().then(() => {
      this.send({ action: 'subscribe', topic });
    });
  }

  unsubscribe(topic: string): void {
    this.cbs.delete(topic);
    this.send({ action: 'unsubscribe', topic });
  }

  private send(data?: JsonObject): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      if (data) {
        this.queue.push(data);
      }
      return;
    }

    // First send queue
    for (const msg of this.queue) {
      this.ws!.send(JSON.stringify(msg));
    }
    this.queue = [];
    if (data) {
      this.ws!.send(JSON.stringify(data));
    }
  }

  private async connect() {
    if (this.ws) {
      return;
    }

    const apiUrl = `${await this.discoveryApi.getBaseUrl('signals')}`;
    const url = new URL(apiUrl);
    url.protocol = url.protocol === 'http:' ? 'ws' : 'wss';
    this.ws = new WebSocket(url.toString());

    this.ws.onmessage = (data: MessageEvent) => {
      try {
        const json = JSON.parse(data.data) as JsonObject;
        if (json.topic) {
          const cb = this.cbs.get(json.topic as string);
          if (cb) {
            cb(json.message as JsonObject);
          }
        }
      } catch (e) {
        // NOOP
      }
    };

    this.ws.onerror = () => {
      this.reconnect();
    };

    this.ws.onclose = () => {
      this.reconnect();
    };

    while (this.ws.readyState !== WebSocket.OPEN) {
      await new Promise(r => setTimeout(r, 10));
    }
    this.send();
  }

  private reconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    this.reconnectTimeout = setTimeout(() => {
      if (this.ws) {
        this.ws.close();
      }
      this.ws = null;
      this.connect().then(() => {
        // Resubscribe to existing topics in case we lost connection
        for (const topic of this.cbs.keys()) {
          this.send({ action: 'subscribe', topic });
        }
      });
    }, 5000);
  }
}
