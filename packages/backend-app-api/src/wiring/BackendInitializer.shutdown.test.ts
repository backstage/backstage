/*
 * Copyright 2026 The Backstage Authors
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
  coreServices,
  createBackendPlugin,
  createServiceFactory,
} from '@backstage/backend-plugin-api';
import { mockServices } from '@backstage/backend-test-utils';
import type { BackendInitializer } from './BackendInitializer';

describe('BackendInitializer shutdown', () => {
  let Initializer: typeof BackendInitializer;

  beforeEach(() => {
    // Each test needs its own instance registry without installing real signal handlers.
    jest.isolateModules(() => {
      Initializer = require('./BackendInitializer').BackendInitializer;
    });
    jest.spyOn(process, 'addListener').mockReturnValue(process);
    jest.spyOn(process, 'exit').mockImplementation(() => undefined as never);
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it.each([
    ['SIGTERM', false],
    ['SIGINT', false],
    ['beforeExit', false],
    ['stop', false],
    ['SIGTERM', true],
    ['SIGINT', true],
    ['beforeExit', true],
    ['stop', true],
  ] as const)(
    'should await cleanup once starting with %s (failure: %s)',
    async (firstRequest, fail) => {
      let releaseShutdown: () => void;
      const shutdownBlocked = new Promise<void>(resolve => {
        releaseShutdown = resolve;
      });
      let notifyShutdown: () => void;
      const shutdownStarted = new Promise<void>(resolve => {
        notifyShutdown = resolve;
      });
      const error = new Error('shutdown failed');
      const beforeShutdown = jest.fn(async () => {
        notifyShutdown();
        await shutdownBlocked;
      });
      const pluginShutdown = jest.fn(async () => {});
      const rootShutdown = jest.fn(async () => {
        expect(pluginShutdown).toHaveBeenCalledTimes(1);
        if (fail) {
          throw error;
        }
      });
      const backend = new Initializer([
        mockServices.rootLogger.factory(),
        mockServices.logger.factory(),
        createServiceFactory({
          service: coreServices.rootLifecycle,
          deps: {},
          factory: () => ({
            ...mockServices.rootLifecycle.mock(),
            startup: async () => {},
            beforeShutdown,
            shutdown: rootShutdown,
          }),
        }),
        createServiceFactory({
          service: coreServices.lifecycle,
          deps: {},
          factory: () => ({
            ...mockServices.lifecycle.mock(),
            startup: async () => {},
            shutdown: pluginShutdown,
          }),
        }),
      ]);
      backend.add(
        createBackendPlugin({
          pluginId: 'test',
          register(reg) {
            reg.registerInit({ deps: {}, async init() {} });
          },
        }),
      );
      await backend.start();

      const handlers = new Map<string, () => Promise<void>>(
        jest
          .mocked(process.addListener)
          .mock.calls.map(([event, handler]) => [
            event,
            handler as () => Promise<void>,
          ]),
      );
      expect([...handlers.keys()]).toEqual(['SIGTERM', 'SIGINT', 'beforeExit']);
      const firstShutdown =
        firstRequest === 'stop'
          ? backend.stop().catch(e => e)
          : handlers.get(firstRequest)!();
      await shutdownStarted;

      let stopCompleted = false;
      const explicitStop = backend.stop().then(
        () => {
          stopCompleted = true;
        },
        e => {
          stopCompleted = true;
          return e;
        },
      );
      const signalRequests = [
        handlers.get('SIGTERM')!(),
        handlers.get('SIGTERM')!(),
        handlers.get('SIGINT')!(),
        handlers.get('beforeExit')!(),
      ];
      // Let duplicate event handlers finish if they incorrectly skip in-flight cleanup.
      await new Promise(resolve => setImmediate(resolve));
      expect(process.exit).not.toHaveBeenCalled();
      expect(stopCompleted).toBe(false);
      expect(beforeShutdown).toHaveBeenCalledTimes(1);
      expect(pluginShutdown).not.toHaveBeenCalled();
      expect(rootShutdown).not.toHaveBeenCalled();

      releaseShutdown!();
      const [firstResult, stopResult] = await Promise.all([
        firstShutdown,
        explicitStop,
        ...signalRequests,
      ]);
      expect(firstResult).toBe(
        firstRequest === 'stop' && fail ? error : undefined,
      );
      expect(stopResult).toBe(fail ? error : undefined);
      expect(beforeShutdown).toHaveBeenCalledTimes(1);
      expect(pluginShutdown).toHaveBeenCalledTimes(1);
      expect(rootShutdown).toHaveBeenCalledTimes(1);
      expect(process.exit).toHaveBeenCalledTimes(1);
      expect(process.exit).toHaveBeenCalledWith(fail ? 1 : 0);
      expect(jest.mocked(console.error).mock.calls).toEqual(
        fail ? [[error]] : [],
      );
      await expect(backend.stop().catch(e => e)).resolves.toBe(
        fail ? error : undefined,
      );
      expect(rootShutdown).toHaveBeenCalledTimes(1);
    },
  );
});
