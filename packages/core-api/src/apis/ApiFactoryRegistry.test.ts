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

import { ApiFactoryRegistry } from './ApiFactoryRegistry';
import { createApiRef } from './ApiRef';

const aRef = createApiRef<number>({ id: 'a', description: '' });
const aFactory1 = { api: aRef, deps: {}, factory: () => 1 };
const aFactory2 = { api: aRef, deps: {}, factory: () => 2 };
const bRef = createApiRef<string>({ id: 'b', description: '' });
const bFactory = { api: bRef, deps: {}, factory: () => 'x' };
const cRef = createApiRef<string>({ id: 'c', description: '' });
const cFactory = { api: cRef, deps: {}, factory: () => 'y' };

describe('ApiFactoryRegistry', () => {
  it('should be empty when created', () => {
    const registry = new ApiFactoryRegistry();
    expect(registry.getAllApis()).toEqual(new Set());
  });

  it('should register a factory', () => {
    const registry = new ApiFactoryRegistry();
    expect(registry.register('default', aFactory1)).toBe(true);
    expect(registry.get(aRef)).toBe(aFactory1);
    expect(registry.getAllApis()).toEqual(new Set([aRef]));
  });

  it('should prioritize factories based on scope', () => {
    const registry = new ApiFactoryRegistry();
    expect(registry.register('default', aFactory1)).toBe(true);
    expect(registry.get(aRef)).toBe(aFactory1);
    expect(registry.register('default', aFactory2)).toBe(false);
    expect(registry.get(aRef)).toBe(aFactory1);
    expect(registry.register('app', aFactory2)).toBe(true);
    expect(registry.get(aRef)).toBe(aFactory2);
    expect(registry.register('default', aFactory1)).toBe(false);
    expect(registry.get(aRef)).toBe(aFactory2);
    expect(registry.register('static', aFactory1)).toBe(true);
    expect(registry.get(aRef)).toBe(aFactory1);
    expect(registry.register('static', aFactory2)).toBe(false);
    expect(registry.get(aRef)).toBe(aFactory1);
    expect(registry.register('app', aFactory2)).toBe(false);
    expect(registry.get(aRef)).toBe(aFactory1);
    expect(registry.getAllApis()).toEqual(new Set([aRef]));
  });

  it('should register multiple factories without conflict', () => {
    const registry = new ApiFactoryRegistry();
    expect(registry.register('static', aFactory1)).toBe(true);
    expect(registry.register('default', bFactory)).toBe(true);
    expect(registry.register('app', cFactory)).toBe(true);
    expect(registry.get(aRef)).toBe(aFactory1);
    expect(registry.get(bRef)).toBe(bFactory);
    expect(registry.get(cRef)).toBe(cFactory);
    expect(registry.getAllApis()).toEqual(new Set([aRef, bRef, cRef]));
  });
});
