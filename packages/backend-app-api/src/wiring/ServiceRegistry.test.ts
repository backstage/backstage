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
} from '@backstage/backend-plugin-api';
import { ServiceRegistry } from './ServiceRegistry';

const ref1 = createServiceRef<{ x: number; pluginId: string }>({
  id: '1',
});
const sf1 = createServiceFactory({
  service: ref1,
  deps: {},
  factory: async () => {
    return async pluginId => {
      return { x: 1, pluginId };
    };
  },
});

const ref2 = createServiceRef<{ x: number; pluginId: string }>({
  id: '2',
});
const sf2 = createServiceFactory({
  service: ref2,
  deps: {},
  factory: async () => {
    return async pluginId => {
      return { x: 2, pluginId };
    };
  },
});
const sf2b = createServiceFactory({
  service: ref2,
  deps: {},
  factory: async () => {
    return async pluginId => {
      return { x: 22, pluginId };
    };
  },
});

const refDefault1 = createServiceRef<{ x: number; pluginId: string }>({
  id: '1',
  defaultFactory: async service =>
    createServiceFactory({
      service,
      deps: {},
      factory: async () => async pluginId => ({ x: 10, pluginId }),
    }),
});

const refDefault2a = createServiceRef<{ x: number; pluginId: string }>({
  id: '2a',
  defaultFactory: async service =>
    createServiceFactory({
      service,
      deps: {},
      factory: async () => async pluginId => ({ x: 20, pluginId }),
    }),
});

const refDefault2b = createServiceRef<{ x: number; pluginId: string }>({
  id: '2b',
  defaultFactory: async service =>
    createServiceFactory({
      service,
      deps: {},
      factory: async () => async pluginId => ({ x: 220, pluginId }),
    }),
});

