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
});
