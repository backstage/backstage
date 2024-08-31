/*
 * Copyright 2022 The Backstage Authors
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

import {
  createBackendModule,
  createExtensionPoint,
  createServiceFactory,
  createServiceRef,
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { Router } from 'express';
import request from 'supertest';

import { startTestBackend } from './TestBackend';
import { mockCredentials } from '../services';

// This bit makes sure that test backends are cleaned up properly
let globalTestBackendHasBeenStopped = false;
beforeAll(async () => {
  await startTestBackend({
    features: [
      createBackendModule({
        pluginId: 'test',
        moduleId: 'test-module',
        register(env) {
          env.registerInit({
            deps: { lifecycle: coreServices.lifecycle },
            async init({ lifecycle }) {
              lifecycle.addShutdownHook(() => {
                globalTestBackendHasBeenStopped = true;
              });
            },
          });
        },
      }),
    ],
  });
});

afterAll(() => {
  if (!globalTestBackendHasBeenStopped) {
    throw new Error('Expected backend to have been stopped');
  }
});

describe('TestBackend', () => {
  it('should get a type error if service implementation does not match', async () => {
    type Obj = { a: string; b: string };
    const serviceRef = createServiceRef<Obj>({ id: 'a' });
    const extensionPoint1 = createExtensionPoint<Obj>({ id: 'b1' });
    const extensionPoint2 = createExtensionPoint<Obj>({ id: 'b2' });
    const extensionPoint3 = createExtensionPoint<Obj>({ id: 'b3' });
    const extensionPoint4 = createExtensionPoint<Obj>({ id: 'b4' });
    const extensionPoint5 = createExtensionPoint<Obj>({ id: 'b5' });
    await expect(
      startTestBackend({
        features: [
          // @ts-expect-error
          [extensionPoint1, { a: 'a' }],
          createServiceFactory({
            service: serviceRef,
            deps: {},
            // @ts-expect-error
            factory: async () => ({ a: 'a' }),
          }),
          createServiceFactory({
            service: serviceRef,
            deps: {},
            factory: async () => ({ a: 'a', b: 'b' }),
          }),
          createServiceFactory({
            service: serviceRef,
            deps: {},
            // @ts-expect-error
            factory: async () => ({ c: 'c' }),
          }),
          createServiceFactory({
            service: serviceRef,
            deps: {},
            // @ts-expect-error
            factory: async () => ({ a: 'a', c: 'c' }),
          }),
          createServiceFactory({
            service: serviceRef,
            deps: {},
            factory: async () => ({ a: 'a', b: 'b', c: 'c' }),
          }),
        ],
        extensionPoints: [
          // @ts-expect-error
          [serviceRef, { a: 'a' }],
          [extensionPoint1, { a: 'a' }],
          [extensionPoint2, { a: 'a', b: 'b' }],
          // @ts-expect-error
          [extensionPoint3, { c: 'c' }],
          // @ts-expect-error
          [extensionPoint4, { a: 'a', c: 'c' }],
          // @ts-expect-error
          [extensionPoint5, { a: 'a', b: 'b', c: 'c' }],
        ],
      }),
    ).rejects.toThrow();
  });

  it('should start the test backend', async () => {
    const testRef = createServiceRef<(v: string) => void>({ id: 'test' });
    const testFn = jest.fn();

    const sf = createServiceFactory({
      deps: {},
      service: testRef,
      factory: async () => {
        return testFn;
      },
    });

    const testModule = createBackendModule({
      pluginId: 'test',
      moduleId: 'test-module',
      register(env) {
        env.registerInit({
          deps: {
            test: testRef,
          },
          async init({ test }) {
            test('winning');
          },
        });
      },
    });

    await startTestBackend({
      features: [testModule, sf],
    });

    expect(testFn).toHaveBeenCalledWith('winning');
  });

  it('should stop the test backend', async () => {
    const shutdownSpy = jest.fn();

    const testModule = createBackendModule({
      pluginId: 'test',
      moduleId: 'test-module',
      register(env) {
        env.registerInit({
          deps: {
            lifecycle: coreServices.lifecycle,
          },
          async init({ lifecycle }) {
            lifecycle.addShutdownHook(shutdownSpy);
          },
        });
      },
    });

    const backend = await startTestBackend({
      features: [testModule],
    });

    expect(shutdownSpy).not.toHaveBeenCalled();
    await backend.stop();
    expect(shutdownSpy).toHaveBeenCalled();
  });

  it('should provide a set of default services', async () => {
    expect.assertions(2);

    const testPlugin = createBackendPlugin({
      pluginId: 'test',
      register(env) {
        env.registerInit({
          deps: {
            cache: coreServices.cache,
            config: coreServices.rootConfig,
            database: coreServices.database,
            discovery: coreServices.discovery,
            httpRouter: coreServices.httpRouter,
            lifecycle: coreServices.lifecycle,
            logger: coreServices.logger,
            permissions: coreServices.permissions,
            pluginMetadata: coreServices.pluginMetadata,
            rootHttpRouter: coreServices.rootHttpRouter,
            rootLifecycle: coreServices.rootLifecycle,
            rootLogger: coreServices.rootLogger,
            scheduler: coreServices.scheduler,
            urlReader: coreServices.urlReader,
            auth: coreServices.auth,
            httpAuth: coreServices.httpAuth,
          },
          async init(deps) {
            expect(Object.keys(deps)).toHaveLength(16);
            expect(Object.values(deps)).not.toContain(undefined);
          },
        });
      },
    });

    await startTestBackend({
      features: [testPlugin],
    });
  });

  it('should allow making requests via supertest', async () => {
    const testPlugin = createBackendPlugin({
      pluginId: 'test',
      register(env) {
        env.registerInit({
          deps: {
            httpRouter: coreServices.httpRouter,
          },
          async init({ httpRouter }) {
            const router = Router();
            router.use('/ping-me', (_, res) => res.json({ message: 'pong' }));
            httpRouter.use(router);
          },
        });
      },
    });

    const { server } = await startTestBackend({ features: [testPlugin] });

    const res = await request(server)
      .get('/api/test/ping-me')
      .set('authorization', mockCredentials.user.header());
    expect(res.status).toEqual(200);
    expect(res.body).toEqual({ message: 'pong' });
  });

  it('should expose health check endpoints', async () => {
    const { server } = await startTestBackend({ features: [] });

    const res = await request(server).get('/.backstage/health/v1/liveness');

    expect(res.status).toEqual(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('should provide extension point implementations', async () => {
    expect.assertions(3);

    const extensionPointA = createExtensionPoint<string>({ id: 'a' });
    const extensionPointB = createExtensionPoint<string>({ id: 'b' });
    await expect(
      startTestBackend({
        extensionPoints: [
          [extensionPointA, 'a'],
          [extensionPointB, 'b'],
        ],
        features: [
          createBackendModule({
            pluginId: 'testA',
            moduleId: 'test',
            register(reg) {
              reg.registerInit({
                deps: { ext: extensionPointA },
                async init({ ext }) {
                  expect(ext).toBe('a');
                },
              });
            },
          }),
          createBackendModule({
            pluginId: 'testB',
            moduleId: 'test',
            register(reg) {
              reg.registerInit({
                deps: { ext: extensionPointB },
                async init({ ext }) {
                  expect(ext).toBe('b');
                },
              });
            },
          }),
        ],
      }),
    ).resolves.not.toBeUndefined();
  });

  it('should reject extension point used by multiple plugins', async () => {
    const extensionPointA = createExtensionPoint<string>({ id: 'a' });
    await expect(
      startTestBackend({
        extensionPoints: [[extensionPointA, 'a']],
        features: [
          createBackendModule({
            pluginId: 'testA',
            moduleId: 'test',
            register(reg) {
              reg.registerInit({
                deps: { ext: extensionPointA },
                async init() {},
              });
            },
          }),
          createBackendModule({
            pluginId: 'testB',
            moduleId: 'test',
            register(reg) {
              reg.registerInit({
                deps: { ext: extensionPointA },
                async init() {},
              });
            },
          }),
        ],
      }),
    ).rejects.toThrow(
      "Illegal dependency: Module 'test' for plugin 'testB' attempted to depend on extension point 'a' for plugin 'testA'. Extension points can only be used within their plugin's scope.",
    );
  });

  it('should reject extension point not used by any plugin', async () => {
    const extensionPointA = createExtensionPoint<string>({ id: 'a' });
    await expect(
      startTestBackend({
        extensionPoints: [[extensionPointA, 'a']],
      }),
    ).rejects.toThrow(
      "Unable to determine the plugin ID of extension point(s) 'a'. Tested extension points must be depended on by one or more tested modules.",
    );
  });

  it('should forward errors from plugins', async () => {
    await expect(
      startTestBackend({
        features: [
          createBackendPlugin({
            pluginId: 'test',
            register(reg) {
              reg.registerInit({
                deps: {},
                async init() {
                  throw new Error('nah');
                },
              });
            },
          }),
        ],
      }),
    ).rejects.toThrow("Plugin 'test' startup failed; caused by Error: nah");
  });

  it('should forward errors from modules', async () => {
    await expect(
      startTestBackend({
        features: [
          createBackendModule({
            pluginId: 'test',
            moduleId: 'tester',
            register(reg) {
              reg.registerInit({
                deps: {},
                async init() {
                  throw new Error('nah');
                },
              });
            },
          }),
        ],
      }),
    ).rejects.toThrow(
      "Module 'tester' for plugin 'test' startup failed; caused by Error: nah",
    );
  });

  it('should forward errors from plugin register', async () => {
    await expect(
      startTestBackend({
        features: [
          createBackendPlugin({
            pluginId: 'test',
            register() {
              throw new Error('nah');
            },
          }),
        ],
      }),
    ).rejects.toThrow('nah');
  });

  it('should forward errors from module register', async () => {
    await expect(
      startTestBackend({
        features: [
          createBackendModule({
            pluginId: 'test',
            moduleId: 'tester',
            register() {
              throw new Error('nah');
            },
          }),
        ],
      }),
    ).rejects.toThrow('nah');
  });
});
