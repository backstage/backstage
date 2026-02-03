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
  ServiceRef,
  coreServices,
} from '@backstage/backend-plugin-api';
import { ServiceRegistry } from './ServiceRegistry';

const ref1 = createServiceRef<{ x: number }>({
  id: '1',
});
const sf1 = createServiceFactory({
  service: ref1,
  deps: {},
  async factory() {
    return { x: 1 };
  },
});

const ref2 = createServiceRef<{ x: number }>({
  scope: 'root',
  id: '2',
});
const sf2 = createServiceFactory({
  service: ref2,
  deps: {},
  async factory() {
    return { x: 2 };
  },
});
const sf2b = createServiceFactory({
  service: ref2,
  deps: {},
  async factory() {
    return { x: 22 };
  },
});

const refDefault1 = createServiceRef<{ x: number }>({
  id: '1',
  defaultFactory: async service =>
    createServiceFactory({
      service,
      deps: {},
      async factory() {
        return { x: 10 };
      },
    }),
});

const refDefault2a = createServiceRef<{ x: number }>({
  id: '2a',
  defaultFactory: async service =>
    createServiceFactory({
      service,
      deps: {},
      async factory() {
        return { x: 20 };
      },
    }),
});

const refDefault2b = createServiceRef<{ x: number }>({
  id: '2b',
  defaultFactory: async service =>
    createServiceFactory({
      service,
      deps: {},
      async factory() {
        return { x: 220 };
      },
    }),
});

