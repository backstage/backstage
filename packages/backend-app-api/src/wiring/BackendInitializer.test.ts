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
  createBackendPlugin,
  createBackendModule,
  createExtensionPoint,
  createBackendFeatureLoader,
  ServiceRef,
  coreServices,
} from '@backstage/backend-plugin-api';
import { BackendInitializer } from './BackendInitializer';
import { mockServices } from '@backstage/backend-test-utils';
import { BackendStartupError } from './BackendStartupError';

const baseFactories = [
  mockServices.rootLifecycle.factory(),
  mockServices.lifecycle.factory(),
  mockServices.rootLogger.factory(),
  mockServices.logger.factory(),
];

function mkNoopFactory(ref: ServiceRef<{}, 'plugin'>) {
  const fn = jest.fn().mockReturnValue({});
  return Object.assign(
    fn,
    createServiceFactory({
      service: ref,
      deps: {},
      factory: fn,
    }),
  );
}

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
  it('should only load modules if the plugin is present', async () => {
    let loadedModule = false;
    const backend1 = new BackendInitializer(baseFactories);
    const testModule = createBackendModule({
      pluginId: 'test',
      moduleId: 'producer',
      register(reg) {
        reg.registerInit({
          deps: {},
          async init() {
            loadedModule = true;
          },
        });
      },
    });
    await backend1.add(testModule);
    await backend1.start();
    expect(loadedModule).toBe(false);

    const backend2 = new BackendInitializer(baseFactories);
    await backend2.add(testModule);
    await backend2.add(
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
    await backend2.start();
    expect(loadedModule).toBe(true);
  });

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

  it('should ignore services provided by feature loaders that have already been explicitly added', async () => {
    const ref = createServiceRef<{}>({ id: '1' });
    const factory1 = mkNoopFactory(ref);
    const factory2 = mkNoopFactory(ref);
    const factory3 = mkNoopFactory(ref);

    const init = new BackendInitializer([...baseFactories, factory1]);
    init.add(factory2);
    init.add(
      createBackendFeatureLoader({
        deps: {},
        *loader() {
          yield factory3;
        },
      }),
    );
    init.add(
      createBackendPlugin({
        pluginId: 'tester',
        register(reg) {
          reg.registerInit({
            deps: { ref },
            async init() {},
          });
        },
      }),
    );

    await init.start();

    expect(factory1).not.toHaveBeenCalled();
    expect(factory2).toHaveBeenCalled();
    expect(factory3).not.toHaveBeenCalled();
  });

  it('should include all multiton service factories', async () => {
    expect.assertions(5);

    const ref = createServiceRef<number>({ id: '1', multiton: true });
    const factory1 = mkNoopFactory(ref).mockResolvedValue(1);
    const factory2 = mkNoopFactory(ref).mockResolvedValue(2);
    const factory3 = mkNoopFactory(ref).mockResolvedValue(3);
    const factory4 = mkNoopFactory(ref).mockResolvedValue(4);

    const init = new BackendInitializer([...baseFactories, factory1]);
    init.add(factory2);
    init.add(
      createBackendFeatureLoader({
        deps: {},
        *loader() {
          yield factory3;
          yield factory4;
        },
      }),
    );
    init.add(
      createBackendPlugin({
        pluginId: 'tester',
        register(reg) {
          reg.registerInit({
            deps: { ns: ref },
            async init({ ns }) {
              expect(ns).toEqual([1, 2, 3, 4]);
            },
          });
        },
      }),
    );

    await init.start();

    expect(factory1).toHaveBeenCalled();
    expect(factory2).toHaveBeenCalled();
    expect(factory3).toHaveBeenCalled();
    expect(factory4).toHaveBeenCalled();
  });

  // Note: this is an important escape hatch in case to loaders conflict and you need to select the winning service factory
  it('should allow duplicate service from feature loaders if overridden', async () => {
    const ref = createServiceRef<{}>({ id: '1' });
    const factory1 = mkNoopFactory(ref);
    const factory2 = mkNoopFactory(ref);
    const factory3 = mkNoopFactory(ref);
    const factory4 = mkNoopFactory(ref);

    const init = new BackendInitializer([...baseFactories, factory1]);
    init.add(factory2);
    init.add(
      createBackendFeatureLoader({
        deps: {},
        *loader() {
          yield factory3;
          yield factory4;
        },
      }),
    );
    init.add(
      createBackendPlugin({
        pluginId: 'tester',
        register(reg) {
          reg.registerInit({
            deps: { ref },
            async init() {},
          });
        },
      }),
    );

    await init.start();

    expect(factory1).not.toHaveBeenCalled();
    expect(factory2).toHaveBeenCalled();
    expect(factory3).not.toHaveBeenCalled();
    expect(factory4).not.toHaveBeenCalled();
  });

  it('should reject duplicate service factories from feature loader without an explicit override', async () => {
    const ref = createServiceRef<{}>({ id: '1' });
    const factory1 = mkNoopFactory(ref);
    const factory2 = mkNoopFactory(ref);
    const factory3 = mkNoopFactory(ref);

    const init = new BackendInitializer([...baseFactories, factory1]);
    init.add(
      createBackendFeatureLoader({
        deps: {},
        *loader() {
          yield factory2;
        },
      }),
    );
    init.add(
      createBackendFeatureLoader({
        deps: {},
        *loader() {
          yield factory3;
        },
      }),
    );

    await expect(init.start()).rejects.toThrow(
      'Duplicate service implementations provided for 1 by both feature loader created at',
    );
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
    const init = new BackendInitializer(baseFactories);
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

  it('should permit startup errors for plugins with onPluginBootFailure: continue', async () => {
    const init = new BackendInitializer([
      ...baseFactories,
      mockServices.rootConfig.factory({
        data: {
          backend: {
            startup: { plugins: { test: { onPluginBootFailure: 'continue' } } },
          },
        },
      }),
    ]);
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
    await expect(init.start()).resolves.not.toThrow();
  });

  it('should permit startup errors if the default onPluginBootFailure is continue', async () => {
    const init = new BackendInitializer([
      ...baseFactories,
      mockServices.rootConfig.factory({
        data: {
          backend: {
            startup: { default: { onPluginBootFailure: 'continue' } },
          },
        },
      }),
    ]);
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
    await expect(init.start()).resolves.not.toThrow();
  });

  it('should forward errors for plugins explicitly marked to abort when the default is continue', async () => {
    const init = new BackendInitializer([
      ...baseFactories,
      mockServices.rootConfig.factory({
        data: {
          backend: {
            startup: {
              default: { onPluginBootFailure: 'continue' },
              plugins: { test: { onPluginBootFailure: 'abort' } },
            },
          },
        },
      }),
    ]);
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

  it('should forward errors when plugin modules fail to start', async () => {
    const init = new BackendInitializer(baseFactories);
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

  it('should permit startup errors for plugin modules with onPluginModuleBootFailure: continue', async () => {
    const init = new BackendInitializer([
      ...baseFactories,
      mockServices.rootConfig.factory({
        data: {
          backend: {
            startup: {
              plugins: {
                test: {
                  modules: { mod: { onPluginModuleBootFailure: 'continue' } },
                },
              },
            },
          },
        },
      }),
    ]);
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
    await expect(init.start()).resolves.not.toThrow();
  });

  it('should permit startup errors if the default onPluginModuleBootFailure is continue', async () => {
    const init = new BackendInitializer([
      ...baseFactories,
      mockServices.rootConfig.factory({
        data: {
          backend: {
            startup: { default: { onPluginModuleBootFailure: 'continue' } },
          },
        },
      }),
    ]);
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
    await expect(init.start()).resolves.not.toThrow();
  });

  it('should forward errors for plugin modules explicitly marked to abort when the default is continue', async () => {
    const init = new BackendInitializer([
      ...baseFactories,
      mockServices.rootConfig.factory({
        data: {
          backend: {
            startup: {
              default: { onPluginModuleBootFailure: 'continue' },
              plugins: {
                test: {
                  modules: { mod: { onPluginModuleBootFailure: 'abort' } },
                },
              },
            },
          },
        },
      }),
    ]);
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
      mockServices.rootLifecycle.factory(),
      mockServices.rootLogger.factory(),
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
            instanceMetadata: coreServices.rootInstanceMetadata,
          },
          async init({ instanceMetadata }) {
            await expect(
              instanceMetadata.getInstalledPlugins(),
            ).resolves.toEqual([
              {
                pluginId: 'test',
                modules: [
                  {
                    moduleId: 'test',
                  },
                ],
              },
              {
                pluginId: 'instance-metadata',
                modules: [],
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

  it('should ignore modules that do not have a matching plugin', async () => {
    expect.assertions(1);
    const backend = new BackendInitializer(baseFactories);
    const instanceMetadataPlugin = createBackendPlugin({
      pluginId: 'instance-metadata',
      register(reg) {
        reg.registerInit({
          deps: {
            instanceMetadata: coreServices.rootInstanceMetadata,
          },
          async init({ instanceMetadata }) {
            await expect(
              instanceMetadata.getInstalledPlugins(),
            ).resolves.toEqual([
              {
                pluginId: 'instance-metadata',
                modules: [],
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
    backend.add(module);
    backend.add(instanceMetadataPlugin);
    await backend.start();
  });

  it('should prevent writes to the instance metadata service', async () => {
    expect.assertions(1);
    const backend = new BackendInitializer(baseFactories);
    const plugin = createBackendPlugin({
      pluginId: 'test',
      register(reg) {
        reg.registerInit({
          deps: {
            instanceMetadata: coreServices.rootInstanceMetadata,
          },
          async init({ instanceMetadata }) {
            const plugins = await instanceMetadata.getInstalledPlugins();
            await expect(() => {
              (plugins[0] as any).pluginId = 'foo';
            }).toThrow(/Cannot assign to read only property/);
          },
        });
      },
    });
    backend.add(plugin);
    await backend.start();
  });

  it('should properly wait for all modules that consume an extension point to really finish, before starting the module that provides that extension point', async () => {
    expect.assertions(3);
    const backend = new BackendInitializer(baseFactories);
    const ext = createExtensionPoint<{ hello: (message: string) => void }>({
      id: 'a',
    });
    const plugin = createBackendPlugin({
      pluginId: 'test',
      register(reg) {
        reg.registerInit({
          deps: {},
          async init() {},
        });
      },
    });
    const producerModule = createBackendModule({
      pluginId: 'test',
      moduleId: 'producer',
      register(reg) {
        const hello = jest.fn();
        reg.registerExtensionPoint(ext, { hello });
        reg.registerInit({
          deps: {},
          async init() {
            // we must not have been initialized before both of the consuming modules have been initialized
            expect(hello).toHaveBeenCalledTimes(2);
            expect(hello).toHaveBeenNthCalledWith(1, 'fast');
            expect(hello).toHaveBeenNthCalledWith(2, 'slow');
          },
        });
      },
    });
    const fastConsumerModule = createBackendModule({
      pluginId: 'test',
      moduleId: 'fast-consumer',
      register(reg) {
        reg.registerInit({
          deps: { x: ext },
          async init({ x }) {
            x.hello('fast');
          },
        });
      },
    });
    const slowConsumerModule = createBackendModule({
      pluginId: 'test',
      moduleId: 'slow-consumer',
      register(reg) {
        reg.registerInit({
          deps: { x: ext },
          async init({ x }) {
            await new Promise(resolve => setTimeout(resolve, 100));
            x.hello('slow');
          },
        });
      },
    });
    await backend.add(plugin);
    await backend.add(producerModule);
    await backend.add(fastConsumerModule);
    await backend.add(slowConsumerModule);
    await backend.start();
  });

  describe('startup results', () => {
    it('should return successful startup result when all plugins and modules start successfully', async () => {
      const init = new BackendInitializer(baseFactories);
      init.add(
        createBackendPlugin({
          pluginId: 'plugin1',
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
          pluginId: 'plugin2',
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
          pluginId: 'plugin1',
          moduleId: 'module1',
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
          pluginId: 'plugin2',
          moduleId: 'module2',
          register(reg) {
            reg.registerInit({
              deps: {},
              async init() {},
            });
          },
        }),
      );

      const { result } = await init.start();

      expect(result.plugins).toHaveLength(2);
      expect(result.plugins[0]).toMatchObject({
        pluginId: 'plugin1',
        modules: [
          {
            moduleId: 'module1',
          },
        ],
      });
      expect(result.plugins[0].failure).toBeUndefined();
      expect(result.plugins[0].modules[0].failure).toBeUndefined();
      expect(result.plugins[1]).toMatchObject({
        pluginId: 'plugin2',
        modules: [
          {
            moduleId: 'module2',
          },
        ],
      });
      expect(result.plugins[1].failure).toBeUndefined();
      expect(result.plugins[1].modules[0].failure).toBeUndefined();
    });

    it('should throw BackendStartupError with results when plugin fails to start', async () => {
      const init = new BackendInitializer(baseFactories);
      const error = new Error('Plugin failed');
      init.add(
        createBackendPlugin({
          pluginId: 'plugin1',
          register(reg) {
            reg.registerInit({
              deps: {},
              async init() {
                throw error;
              },
            });
          },
        }),
      );
      init.add(
        createBackendPlugin({
          pluginId: 'plugin2',
          register(reg) {
            reg.registerInit({
              deps: {},
              async init() {},
            });
          },
        }),
      );

      const err = await init.start().then(
        () => {
          throw new Error('Expected BackendStartupError to be thrown');
        },
        (e: BackendStartupError) => e,
      );

      expect(err).toBeInstanceOf(BackendStartupError);
      expect(err?.result.plugins).toHaveLength(2);
      expect(err?.result.plugins[0]).toMatchObject({
        pluginId: 'plugin1',
        failure: { error, allowed: false },
      });
      expect(err?.result.plugins[1]).toMatchObject({
        pluginId: 'plugin2',
      });
      expect(err?.result.plugins[1].failure).toBeUndefined();
    });

    it('should throw BackendStartupError with results when module fails to start', async () => {
      const init = new BackendInitializer(baseFactories);
      const error = new Error('Module failed');
      init.add(
        createBackendPlugin({
          pluginId: 'plugin1',
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
          pluginId: 'plugin1',
          moduleId: 'module1',
          register(reg) {
            reg.registerInit({
              deps: {},
              async init() {
                throw error;
              },
            });
          },
        }),
      );

      const err = await init.start().then(
        () => {
          throw new Error('Expected BackendStartupError to be thrown');
        },
        (e: BackendStartupError) => e,
      );

      expect(err).toBeInstanceOf(BackendStartupError);
      expect(err?.result.plugins).toHaveLength(1);
      expect(err?.result.plugins[0]).toMatchObject({
        pluginId: 'plugin1',
        modules: [
          {
            moduleId: 'module1',
            failure: { error, allowed: false },
          },
        ],
      });
      expect(err?.result.plugins[0].failure).toBeUndefined();
    });

    it('should throw BackendStartupError with results when multiple plugins fail', async () => {
      const init = new BackendInitializer(baseFactories);
      const error1 = new Error('Plugin1 failed');
      const error2 = new Error('Plugin2 failed');
      init.add(
        createBackendPlugin({
          pluginId: 'plugin1',
          register(reg) {
            reg.registerInit({
              deps: {},
              async init() {
                throw error1;
              },
            });
          },
        }),
      );
      init.add(
        createBackendPlugin({
          pluginId: 'plugin2',
          register(reg) {
            reg.registerInit({
              deps: {},
              async init() {
                throw error2;
              },
            });
          },
        }),
      );

      const err = await init.start().then(
        () => {
          throw new Error('Expected BackendStartupError to be thrown');
        },
        (e: BackendStartupError) => e,
      );

      expect(err).toBeInstanceOf(BackendStartupError);
      expect(err?.result.plugins).toHaveLength(2);
      expect(err?.result.plugins[0].failure?.error).toBe(error1);
      expect(err?.result.plugins[1].failure?.error).toBe(error2);
    });

    it('should return results with failure status when plugin boot failure is permitted', async () => {
      const error = new Error('Plugin failed');
      const init = new BackendInitializer([
        ...baseFactories,
        mockServices.rootConfig.factory({
          data: {
            backend: {
              startup: {
                plugins: { plugin1: { onPluginBootFailure: 'continue' } },
              },
            },
          },
        }),
      ]);
      init.add(
        createBackendPlugin({
          pluginId: 'plugin1',
          register(reg) {
            reg.registerInit({
              deps: {},
              async init() {
                throw error;
              },
            });
          },
        }),
      );
      init.add(
        createBackendPlugin({
          pluginId: 'plugin2',
          register(reg) {
            reg.registerInit({
              deps: {},
              async init() {},
            });
          },
        }),
      );

      const { result } = await init.start();

      expect(result.plugins).toHaveLength(2);
      expect(result.plugins[0]).toMatchObject({
        pluginId: 'plugin1',
        failure: { error, allowed: true },
      });
      expect(result.plugins[1]).toMatchObject({
        pluginId: 'plugin2',
      });
      expect(result.plugins[1].failure).toBeUndefined();
    });

    it('should return results with failure status when module boot failure is permitted', async () => {
      const error = new Error('Module failed');
      const init = new BackendInitializer([
        ...baseFactories,
        mockServices.rootConfig.factory({
          data: {
            backend: {
              startup: {
                plugins: {
                  plugin1: {
                    modules: {
                      module1: { onPluginModuleBootFailure: 'continue' },
                    },
                  },
                },
              },
            },
          },
        }),
      ]);
      init.add(
        createBackendPlugin({
          pluginId: 'plugin1',
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
          pluginId: 'plugin1',
          moduleId: 'module1',
          register(reg) {
            reg.registerInit({
              deps: {},
              async init() {
                throw error;
              },
            });
          },
        }),
      );
      init.add(
        createBackendModule({
          pluginId: 'plugin1',
          moduleId: 'module2',
          register(reg) {
            reg.registerInit({
              deps: {},
              async init() {},
            });
          },
        }),
      );

      const { result } = await init.start();

      expect(result.plugins).toHaveLength(1);
      expect(result.plugins[0]).toMatchObject({
        pluginId: 'plugin1',
        modules: [
          {
            moduleId: 'module1',
            failure: { error, allowed: true },
          },
          {
            moduleId: 'module2',
          },
        ],
      });
      expect(result.plugins[0].failure).toBeUndefined();
      expect(result.plugins[0].modules[1].failure).toBeUndefined();
    });

    it('should include all module results even when some modules fail', async () => {
      const error1 = new Error('Module1 failed');
      const error2 = new Error('Module2 failed');
      const init = new BackendInitializer([
        ...baseFactories,
        mockServices.rootConfig.factory({
          data: {
            backend: {
              startup: {
                plugins: {
                  plugin1: {
                    modules: {
                      module1: { onPluginModuleBootFailure: 'continue' },
                      module2: { onPluginModuleBootFailure: 'continue' },
                    },
                  },
                },
              },
            },
          },
        }),
      ]);
      init.add(
        createBackendPlugin({
          pluginId: 'plugin1',
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
          pluginId: 'plugin1',
          moduleId: 'module1',
          register(reg) {
            reg.registerInit({
              deps: {},
              async init() {
                throw error1;
              },
            });
          },
        }),
      );
      init.add(
        createBackendModule({
          pluginId: 'plugin1',
          moduleId: 'module2',
          register(reg) {
            reg.registerInit({
              deps: {},
              async init() {
                throw error2;
              },
            });
          },
        }),
      );
      init.add(
        createBackendModule({
          pluginId: 'plugin1',
          moduleId: 'module3',
          register(reg) {
            reg.registerInit({
              deps: {},
              async init() {},
            });
          },
        }),
      );

      const { result } = await init.start();

      expect(result.plugins[0].modules).toHaveLength(3);
      expect(result.plugins[0].modules[0]).toMatchObject({
        moduleId: 'module1',
        failure: { error: error1, allowed: true },
      });
      expect(result.plugins[0].modules[1]).toMatchObject({
        moduleId: 'module2',
        failure: { error: error2, allowed: true },
      });
      expect(result.plugins[0].modules[2]).toMatchObject({
        moduleId: 'module3',
      });
      expect(result.plugins[0].modules[2].failure).toBeUndefined();
    });

    it('should return results for plugins without modules', async () => {
      const init = new BackendInitializer(baseFactories);
      init.add(
        createBackendPlugin({
          pluginId: 'plugin1',
          register(reg) {
            reg.registerInit({
              deps: {},
              async init() {},
            });
          },
        }),
      );

      const { result } = await init.start();

      expect(result.plugins).toHaveLength(1);
      expect(result.plugins[0]).toMatchObject({
        pluginId: 'plugin1',
        modules: [],
      });
      expect(result.plugins[0].failure).toBeUndefined();
    });

    it('should include error information in BackendStartupError', async () => {
      const error = new Error('Test error');
      const init = new BackendInitializer(baseFactories);
      init.add(
        createBackendPlugin({
          pluginId: 'plugin1',
          register(reg) {
            reg.registerInit({
              deps: {},
              async init() {
                throw error;
              },
            });
          },
        }),
      );

      const err = await init.start().then(
        () => {
          throw new Error('Expected BackendStartupError to be thrown');
        },
        (e: BackendStartupError) => e,
      );

      expect(err).toBeInstanceOf(BackendStartupError);
      expect(err?.message).toBe(
        "Backend startup failed due to the following errors:\n  Plugin 'plugin1' startup failed; caused by Error: Test error",
      );
      expect(err?.result).toBeDefined();
      expect(err?.result.plugins[0].failure?.error).toBe(error);
    });

    it('should handle plugin scoped service factory failures', async () => {
      const serviceFactoryError = new Error('Service factory failed');
      const ref = createServiceRef<{ value: string }>({
        id: 'failing-service',
      });
      const init = new BackendInitializer([
        ...baseFactories,
        createServiceFactory({
          service: ref,
          deps: {},
          factory: () => {
            throw serviceFactoryError;
          },
        }),
      ]);
      init.add(
        createBackendPlugin({
          pluginId: 'plugin1',
          register(reg) {
            reg.registerInit({
              deps: { service: ref },
              async init() {},
            });
          },
        }),
      );

      const err = await init.start().then(
        () => {
          throw new Error('Expected BackendStartupError to be thrown');
        },
        (e: BackendStartupError) => e,
      );

      expect(err).toBeInstanceOf(BackendStartupError);
      expect(err?.result.plugins).toHaveLength(1);
      expect(err?.result.plugins[0].pluginId).toBe('plugin1');
      expect(err?.result.plugins[0].failure).toBeDefined();
      expect(err?.result.plugins[0].failure?.allowed).toBe(false);
      expect(err?.result.plugins[0].failure?.error.message).toContain(
        "Failed to instantiate service 'failing-service'",
      );
      expect(err?.result.plugins[0].failure?.error.message).toContain(
        'Service factory failed',
      );
    });

    it('should handle plugin scoped service factory failures with allowed boot failure', async () => {
      const serviceFactoryError = new Error('Service factory failed');
      const ref = createServiceRef<{ value: string }>({
        id: 'failing-service',
      });
      const init = new BackendInitializer([
        ...baseFactories,
        mockServices.rootConfig.factory({
          data: {
            backend: {
              startup: {
                plugins: { plugin1: { onPluginBootFailure: 'continue' } },
              },
            },
          },
        }),
        createServiceFactory({
          service: ref,
          deps: {},
          factory: () => {
            throw serviceFactoryError;
          },
        }),
      ]);
      init.add(
        createBackendPlugin({
          pluginId: 'plugin1',
          register(reg) {
            reg.registerInit({
              deps: { service: ref },
              async init() {},
            });
          },
        }),
      );

      const { result } = await init.start();

      expect(result.plugins).toHaveLength(1);
      expect(result.plugins[0].pluginId).toBe('plugin1');
      expect(result.plugins[0].failure).toBeDefined();
      expect(result.plugins[0].failure?.allowed).toBe(true);
      expect(result.plugins[0].failure?.error.message).toContain(
        "Failed to instantiate service 'failing-service'",
      );
      expect(result.plugins[0].failure?.error.message).toContain(
        'Service factory failed',
      );
    });
  });
});
