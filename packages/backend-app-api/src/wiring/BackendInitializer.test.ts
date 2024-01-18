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
  createExtensionPoint,
} from '@backstage/backend-plugin-api';
import { BackendInitializer } from './BackendInitializer';

import {
  lifecycleServiceFactory,
  loggerServiceFactory,
  rootLifecycleServiceFactory,
} from '../services/implementations';

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

const baseFactories = [
  lifecycleServiceFactory(),
  rootLifecycleServiceFactory(),
  createServiceFactory({
    service: coreServices.rootLogger,
    deps: {},
    factory: () => new MockLogger(),
  })(),
  loggerServiceFactory(),
];

describe('BackendInitializer', () => {
  it('should initialize root scoped services', async () => {
    const rootFactory = jest.fn();
    const pluginFactory = jest.fn();

    const services = [
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
    ];

    const init = new BackendInitializer(services);
    await init.start();

    expect(rootFactory).toHaveBeenCalled();
    expect(pluginFactory).not.toHaveBeenCalled();
  });

  it('should initialize modules with extension points', async () => {
    expect.assertions(3);

    const extensionPoint = createExtensionPoint<{ values: string[] }>({
      id: 'a',
    });
    const init = new BackendInitializer(baseFactories);

    init.add(
      createBackendModule({
        pluginId: 'test',
        moduleId: 'mod-a',
        register(reg) {
          reg.registerInit({
            deps: { extension: extensionPoint },
            async init({ extension }) {
              expect(extension.values).toEqual(['b']);
              extension.values.push('a');
            },
          });
        },
      })(),
    );

    init.add(
      createBackendModule({
        pluginId: 'test',
        moduleId: 'mod-b',
        register(reg) {
          const values = ['b'];
          reg.registerExtensionPoint(extensionPoint, { values });
          reg.registerInit({
            deps: {},
            async init() {
              expect(values).toEqual(['b', 'a', 'c']);
            },
          });
        },
      })(),
    );

    init.add(
      createBackendModule({
        pluginId: 'test',
        moduleId: 'mod-c',
        register(reg) {
          reg.registerInit({
            deps: { extension: extensionPoint },
            async init({ extension }) {
              expect(extension.values).toEqual(['b', 'a']);
              extension.values.push('c');
            },
          });
        },
      })(),
    );
    await init.start();
  });

  it('should forward errors when plugins fail to start', async () => {
    const init = new BackendInitializer([]);
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
    const init = new BackendInitializer([]);
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
    const init = new BackendInitializer([]);
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
    const init = new BackendInitializer([]);
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

  it('should reject modules with circular dependencies', async () => {
    const extA = createExtensionPoint<string>({ id: 'a' });
    const extB = createExtensionPoint<string>({ id: 'b' });
    const init = new BackendInitializer([
      rootLifecycleServiceFactory(),
      createServiceFactory({
        service: coreServices.rootLogger,
        deps: {},
        factory: () => new MockLogger(),
      })(),
    ]);
    init.add(
      createBackendModule({
        pluginId: 'test',
        moduleId: 'mod-a',
        register(reg) {
          reg.registerExtensionPoint(extA, 'a');
          reg.registerInit({
            deps: { ext: extB },
            async init() {},
          });
        },
      })(),
    );
    init.add(
      createBackendModule({
        pluginId: 'test',
        moduleId: 'mod-b',
        register(reg) {
          reg.registerExtensionPoint(extB, 'b');
          reg.registerInit({
            deps: { ext: extA },
            async init() {},
          });
        },
      })(),
    );
    await expect(init.start()).rejects.toThrow(
      "Circular dependency detected for modules of plugin 'test', 'mod-a' -> 'mod-b' -> 'mod-a'",
    );
  });

  it('should reject modules that depend on extension points other plugins', async () => {
    const init = new BackendInitializer(baseFactories);
    const extA = createExtensionPoint<string>({ id: 'a' });
    init.add(
      createBackendPlugin({
        pluginId: 'test-a',
        register(reg) {
          reg.registerExtensionPoint(extA, 'a');
          reg.registerInit({
            deps: {},
            async init() {},
          });
        },
      })(),
    );
    init.add(
      createBackendModule({
        pluginId: 'test-b',
        moduleId: 'mod',
        register(reg) {
          reg.registerInit({
            deps: { ext: extA },
            async init() {},
          });
        },
      })(),
    );
    await expect(init.start()).rejects.toThrow(
      "Illegal dependency: Module 'mod' for plugin 'test-b' attempted to depend on extension point 'a' for plugin 'test-a'. Extension points can only be used within their plugin's scope.",
    );
  });
});