describe('ServiceRegistry', () => {
  it('should return undefined if there is no factory defined', async () => {
    const registry = ServiceRegistry.create([]);
    expect(registry.get(ref1, 'catalog')).toBe(undefined);
  });

  it('should return an implementation for a registered ref', async () => {
    const registry = ServiceRegistry.create([sf1]);
    await expect(registry.get(ref1, 'catalog')).resolves.toEqual({ x: 1 });
    await expect(registry.get(ref1, 'scaffolder')).resolves.toEqual({ x: 1 });
    expect(await registry.get(ref1, 'catalog')).toBe(
      await registry.get(ref1, 'catalog'),
    );
    expect(await registry.get(ref1, 'scaffolder')).toBe(
      await registry.get(ref1, 'scaffolder'),
    );
    expect(await registry.get(ref1, 'catalog')).not.toBe(
      await registry.get(ref1, 'scaffolder'),
    );
  });

  it('should handle multiple factories with different serviceRefs', async () => {
    const registry = ServiceRegistry.create([sf1, sf2]);

    await expect(registry.get(ref1, 'catalog')).resolves.toEqual({
      x: 1,
    });
    await expect(registry.get(ref2, 'catalog')).resolves.toEqual({
      x: 2,
    });
    expect(await registry.get(ref1, 'catalog')).not.toBe(
      await registry.get(ref2, 'catalog'),
    );
  });

  it('should not be possible for root scoped services to depend on plugin scoped services', async () => {
    // @ts-expect-error
    const factory = createServiceFactory({
      service: ref2,
      deps: { pluginDep: ref1 },
      async factory() {
        return { x: 2 };
      },
    });
    const registry = ServiceRegistry.create([factory, sf1]);
    await expect(registry.get(ref2, 'catalog')).rejects.toThrow(
      "Failed to instantiate 'root' scoped service '2' because it depends on 'plugin' scoped service '1'.",
    );
  });

  it('should be possible for plugin scoped services to depend on root scoped services', async () => {
    const factory = createServiceFactory({
      service: ref1,
      deps: { rootDep: ref2 },
      factory: async ({ rootDep }) => {
        return { x: rootDep.x };
      },
    });
    const registry = ServiceRegistry.create([factory, sf2]);
    await expect(registry.get(ref1, 'catalog')).resolves.toEqual({
      x: 2,
    });
  });

  it('should be possible for root scoped services to depend on root scoped services', async () => {
    const ref = createServiceRef<{ x: number }>({ id: 'x', scope: 'root' });
    const factory = createServiceFactory({
      service: ref,
      deps: { rootDep: ref2 },
      async factory({ rootDep }) {
        return { x: rootDep.x };
      },
    });
    const registry = ServiceRegistry.create([factory, sf2]);
    await expect(registry.get(ref, 'catalog')).resolves.toEqual({
      x: 2,
    });
  });

  it('should return the pluginId from the pluginMetadata service', async () => {
    const ref = createServiceRef<{ pluginId: string }>({ id: 'x' });
    const factory = createServiceFactory({
      service: ref,
      deps: { meta: coreServices.pluginMetadata },
      async factory({ meta }) {
        return { pluginId: meta.getId() };
      },
    });
    const registry = ServiceRegistry.create([factory]);
    await expect(registry.get(ref, 'catalog')).resolves.toEqual({
      pluginId: 'catalog',
    });
  });

  it('should use the last factory for each ref', async () => {
    const registry = ServiceRegistry.create([sf2, sf2b]);
    await expect(registry.get(ref2, 'catalog')).resolves.toEqual({
      x: 22,
    });
  });

  it('should use added service factories for each ref', async () => {
    const registry = ServiceRegistry.create([sf2]);
    registry.add(sf2b);
    await expect(registry.get(ref2, 'catalog')).resolves.toEqual({
      x: 22,
    });
  });

  it('should not allow factories to be added after instantiation', async () => {
    const registry = ServiceRegistry.create([sf2]);
    await expect(registry.get(ref2, 'catalog')).resolves.toEqual({
      x: 2,
    });
    expect(() => registry.add(sf2b)).toThrow(
      'Unable to set service factory with id 2, service has already been instantiated',
    );
  });

  it('should not allow the same factory to be added twice', async () => {
    const registry = ServiceRegistry.create([sf2]);
    registry.add(sf2b);
    expect(() => registry.add(sf2b)).toThrow(
      'Duplicate service implementations provided for 2',
    );
  });

  it('should use the defaultFactory from the ref if not provided to the registry', async () => {
    const registry = ServiceRegistry.create([]);
    await expect(registry.get(refDefault1, 'catalog')).resolves.toEqual({
      x: 10,
    });
  });

  it('should not use the defaultFactory from the ref if provided to the registry', async () => {
    const registry = ServiceRegistry.create([sf1]);
    await expect(registry.get(refDefault1, 'catalog')).resolves.toEqual({
      x: 1,
    });
  });

  it('should handle duplicate defaultFactories by duplicating the implementations', async () => {
    const registry = ServiceRegistry.create([]);
    await expect(registry.get(refDefault2a, 'catalog')).resolves.toEqual({
      x: 20,
    });
    await expect(registry.get(refDefault2b, 'catalog')).resolves.toEqual({
      x: 220,
    });
    expect(await registry.get(refDefault2a, 'catalog')).toBe(
      await registry.get(refDefault2a, 'catalog'),
    );
    expect(await registry.get(refDefault2b, 'catalog')).toBe(
      await registry.get(refDefault2b, 'catalog'),
    );
    expect(await registry.get(refDefault2a, 'catalog')).not.toBe(
      await registry.get(refDefault2b, 'catalog'),
    );
  });

  it('should only call each default factory loader once', async () => {
    const factoryLoader = jest.fn(async (service: ServiceRef<void, 'plugin'>) =>
      createServiceFactory({
        service,
        deps: {},
        async factory() {},
      }),
    );
    const ref = createServiceRef<void>({
      id: '1',
      defaultFactory: factoryLoader,
    });

    const registry = ServiceRegistry.create([]);
    await Promise.all([
      expect(registry.get(ref, 'catalog')).resolves.toBeUndefined(),
      expect(registry.get(ref, 'catalog')).resolves.toBeUndefined(),
    ]);
    expect(factoryLoader).toHaveBeenCalledTimes(1);
  });

  it('should not call factory functions more than once', async () => {
    const createRootContext = jest.fn(async () => ({ x: 1 }));
    const factory = jest.fn(async () => ({ x: 1 }));
    const myFactory = createServiceFactory({
      service: ref1,
      deps: {},
      createRootContext,
      factory,
    });

    const registry = ServiceRegistry.create([myFactory]);

    await Promise.all([
      registry.get(ref1, 'catalog')!,
      registry.get(ref1, 'catalog')!,
      registry.get(ref1, 'catalog')!,
      registry.get(ref1, 'scaffolder')!,
      registry.get(ref1, 'scaffolder')!,
    ]);

    expect(createRootContext).toHaveBeenCalledTimes(1);
    expect(factory).toHaveBeenCalledTimes(2);
  });

  it('should not call factory functions more than once without root context', async () => {
    const factory = jest.fn(async () => ({ x: 1 }));
    const myFactory = createServiceFactory({
      service: ref1,
      deps: {},
      factory,
    });

    const registry = ServiceRegistry.create([myFactory]);

    await Promise.all([
      registry.get(ref1, 'catalog')!,
      registry.get(ref1, 'catalog')!,
      registry.get(ref1, 'catalog')!,
      registry.get(ref1, 'scaffolder')!,
      registry.get(ref1, 'scaffolder')!,
    ]);

    expect(factory).toHaveBeenCalledTimes(2);
  });

  it('should throw if dependencies are not available', async () => {
    const myFactory = createServiceFactory({
      service: ref1,
      deps: { dep: ref2 },
      async factory() {
        throw new Error('ignored');
      },
    });

    const registry = ServiceRegistry.create([myFactory]);

    await expect(registry.get(ref1, 'catalog')).rejects.toThrow(
      "Failed to instantiate service '1' for 'catalog' because the following dependent services are missing: '2'",
    );
  });

  it('should throw if dependencies are not available 2', async () => {
    const refA = createServiceRef<string>({ id: 'a' });
    const refB = createServiceRef<string>({ id: 'b' });
    const refC = createServiceRef<string>({ id: 'c' });
    const refD = createServiceRef<string>({ id: 'd' });

    const factoryA = createServiceFactory({
      service: refA,
      deps: { b: refB },
      factory: async ({ b }) => b,
    });

    const factoryB = createServiceFactory({
      service: refB,
      deps: { c: refC, d: refD },
      async factory() {
        throw new Error('ignored');
      },
    });

    const registry = ServiceRegistry.create([factoryA, factoryB]);

    await expect(registry.get(refA, 'catalog')).rejects.toThrow(
      "Failed to instantiate service 'a' for 'catalog' because the factory function threw an error, Error: Failed to instantiate service 'b' for 'catalog' because the following dependent services are missing: 'c', 'd'",
    );
  });

  describe('checkForCircularDeps', () => {
    it('should throw if there are shallow circular dependencies', async () => {
      const refA = createServiceRef<string>({ id: 'a' });
      const refB = createServiceRef<string>({ id: 'b' });

      const factoryA = createServiceFactory({
        service: refA,
        deps: { b: refB },
        factory: async ({ b }) => b,
      });

      const factoryB = createServiceFactory({
        service: refB,
        deps: { a: refA },
        factory: async ({ a }) => a,
      });

      expect(() => ServiceRegistry.create([factoryA, factoryB])).toThrow(
        `Circular dependencies detected:
  'a' -> 'b' -> 'a'`,
      );
    });

    it('should throw if there are multiple circular dependency cycles', async () => {
      const refA = createServiceRef<string>({ id: 'a' });
      const refB = createServiceRef<string>({ id: 'b' });
      const refC = createServiceRef<string>({ id: 'c' });
      const refD = createServiceRef<string>({ id: 'd' });

      const factoryA = createServiceFactory({
        service: refA,
        deps: { b: refB },
        factory: async ({ b }) => b,
      });

      const factoryB = createServiceFactory({
        service: refB,
        deps: { a: refA },
        factory: async ({ a }) => a,
      });

      const factoryC = createServiceFactory({
        service: refC,
        deps: { d: refD },
        factory: async ({ d }) => d,
      });

      const factoryD = createServiceFactory({
        service: refD,
        deps: { c: refC },
        factory: async ({ c }) => c,
      });

      expect(() =>
        ServiceRegistry.create([factoryA, factoryB, factoryC, factoryD]),
      ).toThrow(
        `Circular dependencies detected:
  'a' -> 'b' -> 'a'
  'c' -> 'd' -> 'c'`,
      );
    });

    it('should throw if there are deep circular dependencies', async () => {
      const refA = createServiceRef<string>({ id: 'a' });
      const refB = createServiceRef<string>({ id: 'b' });
      const refC = createServiceRef<string>({ id: 'c' });

      const factoryA = createServiceFactory({
        service: refA,
        deps: { b: refB },
        factory: async ({ b }) => b,
      });

      const factoryB = createServiceFactory({
        service: refB,
        deps: { c: refC },
        factory: async ({ c }) => c,
      });

      const factoryC = createServiceFactory({
        service: refC,
        deps: { a: refA },
        factory: async ({ a }) => a,
      });

      expect(() =>
        ServiceRegistry.create([factoryA, factoryB, factoryC]),
      ).toThrow(
        `Circular dependencies detected:
  'a' -> 'b' -> 'c' -> 'a'`,
      );
    });

    it('should throw if there are deep circular dependencies 2', async () => {
      const refA = createServiceRef<string>({ id: 'a' });
      const refB = createServiceRef<string>({ id: 'b' });
      const refC = createServiceRef<string>({ id: 'c' });
      const refD = createServiceRef<string>({ id: 'd' });

      const factoryA = createServiceFactory({
        service: refA,
        deps: { b: refB },
        factory: async ({ b }) => b,
      });

      const factoryB = createServiceFactory({
        service: refB,
        deps: { c: refC, d: refD },
        factory: async ({ c, d }) => c + d,
      });

      const factoryC = createServiceFactory({
        service: refC,
        deps: { a: refA },
        factory: async ({ a }) => a,
      });

      const factoryD = createServiceFactory({
        service: refD,
        deps: {},
        factory: async () => 'd',
      });

      expect(() =>
        ServiceRegistry.create([factoryA, factoryB, factoryC, factoryD]),
      ).toThrow(
        `Circular dependencies detected:
  'a' -> 'b' -> 'c' -> 'a'`,
      );
    });

    it('should throw if there are circular dependencies', async () => {
      const refA = createServiceRef<string>({ id: 'a' });
      const refB = createServiceRef<string>({ id: 'b' });
      const refC = createServiceRef<string>({ id: 'c' });

      const factoryA = createServiceFactory({
        service: refA,
        deps: { b: refB, c: refC },
        factory: async ({ b, c }) => b + c,
      });

      const factoryB = createServiceFactory({
        service: refB,
        deps: {},
        factory: async () => 'b',
      });

      const factoryC = createServiceFactory({
        service: refC,
        deps: { a: refA },
        factory: async ({ a }) => a,
      });

      expect(() =>
        ServiceRegistry.create([factoryA, factoryB, factoryC]),
      ).toThrow(
        `Circular dependencies detected:
  'a' -> 'c' -> 'a'`,
      );
    });

    it('should not infinitely loop if there are circular dependencies where not all nodes are in the cycle', async () => {
      const refA = createServiceRef<string>({ id: 'a' });
      const refB = createServiceRef<string>({ id: 'b' });
      const refC = createServiceRef<string>({ id: 'c' });

      const factoryA = createServiceFactory({
        service: refA,
        deps: { b: refB },
        factory: async ({ b }) => b,
      });

      const factoryB = createServiceFactory({
        service: refB,
        deps: { c: refC },
        factory: async ({ c }) => c,
      });

      const factoryC = createServiceFactory({
        service: refC,
        deps: { b: refB },
        factory: async ({ b }) => b,
      });

      expect(() =>
        ServiceRegistry.create([factoryA, factoryB, factoryC]),
      ).toThrow(
        `Circular dependencies detected:
  'b' -> 'c' -> 'b'`,
      );
    });
  });

  it('should decorate error messages thrown by the top-level factory function', async () => {
    const myFactory = createServiceFactory({
      service: ref1,
      deps: {},
      createRootContext() {
        throw new Error('top-level error');
      },
      factory() {
        throw new Error(`error in plugin`);
      },
    });

    const registry = ServiceRegistry.create([myFactory]);

    await expect(registry.get(ref1, 'catalog')).rejects.toThrow(
      "Failed to instantiate service '1' because createRootContext threw an error, Error: top-level error",
    );
  });

  it('should decorate error messages thrown by the plugin-level factory function', async () => {
    const myFactory = createServiceFactory({
      service: ref1,
      deps: {},
      async factory() {
        throw new Error(`error in plugin`);
      },
    });

    const registry = ServiceRegistry.create([myFactory]);

    await expect(registry.get(ref1, 'catalog')).rejects.toThrow(
      "Failed to instantiate service '1' for 'catalog' because the factory function threw an error, Error: error in plugin",
    );
  });

  it('should decorate error messages thrown by default factory loaders', async () => {
    const ref = createServiceRef<string>({
      id: '1',
      defaultFactory() {
        throw new Error('default factory error');
      },
    });

    const registry = ServiceRegistry.create([]);

    await expect(registry.get(ref, 'catalog')).rejects.toThrow(
      "Failed to instantiate service '1' because the default factory loader threw an error, Error: default factory error",
    );
  });
});
