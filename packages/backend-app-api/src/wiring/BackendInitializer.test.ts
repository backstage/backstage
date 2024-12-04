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

import { rootLifecycleServiceFactory } from '@backstage/backend-defaults/rootLifecycle';
import { lifecycleServiceFactory } from '@backstage/backend-defaults/lifecycle';
import { loggerServiceFactory } from '@backstage/backend-defaults/logger';
import {
  createServiceRef,
  createServiceFactory,
  coreServices,
  createBackendPlugin,
  createBackendModule,
  createExtensionPoint,
  createBackendFeatureLoader,
} from '@backstage/backend-plugin-api';
import { BackendInitializer } from './BackendInitializer';
import { instanceMetadataServiceRef } from '@backstage/backend-plugin-api/alpha';

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
  lifecycleServiceFactory,
  rootLifecycleServiceFactory,
  createServiceFactory({
    service: coreServices.rootLogger,
    deps: {},
    factory: () => new MockLogger(),
  }),
  loggerServiceFactory,
];

const testPlugin = createBackendPlugin({
  pluginId: 'test',
  register(reg) {
    reg.registerInit({
      deps: {},
      async init() {},
    });
  },
});

describe('BackendInitializer', () => {
  it('should initialize root scoped services', async () => {
    const ref1 = createServiceRef<{ x: number }>({
      id: '1',
      scope: 'root',
    });
    const ref2 = createServiceRef<{ x: number }>({
      id: '2',
      scope: 'root',
    });
    const ref3 = createServiceRef<{ x: number }>({
      id: '3',
      scope: 'root',
    });
    const factory1 = jest.fn();
    const factory2 = jest.fn();
    const factory3 = jest.fn();

    const services = [
      ...baseFactories,
      createServiceFactory({
        service: ref1,
        initialization: 'always',
        deps: {},
        factory: factory1,
      }),
      createServiceFactory({
        service: ref2,
        deps: {},
        factory: factory2,
      }),
      createServiceFactory({
        service: ref3,
        initialization: 'lazy',
        deps: {},
        factory: factory3,
      }),
    ];

    const init = new BackendInitializer(services);
    await init.start();

    expect(factory1).toHaveBeenCalled();
    expect(factory2).toHaveBeenCalled();
    expect(factory3).not.toHaveBeenCalled();
  });

  it('should discover features from feature loader', async () => {
    const ref1 = createServiceRef<{ x: number }>({
      id: '1',
      scope: 'root',
    });
    const ref2 = createServiceRef<{ x: number }>({
      id: '2',
      scope: 'plugin',
    });
    const factory1 = jest.fn();
    const factory2 = jest.fn();

    const pluginInit = jest.fn(async () => {});
    const moduleInit = jest.fn(async () => {});

    const init = new BackendInitializer(baseFactories);
    init.add(
      createBackendFeatureLoader({
        *loader() {
          yield createServiceFactory({
            service: ref1,
            deps: {},
            factory: factory1,
          });
          yield createServiceFactory({
            service: ref2,
            initialization: 'always',
            deps: {},
            factory: factory2,
          });
          yield createBackendPlugin({
            pluginId: 'test',
            register(reg) {
              reg.registerInit({
                deps: {},
                init: pluginInit,
              });
            },
          });
          yield createBackendModule({
            pluginId: 'test',
            moduleId: 'tester',
            register(reg) {
              reg.registerInit({
                deps: {},
                init: moduleInit,
              });
            },
          });
        },
      }),
    );
    await init.start();

    expect(factory1).toHaveBeenCalled();
    expect(factory2).toHaveBeenCalled();
    expect(pluginInit).toHaveBeenCalled();
    expect(moduleInit).toHaveBeenCalled();
  });

  it('should refuse to override already initialized services through loaded features', async () => {
    const ref1 = createServiceRef<{ x: number }>({
      id: '1',
      scope: 'root',
    });

    const init = new BackendInitializer([
      ...baseFactories,
      createServiceFactory({
        service: ref1,
        deps: {},
        factory: () => ({ x: 1 }),
      }),
    ]);
    init.add(
      createBackendFeatureLoader({
        deps: { service1: ref1 },
        *loader() {
          yield createServiceFactory({
            service: ref1,
            deps: {},
            factory: jest.fn(),
          });
        },
      }),
    );
    await expect(init.start()).rejects.toThrow(
      'Unable to set service factory with id 1, service has already been instantiated',
    );
  });

  it('should refuse feature loader that depends on a plugin scoped service', async () => {
    const ref1 = createServiceRef<{ x: number }>({
      id: '1',
    });

    const init = new BackendInitializer([
      ...baseFactories,
      createServiceFactory({
        service: ref1,
        deps: {},
        factory: () => ({ x: 1 }),
      }),
    ]);
    init.add(
      createBackendFeatureLoader({
        // @ts-expect-error
        deps: { service1: ref1 },
        *loader() {
          yield createServiceFactory({
            service: ref1,
            deps: {},
            factory: jest.fn(),
          });
        },
      }),
    );
    await expect(init.start()).rejects.toThrow(
      /^Feature loaders can only depend on root scoped services, but 'service1' is scoped to 'plugin'. Offending loader is created at '.*'$/,
    );
  });

  it('should initialize plugin scoped services with eager initialization', async () => {
    const ref1 = createServiceRef<{ x: number }>({
      id: '1',
    });
    const ref2 = createServiceRef<{ x: number }>({
      id: '2',
    });
    const ref3 = createServiceRef<{ x: number }>({
      id: '3',
    });
    const factory1 = jest.fn();
    const factory2 = jest.fn();
    const factory3 = jest.fn();

    const services = [
      ...baseFactories,
      createServiceFactory({
        service: ref1,
        initialization: 'always',
        deps: {},
        factory: factory1,
      }),
      createServiceFactory({
        service: ref2,
        deps: {},
        factory: factory2,
      }),
      createServiceFactory({
        service: ref3,
        initialization: 'lazy',
        deps: {},
        factory: factory3,
      }),
    ];

    const init = new BackendInitializer(services);
    init.add(
      createBackendPlugin({
        pluginId: 'test',
        register(reg) {
          reg.registerInit({
            deps: {},
            async init() {},
          });
        },
      }),
    );
    await init.start();

    expect(factory1).toHaveBeenCalled();
    expect(factory2).not.toHaveBeenCalled();
    expect(factory3).not.toHaveBeenCalled();
  });

  it('should initialize modules with extension points', async () => {
    expect.assertions(3);

    const extensionPoint = createExtensionPoint<{ values: string[] }>({
      id: 'a',
    });
    const init = new BackendInitializer(baseFactories);

    init.add(testPlugin);
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
      }),
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
      }),
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
      }),
    );
    await init.start();
  });

  it('should allow plugins and modules depend on multiton services', async () => {
    expect.assertions(2);

    const multiServiceRef = createServiceRef<string>({
      id: 'a',
      multiton: true,
    });
    const init = new BackendInitializer(baseFactories);

    init.add(
      createServiceFactory({
        service: multiServiceRef,
        deps: {},
        factory: () => 'x',
      }),
    );
    init.add(
      createServiceFactory({
        service: multiServiceRef,
        deps: {},
        factory: () => 'y',
      }),
    );

    init.add(
      createBackendPlugin({
        pluginId: 'test',
        register(reg) {
          reg.registerInit({
            deps: { multi: multiServiceRef },
            async init({ multi }) {
              expect(multi).toEqual(['x', 'y']);
            },
          });
        },
      }),
    );

    init.add(
      createBackendModule({
        pluginId: 'test',
        moduleId: 'test',
        register(reg) {
          reg.registerInit({
            deps: { multi: multiServiceRef },
            async init({ multi }) {
              expect(multi).toEqual(['x', 'y']);
            },
          });
        },
      }),
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
      }),
    );
    await expect(init.start()).rejects.toThrow(
      "Plugin 'test' startup failed; caused by Error: NOPE",
    );
  });

  it('should forward errors when multiple plugins fail to start', async () => {
    const init = new BackendInitializer([]);
    init.add(
      createBackendPlugin({
        pluginId: 'test-1',
        register(reg) {
          reg.registerInit({
            deps: {},
            async init() {
              throw new Error('NOPE A');
            },
          });
        },
      }),
    );
    init.add(
      createBackendPlugin({
        pluginId: 'test-2',
        register(reg) {
          reg.registerInit({
            deps: {},
            async init() {
              throw new Error('NOPE B');
            },
          });
        },
      }),
    );
    const result = init.start();

    await expect(result).rejects.toThrow('Backend startup failed');
    await expect(result).rejects.toMatchObject({
      errors: [
        expect.objectContaining({
          message: "Plugin 'test-1' startup failed; caused by Error: NOPE A",
        }),
        expect.objectContaining({
          message: "Plugin 'test-2' startup failed; caused by Error: NOPE B",
        }),
      ],
    });
  });

  it('should forward errors when modules fail to start', async () => {
    const init = new BackendInitializer([]);
    init.add(testPlugin);
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
      }),
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
      }),
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
      }),
    );
    await expect(init.start()).rejects.toThrow(
      "Plugin 'test' is already registered",
    );
  });

  it('should reject duplicate modules', async () => {
    const init = new BackendInitializer([]);
    init.add(testPlugin);
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
      }),
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
      }),
    );
    await expect(init.start()).rejects.toThrow(
      "Module 'mod' for plugin 'test' is already registered",
    );
  });

  it('should reject modules with circular dependencies', async () => {
    const extA = createExtensionPoint<string>({ id: 'a' });
    const extB = createExtensionPoint<string>({ id: 'b' });
    const init = new BackendInitializer([
      rootLifecycleServiceFactory,
      createServiceFactory({
        service: coreServices.rootLogger,
        deps: {},
        factory: () => new MockLogger(),
      }),
    ]);
    init.add(testPlugin);
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
      }),
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
      }),
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
      }),
    );
    init.add(testPlugin);
    init.add(
      createBackendModule({
        pluginId: 'test',
        moduleId: 'mod',
        register(reg) {
          reg.registerInit({
            deps: { ext: extA },
            async init() {},
          });
        },
      }),
    );
    await expect(init.start()).rejects.toThrow(
      "Illegal dependency: Module 'mod' for plugin 'test' attempted to depend on extension point 'a' for plugin 'test-a'. Extension points can only be used within their plugin's scope.",
    );
  });

  it('should reject plugins with missing dependencies', async () => {
    const init = new BackendInitializer(baseFactories);
    const ref = createServiceRef<string>({ id: 'a' });
    init.add(
      createBackendPlugin({
        pluginId: 'test',
        register(reg) {
          reg.registerInit({
            deps: { ref },
            async init() {},
          });
        },
      }),
    );
    await expect(init.start()).rejects.toThrow(
      "Service or extension point dependencies of plugin 'test' are missing for the following ref(s): serviceRef{a}",
    );
  });

  it('should reject modules with missing dependencies', async () => {
    const init = new BackendInitializer(baseFactories);
    const ref = createServiceRef<string>({ id: 'a' });
    init.add(
      createBackendPlugin({
        pluginId: 'test',
        register(reg) {
          reg.registerInit({
            deps: {},
            async init() {},
          });
        },
      }),
    );
    init.add(
      createBackendModule({
        pluginId: 'test',
        moduleId: 'test-mod',
        register(reg) {
          reg.registerInit({
            deps: { ref },
            async init() {},
          });
        },
      }),
    );
    await expect(init.start()).rejects.toThrow(
      "Service or extension point dependencies of module 'test-mod' for plugin 'test' are missing for the following ref(s): serviceRef{a}",
    );
  });

  it('should properly load double-default CJS modules', async () => {
    expect.assertions(3);

    const init = new BackendInitializer(baseFactories);
    init.add(
      createBackendFeatureLoader({
        loader() {
          return [
            createBackendPlugin({
              pluginId: 'no-double-wrapping',
              register(reg) {
                reg.registerInit({
                  deps: {},
                  async init() {
                    expect(true).toBeTruthy();
                  },
                });
              },
            }),
            {
              default: createBackendPlugin({
                pluginId: 'single-wrapping',
                register(reg) {
                  reg.registerInit({
                    deps: {},
                    async init() {
                      expect(true).toBeTruthy();
                    },
                  });
                },
              }),
            },
            {
              default: {
                default: createBackendPlugin({
                  pluginId: 'double-wrapping',
                  register(reg) {
                    reg.registerInit({
                      deps: {},
                      async init() {
                        expect(true).toBeTruthy();
                      },
                    });
                  },
                }),
              },
            } as any, // not typescript valid, but can happen at runtime
          ];
        },
      }),
    );

    await init.start();
  });

  it('should properly add plugins + modules to the instance metadata service', async () => {
    expect.assertions(1);
    const backend = new BackendInitializer(baseFactories);
    const plugin = createBackendPlugin({
      pluginId: 'test',
      register(reg) {
        reg.registerInit({
          deps: {},
          async init() {},
        });
      },
    });
    const instanceMetadataPlugin = createBackendPlugin({
      pluginId: 'instance-metadata',
      register(reg) {
        reg.registerInit({
          deps: {
            instanceMetadata: instanceMetadataServiceRef,
          },
          async init({ instanceMetadata }) {
            expect(instanceMetadata.getInstalledFeatures()).toEqual([
              {
                pluginId: 'test',
                type: 'plugin',
              },
              {
                pluginId: 'test',
                moduleId: 'test',
                type: 'module',
              },
              {
                pluginId: 'instance-metadata',
                type: 'plugin',
              },
            ]);
          },
        });
      },
    });
    const module = createBackendModule({
      pluginId: 'test',
      moduleId: 'test',
      register(reg) {
        reg.registerInit({
          deps: {},
          async init() {},
        });
      },
    });
    backend.add(plugin);
    backend.add(module);
    backend.add(instanceMetadataPlugin);
    await backend.start();
  });
});
