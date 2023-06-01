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
import { LoggerService, SignalsService } from '@backstage/backend-plugin-api';
import {
  SignalsClientMessage,
  SignalsClientRegisterCommand,
  SignalsClientSubscribeCommand,
} from './types';
import { io, Socket } from 'socket.io-client';
import { TokenManager } from '../tokens';

type SignalsClientSubscription = {
  pluginId: string;
  topic?: string;
  onMessage: (data: SignalsClientMessage) => void;
};

export class DefaultSignalsClient implements SignalsService {
  private readonly pluginId: string;
  private readonly endpoint: string;
  private readonly logger: LoggerService;
  private readonly tokenManager?: TokenManager;
  private ws: Socket | null;
  private subscriptions: Map<string, SignalsClientSubscription>;
  private readonly messageQueue: Set<{ channel: string; message: any }>;

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
    this.logger.info(`${this.pluginId} connecting to signals service`);
    const url = new URL(this.endpoint);
    let token;
    if (this.tokenManager) {
      ({ token } = await this.tokenManager.getToken());
    }
    this.ws = io(url.toString(), {
      path: '/signals',
      auth: {
        token: token,
      },
    });

    this.ws.on('error', (err: Error) => {
      this.logger.error(`${this.pluginId} signals error occurred: ${err}`);
    });

    this.ws.on('connect', () => {
      // Register this plugin client to the signals server
      const cmd: SignalsClientRegisterCommand = {
        pluginId: this.pluginId,
      };
      this.send('register', cmd);

      for (const msg of this.messageQueue) {
        this.send(msg.channel, msg.message);
      }
      this.messageQueue.clear();
    });

    this.ws.on('message', (msg: SignalsClientMessage) => {
      try {
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
          `${this.pluginId} invalid data received from server: ${msg}: ${e}`,
        );
      }
    });
  }

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

  private send(channel: string, message: any) {
    if (!this.ws || !this.ws.connected) {
      this.messageQueue.add({ channel, message });
      return;
    }

    try {
      this.ws.emit(channel, message);
    } catch (_e) {
      this.messageQueue.add({ channel, message });
    }
  }

  async publish(
    message: unknown,
    target?: {
      topic?: string;
      entityRefs?: string[];
    },
  ) {
    const cmd: SignalsClientMessage = {
      pluginId: this.pluginId,
      topic: target?.topic,
      targetEntityRefs: target?.entityRefs,
      data: message,
    };
    this.logger.debug(`Publish signal from ${this.pluginId}`);
    this.send('publish', cmd);
  }

  async subscribe(
    pluginId: string,
    onMessage: (data: SignalsClientMessage) => void,
    topic?: string,
  ) {
    const subscriptionKey = `${pluginId}:${topic}`;
    if (this.subscriptions.has(subscriptionKey)) {
      return;
    }

    this.subscriptions.set(subscriptionKey, { pluginId, onMessage, topic });

    const cmd: SignalsClientSubscribeCommand = {
      pluginId,
      topic,
    };
    this.send('subscribe', cmd);
  }

  async unsubscribe(pluginId: string, topic?: string) {
    const subscriptionKey = `${pluginId}:${topic}`;
    if (!this.subscriptions.has(subscriptionKey)) {
      return;
    }

    this.subscriptions.delete(subscriptionKey);

    const cmd: SignalsClientSubscribeCommand = {
      pluginId,
      topic,
    };
    this.send('unsubscribe', cmd);
  }
}
