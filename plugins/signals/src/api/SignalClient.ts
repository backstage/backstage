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
const WS_CLOSE_INTENTIONALLY = 3000;

/**
 * A client for the signal API.
 *
 * @public
 */
export class SignalClient implements SignalApi {
  static readonly DEFAULT_CONNECT_TIMEOUT_MS: number = 1000;
  static readonly DEFAULT_RECONNECT_TIMEOUT_MS: number = 5000;
  private connectionPromise: Promise<WebSocket> | undefined = undefined;
  private subscriptions: Map<string, Subscription> = new Map();

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
    const subscriptionId = uuid();

    this.ensureConnection().then(socket => {
      const shouldSubscribe = ![...this.subscriptions.values()].some(
        sub => sub.channel === channel,
      );
      this.subscriptions.set(subscriptionId, {
        channel,
        callback: onMessage,
      });
      if (shouldSubscribe) {
        socket.send(JSON.stringify({ action: 'subscribe', channel }));
      }
    });

    const unsubscribe = () => {
      if (!this.subscriptions.delete(subscriptionId)) {
        return;
      }
      const shouldUnsubscribe = ![...this.subscriptions.values()].some(
        sub => sub.channel === channel,
      );

      const promise = this.connectionPromise;
      promise
        ?.then(socket => {
          if (promise !== this.connectionPromise) {
            return;
          }

          if (shouldUnsubscribe) {
            try {
              socket.send(JSON.stringify({ action: 'unsubscribe', channel }));
            } catch {
              // intentionally ignored
            }
          }

          if (this.subscriptions.size === 0) {
            this.connectionPromise = undefined;
            socket.close(WS_CLOSE_INTENTIONALLY);
          }
        })
        .catch(() => {});
    };

