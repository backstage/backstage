/*
 * Copyright 2020 Spotify AB
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

import { ApiResolver } from './ApiResolver';
import { createApiRef } from './ApiRef';
import { ApiFactoryRegistry } from './ApiFactoryRegistry';

const aRef = createApiRef<number>({ id: 'a', description: '' });
const bRef = createApiRef<string>({ id: 'b', description: '' });
const cRef = createApiRef<{ x: string }>({ id: 'c', description: '' });

function createRegistry() {
  const registry = new ApiFactoryRegistry();
  registry.register('default', {
    api: aRef,
    deps: {},
    factory: () => 1,
  });
  registry.register('default', {
    api: bRef,
    deps: {},
    factory: () => 'b',
  });
  registry.register('default', {
    api: cRef,
    deps: { b: bRef },
    factory: ({ b }) => ({ x: 'x', b }),
  });
  return registry;
}

function createLongCyclicRegistry() {
  const registry = new ApiFactoryRegistry();
  registry.register('default', {
    api: aRef,
    deps: { b: bRef },
    factory: () => 1,
  });
  registry.register('default', {
    api: bRef,
    deps: { c: cRef },
    factory: () => 'b',
  });
  registry.register('default', {
    api: cRef,
    deps: { a: aRef },
    factory: () => ({ x: 'x' }),
  });
  return registry;
}

function createShortCyclicRegistry() {
  const registry = new ApiFactoryRegistry();
  registry.register('default', {
    api: aRef,
    deps: { a: aRef },
    factory: () => 1,
  });
  registry.register('default', {
    api: bRef,
    deps: { c: cRef },
    factory: () => 'b',
  });
  registry.register('default', {
    api: cRef,
    deps: { b: bRef },
    factory: () => ({ x: 'x' }),
  });
  return registry;
}

describe('ApiResolver', () => {
  it('should be created empty', () => {
    const resolver = new ApiResolver(new ApiFactoryRegistry());
    expect(resolver.get(aRef)).toBe(undefined);
    expect(resolver.get(bRef)).toBe(undefined);
    expect(resolver.get(cRef)).toBe(undefined);
  });

  it('should instantiate APIs', () => {
    const resolver = new ApiResolver(createRegistry());
    expect(resolver.get(aRef)).toBe(1);
    expect(resolver.get(bRef)).toBe('b');
    expect(resolver.get(cRef)).toEqual({ x: 'x', b: 'b' });
    expect(resolver.get(cRef)).toBe(resolver.get(cRef));
  });

  it('should detect long dependency cycles', () => {
    const resolver = new ApiResolver(createLongCyclicRegistry());
    expect(() => resolver.get(aRef)).toThrow(
      'Circular dependency of api factory for apiRef{a}',
    );
    // Second call for same ref should still throw
    expect(() => resolver.get(aRef)).toThrow(
      'Circular dependency of api factory for apiRef{a}',
    );
    expect(() => resolver.get(bRef)).toThrow(
      'Circular dependency of api factory for apiRef{b}',
    );
    expect(() => resolver.get(cRef)).toThrow(
      'Circular dependency of api factory for apiRef{c}',
    );
  });

  it('should detect short dependency cycles', () => {
    const resolver = new ApiResolver(createShortCyclicRegistry());
    expect(() => resolver.get(aRef)).toThrow(
      'Circular dependency of api factory for apiRef{a}',
    );
    expect(() => resolver.get(bRef)).toThrow(
      'Circular dependency of api factory for apiRef{b}',
    );
    expect(() => resolver.get(cRef)).toThrow(
      'Circular dependency of api factory for apiRef{c}',
    );
  });

  it('should validate a factory holder', () => {
    expect(() => {
      ApiResolver.validateFactories(createRegistry(), [aRef, bRef, cRef]);
    }).not.toThrow();
  });

  it('should find dependency cycles with validation', () => {
    const short = createShortCyclicRegistry();
    expect(() =>
      ApiResolver.validateFactories(short, short.getAllApis()),
    ).toThrow('Circular dependency of api factory for apiRef{a}');
    expect(() => ApiResolver.validateFactories(short, [bRef])).toThrow(
      'Circular dependency of api factory for apiRef{b}',
    );
    expect(() => ApiResolver.validateFactories(short, [cRef])).toThrow(
      'Circular dependency of api factory for apiRef{c}',
    );

    const long = createLongCyclicRegistry();
    expect(() =>
      ApiResolver.validateFactories(long, long.getAllApis()),
    ).toThrow('Circular dependency of api factory for apiRef{a}');
    expect(() => ApiResolver.validateFactories(long, [bRef])).toThrow(
      'Circular dependency of api factory for apiRef{b}',
    );
    expect(() => ApiResolver.validateFactories(long, [cRef])).toThrow(
      'Circular dependency of api factory for apiRef{c}',
    );
  });

  it('should only call factory func once', () => {
    const registry = new ApiFactoryRegistry();
    const factory = jest.fn().mockReturnValue(2);
    registry.register('default', {
      api: aRef,
      deps: {},
      factory,
    });

    const resolver = new ApiResolver(registry);
    expect(factory).toHaveBeenCalledTimes(0);
    expect(resolver.get(aRef)).toBe(2);
    expect(factory).toHaveBeenCalledTimes(1);
    expect(resolver.get(aRef)).toBe(2);
    expect(factory).toHaveBeenCalledTimes(1);
  });
});
