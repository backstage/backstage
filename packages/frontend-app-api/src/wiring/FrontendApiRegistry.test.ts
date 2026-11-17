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
  createApiRef,
  createApiFactory,
} from '@backstage/frontend-plugin-api';
import {
  FrontendApiRegistry,
  FrontendApiResolver,
} from './FrontendApiRegistry';

describe('FrontendApiResolver', () => {
  it('should cache promise-valued APIs and pass promises to dependent factories', async () => {
    const child = createApiRef<Promise<{ value: string }>>().with({
      id: 'test.child',
    });
    const parent = createApiRef<Promise<string>>().with({ id: 'test.parent' });
    const childFactory = jest.fn(async () => ({ value: 'child' }));
    const parentFactory = jest.fn(
      async ({ dependency }: { dependency: Promise<{ value: string }> }) => {
        return `parent: ${(await dependency).value}`;
      },
    );
    const registry = new FrontendApiRegistry();
    registry.register(
      createApiFactory({ api: child, deps: {}, factory: childFactory }),
    );
    registry.register(
      createApiFactory({
        api: parent,
        deps: { dependency: child },
        factory: parentFactory,
      }),
    );
    const container = createApiRef<{
      dependency: Promise<{ value: string }>;
    }>().with({ id: 'test.container' });
    registry.register(
      createApiFactory({
        api: container,
        deps: { dependency: child },
        factory: deps => deps,
      }),
    );
    const resolver = new FrontendApiResolver({ primaryRegistry: registry });
    const first = resolver.get(parent);
    const dependency: Promise<{ value: string }> | undefined =
      resolver.get(child);
    expect(resolver.get(parent)).toBe(first);
    expect(parentFactory).toHaveBeenCalledWith({ dependency });
    expect(resolver.get(container)?.dependency).toBe(dependency);
    expect(childFactory).toHaveBeenCalledTimes(1);
    expect(parentFactory).toHaveBeenCalledTimes(1);
    await expect(first).resolves.toBe('parent: child');
    expect(resolver.get(parent)).toBe(first);
    expect(
      resolver.get(createApiRef<Promise<string>>().with({ id: 'missing' })),
    ).toBeUndefined();

    resolver.invalidate([child.id, parent.id]);
    const replacement = resolver.get(parent);
    expect(replacement).not.toBe(first);
    await expect(replacement).resolves.toBe('parent: child');
    expect(childFactory).toHaveBeenCalledTimes(2);
    expect(parentFactory).toHaveBeenCalledTimes(2);
  });

  it('should cache a rejected promise without rerunning its factory', async () => {
    const api = createApiRef<Promise<string>>().with({ id: 'test.rejected' });
    const factory = jest.fn(async () => {
      throw new Error('API initialization failed');
    });
    const registry = new FrontendApiRegistry();
    registry.register(createApiFactory({ api, deps: {}, factory }));
    const resolver = new FrontendApiResolver({ primaryRegistry: registry });
    const promise = resolver.get(api);
    await expect(promise).rejects.toThrow('API initialization failed');
    expect(resolver.get(api)).toBe(promise);
    expect(factory).toHaveBeenCalledTimes(1);
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
