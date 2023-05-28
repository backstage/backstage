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
import { LoggerService, EventsService } from '@backstage/backend-plugin-api';
import {
  EventsClientPublishCommand,
  EventsClientRegisterCommand,
  EventsClientSubscribeCommand,
} from './types';
import { RawData, WebSocket } from 'ws';
import { TokenManager } from '../tokens';

type EventsClientSubscription = {
  pluginId: string;
  topic?: string;
  onMessage: (data: unknown) => void;
};

const MAX_CONNECTION_RETRYS = 5;
const CONNECTION_RETRY_INTERVAL = 5000;

export class DefaultEventsClient implements EventsService {
  private readonly pluginId: string;
  private readonly endpoint: string;
  private readonly logger: LoggerService;
  private readonly tokenManager?: TokenManager;
  private ws: WebSocket | null;
  private subscriptions: Map<string, EventsClientSubscription>;
  private connectionRetries = 0;
  private readonly messageQueue: Set<string>;

  constructor(
    endpoint: string,
    pluginId: string,
    logger: LoggerService,
    tokenManager?: TokenManager,
  ) {
    this.endpoint = endpoint;
    this.pluginId = pluginId;
    this.logger = logger;
    this.tokenManager = tokenManager;
    this.ws = null;
    this.subscriptions = new Map();
    this.messageQueue = new Set();
  }

  async connect() {
    if (this.ws) {
      return;
    }
    this.logger.info(`${this.pluginId} connecting to events service`);
    this.connectionRetries = 0;
    await this.connectInternal();
  }

  private readonly connectInternal = async () => {
    const url = new URL(this.endpoint);
    url.pathname = '/events';
    let token;
    if (this.tokenManager) {
      ({ token } = await this.tokenManager.getToken());
    }
    this.ws = new WebSocket(url.toString(), {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    this.ws.on('error', (err: Error) => {
      this.ws?.close();
      this.ws = null;
      this.connectionRetries += 1;
      if (this.connectionRetries < MAX_CONNECTION_RETRYS) {
        setTimeout(this.connectInternal, CONNECTION_RETRY_INTERVAL);
        return;
      }
      this.subscriptions.clear();
      this.logger.error(`${this.pluginId} events error occurred: ${err}`);
    });

    this.ws.on('open', () => {
      if (!this.ws) {
        return;
      }
      this.connectionRetries = 0;
      // Register this plugin client to the events server
      const cmd: EventsClientRegisterCommand = {
        command: 'register',
        pluginId: this.pluginId,
      };
      this.send(JSON.stringify(cmd));

      for (const msg of this.messageQueue) {
        this.send(msg);
      }
      this.messageQueue.clear();
    });

    this.ws.on('message', (data: RawData) => {
      try {
        const msg = JSON.parse(data.toString()) as EventsClientPublishCommand;
        for (const subscription of this.subscriptions.values()) {
          if (
            subscription.pluginId === msg.pluginId &&
            (!msg.topic || subscription.topic === msg.topic)
          ) {
            subscription.onMessage(msg.data);
          }
        }
      } catch (e) {
        this.logger.error(
          `${this.pluginId} invalid data received from server: ${data}: ${e}`,
        );
      }
    });
  };

  async disconnect() {
    for (const subscription of this.subscriptions.values()) {
      await this.unsubscribe(subscription.pluginId, subscription.topic);
    }
    this.subscriptions.clear();
    this.messageQueue.clear();
    if (this.ws) {
      this.ws.close();
    }
    this.ws = null;
  }

  private send(msg: string) {
    if (!this.ws) {
      this.messageQueue.add(msg);
      return;
    }

    try {
      this.ws.send(msg);
    } catch (_e) {
      this.messageQueue.add(msg);
    }
  }

  async publish(
    message: unknown,
    target?: {
      topic?: string;
      entityRefs?: string[];
    },
  ) {
    const cmd: EventsClientPublishCommand = {
      command: 'publish',
      pluginId: this.pluginId,
      topic: target?.topic,
      targetEntityRefs: target?.entityRefs,
      data: message,
    };
    this.logger.info(`Publish event from ${this.pluginId}`);
    this.send(JSON.stringify(cmd));
  }

  async subscribe(
    pluginId: string,
    onMessage: (data: unknown) => void,
    topic?: string,
  ) {
    const subscriptionKey = `${pluginId}:${topic}`;
    if (this.subscriptions.has(subscriptionKey)) {
      return;
    }

    this.subscriptions.set(subscriptionKey, { pluginId, onMessage, topic });

    const cmd: EventsClientSubscribeCommand = {
      command: 'subscribe',
      pluginId,
      topic,
    };
    this.send(JSON.stringify(cmd));
  }

  async unsubscribe(pluginId: string, topic?: string) {
    const subscriptionKey = `${pluginId}:${topic}`;
    if (!this.subscriptions.has(subscriptionKey)) {
      return;
    }

    this.subscriptions.delete(subscriptionKey);

    const cmd: EventsClientSubscribeCommand = {
      command: 'unsubscribe',
      pluginId,
      topic,
    };
    this.send(JSON.stringify(cmd));
  }
}
