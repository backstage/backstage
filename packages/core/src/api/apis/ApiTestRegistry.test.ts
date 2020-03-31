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

import ApiTestRegistry from './ApiTestRegistry';
import ApiRef from './ApiRef';

describe('ApiTestRegistry', () => {
  const aRef = new ApiRef<number>({ id: 'a', description: '' });
  const bRef = new ApiRef<string>({ id: 'b', description: '' });
  const cRef = new ApiRef<string>({ id: 'c', description: '' });

  it('should be created', () => {
    const registry = new ApiTestRegistry();
    expect(registry.get(aRef)).toBe(undefined);
    expect(registry.get(bRef)).toBe(undefined);
    expect(registry.get(cRef)).toBe(undefined);
  });

  it('should register a factory', () => {
    const registry = new ApiTestRegistry();
    registry.register(aRef, () => 3);
    expect(registry.get(aRef)).toBe(3);
    expect(registry.get(bRef)).toBe(undefined);
    expect(registry.get(cRef)).toBe(undefined);
  });

  it('should remove factories when resetting', () => {
    const registry = new ApiTestRegistry();
    registry.register(aRef, () => 3);
    expect(registry.get(aRef)).toBe(3);
    registry.reset();
    expect(registry.get(aRef)).toBe(undefined);
  });

  it('should keep saved factories when resetting', () => {
    const registry = new ApiTestRegistry();
    registry.register(aRef, () => 3);
    registry.save();
    registry.register(bRef, () => 'x');
    expect(registry.get(aRef)).toBe(3);
    expect(registry.get(bRef)).toBe('x');
    registry.reset();
    expect(registry.get(aRef)).toBe(3);
    expect(registry.get(bRef)).toBe(undefined);
  });

  it('should register factories with dependencies', () => {
    // 100% coverage + happy typescript = hasOwnProperty + this atrocity
    const cDeps = Object.create(
      { c: cRef },
      { a: { enumerable: true, value: aRef } },
    );
    cDeps.b = bRef;

    const registry = new ApiTestRegistry();
    registry.register({ implements: aRef, deps: {}, factory: () => 3 });
    registry.register({
      implements: bRef,
      deps: { dep: aRef },
      factory: ({ dep }) => `hello ${dep}`,
    });
    registry.register({
      implements: cRef,
      deps: cDeps,
      factory: ({ a, b }) => b.repeat(a),
    });
    expect(registry.get(aRef)).toBe(3);
    expect(registry.get(bRef)).toBe('hello 3');
    expect(registry.get(cRef)).toBe('hello 3hello 3hello 3');
  });

  it('should not allow cyclic dependencies', () => {
    const registry = new ApiTestRegistry();
    registry.register({
      implements: aRef,
      deps: { b: bRef },
      factory: () => 1,
    });
    registry.register({
      implements: bRef,
      deps: { c: cRef },
      factory: () => 'b',
    });
    registry.register({
      implements: cRef,
      deps: { a: aRef },
      factory: () => 'c',
    });
    expect(() => registry.get(aRef)).toThrow(
      'Circular dependency of api factory for apiRef{a}',
    );
    expect(() => registry.get(bRef)).toThrow(
      'Circular dependency of api factory for apiRef{b}',
    );
    expect(() => registry.get(cRef)).toThrow(
      'Circular dependency of api factory for apiRef{c}',
    );
  });

  it('should throw error if dependency is not available', () => {
    const registry = new ApiTestRegistry();
    registry.register({
      implements: aRef,
      deps: { b: bRef },
      factory: () => 1,
    });
    expect(() => registry.get(aRef)).toThrow(
      'No API factory available for dependency apiRef{b} of dependent apiRef{a}',
    );
    expect(registry.get(bRef)).toBe(undefined);
    expect(registry.get(cRef)).toBe(undefined);
  });

  it('should only call factory func once', () => {
    const registry = new ApiTestRegistry();
    const factory = jest.fn().mockReturnValue(2);
    registry.register(aRef, factory);

    expect(factory).toHaveBeenCalledTimes(0);
    expect(registry.get(aRef)).toBe(2);
    expect(factory).toHaveBeenCalledTimes(1);
    expect(registry.get(aRef)).toBe(2);
    expect(factory).toHaveBeenCalledTimes(1);
  });

  it('should call factory again after reset', () => {
    const registry = new ApiTestRegistry();
    const factory = jest.fn().mockReturnValue(2);
    registry.register(aRef, factory);
    registry.save();

    expect(factory).toHaveBeenCalledTimes(0);
    expect(registry.get(aRef)).toBe(2);
    expect(factory).toHaveBeenCalledTimes(1);
    expect(registry.get(aRef)).toBe(2);
    expect(factory).toHaveBeenCalledTimes(1);
    registry.reset();
    expect(registry.get(aRef)).toBe(2);
    expect(factory).toHaveBeenCalledTimes(2);
  });
});
