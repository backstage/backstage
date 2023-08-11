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
  createServiceRef,
  createServiceFactory,
  coreServices,
  createBackendPlugin,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import { BackendInitializer } from './BackendInitializer';
import { ServiceRegistry } from './ServiceRegistry';
import { rootLifecycleServiceFactory } from '../services/implementations';

const rootRef = createServiceRef<{ x: number }>({
  id: '1',
  scope: 'root',
});

const pluginRef = createServiceRef<{ x: number }>({
  id: '2',
});

class MockLogger {
  debug() {}
  info() {}
  warn() {}
  error() {}
  child() {
    return this;
  }
}

describe('BackendInitializer', () => {
  it('should initialize root scoped services', async () => {
    const rootFactory = jest.fn();
    const pluginFactory = jest.fn();

    const registry = new ServiceRegistry([
      createServiceFactory({
        service: rootRef,
        deps: {},
        factory: rootFactory,
      })(),
      createServiceFactory({
        service: pluginRef,
        deps: {},
        factory: pluginFactory,
      })(),
      rootLifecycleServiceFactory(),
      createServiceFactory({
        service: coreServices.rootLogger,
        deps: {},
        factory: () => new MockLogger(),
      })(),
    ]);

    const init = new BackendInitializer(registry);
    await init.start();

    expect(rootFactory).toHaveBeenCalled();
    expect(pluginFactory).not.toHaveBeenCalled();
  });

  it('should forward errors when plugins fail to start', async () => {
    const init = new BackendInitializer(new ServiceRegistry([]));
    init.add(
      createBackendPlugin({
        pluginId: 'test',
        register(reg) {
          reg.registerInit({
            deps: {},
            async init() {
              throw new Error('NOPE');
            },
          });
        },
      })(),
    );
    await expect(init.start()).rejects.toThrow(
      "Plugin 'test' startup failed; caused by Error: NOPE",
    );
  });

  it('should forward errors when modules fail to start', async () => {
    const init = new BackendInitializer(new ServiceRegistry([]));
    init.add(
      createBackendModule({
        pluginId: 'test',
        moduleId: 'mod',
        register(reg) {
          reg.registerInit({
            deps: {},
            async init() {
              throw new Error('NOPE');
            },
          });
        },
      })(),
    );
    await expect(init.start()).rejects.toThrow(
      "Module 'mod' for plugin 'test' startup failed; caused by Error: NOPE",
    );
  });

  it('should reject duplicate plugins', async () => {
    const init = new BackendInitializer(new ServiceRegistry([]));
    init.add(
      createBackendPlugin({
        pluginId: 'test',
        register(reg) {
          reg.registerInit({
            deps: {},
            async init() {},
          });
        },
      })(),
    );
    init.add(
      createBackendPlugin({
        pluginId: 'test',
        register(reg) {
          reg.registerInit({
            deps: {},
            async init() {},
          });
        },
      })(),
    );
    await expect(init.start()).rejects.toThrow(
      "Plugin 'test' is already registered",
    );
  });

  it('should reject duplicate modules', async () => {
    const init = new BackendInitializer(new ServiceRegistry([]));
    init.add(
      createBackendModule({
        pluginId: 'test',
        moduleId: 'mod',
        register(reg) {
          reg.registerInit({
            deps: {},
            async init() {},
          });
        },
      })(),
    );
    init.add(
      createBackendModule({
        pluginId: 'test',
        moduleId: 'mod',
        register(reg) {
          reg.registerInit({
            deps: {},
            async init() {},
          });
        },
      })(),
    );
    await expect(init.start()).rejects.toThrow(
      "Module 'mod' for plugin 'test' is already registered",
    );
  });
});
