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
  InternalServiceFactory,
  createServiceFactory,
  createServiceRef,
} from './types';

const ref = createServiceRef<string>({ id: 'x' });
const rootDep = createServiceRef<number>({ id: 'y', scope: 'root' });
const pluginDep = createServiceRef<boolean>({ id: 'z' });
function unused(..._any: any[]) {}

describe('createServiceFactory', () => {
  it('should create a plugin scoped factory', () => {
    const factory = createServiceFactory({
      service: ref,
      deps: {},
      createRootContext() {},
      factory(_deps) {
        return 'x';
      },
    });
    expect(factory.$$type).toBe('@backstage/BackendFeature');
    expect((factory as InternalServiceFactory).featureType).toBe('service');
    expect(factory.service).toBe(ref);
  });

  it('should create a root scoped factory', () => {
    const factory = createServiceFactory({
      service: rootDep,
      deps: {},
      factory(_deps) {
        return 0;
      },
    });
    expect(factory.$$type).toBe('@backstage/BackendFeature');
    expect((factory as InternalServiceFactory).featureType).toBe('service');
    expect(factory.service).toBe(rootDep);
  });

  it('should create a plugin scoped factory with a root context', () => {
    const factory = createServiceFactory({
      service: ref,
      deps: {},
      async createRootContext() {},
      async factory(_deps) {
        return 'x';
      },
    });
    expect(factory.$$type).toBe('@backstage/BackendFeature');
    expect((factory as InternalServiceFactory).featureType).toBe('service');
    expect(factory.service).toBe(ref);
  });

  it('should create root scoped factory with dependencies', () => {
    const factory = createServiceFactory({
      service: createServiceRef({ id: 'foo', scope: 'root' }),
      deps: {
        root: rootDep,
      },
      async factory({ root }) {
        const root1: number = root;
        // @ts-expect-error
        const root2: string = root;
        unused(root1, root2);
        return 0;
      },
    });
    expect(factory.$$type).toBe('@backstage/BackendFeature');
  });

  it('should create a plugin scoped factory with dependencies', () => {
    const factory = createServiceFactory({
      service: createServiceRef({ id: 'derp' }),
      deps: {
        root: rootDep,
        plugin: pluginDep,
      },
      async createRootContext({ root }) {
        const root1: number = root;
        // @ts-expect-error
        const root2: string = root;
        unused(root1, root2);
        return { root };
      },
      async factory({ plugin, root: rootB }, { root }) {
        const root1: number = root;
        // @ts-expect-error
        const root2: string = root;
        const root3: number = rootB;
        // @ts-expect-error
        const root4: string = rootB;
        const plugin3: boolean = plugin;
        // @ts-expect-error
        const plugin4: number = plugin;
        unused(root1, root2, root3, root4, plugin3, plugin4);
        return 'x';
      },
    });
    expect(factory.$$type).toBe('@backstage/BackendFeature');
  });

  it('should create factory with dependencies with optional derpFactory', () => {
    const factory = createServiceFactory({
      service: createServiceRef({ id: 'derp' }),
      deps: {
        root: rootDep,
        plugin: pluginDep,
      },
      async factory({ root, plugin }) {
        const root1: number = root;
        // @ts-expect-error
        const root2: string = root;
        const plugin3: boolean = plugin;
        // @ts-expect-error
        const plugin4: number = plugin;
        unused(root1, root2, plugin3, plugin4);
        return 'x';
      },
    });
    expect(factory.$$type).toBe('@backstage/BackendFeature');
  });

  it('should support old service refs without a multiton field', () => {
    const oldPluginDep = pluginDep as Omit<typeof pluginDep, 'multiton'>; // Old refs don't have a multiton field
    const factory = createServiceFactory({
      service: ref,
      deps: {
        plugin: oldPluginDep,
      },
      async factory({ plugin }) {
        const plugin1: boolean = plugin;
        // @ts-expect-error
        const plugin2: number = plugin;
        unused(plugin1, plugin2);
        return 'x';
      },
    });
    expect(factory.$$type).toBe('@backstage/BackendFeature');
  });
});
