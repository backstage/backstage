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
import { io } from 'socket.io-client';
import { SignalsBroker } from './SignalsBroker';
import { DefaultSignalsClient } from './SignalsClient';

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
    this.callbacks.get(event)(...args);
  }

  emit(channel: string, data: any) {
    this.sent.push({ channel, data });
  }

  close() {
    this.connected = false;
  }
}

describe('SignalsBroker', () => {
  const mockLogger = {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };

  let client: DefaultSignalsClient;
  let mockSocket: MockSocket;

  beforeEach(() => {
    mockSocket = new MockSocket();
    io.mockReturnValue(mockSocket);

    client = new DefaultSignalsClient('http://localhost', 'plugin', mockLogger);
    mockLogger.debug.mockClear();
    mockLogger.info.mockClear();
    mockLogger.warn.mockReset();
    mockLogger.error.mockReset();
  });

  it('should connect and register', async () => {
    await client.connect();
    expect(mockSocket.callbacks.size).toEqual(3);

    mockSocket.callCallback('connect');
    expect(mockSocket.sent.length).toEqual(1);
    expect(mockSocket.sent[0]).toEqual({
      channel: 'register',
      data: { pluginId: 'plugin' },
    });
  });

  it('should disconnect on error', async () => {
    await client.connect();
    mockSocket.callCallback('error', new Error('test'));

    expect(mockLogger.error).toHaveBeenCalledWith(
      'plugin signals error occurred: Error: test, disconnecting',
    );
    expect(mockSocket.connected).toBeFalsy();
  });

  it('should disconnect on server disconnect', async () => {
    await client.connect();
    mockSocket.callCallback('disconnect');

    expect(mockLogger.info).toHaveBeenCalledWith('plugin signals disconnected');
    expect(mockSocket.connected).toBeFalsy();
  });

  it('should store messages to queue before connected', async () => {
    await client.publish('Hello world');
    await client.publish('foo bar', {
      topic: 'baz',
      entityRefs: ['user:default/john.doe'],
    });

    await client.connect();
    mockSocket.callCallback('connect');
    expect(mockSocket.sent.length).toEqual(3);
    expect(mockSocket.sent[0]).toEqual({
      channel: 'register',
      data: { pluginId: 'plugin' },
    });
    expect(mockSocket.sent[1]).toEqual({
      channel: 'publish',
      data: {
        data: 'Hello world',
        pluginId: 'plugin',
        targetEntityRefs: undefined,
        topic: undefined,
      },
    });
    expect(mockSocket.sent[2]).toEqual({
      channel: 'publish',
      data: {
        data: 'foo bar',
        pluginId: 'plugin',
        targetEntityRefs: ['user:default/john.doe'],
        topic: 'baz',
      },
    });
  });
});
