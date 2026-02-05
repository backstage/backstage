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

import { mockApis } from '@backstage/test-utils';
import WS from 'jest-websocket-mock';
import { SignalClient } from './SignalClient';
import waitForExpect from 'wait-for-expect';
import { DiscoveryApi, IdentityApi } from '@backstage/frontend-plugin-api';

describe('SignalClient', () => {
  let identity: IdentityApi;
  let discoveryApi: DiscoveryApi;
  let server: WS;
  let port = 1234; // Use unique ports per test to ensure that tests do not interfare with each other

  beforeEach(async () => {
    identity = mockApis.identity({ token: '12345' });
    discoveryApi = mockApis.discovery({ baseUrl: `http://localhost:${port}` });
    server = new WS(`ws://localhost:${port}/api/signals`, {
      jsonProtocol: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    WS.clean();
    port += 1;
  });

  it('should handle single subscription correctly', async () => {
    const messageMock = jest.fn();
    const client = SignalClient.create({ discoveryApi, identity });
    const { unsubscribe } = client.subscribe('channel', messageMock);
    await server.connected;

    await expect(server).toReceiveMessage({
      action: 'subscribe',
      channel: 'channel',
    });
    server.send({ channel: 'channel', message: { hello: 'world' } });
    expect(messageMock).toHaveBeenCalledWith({ hello: 'world' });

    await unsubscribe();

    await expect(server).toReceiveMessage({
      action: 'unsubscribe',
      channel: 'channel',
    });
  });

  it('should handle multiple subscription correctly', async () => {
    const messageMock1 = jest.fn();
    const messageMock2 = jest.fn();
    const client1 = SignalClient.create({ discoveryApi, identity });
    const client2 = SignalClient.create({ discoveryApi, identity });
    const { unsubscribe: unsubscribe1 } = client1.subscribe(
      'channel',
      messageMock1,
    );
    const { unsubscribe: unsubscribe2 } = client2.subscribe(
      'channel',
      messageMock2,
    );

    await server.connected;

    await waitForExpect(() =>
      expect(server).toHaveReceivedMessages([
        {
          action: 'subscribe',
          channel: 'channel',
        },
        {
          action: 'subscribe',
          channel: 'channel',
        },
      ]),
    );
    server.send({ channel: 'channel', message: { hello: 'world' } });
    expect(messageMock1).toHaveBeenCalledWith({ hello: 'world' });
    expect(messageMock2).toHaveBeenCalledWith({ hello: 'world' });

    await unsubscribe1();
    await waitForExpect(() =>
      expect(server).toReceiveMessage({
        action: 'unsubscribe',
        channel: 'channel',
      }),
    );

    await unsubscribe2();
    await waitForExpect(() =>
      expect(server.messages).toEqual([
        {
          action: 'subscribe',
          channel: 'channel',
        },
        {
          action: 'subscribe',
          channel: 'channel',
        },
        {
          action: 'unsubscribe',
          channel: 'channel',
        },
        {
          action: 'unsubscribe',
          channel: 'channel',
        },
      ]),
    );
  });

  it('should reconnect on error', async () => {
    const messageMock = jest.fn();
    const client = SignalClient.create({
      discoveryApi,
      identity,
      reconnectTimeout: 10,
      connectTimeout: 100,
    });

    const { unsubscribe } = client.subscribe('channel', messageMock);
    await server.connected;
    await expect(server).toReceiveMessage({
      action: 'subscribe',
      channel: 'channel',
    });

    await server.server.emit('error', null);

    await waitForExpect(() =>
      expect(server.messages).toEqual([
        { action: 'subscribe', channel: 'channel' },
        { action: 'subscribe', channel: 'channel' },
      ]),
    );

    unsubscribe();
  });

  it('should handle multiple simultaneous subscriptions without creating multiple connections', async () => {
    const messageMock1 = jest.fn();
    const messageMock2 = jest.fn();
    const messageMock3 = jest.fn();

    let connectionCount = 0;
    const OriginalWebSocket = global.WebSocket;

    const WrappedWebSocket = function WebSocket(
      url: string | URL,
      protocols?: string | string[],
    ) {
      connectionCount++;
      return new OriginalWebSocket(url, protocols);
    } as any;

    WrappedWebSocket.CONNECTING = OriginalWebSocket.CONNECTING;
    WrappedWebSocket.OPEN = OriginalWebSocket.OPEN;
    WrappedWebSocket.CLOSING = OriginalWebSocket.CLOSING;
    WrappedWebSocket.CLOSED = OriginalWebSocket.CLOSED;
    WrappedWebSocket.prototype = OriginalWebSocket.prototype;

    global.WebSocket = WrappedWebSocket;

    try {
      const client = SignalClient.create({ discoveryApi, identity });

      const sub1 = client.subscribe('channel1', messageMock1);
      const sub2 = client.subscribe('channel2', messageMock2);
      const sub3 = client.subscribe('channel3', messageMock3);

      await server.connected;

      expect(connectionCount).toBe(1);

      await waitForExpect(() =>
        expect(server.messages).toEqual([
          { action: 'subscribe', channel: 'channel1' },
          { action: 'subscribe', channel: 'channel2' },
          { action: 'subscribe', channel: 'channel3' },
        ]),
      );

      server.send({ channel: 'channel1', message: { test: '1' } });
      server.send({ channel: 'channel2', message: { test: '2' } });
      server.send({ channel: 'channel3', message: { test: '3' } });

      await waitForExpect(() => {
        expect(messageMock1).toHaveBeenCalledWith({ test: '1' });
        expect(messageMock2).toHaveBeenCalledWith({ test: '2' });
        expect(messageMock3).toHaveBeenCalledWith({ test: '3' });
      });

      expect(connectionCount).toBe(1);
      sub1.unsubscribe();
      sub2.unsubscribe();
      sub3.unsubscribe();
    } finally {
      global.WebSocket = OriginalWebSocket;
    }
  });

  it('should handle multiple simultaneous subscriptions to the same channel', async () => {
    const messageMock1 = jest.fn();
    const messageMock2 = jest.fn();
    const messageMock3 = jest.fn();
    const client = SignalClient.create({ discoveryApi, identity });

    const sub1 = client.subscribe('channel', messageMock1);
    const sub2 = client.subscribe('channel', messageMock2);
    const sub3 = client.subscribe('channel', messageMock3);

    await server.connected;

    await waitForExpect(() =>
      expect(server.messages).toEqual([
        { action: 'subscribe', channel: 'channel' },
      ]),
    );

    server.send({ channel: 'channel', message: { test: 'data' } });

    await waitForExpect(() => {
      expect(messageMock1).toHaveBeenCalledWith({ test: 'data' });
      expect(messageMock2).toHaveBeenCalledWith({ test: 'data' });
      expect(messageMock3).toHaveBeenCalledWith({ test: 'data' });
    });

    sub1.unsubscribe();
    sub2.unsubscribe();

    await waitForExpect(() => {
      expect(server.messages).toHaveLength(1);
    });

    sub3.unsubscribe();

    await waitForExpect(() =>
      expect(server.messages).toEqual([
        { action: 'subscribe', channel: 'channel' },
        { action: 'unsubscribe', channel: 'channel' },
      ]),
    );
  });

  it('should resubscribe after reconnect even if initial connection failed', async () => {
    const discoveryApi2 = {
      getBaseUrl: jest
        .fn()
        .mockResolvedValue(`http://localhost:${port}/api/signals-test`),
    };

    const messageMock = jest.fn();
    const client = SignalClient.create({
      discoveryApi: discoveryApi2 as any,
      identity,
      reconnectTimeout: 50,
      connectTimeout: 100,
    });

    const server2 = new WS(`ws://localhost:${port}/api/signals-test`, {
      jsonProtocol: true,
    });

    client.subscribe('channel', messageMock);
    await server2.connected;
    server2.close();

    const server3 = new WS(`ws://localhost:${port}/api/signals-test`, {
      jsonProtocol: true,
    });

    await server3.connected;

    await waitForExpect(() =>
      expect(server3.messages).toEqual([
        { action: 'subscribe', channel: 'channel' },
      ]),
    );

    server3.send({ channel: 'channel', message: { reconnected: true } });
    await waitForExpect(() => {
      expect(messageMock).toHaveBeenCalledWith({ reconnected: true });
    });

    server3.close();
  });

  it('should resubscribe when server closes connection normally while subscriptions exist', async () => {
    const messageMock = jest.fn();
    const client = SignalClient.create({
      discoveryApi,
      identity,
      reconnectTimeout: 50,
      connectTimeout: 100,
    });

    client.subscribe('channel', messageMock);
    await server.connected;

    await waitForExpect(() =>
      expect(server.messages).toEqual([
        { action: 'subscribe', channel: 'channel' },
      ]),
    );

    server.close();

    const server2 = new WS(`ws://localhost:${port}/api/signals`, {
      jsonProtocol: true,
    });

    const messageMock2 = jest.fn();
    client.subscribe('channel2', messageMock2);

    await server2.connected;

    await waitForExpect(() => {
      expect(server2.messages).toEqual(
        expect.arrayContaining([
          { action: 'subscribe', channel: 'channel' },
          { action: 'subscribe', channel: 'channel2' },
        ]),
      );
      expect(server2.messages).toHaveLength(2);
    });

    server2.send({ channel: 'channel', message: { after: 'reconnect' } });
    server2.send({ channel: 'channel2', message: { second: 'channel' } });

    await waitForExpect(() => {
      expect(messageMock).toHaveBeenCalledWith({ after: 'reconnect' });
      expect(messageMock2).toHaveBeenCalledWith({ second: 'channel' });
    });

    server2.close();
  });
});
