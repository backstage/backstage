/*
 * Copyright 2026 The Backstage Authors
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
  type AnyApiFactory,
  type AnyApiRef,
  createApiRef,
  createApiFactory,
} from '@backstage/frontend-plugin-api';
import {
  FrontendApiRegistry,
  FrontendApiResolver,
} from './FrontendApiRegistry';

describe('FrontendApiResolver', () => {
  it('should return stable promises for present async APIs and isolate resolver instances', async () => {
    const api = createApiRef<{ value: string }>().with({
      id: 'async',
      loading: 'async',
    });
    const missing = createApiRef<string>().with({
      id: 'missing',
      loading: 'async',
    });
    const factory = jest.fn(() => ({ value: 'loaded' }));
    const registry = new FrontendApiRegistry();
    registry.register(createApiFactory({ api, deps: {}, factory }));
    const resolver = new FrontendApiResolver({ primaryRegistry: registry });
    expect(factory).not.toHaveBeenCalled();

    function lookup<TApiRef extends AnyApiRef>(ref: TApiRef) {
      return resolver.get(ref);
    }
    const result: Promise<{ value: string }> | undefined = lookup(api);
    expect(result).toBeInstanceOf(Promise);
    expect(resolver.isMaterialized(api.id)).toBe(true);
    expect(resolver.get(api)).toBe(result);
    const instance = await result;
    expect(instance).toEqual({ value: 'loaded' });
    expect(resolver.get(api)).toBe(result);
    expect(factory).toHaveBeenCalledTimes(1);
    const missingResult = resolver.get(missing);
    expect(missingResult).toBeUndefined();
    expect(resolver.isMaterialized(missing.id)).toBe(false);
    expect(resolver.get(missing)).toBe(missingResult);
    registry.register(createApiFactory(missing, 'registered later'));
    await expect(resolver.get(missing)).resolves.toBe('registered later');

    const otherResolver = new FrontendApiResolver({
      primaryRegistry: registry,
    });
    expect(await otherResolver.get(api)).not.toBe(instance);
    expect(factory).toHaveBeenCalledTimes(2);
  });

  it('should start async dependencies in parallel and pass resolved, falsy values to factories', async () => {
    const left = createApiRef<string>().with({ id: 'left', loading: 'async' });
    const right = createApiRef<string>().with({
      id: 'right',
      loading: 'async',
    });
    const sync = createApiRef<boolean>().with({ id: 'sync' });
    const api = createApiRef<string>().with({ id: 'parent', loading: 'async' });
    let resolveLeft: (value: string) => void;
    let resolveRight: (value: string) => void;
    const leftPromise = new Promise<string>(resolve => {
      resolveLeft = resolve;
    });
    const rightPromise = new Promise<string>(resolve => {
      resolveRight = resolve;
    });
    const leftFactory = jest.fn(() => leftPromise);
    const rightFactory = jest.fn(() => rightPromise);
    const factory = jest.fn(
      ({ left: l, right: r, sync: s }) => `${l}-${r}-${s}`,
    );
    const registry = new FrontendApiRegistry();
    registry.registerAll([
      createApiFactory({ api: left, deps: {}, factory: leftFactory }),
      createApiFactory({ api: right, deps: {}, factory: rightFactory }),
      createApiFactory(sync, false),
      createApiFactory({ api, deps: { left, right, sync }, factory }),
    ]);
    const resolver = new FrontendApiResolver({ primaryRegistry: registry });
    const result = resolver.get(api);
    await Promise.resolve();
    expect(leftFactory).toHaveBeenCalledTimes(1);
    expect(rightFactory).toHaveBeenCalledTimes(1);
    expect(factory).not.toHaveBeenCalled();
    resolveLeft!('left');
    resolveRight!('right');
    await expect(result).resolves.toBe('left-right-false');
    expect(factory).toHaveBeenCalledWith({
      left: 'left',
      right: 'right',
      sync: false,
    });
    expect(resolver.get(api)).toBe(result);
  });

  it('should cache rejected loads and reject missing dependencies and cycles', async () => {
    const api = createApiRef<string>().with({ id: 'async', loading: 'async' });
    const dependency = createApiRef<string>().with({
      id: 'dependency',
      loading: 'async',
    });
    const error = new Error('Failed to load API chunk');
    const factory = jest.fn(() => {
      throw error;
    });
    const registry = new FrontendApiRegistry();
    registry.register(createApiFactory({ api, deps: {}, factory }));
    const resolver = new FrontendApiResolver({ primaryRegistry: registry });
    const rejected = resolver.get(api);
    await expect(rejected).rejects.toBe(error);
    expect(resolver.get(api)).toBe(rejected);
    expect(factory).toHaveBeenCalledTimes(1);

    registry.set(
      createApiFactory({
        api,
        deps: { dependency },
        factory: ({ dependency: value }) => value,
      }),
    );
    resolver.invalidate();
    await expect(resolver.get(api)).rejects.toThrow(
      'No API factory available for dependency',
    );

    registry.register(
      createApiFactory({
        api: dependency,
        deps: { api },
        factory: () => 'cycle',
      }),
    );
    resolver.invalidate();
    // Starting both roots together must reject rather than wait on each other.
    await expect(
      Promise.all([resolver.get(api), resolver.get(dependency)]),
    ).rejects.toThrow('Circular dependency');

    const syncFailure = createApiRef<string>().with({ id: 'sync-failure' });
    let rejectDependency: (error: Error) => void;
    const pendingDependency = new Promise<string>((_, reject) => {
      rejectDependency = reject;
    });
    registry.set(
      createApiFactory({
        api: dependency,
        deps: {},
        factory: () => pendingDependency,
      }),
    );
    registry.register(
      createApiFactory({
        api: syncFailure,
        deps: {},
        factory: () => {
          throw error;
        },
      }),
    );
    registry.set(
      createApiFactory({
        api,
        deps: { dependency, syncFailure },
        factory: () => 'unreachable',
      }),
    );
    resolver.invalidate();
    await expect(resolver.get(api)).rejects.toBe(error);
    const missing = createApiRef<string>().with({ id: 'missing' });
    registry.set(
      createApiFactory({
        api,
        deps: { dependency, missing },
        factory: () => 'unreachable',
      }),
    );
    resolver.invalidate([api.id]);
    const missingResult = resolver.get(api);
    await expect(missingResult).rejects.toThrow(
      'No API factory available for dependency apiRef{missing}',
    );
    expect(resolver.get(api)).toBe(missingResult);
    // A sibling that rejects later must still be observed by dependency resolution.
    rejectDependency!(new Error('Sibling dependency failed later'));
    await Promise.resolve();
  });

  it('should enforce async opt-in at runtime without corrupting existing instances', async () => {
    const sync = createApiRef<string>().with({ id: 'sync' });
    const alias = createApiRef<string>().with({ id: 'sync', loading: 'async' });
    const asyncRef = createApiRef<string>().with({
      id: 'async',
      loading: 'async',
    });
    const registry = new FrontendApiRegistry();
    registry.register(createApiFactory(sync, 'synchronous'));
    const resolver = new FrontendApiResolver({ primaryRegistry: registry });
    await expect(resolver.get(alias)).resolves.toBe('synchronous');
    expect(resolver.get(sync)).toBe('synchronous');

    registry.set({ api: sync, deps: { asyncRef }, factory: () => 'invalid' });
    resolver.invalidate();
    expect(() => resolver.get(sync)).toThrow('cannot depend on async API');
    registry.set({
      api: sync,
      deps: {},
      factory: () => Promise.resolve('invalid'),
    });
    expect(() => resolver.get(sync)).toThrow(
      "must opt in to async factories using loading: 'async'",
    );
  });

  it('should share instances across access modes and preserve factory dependency contracts', async () => {
    const sync = createApiRef<{ value: string }>().with({ id: 'migrated' });
    const asyncRef = createApiRef<{ value: string }>().with({
      id: 'migrated',
      loading: 'async',
    });
    const factory = jest.fn(() => ({ value: 'instance' }));
    const registry = new FrontendApiRegistry();
    registry.register(createApiFactory({ api: sync, deps: {}, factory }));
    const resolver = new FrontendApiResolver({ primaryRegistry: registry });
    const wrapped = resolver.get(asyncRef);
    expect(await wrapped).toBe(resolver.get(sync));
    expect(resolver.get(asyncRef)).toBe(wrapped);
    expect(factory).toHaveBeenCalledTimes(1);

    registry.set(createApiFactory({ api: asyncRef, deps: {}, factory }));
    resolver.invalidate([sync.id]);
    expect(() => resolver.get(sync)).toThrow(
      'Update the package exporting this API ref',
    );
    const migrated = resolver.get(asyncRef);
    await expect(migrated).resolves.toEqual({ value: 'instance' });
    expect(resolver.get(asyncRef)).toBe(migrated);
    expect(() => resolver.get(sync)).toThrow('requested synchronously');
    expect(factory).toHaveBeenCalledTimes(2);

    const parent = createApiRef<string>().with({ id: 'parent' });
    const asyncParent = createApiRef<string>().with({
      id: 'parent',
      loading: 'async',
    });
    const parentFactory = jest.fn(({ child }) => child.value);
    registry.register(
      createApiFactory({
        api: asyncParent,
        deps: { child: sync },
        factory: parentFactory,
      }),
    );
    await expect(resolver.get(asyncParent)).resolves.toBe('instance');
    expect(parentFactory).toHaveBeenCalledTimes(1);

    registry.set(
      createApiFactory({
        api: parent,
        deps: { child: sync },
        factory: parentFactory,
      }),
    );
    resolver.invalidate([parent.id]);
    expect(() => resolver.get(parent)).toThrow(
      "API 'parent' requests it through dependency 'child'",
    );
    expect(() => resolver.get(parent)).toThrow(
      'Dependency path: parent[child] -> migrated',
    );
    expect(() => resolver.get(parent)).toThrow(
      "Set loading: 'async' on the ref for 'parent'",
    );
    const rejected = resolver.get(asyncParent);
    await expect(rejected).rejects.toThrow(
      "API 'parent' requests it through dependency 'child'",
    );
    expect(resolver.get(asyncParent)).toBe(rejected);
    expect(parentFactory).toHaveBeenCalledTimes(1);
  });

  it('should preserve fallback promises and ignore stale completions after invalidation', async () => {
    const api = createApiRef<string>().with({ id: 'async', loading: 'async' });
    let resolveOld: (value: string) => void;
    const old = new Promise<string>(resolve => {
      resolveOld = resolve;
    });
    const registry = new FrontendApiRegistry();
    registry.register(createApiFactory({ api, deps: {}, factory: () => old }));
    const resolver = new FrontendApiResolver({ primaryRegistry: registry });
    const oldResult = resolver.get(api);
    registry.set(createApiFactory(api, 'new'));
    resolver.invalidate([api.id]);
    const newResult = resolver.get(api);
    await expect(newResult).resolves.toBe('new');
    resolveOld!('old');
    await expect(oldResult).resolves.toBe('old');
    expect(resolver.get(api)).toBe(newResult);

    const fallback = new FrontendApiResolver({ fallbackApis: resolver });
    expect(fallback.get(api)).toBe(newResult);
    expect(fallback.get(api)).toBe(newResult);
  });

  it('should cache falsy API values', () => {
    const falseApiRef = createApiRef<boolean>({ id: 'test.false' });
    const falseFactoryFn = jest.fn(() => false);
    const registry = new FrontendApiRegistry();

    registry.register({
      api: falseApiRef,
      deps: {},
      factory: falseFactoryFn,
    } as AnyApiFactory);

    const resolver = new FrontendApiResolver({ primaryRegistry: registry });

    expect(resolver.get(falseApiRef)).toBe(false);
    expect(resolver.get(falseApiRef)).toBe(false);
    expect(falseFactoryFn).toHaveBeenCalledTimes(1);
  });

  it('should resolve falsy dependencies', () => {
    const falseApiRef = createApiRef<boolean>({ id: 'test.false' });
    const dependentApiRef = createApiRef<string>({ id: 'test.dependent' });
    const falseFactoryFn = jest.fn(() => false);
    const dependentFactoryFn = jest.fn((deps: { falseDependency: boolean }) =>
      deps.falseDependency === false ? 'resolved' : 'unexpected',
    );
    const registry = new FrontendApiRegistry();

    registry.register({
      api: falseApiRef,
      deps: {},
      factory: falseFactoryFn,
    } as AnyApiFactory);
    registry.register({
      api: dependentApiRef,
      deps: { falseDependency: falseApiRef },
      factory: dependentFactoryFn,
    } as AnyApiFactory);

    const resolver = new FrontendApiResolver({ primaryRegistry: registry });

    expect(resolver.get(dependentApiRef)).toBe('resolved');
    expect(dependentFactoryFn).toHaveBeenCalledWith({
      falseDependency: false,
    });
  });
});
