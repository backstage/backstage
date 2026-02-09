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
import { createBackend } from '@backstage/backend-defaults';
import { Backend } from '@backstage/backend-app-api';
import { mockServices } from '@backstage/backend-test-utils';
import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { Router } from 'express';
import { EventSource } from 'eventsource';
import waitForExpect from 'wait-for-expect';

describe('gateway', () => {
  let backend: Backend;
  let anotherBackend: Backend;

  const dummyPlugin = createBackendPlugin({
    pluginId: 'dummy',
    register(env) {
      env.registerInit({
        deps: {
          httpRouter: coreServices.httpRouter,
        },
        async init({ httpRouter }) {
          const router = Router();
          router.get('/foo', (_req, res) => {
            res.json({ foo: true });
          });

          httpRouter.use(router);
        },
      });
    },
  });

  const discovery = mockServices.discovery.mock();
  discovery.getBaseUrl.mockImplementation(async (pluginId: string) => {
    if (pluginId === 'external-plugin') {
      return 'http://localhost:7778/api/external-plugin';
    }
    return `http://localhost:7777/api/${pluginId}`;
  });

  beforeAll(async () => {
    backend = createBackend();
    backend.add(mockServices.rootHttpRouter.factory());
    backend.add(
      mockServices.rootConfig.factory({
        data: {
          backend: { baseUrl: 'http://localhost:7777', listen: { port: 7777 } },
        },
      }),
    );
    backend.add(mockServices.auth.factory());
    backend.add(mockServices.httpAuth.factory());
    backend.add(discovery.factory);
    backend.add(dummyPlugin);
    backend.add(import('./'));

    anotherBackend = createBackend();
    anotherBackend.add(mockServices.rootHttpRouter.factory());
    anotherBackend.add(
      mockServices.rootConfig.factory({
        data: {
          backend: { baseUrl: 'http://localhost:7778', listen: { port: 7778 } },
        },
      }),
    );
    anotherBackend.add(mockServices.auth.factory());
    anotherBackend.add(mockServices.httpAuth.factory());
    anotherBackend.add(mockServices.discovery.factory());
    anotherBackend.add(
      createBackendPlugin({
        pluginId: 'external-plugin',
        register(env) {
          env.registerInit({
            deps: {
              rootHttpRouter: coreServices.rootHttpRouter,
              httpRouter: coreServices.httpRouter,
            },
            async init({ httpRouter }) {
              const router = Router();
              router.get('/foo', (_req, res) => {
                res.json({ bar: true });
              });

              router.get('/endpoint-sse', async (_req, res) => {
                res.setHeader('Content-Type', 'text/event-stream');
                res.setHeader('Cache-Control', 'no-cache');
                res.setHeader('Connection', 'keep-alive');

                // Send periodic updates
                let data = { timestamp: new Date().toISOString() };
                res.write(`data: ${JSON.stringify(data)}\n\n`);
                res.flush();
                await pause(50);

                data = { timestamp: new Date().toISOString() };
                res.write(`data: ${JSON.stringify(data)}\n\n`);
                res.flush();
                await pause(50);

                data = { timestamp: new Date().toISOString() };
                res.write(`data: ${JSON.stringify(data)}\n\n`);
                res.flush();
                await pause(50);

                res.destroy();
              });

              httpRouter.use(router);
            },
          });
        },
      }),
    );
    await Promise.all([backend.start(), anotherBackend.start()]);
  }, 15_000);

  afterAll(async () => {
    await backend.stop();
    await anotherBackend.stop();
  });

  it('should invoke the endpoint of an installed plugin', async () => {
    const response = await fetch('http://localhost:7777/api/dummy/foo');
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toEqual({ foo: true });
  });

  it('should proxy requests for unknown plugins', async () => {
    const response = await fetch(
      'http://localhost:7777/api/external-plugin/foo',
    );
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toEqual({ bar: true });
  });

  it('should detect looped requests', async () => {
    const response = await fetch(
      'http://localhost:7777/api/nonexistent-plugin/foo',
    );
    expect(response.status).toBe(508);

    const data = await response.json();
    expect(data).toEqual({
      error: {
        name: 'LoopDetectedError',
        message: 'Maximum proxy hop count exceeded (3)',
      },
    });
  });

  it('should detect looped requests with intentional negative hop count', async () => {
    const response = await fetch(
      'http://localhost:7777/api/nonexistent-plugin/foo',
      {
        headers: {
          'backstage-gateway-hops': '-1000000',
        },
      },
    );
    expect(response.status).toBe(508);

    const data = await response.json();
    expect(data).toEqual({
      error: {
        name: 'LoopDetectedError',
        message: 'Maximum proxy hop count exceeded (3)',
      },
    });
  });

  it('should close the response for sse connections', async () => {
    const eventSource = new EventSource(
      'http://localhost:7777/api/external-plugin/endpoint-sse',
    );

    const mockOnMessage = jest.fn();
    const mockOnError = jest.fn();
    eventSource.addEventListener('message', mockOnMessage);
    eventSource.addEventListener('error', mockOnError);

    await waitForExpect(() => {
      expect(mockOnMessage).toHaveBeenCalledTimes(3);
      expect(mockOnError).toHaveBeenCalled();
    });
  });
});

function pause(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