describe('ServiceRegistry', () => {
  it('should return undefined if there is no factory defined', async () => {
    const registry = new ServiceRegistry([]);
    expect(registry.get(ref1)).toBe(undefined);
  });

  it('should return a factory for a registered ref', async () => {
    const registry = new ServiceRegistry([sf1]);
    const factory = registry.get(ref1)!;
    expect(factory).toEqual(expect.any(Function));
    await expect(factory('catalog')).resolves.toEqual({
      x: 1,
      pluginId: 'catalog',
    });
    await expect(factory('scaffolder')).resolves.toEqual({
      x: 1,
      pluginId: 'scaffolder',
    });
    expect(await factory('catalog')).toBe(await factory('catalog'));
  });

  it('should handle multiple factories with different serviceRefs', async () => {
    const registry = new ServiceRegistry([sf1, sf2]);
    const factory1 = registry.get(ref1)!;
    const factory2 = registry.get(ref2)!;
    expect(factory1).toEqual(expect.any(Function));
    expect(factory2).toEqual(expect.any(Function));
    await expect(factory1('catalog')).resolves.toEqual({
      x: 1,
      pluginId: 'catalog',
    });
    await expect(factory2('catalog')).resolves.toEqual({
      x: 2,
      pluginId: 'catalog',
    });
    expect(await factory1('catalog')).not.toBe(await factory2('catalog'));
  });

  it('should use the last factory for each ref', async () => {
    const registry = new ServiceRegistry([sf2, sf2b]);
    const factory2 = registry.get(ref2)!;
    await expect(factory2('catalog')).resolves.toEqual({
      x: 22,
      pluginId: 'catalog',
    });
  });

  it('should return the defaultFactory from the ref if not provided to the registry', async () => {
    const registry = new ServiceRegistry([]);
    const factory = registry.get(refDefault1)!;
    expect(factory).toEqual(expect.any(Function));
    await expect(factory('catalog')).resolves.toEqual({
      x: 10,
      pluginId: 'catalog',
    });
  });

  it('should not return the defaultFactory from the ref if provided to the registry', async () => {
    const registry = new ServiceRegistry([sf1]);
    const factory = registry.get(refDefault1)!;
    expect(factory).toEqual(expect.any(Function));
    await expect(factory('catalog')).resolves.toEqual({
      x: 1,
      pluginId: 'catalog',
    });
  });

  it('should handle duplicate defaultFactories by duplicating the implementations', async () => {
    const registry = new ServiceRegistry([]);
    const factoryA = registry.get(refDefault2a)!;
    const factoryB = registry.get(refDefault2b)!;
    expect(factoryA).toEqual(expect.any(Function));
    expect(factoryB).toEqual(expect.any(Function));
    await expect(factoryA('catalog')).resolves.toEqual({
      x: 20,
      pluginId: 'catalog',
    });
    await expect(factoryB('catalog')).resolves.toEqual({
      x: 220,
      pluginId: 'catalog',
    });
    expect(await factoryA('catalog')).toBe(await factoryA('catalog'));
    expect(await factoryB('catalog')).toBe(await factoryB('catalog'));
    expect(await factoryA('catalog')).not.toBe(await factoryB('catalog'));
  });

  it('should only call each default factory loader once', async () => {
    const factoryLoader = jest.fn(async (service: ServiceRef<void>) =>
      createServiceFactory({
        service,
        deps: {},
        factory: async () => async () => {},
      }),
    );
    const ref = createServiceRef<void>({
      id: '1',
      defaultFactory: factoryLoader,
    });

    const registry = new ServiceRegistry([]);
    const factory = registry.get(ref)!;
    await Promise.all([
      expect(factory('catalog')).resolves.toBeUndefined(),
      expect(factory('catalog')).resolves.toBeUndefined(),
    ]);
    expect(factoryLoader).toHaveBeenCalledTimes(1);
  });

  it('should not call factory functions more than once', async () => {
    const innerFactory = jest.fn(async (pluginId: string) => {
      return { x: 1, pluginId };
    });
    const factory = jest.fn(async () => innerFactory);
    const myFactory = createServiceFactory({
      service: ref1,
      deps: {},
      factory,
    });

    const registry = new ServiceRegistry([myFactory]);

    await Promise.all([
      registry.get(ref1)!('catalog')!,
      registry.get(ref1)!('catalog')!,
      registry.get(ref1)!('catalog')!,
      registry.get(ref1)!('scaffolder')!,
      registry.get(ref1)!('scaffolder')!,
    ]);

    expect(factory).toHaveBeenCalledTimes(1);
    expect(innerFactory).toHaveBeenCalledTimes(2);
    expect(innerFactory).toHaveBeenCalledWith('catalog');
    expect(innerFactory).toHaveBeenCalledWith('scaffolder');
  });

  it('should throw if dependencies are not available', async () => {
    const myFactory = createServiceFactory({
      service: ref1,
      deps: { dep: ref2 },
      async factory() {
        throw new Error('ignored');
      },
    });

    const registry = new ServiceRegistry([myFactory]);
    const factory = registry.get(ref1)!;

    await expect(factory('catalog')).rejects.toThrow(
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
      async factory({ b }) {
        return async pluginId => b(pluginId);
      },
    });

    const factoryB = createServiceFactory({
      service: refB,
      deps: { c: refC, d: refD },
      async factory() {
        throw new Error('ignored');
      },
    });

    const registry = new ServiceRegistry([factoryA, factoryB]);
    const factory = registry.get(refA)!;

    await expect(factory('catalog')).rejects.toThrow(
      "Failed to instantiate service 'a' for 'catalog' because the factory function threw an error, Error: Failed to instantiate service 'b' for 'catalog' because the following dependent services are missing: 'c', 'd'",
    );
  });

  it('should decorate error messages thrown by the top-level factory function', async () => {
    const myFactory = createServiceFactory({
      service: ref1,
      deps: {},
      factory() {
        throw new Error('top-level error');
      },
    });

    const registry = new ServiceRegistry([myFactory]);
    const factory = registry.get(ref1)!;

    await expect(factory('catalog')).rejects.toThrow(
      "Failed to instantiate service '1' because the top-level factory function threw an error, Error: top-level error",
    );
  });

  it('should decorate error messages thrown by the plugin-level factory function', async () => {
    const myFactory = createServiceFactory({
      service: ref1,
      deps: {},
      async factory() {
        return pluginId => {
          throw new Error(`error in plugin ${pluginId}`);
        };
      },
    });

    const registry = new ServiceRegistry([myFactory]);
    const factory = registry.get(ref1)!;

    await expect(factory('catalog')).rejects.toThrow(
      "Failed to instantiate service '1' for 'catalog' because the factory function threw an error, Error: error in plugin catalog",
    );
  });

  it('should decorate error messages thrown by default factory loaders', async () => {
    const ref = createServiceRef<string>({
      id: '1',
      defaultFactory() {
        throw new Error('default factory error');
      },
    });

    const registry = new ServiceRegistry([]);
    const factory = registry.get(ref)!;

    await expect(factory('catalog')).rejects.toThrow(
      "Failed to instantiate service '1' because the default factory loader threw an error, Error: default factory error",
    );
  });
});
