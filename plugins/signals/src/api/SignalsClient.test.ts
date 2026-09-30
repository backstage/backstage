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

describe('SignalClient', () => {
  const identity = mockApis.identity({ token: '12345' });
  const discoveryApi = mockApis.discovery({ baseUrl: 'http://localhost:1234' });

  let server: WS;

  beforeEach(async () => {
    jest.clearAllMocks();
    server = new WS('ws://localhost:1234/api/signals', {
      jsonProtocol: true,
    });
  });

  afterEach(() => {
    WS.clean();
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

  it('shares a pending connection and subscribes to the current channels', async () => {
    let resolveCredentials!: (credentials: { token: string }) => void;
    const credentials = new Promise<{ token: string }>(resolve => {
      resolveCredentials = resolve;
    });
    const delayedIdentity = {
      ...identity,
      getCredentials: jest.fn(() => credentials),
    };
    const client = SignalClient.create({
      discoveryApi,
      identity: delayedIdentity,
    });

    const first = client.subscribe('first', jest.fn());
    const duplicate = client.subscribe('first', jest.fn());
    const second = client.subscribe('second', jest.fn());
    const removed = client.subscribe('removed', jest.fn());
    removed.unsubscribe();

    await waitForExpect(() =>
      expect(delayedIdentity.getCredentials).toHaveBeenCalledTimes(1),
    );
    resolveCredentials({ token: '12345' });
    await server.connected;
    await waitForExpect(() =>
      expect(server).toHaveReceivedMessages([
        { action: 'subscribe', channel: 'first' },
        { action: 'subscribe', channel: 'second' },
      ]),
    );
    expect(server.server.clients()).toHaveLength(1);

    first.unsubscribe();
    expect(server.messages).toHaveLength(2);
    duplicate.unsubscribe();
    second.unsubscribe();
  });

  it('does not open a connection after all subscriptions are removed', async () => {
    let resolveBaseUrl!: (url: string) => void;
    const baseUrl = new Promise<string>(resolve => {
      resolveBaseUrl = resolve;
    });
    const getBaseUrl = jest.fn(() => baseUrl);
    const client = SignalClient.create({
      discoveryApi: { getBaseUrl },
      identity,
      reconnectTimeout: 10,
    });
    const subscription = client.subscribe('channel', jest.fn());
    await waitForExpect(() => expect(getBaseUrl).toHaveBeenCalledTimes(1));

    subscription.unsubscribe();
    resolveBaseUrl('http://localhost:1234/api/signals');
    await new Promise(resolve => setTimeout(resolve, 30));
    expect(server.server.clients()).toHaveLength(0);
    expect(getBaseUrl).toHaveBeenCalledTimes(1);
  });

  it('does not connect or retry without a token', async () => {
    const noTokenIdentity = {
      ...identity,
      getCredentials: jest.fn(async () => ({})),
    };
    const getBaseUrl = jest.fn().mockRejectedValue(new Error('Unavailable'));
    const client = SignalClient.create({
      discoveryApi: { getBaseUrl },
      identity: noTokenIdentity,
      reconnectTimeout: 10,
    });
    const subscription = client.subscribe('channel', jest.fn());

    await waitForExpect(() =>
      expect(noTokenIdentity.getCredentials).toHaveBeenCalledTimes(1),
    );
    await new Promise(resolve => setTimeout(resolve, 30));
    expect(server.server.clients()).toHaveLength(0);
    expect(getBaseUrl).not.toHaveBeenCalled();
    expect(noTokenIdentity.getCredentials).toHaveBeenCalledTimes(1);
    subscription.unsubscribe();
  });

  it('stops reconnecting when credentials no longer contain a token', async () => {
    const getCredentials = jest
      .fn()
      .mockResolvedValueOnce({ token: '12345' })
      .mockResolvedValue({});
    const client = SignalClient.create({
      discoveryApi,
      identity: { ...identity, getCredentials },
      reconnectTimeout: 10,
    });
    const subscription = client.subscribe('channel', jest.fn());
    await server.connected;
    await expect(server).toReceiveMessage({
      action: 'subscribe',
      channel: 'channel',
    });

    server.close({ code: 4000, reason: 'Token expired', wasClean: false });
    await waitForExpect(() => expect(getCredentials).toHaveBeenCalledTimes(2));
    await new Promise(resolve => setTimeout(resolve, 30));
    expect(getCredentials).toHaveBeenCalledTimes(2);
    expect(server.server.clients()).toHaveLength(0);
    subscription.unsubscribe();
  });

  it('should reconnect on error', async () => {
    const messageMock = jest.fn();
    const client = SignalClient.create({
      discoveryApi,
      identity,
      reconnectTimeout: 10,
      connectTimeout: 100,
    });

    client.subscribe('channel', messageMock);
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
  });
});
