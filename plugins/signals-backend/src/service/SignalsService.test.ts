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

import { SignalsService } from './SignalsService';
import { mockServices } from '@backstage/backend-test-utils';
import { EventBroker, EventSubscriber } from '@backstage/plugin-events-node';
import * as http from 'http';
import { io, Socket } from 'socket.io-client';
import { AddressInfo } from 'net';
import { Logger } from 'winston';

describe('SignalsService', () => {
  let onEvent: Function;
  let clientSocket: Socket;
  let httpServer: http.Server;

  const mockLogger = {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    child: () => {
      return this;
    },
  } as unknown as Logger;
  const identity = mockServices.identity();
  const config = mockServices.config();
  const mockEventBroker = {
    publish: async () => jest.fn(),
    subscribe: (subscriber: EventSubscriber) => {
      onEvent = subscriber.onEvent;
    },
  } as unknown as EventBroker;

  beforeEach(() => {
    return new Promise(done => {
      httpServer = http.createServer();
      SignalsService.create({
        httpServer,
        logger: mockLogger,
        identity,
        config,
        eventBroker: mockEventBroker,
      });

      httpServer.listen(() => {
        const port = (httpServer.address() as AddressInfo)!.port;
        clientSocket = io(`http://localhost:${port}`, {
          path: '/signals',
        });
        // @ts-ignore
        clientSocket.on('connect', done);
      });
    });
  });

  afterEach(() => {
    clientSocket.close();
    httpServer.close();
  });

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  it('should allow subscription and unsubscription', async () => {
    expect.assertions(1);
    clientSocket.emit('subscribe', { pluginId: 'test-plugin' });

    await sleep(500);

    clientSocket.on('message', data => {
      expect(data).toEqual({ data: { test: 'test' }, pluginId: 'test-plugin' });
    });

    onEvent({
      topic: 'signals',
      eventPayload: { test: 'test' },
      metadata: { pluginId: 'test-plugin' },
    });

    await sleep(500);

    clientSocket.emit('unsubscribe', { pluginId: 'test-plugin' });
  });
});
