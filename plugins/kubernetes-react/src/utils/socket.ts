/*
 * Copyright 2025 The Backstage Authors
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

import { EventTarget, Event } from 'event-target-shim';
import type { SocketEventMap } from '../types';

/**
 * @public
 */
export const SOCK_EVENT_MAP = {
  CONNECT_ERROR: 'connect_error',
  CONNECTED: 'connected',
  CONNECTING: 'connecting',
  DISCONNECT_ERROR: 'disconnect_error',
  DISCONNECTED: 'disconnected',
  MESSAGE: 'message',
} as const;

/**
 * @public
 */
export class Socket extends EventTarget<SocketEventMap> {
  static CONNECTING = 0 as const;
  static OPEN = 1 as const;
  static CLOSING = 2 as const;
  static CLOSED = 3 as const;
  static RECONNECTING = 4 as const;
  // eslint-disable-next-line func-names
  static #genId = (function* () {
    let i = 1;
    while (true) {
      yield i++;
    }
  })();

  url: URL;
  autoReconnect: boolean = false;
  state: number = Socket.CLOSED;
  hasBeenOpen = false;
  hasReconnected = false;
  protocol: string | string[] | null | undefined = null;
  maxTries: number;

  // "Private"
  #socket: WebSocket | null = null;
  #reconnectTimer: NodeJS.Timeout | null = null;
  #disconnectCallBacks: Array<Function> = [];
  #disconnectedAt = 0;
  #hasConnectedOnce = false;
  #hasFlaggedConnErr = false;
  #tries = 0;
  #id = Socket.#genId.next().value;

  constructor(
    url: string,
    protocol: string | string[] | undefined,
    autoReconnect = true,
    maxTries = 2,
  ) {
    super();

    this.url = this.#parseUrl(url);
    this.autoReconnect = autoReconnect;
    this.protocol = protocol;
    this.maxTries = maxTries;
  }

  #parseUrl(url: string) {
    try {
      const _url = new URL(url);
      if (!_url.protocol.startsWith('ws')) {
        _url.protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      }

      return _url;
    } catch (err) {
      throw new Error(
        'Invalid: provided url must adhere to WHATWG specification. Check https://url.spec.whatwg.org/#dom-url-url',
      );
    }
  }

  connect() {
    if (this.#socket && this.#socket.readyState === this.#socket.OPEN) {
      // already connected
      return;
    }

    if (this.state !== Socket.RECONNECTING) {
      this.state = Socket.CONNECTING;
    }

    this.url.searchParams.append('sockId', String(this.#id));

    let socket;

    this.#tries++;

    if (this.protocol) {
      socket = new WebSocket(this.url.href, this.protocol);
    } else {
      socket = new WebSocket(this.url.href);
    }

    socket.onmessage = this.#onmessage.bind(this);
    socket.onopen = this.#opened.bind(this);
    socket.onerror = this.#errored.bind(this);
    socket.onclose = this.#closed.bind(this);

    this.#socket = socket;
    this.state = Socket.CONNECTING;

    this.dispatchEvent(new Event(SOCK_EVENT_MAP.CONNECTING));
  }

  send(data: string | ArrayBufferLike | Blob | ArrayBufferView) {
    if (this.#socket && this.state === Socket.OPEN) {
      this.#socket.send(data);

      return true;
    }

    return false;
  }

  disconnect(callBack?: CallableFunction) {
    if (callBack) {
      this.#disconnectCallBacks.push(callBack);
    }

    const _this = this;
    const promise = new Promise<void>((resolve, reject) => {
      if (this.state === Socket.CLOSED) {
        resolve();
      }

      function onError(e: unknown) {
        reject(e);
        _this.removeEventListener(SOCK_EVENT_MAP.CONNECT_ERROR, onError);
      }

      this.addEventListener(SOCK_EVENT_MAP.CONNECT_ERROR, onError);

      this.#disconnectCallBacks.push(() => {
        this.removeEventListener(SOCK_EVENT_MAP.CONNECT_ERROR, onError);
        resolve();
      });
    });

    this.autoReconnect = false;
    this.#close();

    return promise;
  }

  reconnect() {
    if (
      [Socket.CONNECTING as number, Socket.RECONNECTING as number].includes(
        this.state,
      )
    ) {
      // already in connecting stage
      return;
    }

    if (this.#socket && this.state === Socket.OPEN) {
      this.#close();
      this.connect();
    } else {
      this.connect();
    }
  }

  get sockId() {
    return this.#id;
  }

  isConnected() {
    return this.state === Socket.OPEN;
  }

  #close() {
    const socket = this.#socket;

    if (!socket) {
      return;
    }

    try {
      socket.onopen = null;
      socket.onerror = null;
      socket.onmessage = null;
      socket.close();
    } catch (e) {
      //
    }

    this.state = Socket.CLOSING;
  }

  #opened() {
    const now = new Date().getTime();

    const atTime = this.#disconnectedAt;
    let afterMilliseconds = 0;

    if (atTime) {
      afterMilliseconds = now - atTime;
    }

    if (this.hasBeenOpen) {
      this.hasReconnected = true;
    }

    this.hasBeenOpen = true;
    this.state = Socket.OPEN;
    this.#disconnectedAt = 0;

    const e = new Event(SOCK_EVENT_MAP.CONNECTED);
    Object.assign(e, { detail: { tries: this.#tries, afterMilliseconds } });
    this.dispatchEvent(e);
    this.#tries = 0;
    if (this.#reconnectTimer) clearTimeout(this.#reconnectTimer);
  }

  #onmessage(event: MessageEvent) {
    this.#tries = 0;
    this.dispatchEvent(event as Event);
  }

  #errored(e: globalThis.Event) {
    this.dispatchEvent(e as Event);
  }

  #closed(ev: CloseEvent) {
    this.#socket = null;
    if (this.#reconnectTimer) clearTimeout(this.#reconnectTimer);

    const callBacks = this.#disconnectCallBacks;

    while (callBacks.length) {
      const fn = callBacks.pop();

      if (fn) {
        fn.apply(this);
      }
    }

    if (
      [Socket.OPEN, Socket.CLOSING].includes(
        this.state as typeof Socket.OPEN | typeof Socket.CLOSING,
      )
    ) {
      this.#hasConnectedOnce = true;
    }

    if (!this.#disconnectedAt) {
      this.#disconnectedAt = new Date().getTime();
    }

    if (!this.#hasFlaggedConnErr && !this.#hasConnectedOnce) {
      this.autoReconnect = false;
      this.state = Socket.CLOSED;

      this.dispatchEvent(new Event(SOCK_EVENT_MAP.CONNECT_ERROR));
      this.#hasFlaggedConnErr = true;
    } else if (this.autoReconnect) {
      this.state = Socket.RECONNECTING;

      if (this.maxTries && this.#tries > 1 && this.#tries <= this.maxTries) {
        this.dispatchEvent(new Event(SOCK_EVENT_MAP.CONNECT_ERROR));
      }

      if (this.maxTries && this.#tries > this.maxTries) {
        this.state = Socket.CLOSED;
        this.dispatchEvent(new Event(SOCK_EVENT_MAP.DISCONNECT_ERROR));
      } else {
        const reconnect = () => {
          const delay = Math.max(1000, Math.min(1000 * this.#tries, 30000));

          this.#reconnectTimer = setTimeout(() => {
            this.connect();
          }, delay);
        };

        reconnect();
      }
    } else {
      this.state = Socket.CLOSED;
    }

    if (this.state === Socket.CLOSED) {
      const event = new Event(SOCK_EVENT_MAP.DISCONNECTED);
      Object.assign(event, {
        code: ev.code,
        reason: ev.reason,
        wasClean: ev.wasClean,
      });
      this.dispatchEvent(event);
    } else if (this.state === Socket.RECONNECTING) {
      this.dispatchEvent(new Event(SOCK_EVENT_MAP.CONNECTING));
    }
  }
}
