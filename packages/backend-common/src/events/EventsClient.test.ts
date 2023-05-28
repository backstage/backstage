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

import { DefaultEventsClient } from './EventsClient';
import { getVoidLogger } from '../logging';
import { MockServer } from '@relaycorp/ws-mock';
import { WebSocket } from 'ws';

jest.mock('ws', () => ({
  __esModule: true,
  WebSocket: jest.fn(),
}));

describe('EventsClient', () => {
  let client: DefaultEventsClient;
  let server: MockServer;
  beforeEach(async () => {
    server = new MockServer();
    client = new DefaultEventsClient(
      'ws://localhost:1234',
      'catalog',
      getVoidLogger(),
    );
    (WebSocket as unknown as jest.Mock).mockImplementation(() => server.client);
  });

  it('should connect and register and publish messages succesfully', async () => {
    await server.use(client.connect(), async () => {
      const registerMsg = await server.receive();
      expect(registerMsg).toEqual(
        JSON.stringify({ command: 'register', pluginId: 'catalog' }),
      );

      await client.publish({ test: 'test' });
      const received = await server.receive();
      expect(received).toEqual(
        JSON.stringify({
          command: 'publish',
          pluginId: 'catalog',
          data: { test: 'test' },
        }),
      );
    });
  });

  it('should queue messages before connecting', async () => {
    await client.publish({ test: 'test' });
    await client.publish(
      { test: 'test2' },
      {
        entityRefs: ['user:default/john.doe'],
      },
    );
    await server.use(client.connect(), async () => {
      const registerMsg = await server.receive();
      expect(registerMsg).toEqual(
        JSON.stringify({ command: 'register', pluginId: 'catalog' }),
      );

      const received = await server.receive();
      expect(received).toEqual(
        JSON.stringify({
          command: 'publish',
          pluginId: 'catalog',
          data: { test: 'test' },
        }),
      );
      const received2 = await server.receive();
      expect(received2).toEqual(
        JSON.stringify({
          command: 'publish',
          pluginId: 'catalog',
          targetEntityRefs: ['user:default/john.doe'],
          data: { test: 'test2' },
        }),
      );
    });
  });

  it('should allow subscribing to events', async () => {
    await server.use(client.connect(), async () => {
      const registerMsg = await server.receive();
      expect(registerMsg).toEqual(
        JSON.stringify({ command: 'register', pluginId: 'catalog' }),
      );

      let receivedData;
      await client.subscribe('catalog', data => {
        receivedData = data;
      });
      const received = await server.receive();
      expect(received).toEqual(
        JSON.stringify({
          command: 'subscribe',
          pluginId: 'catalog',
        }),
      );

      await server.send(
        JSON.stringify({
          command: 'publish',
          pluginId: 'catalog',
          data: { test: 'test' },
        }),
      );
      expect(receivedData).toEqual({ test: 'test' });
    });
  });

  it('should clean up after disconnect', async () => {
    await server.use(client.connect(), async () => {
      const registerMsg = await server.receive();
      expect(registerMsg).toEqual(
        JSON.stringify({ command: 'register', pluginId: 'catalog' }),
      );

      await client.subscribe('catalog', _ => {});
      const received = await server.receive();
      expect(received).toEqual(
        JSON.stringify({
          command: 'subscribe',
          pluginId: 'catalog',
        }),
      );

      await client.disconnect();
      expect(server.didPeerCloseConnection).toBeTruthy();
    });
  });
});
