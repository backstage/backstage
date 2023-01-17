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

import { createServiceFactory, createServiceRef } from './types';

const ref = createServiceRef<string>({ id: 'x' });
const rootDep = createServiceRef<number>({ id: 'y', scope: 'root' });
const pluginDep = createServiceRef<boolean>({ id: 'z' });

interface TestOptions {
  x: number;
}
function unused(..._any: any[]) {}

describe('createServiceFactory', () => {
  it('should create a sync factory with no options', () => {
    const metaFactory = createServiceFactory({
      service: ref,
      deps: {},
      createRootContext() {},
      factory(_deps) {
        return 'x';
      },
    });
    expect(metaFactory).toEqual(expect.any(Function));
    expect(metaFactory().service).toBe(ref);

    // @ts-expect-error
    metaFactory('string');
    // @ts-expect-error
    metaFactory({});
    // @ts-expect-error
    metaFactory({ x: 1 });
    // @ts-expect-error
    metaFactory(null);
    // @ts-expect-error
    metaFactory(undefined);
    metaFactory();
  });

  it('should create a sync root factory with no options', () => {
    const metaFactory = createServiceFactory({
      service: rootDep,
      deps: {},
      factory(_deps) {
        return 0;
      },
    });
    expect(metaFactory).toEqual(expect.any(Function));
    expect(metaFactory().service).toBe(rootDep);

    // @ts-expect-error
    metaFactory('string');
    // @ts-expect-error
    metaFactory({});
    // @ts-expect-error
    metaFactory({ x: 1 });
    // @ts-expect-error
    metaFactory(null);
    // @ts-expect-error
    metaFactory(undefined);
    metaFactory();
  });

  it('should create a factory with no options', () => {
    const metaFactory = createServiceFactory({
      service: ref,
      deps: {},
      async createRootContext() {},
      async factory(_deps) {
        return 'x';
      },
    });
    expect(metaFactory).toEqual(expect.any(Function));
    expect(metaFactory().service).toBe(ref);

    // @ts-expect-error
    metaFactory('string');
    // @ts-expect-error
    metaFactory({});
    // @ts-expect-error
    metaFactory({ x: 1 });
    // @ts-expect-error
    metaFactory(null);
    // @ts-expect-error
    metaFactory(undefined);
    metaFactory();
  });

  it('should create a factory with optional options', () => {
    const metaFactory = createServiceFactory((_opts?: { x: number }) => ({
      service: ref,
      deps: {},
      async createRootContext() {},
      async factory() {
        return 'x';
      },
    }));
    expect(metaFactory).toEqual(expect.any(Function));

    // @ts-expect-error
    metaFactory('string');
    // @ts-expect-error
    metaFactory({});
    metaFactory({ x: 1 });
    // @ts-expect-error
    metaFactory({ x: 1, y: 2 });
    // @ts-expect-error
    metaFactory(null);
    metaFactory(undefined);
    metaFactory();
  });

  it('should create a factory with required options', () => {
    const metaFactory = createServiceFactory((_opts: { x: number }) => ({
      service: ref,
      deps: {},
      async createRootContext() {},
      async factory() {
        return 'x';
      },
    }));
    expect(metaFactory).toEqual(expect.any(Function));

    // @ts-expect-error
    metaFactory('string');
    // @ts-expect-error
    metaFactory({});
    metaFactory({ x: 1 });
    // @ts-expect-error
    metaFactory({ x: 1, y: 2 });
    // @ts-expect-error
    metaFactory(null);
    // @ts-expect-error
    metaFactory(undefined);
    // @ts-expect-error
    metaFactory();
  });

  it('should create a factory with optional options as interface', () => {
    const metaFactory = createServiceFactory((_opts?: TestOptions) => ({
      service: ref,
      deps: {},
      async createRootContext() {},
      async factory() {
        return 'x';
      },
    }));
    expect(metaFactory).toEqual(expect.any(Function));

    // @ts-expect-error
    metaFactory('string');
    // @ts-expect-error
    metaFactory({});
    metaFactory({ x: 1 });
    // @ts-expect-error
    metaFactory({ x: 1, y: 2 });
    // @ts-expect-error
    metaFactory(null);
    metaFactory(undefined);
    metaFactory();
  });

  it('should create a factory with required options as interface', () => {
    const metaFactory = createServiceFactory((_opts: TestOptions) => ({
      service: ref,
      deps: {},
      async createRootContext() {},
      async factory() {
        return 'x';
      },
    }));
    expect(metaFactory).toEqual(expect.any(Function));

    // @ts-expect-error
    metaFactory('string');
    // @ts-expect-error
    metaFactory({});
    metaFactory({ x: 1 });
    // @ts-expect-error
    metaFactory({ x: 1, y: 2 });
    // @ts-expect-error
    metaFactory(null);
    // @ts-expect-error
    metaFactory(undefined);
    // @ts-expect-error
    metaFactory();
  });

  it('should create root scoped factory with dependencies', () => {
    const metaFactory = createServiceFactory({
      service: createServiceRef({ id: 'foo', scope: 'root' }),
      deps: {
        root: rootDep,
        plugin: pluginDep,
      },
      async factory({ root }) {
        const root1: number = root;
        // @ts-expect-error
        const root2: string = root;
        unused(root1, root2);
        return 0;
      },
    });
    expect(metaFactory).toEqual(expect.any(Function));

    // @ts-expect-error
    metaFactory({});
    // @ts-expect-error
    metaFactory(null);
    // @ts-expect-error
    metaFactory(undefined);
    metaFactory();
  });

  it('should create root scoped factory with dependencies and optional options', () => {
    const metaFactory = createServiceFactory((_options?: TestOptions) => ({
      service: createServiceRef({ id: 'foo', scope: 'root' }),
      deps: {
        root: rootDep,
        plugin: pluginDep,
      },
      async factory({ root }) {
        const root1: number = root;
        // @ts-expect-error
        const root2: string = root;
        unused(root1, root2);
        return 0;
      },
    }));
    expect(metaFactory).toEqual(expect.any(Function));

    // @ts-expect-error
    metaFactory('string');
    // @ts-expect-error
    metaFactory({});
    metaFactory({ x: 1 });
    // @ts-expect-error
    metaFactory({ x: 1, y: 2 });
    // @ts-expect-error
    metaFactory(null);
    metaFactory(undefined);
    metaFactory();
  });

  it('should create factory with dependencies', () => {
    const metaFactory = createServiceFactory({
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
    expect(metaFactory).toEqual(expect.any(Function));

    // @ts-expect-error
    metaFactory({});
    // @ts-expect-error
    metaFactory(null);
    // @ts-expect-error
    metaFactory(undefined);
    metaFactory();
  });

  it('should create factory with dependencies with optional derpFactory', () => {
    const metaFactory = createServiceFactory({
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

    expect(metaFactory).toEqual(expect.any(Function));

    // @ts-expect-error
    metaFactory({});
    // @ts-expect-error
    metaFactory(null);
    // @ts-expect-error
    metaFactory(undefined);
    metaFactory();
  });

  it('should create factory with required options and dependencies', () => {
    const metaFactory = createServiceFactory((_opts: TestOptions) => ({
      service: ref,
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
      async factory({ plugin }, { root }) {
        const root1: number = root;
        // @ts-expect-error
        const root2: string = root;
        const plugin3: boolean = plugin;
        // @ts-expect-error
        const plugin4: number = plugin;
        unused(root1, root2, plugin3, plugin4);
        return 'x';
      },
    }));
    expect(metaFactory).toEqual(expect.any(Function));

    // @ts-expect-error
    metaFactory('string');
    // @ts-expect-error
    metaFactory({});
    metaFactory({ x: 1 });
    // @ts-expect-error
    metaFactory({ x: 1, y: 2 });
    // @ts-expect-error
    metaFactory(null);
    // @ts-expect-error
    metaFactory(undefined);
    // @ts-expect-error
    metaFactory();
  });

  it('should create factory with optional options and dependencies', () => {
    const metaFactory = createServiceFactory((_opts?: TestOptions) => ({
      service: ref,
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
      async factory({ plugin }, { root }) {
        const root1: number = root;
        // @ts-expect-error
        const root2: string = root;
        const plugin3: boolean = plugin;
        // @ts-expect-error
        const plugin4: number = plugin;
        unused(root1, root2, plugin3, plugin4);
        return 'x';
      },
    }));
    expect(metaFactory).toEqual(expect.any(Function));

    // @ts-expect-error
    metaFactory('string');
    // @ts-expect-error
    metaFactory({});
    metaFactory({ x: 1 });
    // @ts-expect-error
    metaFactory({ x: 1, y: 2 });
    // @ts-expect-error
    metaFactory(null);
    metaFactory(undefined);
    metaFactory();
  });

  it('should only allow objects as options', () => {
    // @ts-expect-error
    const metaFactory = createServiceFactory((_opts: string) => ({
      service: ref,
      deps: {},
      async factory() {
        return async () => 'x';
      },
    }));
    expect(metaFactory).toEqual(expect.any(Function));
    // @ts-expect-error
    createServiceFactory((_opts: number) => ({
      service: ref,
      deps: {},
      async factory() {
        return async () => 'x';
      },
    }));
    // @ts-expect-error
    createServiceFactory((_opts: symbol) => ({
      service: ref,
      deps: {},
      async factory() {
        return async () => 'x';
      },
    }));
    // @ts-expect-error
    createServiceFactory((_opts: bigint) => ({
      service: ref,
      deps: {},
      async factory() {
        return async () => 'x';
      },
    }));
    // @ts-expect-error
    createServiceFactory((_opts: 'string') => ({
      service: ref,
      deps: {},
      async factory() {
        return async () => 'x';
      },
    }));
    // @ts-expect-error
    createServiceFactory((_opts: Array) => ({
      service: ref,
      deps: {},
      async factory() {
        return async () => 'x';
      },
    }));
    // @ts-expect-error
    createServiceFactory((_opts: Map) => ({
      service: ref,
      deps: {},
      async factory() {
        return async () => 'x';
      },
    }));
    // @ts-expect-error
    createServiceFactory((_opts: Set) => ({
      service: ref,
      deps: {},
      async factory() {
        return async () => 'x';
      },
    }));
    // @ts-expect-error
    createServiceFactory((_opts: null) => ({
      service: ref,
      deps: {},
      async factory() {
        return async () => 'x';
      },
    }));
  });
});
