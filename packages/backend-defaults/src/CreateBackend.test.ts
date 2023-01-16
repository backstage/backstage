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

import {
  coreServices,
  createBackendPlugin,
  createServiceFactory,
  createServiceRef,
  createSharedEnvironment,
} from '@backstage/backend-plugin-api';
import { mockConfigFactory } from '@backstage/backend-test-utils';
import { createBackend } from './CreateBackend';

const fooServiceRef = createServiceRef<string>({ id: 'foo', scope: 'root' });
const barServiceRef = createServiceRef<string>({ id: 'bar', scope: 'root' });

describe('createBackend', () => {
  it('should not throw when overriding a default service implementation', () => {
    expect(() =>
      createBackend({
        services: [
          createServiceFactory({
            service: coreServices.rootLifecycle,
            deps: {},
            factory: async () => ({ addShutdownHook: () => {} }),
          }),
        ],
      }),
    ).not.toThrow();
  });

  it('should throw on duplicate service implementations', () => {
    expect(() =>
      createBackend({
        services: [
          createServiceFactory({
            service: coreServices.rootLifecycle,
            deps: {},
            factory: async () => ({ addShutdownHook: () => {} }),
          }),
          createServiceFactory({
            service: coreServices.rootLifecycle,
            deps: {},
            factory: async () => ({ addShutdownHook: () => {} }),
          }),
        ],
      }),
    ).toThrow(
      'Duplicate service implementations provided for core.rootLifecycle',
    );
  });

  it('should throw when providing a plugin metadata service implementation', () => {
    expect(() =>
      createBackend({
        services: [
          createServiceFactory({
            service: coreServices.pluginMetadata,
            deps: {},
            factory: async () => ({ getId: () => 'test' }),
          }),
        ],
      }),
    ).toThrow('The core.pluginMetadata service cannot be overridden');
  });

  it('should throw if an unsupported InternalSharedEnvironment version is passed in', () => {
    expect(() =>
      createBackend({
        env: {} as any,
      }),
    ).toThrow(
      "Shared environment version 'undefined' is invalid or not supported",
    );
    expect(() =>
      createBackend({
        env: { version: {} } as any,
      }),
    ).toThrow(
      "Shared environment version '[object Object]' is invalid or not supported",
    );
    expect(() =>
      createBackend({
        env: { version: 'v2' } as any,
      }),
    ).toThrow("Shared environment version 'v2' is invalid or not supported");
  });

  it('should prioritize services correctly', async () => {
    const backend = createBackend({
      env: createSharedEnvironment({
        services: [
          createServiceFactory({
            service: coreServices.rootHttpRouter,
            deps: {},
            async factory() {
              return {
                use() {},
              };
            },
          }),
          mockConfigFactory({
            data: { root: 'root-env' },
          }),
          createServiceFactory({
            service: fooServiceRef,
            deps: {},
            async factory() {
              return 'foo-env';
            },
          }),
          createServiceFactory({
            service: barServiceRef,
            deps: {},
            async factory() {
              return 'bar-env';
            },
          }),
        ],
      })(),
      services: [
        createServiceFactory({
          service: fooServiceRef,
          deps: {},
          factory: async () => 'foo-backend',
        }),
      ],
    });

    expect.assertions(3);
    backend.add(
      createBackendPlugin({
        id: 'test',
        register(reg) {
          reg.registerInit({
            deps: {
              config: coreServices.config,
              foo: fooServiceRef,
              bar: barServiceRef,
            },
            async init({ config, foo, bar }) {
              expect(config.get('root')).toBe('root-env');
              expect(foo).toBe('foo-backend');
              expect(bar).toBe('bar-env');
            },
          });
        },
      })(),
    );

    await backend.start();
  });
});
