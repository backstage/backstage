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
import { DiscoveryApi, IdentityApi } from '@backstage/core-plugin-api';

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
  const discoveryApi = {
    getBaseUrl: jest.fn().mockResolvedValue('http://localhost'),
  } as unknown as DiscoveryApi;

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
      discoveryApi,
      identityApi,
    });
    await client.subscribe({ pluginId: 'plugin', onMessage: _ => {} });
    expect(mockSocket.sent.length).toEqual(0);
  });

  it('should be able to subscribe and unsubscribe', async () => {
    const client = SignalsClient.create({
      discoveryApi,
      identityApi,
    });
    let receivedData;
    const subsKey = await client.subscribe({
      pluginId: 'plugin',
      onMessage: data => {
        receivedData = data;
      },
    });
    expect(io).toHaveBeenCalledWith('http://localhost', {
      auth: { token: '12345' },
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
    await client.unsubscribe(subsKey);
    expect(mockSocket.sent.length).toEqual(2);
    expect(mockSocket.sent[1]).toEqual({
      channel: 'unsubscribe',
      data: { pluginId: 'plugin', topic: undefined },
    });
  });
});
