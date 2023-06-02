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

import { Server, Socket } from 'socket.io';
import { SignalsBroker } from './SignalsBroker';
import { Handshake } from 'socket.io/dist/socket';
import * as uuid from 'uuid';
import jwt_decode from 'jwt-decode';

jest.mock('socket.io');
jest.mock('jwt-decode', () => jest.fn());

const jwtMock = jwt_decode as unknown as jest.Mock;

class MockServer extends Server {
  callbacks: Map<string, Function> = new Map();
  isOpen: boolean = true;

  on(event: string, cb: Function) {
    this.callbacks.set(event, cb);
  }

  callCallback(event: string, ...args: any[]) {
    this.callbacks.get(event)(...args);
  }

  close() {
    this.isOpen = false;
  }
}

class MockSocket extends Socket {
  callbacks: Map<string, Function> = new Map();
  id: string = uuid.v4();
  isConnected: boolean = true;
  handshake: Handshake = { address: '127.0.0.1', auth: {} };
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

  disconnect() {
    this.isConnected = false;
  }
}

describe('SignalsBroker', () => {
  const mockLogger = {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };

  let mockServer: MockServer;
  let broker: SignalsBroker;

  beforeEach(() => {
    mockServer = new MockServer();
    broker = SignalsBroker.create(mockServer, mockLogger);
    mockLogger.debug.mockClear();
    mockLogger.info.mockClear();
    mockLogger.warn.mockReset();
    mockLogger.error.mockReset();
    jwtMock.mockReset();
  });

  const createBackendMock = (id?: string) => {
    jwtMock.mockReturnValueOnce({ sub: 'backstage-server', ent: null });
    const mockSocket = new MockSocket();
    mockSocket.handshake.auth.token = 'jwt';
    mockSocket.id = id ?? 'test';
    mockServer.callCallback('connection', mockSocket);
    return mockSocket;
  };

  const createFrontendMock = (
    id?: string,
    sub?: string,
    entities?: string[],
  ) => {
    jwtMock.mockReturnValueOnce({
      sub: sub ?? 'user',
      ent: entities ?? ['group:default/test'],
    });
    const mockSocket = new MockSocket();
    mockSocket.handshake.auth.token = 'jwt';
    mockSocket.id = id ?? 'test';
    mockServer.callCallback('connection', mockSocket);
    return mockSocket;
  };

  it('should close the server when error occurs', () => {
    mockServer.callCallback('error', new Error('test'));
    expect(mockServer.isOpen).toBeFalsy();
  });

  it('should receive and forward messages from other servers', () => {
    const mockFrontendPlugin = createFrontendMock();
    mockFrontendPlugin.callCallback('subscribe', {
      pluginId: 'test-plugin-id',
    });

    mockServer.callCallback('broker:publish', {
      uid: uuid.v4(),
      message: {
        pluginId: 'test-plugin-id',
        data: 'Hello world',
      },
    });

    expect(mockFrontendPlugin.sent.length).toEqual(1);
    expect(mockFrontendPlugin.sent[0]).toEqual({
      channel: 'message',
      data: {
        pluginId: 'test-plugin-id',
        data: 'Hello world',
        targetEntityRefs: undefined,
      },
    });
  });

  it('should close connections on server close', () => {
    const mockSocket = new MockSocket();
    mockServer.callCallback('connection', mockSocket);
    mockServer.callCallback('close');
    expect(mockSocket.isConnected).toBeFalsy();
  });

  it('should not allow invalid authentication', () => {
    const mockSocket = new MockSocket();
    mockSocket.handshake.auth.token = 'invalid';
    mockServer.callCallback('connection', mockSocket);
    expect(mockSocket.isConnected).toBeFalsy();
  });

  it('should not allow registration of frontend service', () => {
    const mockSocket = createFrontendMock();
    mockSocket.callCallback('register', { pluginId: 'test-plugin-id' });
    expect(mockLogger.warn).toHaveBeenCalledWith(
      'Invalid signals register request from (id: test, type: frontend, sub: user, ip: 127.0.0.1)',
    );
  });

  it('should allow registration of backend service', () => {
    const mockSocket = createBackendMock();
    mockSocket.callCallback('register', { pluginId: 'test-plugin-id' });
    expect(mockLogger.info).toHaveBeenCalledWith(
      "Plugin 'test-plugin-id' registered to signals broker (id: test, type: backend, sub: backstage-server, ip: 127.0.0.1)",
    );
  });

  it('should disconnect on from server when client disconnects', () => {
    const mockSocket = createBackendMock();
    mockSocket.callCallback('disconnect');
    expect(mockSocket.isConnected).toBeFalsy();
    expect(mockLogger.info).toHaveBeenCalledWith(
      'Connection (id: test, type: backend, sub: backstage-server, ip: 127.0.0.1) disconnected',
    );
  });

  it('should disconnect on error', () => {
    const mockSocket = createBackendMock();
    mockSocket.callCallback('error', new Error('test'));
    expect(mockSocket.isConnected).toBeFalsy();
    expect(mockLogger.error).toHaveBeenCalledWith(
      'Signals connection error occurred for (id: test, type: backend, sub: backstage-server, ip: 127.0.0.1): Error: test, disconnecting',
    );
  });

  it('should not allow publishing without registration', () => {
    const mockSocket = createBackendMock();
    mockSocket.callCallback('publish', {
      pluginId: 'test-plugin-id',
      data: 'Hello world',
    });
    expect(mockLogger.warn).toHaveBeenCalledWith(
      'Invalid signals publish request from (id: test, type: backend, sub: backstage-server, ip: 127.0.0.1)',
    );
  });

  it('should not allow backend to subscribe to events', () => {
    const mockSocket = createBackendMock();
    mockSocket.callCallback('subscribe', {
      pluginId: 'test-plugin-id',
    });
    expect(mockLogger.warn).toHaveBeenCalledWith(
      'Invalid signals subscribe request from (id: test, type: backend, sub: backstage-server, ip: 127.0.0.1)',
    );
  });

  it('should not allow backend to unsubscribe from events', () => {
    const mockSocket = createBackendMock();
    mockSocket.callCallback('unsubscribe', {
      pluginId: 'test-plugin-id',
    });
    expect(mockLogger.warn).toHaveBeenCalledWith(
      'Invalid signals unsubscribe request from (id: test, type: backend, sub: backstage-server, ip: 127.0.0.1)',
    );
  });

  it('should allow frontend to subscribe and unsubscribe to events', () => {
    const mockSocket = createFrontendMock();
    mockSocket.callCallback('subscribe', {
      pluginId: 'test-plugin-id',
    });
    expect(mockLogger.info).toHaveBeenCalledWith(
      "(id: test, type: frontend, sub: user, ip: 127.0.0.1) subscribed to 'test-plugin-id'",
    );

    // Subscribing again should do nothing
    mockSocket.callCallback('subscribe', {
      pluginId: 'test-plugin-id',
    });

    mockSocket.callCallback('unsubscribe', {
      pluginId: 'test-plugin-id',
    });
    expect(mockLogger.info).toHaveBeenCalledWith(
      "(id: test, type: frontend, sub: user, ip: 127.0.0.1) unsubscribed from 'test-plugin-id'",
    );

    // Subscribing and unsubscribing again should do nothing => No logging
    mockSocket.callCallback('unsubscribe', {
      pluginId: 'test-plugin-id',
    });
    expect(mockLogger.info).toHaveBeenCalledTimes(3);
  });

  it('should allow publishing to clients without topic or entity targets', () => {
    const mockBackendPlugin = createBackendMock();
    mockBackendPlugin.callCallback('register', { pluginId: 'test-plugin-id' });

    const mockFrontendPlugin = createFrontendMock();
    mockFrontendPlugin.callCallback('subscribe', {
      pluginId: 'test-plugin-id',
    });

    mockBackendPlugin.callCallback('publish', {
      pluginId: 'test-plugin-id',
      data: 'Hello world',
    });

    expect(mockFrontendPlugin.sent.length).toEqual(1);
    expect(mockFrontendPlugin.sent[0]).toEqual({
      channel: 'message',
      data: {
        pluginId: 'test-plugin-id',
        data: 'Hello world',
        targetEntityRefs: undefined,
      },
    });
  });

  it('should publish to clients without topic even the message has topic', () => {
    const mockBackendPlugin = createBackendMock();
    mockBackendPlugin.callCallback('register', { pluginId: 'test-plugin-id' });

    const mockFrontendPlugin = createFrontendMock();
    mockFrontendPlugin.callCallback('subscribe', {
      pluginId: 'test-plugin-id',
    });

    mockBackendPlugin.callCallback('publish', {
      pluginId: 'test-plugin-id',
      data: 'Hello world',
      topic: 'test-topic',
    });

    expect(mockFrontendPlugin.sent.length).toEqual(1);
    expect(mockFrontendPlugin.sent[0]).toEqual({
      channel: 'message',
      data: {
        pluginId: 'test-plugin-id',
        data: 'Hello world',
        topic: 'test-topic',
        targetEntityRefs: undefined,
      },
    });
  });

  it('should not publish to clients that have not subscribed to specific topic', () => {
    const mockBackendPlugin = createBackendMock();
    mockBackendPlugin.callCallback('register', { pluginId: 'test-plugin-id' });

    const mockFrontendPlugin = createFrontendMock();
    mockFrontendPlugin.callCallback('subscribe', {
      pluginId: 'test-plugin-id',
      topic: 'non-existing',
    });

    mockBackendPlugin.callCallback('publish', {
      pluginId: 'test-plugin-id',
      data: 'Hello world',
      topic: 'test-topic',
    });

    expect(mockFrontendPlugin.sent.length).toEqual(0);
  });

  it('should be able to target to specific groups', () => {
    const mockBackendPlugin = createBackendMock();
    mockBackendPlugin.callCallback('register', { pluginId: 'test-plugin-id' });

    const mockFrontendPlugin1 = createFrontendMock(
      'front1',
      'user:default/john.doe',
      ['user:default/john.doe', 'group:default/developers'],
    );
    mockFrontendPlugin1.callCallback('subscribe', {
      pluginId: 'test-plugin-id',
    });

    const mockFrontendPlugin2 = createFrontendMock(
      'front2',
      'user:default/jane.doe',
      ['user:default/jane.doe', 'group:default/developers'],
    );
    mockFrontendPlugin2.callCallback('subscribe', {
      pluginId: 'test-plugin-id',
    });

    mockBackendPlugin.callCallback('publish', {
      pluginId: 'test-plugin-id',
      data: 'Hello world',
      targetEntityRefs: ['user:default/john.doe'],
    });

    // Should only publish to john.doe user
    expect(mockFrontendPlugin1.sent.length).toEqual(1);
    expect(mockFrontendPlugin1.sent[0]).toEqual({
      channel: 'message',
      data: {
        pluginId: 'test-plugin-id',
        data: 'Hello world',
        targetEntityRefs: undefined,
      },
    });
    expect(mockFrontendPlugin2.sent.length).toEqual(0);

    // Should publish to both because they are in the same group
    mockBackendPlugin.callCallback('publish', {
      pluginId: 'test-plugin-id',
      data: 'Hello world',
      targetEntityRefs: ['group:default/developers'],
    });
    expect(mockFrontendPlugin1.sent.length).toEqual(2);
    expect(mockFrontendPlugin2.sent.length).toEqual(1);
  });
});
