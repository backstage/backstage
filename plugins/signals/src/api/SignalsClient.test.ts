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

describe('SignalsClient', () => {
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

    await expect(server).toReceiveMessage({
      action: 'subscribe',
      channel: 'channel',
    });
    server.send({ channel: 'channel', message: { hello: 'world' } });
    expect(messageMock1).toHaveBeenCalledWith({ hello: 'world' });
    expect(messageMock2).toHaveBeenCalledWith({ hello: 'world' });

    await unsubscribe1();
    await expect(server).not.toReceiveMessage({
      action: 'unsubscribe',
      channel: 'channel',
    });

    await unsubscribe2();
    await expect(server).toReceiveMessage({
      action: 'unsubscribe',
      channel: 'channel',
    });
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

    await new Promise(r => setTimeout(r, 50));
    await expect(server).toReceiveMessage({
      action: 'subscribe',
      channel: 'channel',
    });
  });
});