    return { unsubscribe };
  }

  /**
   * Makes sure that there is a connection in a good OPEN state. Never throws.
   */
  private async ensureConnection(): Promise<WebSocket> {
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    const connectionPromise = (async () => {
      const socket = await this.createWebSocket();

      socket.addEventListener('error', () => {
        this.reconnect();
      });

      socket.addEventListener('close', event => {
        if (event.code !== WS_CLOSE_INTENTIONALLY) {
          this.reconnect();
        }
      });

      return socket;
    })();

    this.connectionPromise = connectionPromise;
    return await connectionPromise;
  }

  /**
   * Throws away the current connection to the signal server (if any) and
   * establishes a new one.
   */
  private async reconnect() {
    const previous = this.connectionPromise;
    this.connectionPromise = undefined;

    previous
      ?.then(socket => {
        socket.close(WS_CLOSE_INTENTIONALLY);
      })
      .catch(() => {});

    await new Promise(resolve => setTimeout(resolve, this.reconnectTimeout));
    await this.ensureConnection();
  }

  /**
   * Repeatedly tries to establish an open connection and sync up the
   * subscriptions until it succeeds. Returns a web socket in an OPEN state.
   * Never throws an error.
   */
  private async createWebSocket(): Promise<WebSocket> {
    let socket: WebSocket | undefined = undefined;

    for (;;) {
      try {
        // Re-evaluate identity and discovery for each attempt. The contract
        // with the backend is to send the token (if any) in the
        // Sec-WebSocket-Protocol header.
        const credentials = await this.identity.getCredentials();
        const url = new URL(await this.discoveryApi.getBaseUrl('signals'));
        url.protocol = url.protocol === 'http:' ? 'ws:' : 'wss:';
        socket = new WebSocket(url.toString(), credentials.token);

        socket.addEventListener('message', event => {
          this.handleMessage(event);
        });

        await this.ensureWebSocketIsOpen(socket);
        await this.ensureWebSocketHasAllSubscriptions(socket);

        if (socket.readyState !== WebSocket.OPEN) {
          throw new Error(
            'Connection unexpectedly closed while connecting to signal server',
          );
        }

        return socket;
      } catch {
        try {
          socket?.close(WS_CLOSE_NORMAL);
          socket = undefined;
        } catch {
          // intentionally ignored
        }
        await new Promise(resolve =>
          setTimeout(resolve, this.reconnectTimeout),
        );
      }
    }
  }

  /**
   * Blocks until the web socket is in the OPEN state, or throws an error if it
   * was shutting down or failed to connect.
   */
  private async ensureWebSocketIsOpen(socket: WebSocket) {
    if (socket.readyState === WebSocket.OPEN) {
      return;
    } else if (socket.readyState !== WebSocket.CONNECTING) {
      throw new Error('Web socket was unexpectedly not in a CONNECTING state');
    }

    const connectTimeout = this.connectTimeout;

    await new Promise<void>((resolve, reject) => {
      const timeoutHandle = setTimeout(onTimeout, connectTimeout);
      socket.addEventListener('open', opOpen);
      socket.addEventListener('error', onError);
      socket.addEventListener('close', onClose);

      function opOpen() {
        cleanup();
        resolve();
      }

      function onError() {
        cleanup();
        reject(new Error(`Failed to connect to signal server`));
      }

      function onClose() {
        cleanup();
        reject(
          new Error(
            `Connection unexpectedly closed while connecting to signal server`,
          ),
        );
      }

      function onTimeout() {
        cleanup();
        reject(
          new Error(
            `Timed out after ${connectTimeout}ms while connecting to signal server`,
          ),
        );
      }

      function cleanup() {
        socket.removeEventListener('open', opOpen);
        socket.removeEventListener('error', onError);
        socket.removeEventListener('close', onClose);
        clearTimeout(timeoutHandle);
      }
    });
  }

  /**
   * Blocks until the web socket has sent all of the required subscribe
   * messages, or throws an error if it was shutting down or failed to send them
   * all.
   */
  private async ensureWebSocketHasAllSubscriptions(socket: WebSocket) {
    if (socket.readyState !== WebSocket.OPEN) {
      throw new Error('Web socket was unexpectedly not in an OPEN state');
    }

    await new Promise<void>(async (resolve, reject) => {
      let aborted = false;

      socket.addEventListener('error', onFailed);
      socket.addEventListener('close', onFailed);

      // This is in a loop to account for new subscriptions that are added while
      // we are connecting and sending subscribe messages (due to
      // this.subscriptions being updated).
      const subscribedChannels = new Set<string>();
      for (;;) {
        try {
          const channelsToSubscribe = [...this.subscriptions.values()]
            .map(sub => sub.channel)
            .filter(channel => !subscribedChannels.has(channel));
          if (channelsToSubscribe.length === 0) {
            break;
          }

          for (let i = 0; i < channelsToSubscribe.length; ++i) {
            if (aborted) {
              break;
            }
            const channel = channelsToSubscribe[i];
            socket.send(JSON.stringify({ action: 'subscribe', channel }));
            subscribedChannels.add(channel);
            if (i < channelsToSubscribe.length - 1) {
              await new Promise(r => setTimeout(r, 10)); // Leave a little room for the buffer to not overflow
            }
          }
        } catch {
          onFailed();
          break;
        }
      }

      if (!aborted) {
        cleanup();
        resolve();
      }

      function onFailed() {
        cleanup();
        aborted = true;
        reject(new Error('Failed to send subscribe messages to signal server'));
      }

      function cleanup() {
        socket.removeEventListener('error', onFailed);
        socket.removeEventListener('close', onFailed);
      }
    });

    return socket;
  }

  private handleMessage(event: MessageEvent) {
    let json: any;
    try {
      json = JSON.parse(event.data);
    } catch {
      return;
    }

    if (
      !json ||
      typeof json !== 'object' ||
      Array.isArray(json) ||
      typeof json.channel !== 'string'
    ) {
      return;
    }

    for (const sub of this.subscriptions.values()) {
      if (sub.channel === json.channel) {
        try {
          sub.callback(json.message);
        } catch {
          continue;
        }
      }
    }
  }
}
