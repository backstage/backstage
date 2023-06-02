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
import { SignalsClient } from './SignalsClient';
import { ConfigReader } from '@backstage/config';
import { IdentityApi } from '@backstage/core-plugin-api';

jest.mock('socket.io-client', () => ({
  io: jest.fn(),
}));

class MockSocket {
  callbacks: Map<string, Function> = new Map();
  connected: boolean = true;
  sent: { channel: string; data: any }[] = [];

  on(event: string, cb: Function) {
    this.callbacks.set(event, cb);
  }

  callCallback(event: string, ...args: any[]) {
    const cb = this.callbacks.get(event);
    if (!cb) {
      throw new Error(`No callback registered for event ${event}`);
    }
    cb(...args);
  }

  emit(channel: string, data: any) {
    this.sent.push({ channel, data });
  }

  close() {
    this.connected = false;
  }
}

describe('SignalsClient', () => {
  const tokenFunction = jest.fn();
  const identityApi = {
    getCredentials: tokenFunction,
  } as unknown as IdentityApi;

  const mockLogger = {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };

  let mockSocket: MockSocket;

  beforeEach(() => {
    mockSocket = new MockSocket();
    (io as unknown as jest.MockedFn<typeof io>).mockReturnValue(
      mockSocket as unknown as Socket,
    );
    tokenFunction.mockResolvedValue({ token: '12345' });

    mockLogger.debug.mockClear();
    mockLogger.info.mockClear();
    mockLogger.warn.mockReset();
    mockLogger.error.mockReset();
  });

  it('should not do anything if config not enabled', async () => {
    const client = SignalsClient.create({
      configApi: new ConfigReader({}),
      identityApi: identityApi,
    });
    await client.subscribe('plugin', _ => {});
    expect(mockSocket.sent.length).toEqual(0);
  });

  it('should allow using custom endpont', async () => {
    const client = SignalsClient.create({
      configApi: new ConfigReader({
        backend: {
          baseUrl: 'http://localhost',
          signals: {
            enabled: true,
            endpoint: 'https://my-backstage-instance.io',
          },
        },
      }),
      identityApi: identityApi,
    });

    await client.subscribe('plugin', _ => {});
    expect(io).toHaveBeenCalledWith('https://my-backstage-instance.io', {
      auth: { token: '12345' },
      multiplex: true,
      path: '/signals',
    });
  });

  it('should be able to subscribe and unsubscribe', async () => {
    const client = SignalsClient.create({
      configApi: new ConfigReader({
        backend: { baseUrl: 'http://localhost', signals: true },
      }),
      identityApi: identityApi,
    });
    let receivedData;
    await client.subscribe('plugin', data => {
      receivedData = data;
    });
    expect(io).toHaveBeenCalledWith('http://localhost', {
      auth: { token: '12345' },
      multiplex: true,
      path: '/signals',
    });

    // Client connected
    mockSocket.callCallback('connect');
    expect(mockSocket.sent.length).toEqual(1);
    expect(mockSocket.sent[0]).toEqual({
      channel: 'subscribe',
      data: { pluginId: 'plugin', topic: undefined },
    });

    // Incoming data from broker
    mockSocket.callCallback('message', {
      pluginId: 'plugin',
      data: 'Hello world',
    });
    expect(receivedData).toEqual('Hello world');

    // Unsubscribe sent to broker
    await client.unsubscribe('plugin');
    expect(mockSocket.sent.length).toEqual(2);
    expect(mockSocket.sent[1]).toEqual({
      channel: 'unsubscribe',
      data: { pluginId: 'plugin', topic: undefined },
    });
  });

  it('should throw error on duplicate subscription', async () => {
    const client = SignalsClient.create({
      configApi: new ConfigReader({
        backend: { baseUrl: 'http://localhost', signals: true },
      }),
      identityApi: identityApi,
    });

    await client.subscribe('plugin', _ => {});
    expect(io).toHaveBeenCalledWith('http://localhost', {
      auth: { token: '12345' },
      multiplex: true,
      path: '/signals',
    });

    mockSocket.callCallback('connect');
    expect(mockSocket.sent.length).toEqual(1);
    expect(mockSocket.sent[0]).toEqual({
      channel: 'subscribe',
      data: { pluginId: 'plugin', topic: undefined },
    });

    await expect(client.subscribe('plugin', _ => {})).rejects.toThrow();
  });
});
