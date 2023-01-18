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
  createBackendModule,
  createBackendPlugin,
  createExtensionPoint,
} from './factories';

describe('createExtensionPoint', () => {
  it('should create an ExtensionPoint', () => {
    const extensionPoint = createExtensionPoint({ id: 'x' });
    expect(extensionPoint).toBeDefined();
    expect(extensionPoint.id).toBe('x');
    expect(() => extensionPoint.T).toThrow();
    expect(String(extensionPoint)).toBe('extensionPoint{x}');
  });
});

describe('createBackendPlugin', () => {
  it('should create a BackendPlugin', () => {
    const plugin = createBackendPlugin((_options: { a: string }) => ({
      id: 'x',
      register() {},
    }));
    expect(plugin).toBeDefined();
    expect(plugin({ a: 'a' })).toBeDefined();
    expect(plugin({ a: 'a' }).id).toBe('x');
    // @ts-expect-error
    expect(plugin()).toBeDefined();
    // @ts-expect-error
    expect(plugin({ b: 'b' })).toBeDefined();
  });

  it('should create plugins with optional options', () => {
    const plugin = createBackendPlugin((_options?: { a: string }) => ({
      id: 'x',
      register() {},
    }));
    expect(plugin).toBeDefined();
    expect(plugin({ a: 'a' })).toBeDefined();
    expect(plugin()).toBeDefined();
    // @ts-expect-error
    expect(plugin({ b: 'b' })).toBeDefined();
  });

  it('should create plugins without options', () => {
    const plugin = createBackendPlugin({
      id: 'x',
      register() {},
    });
    expect(plugin).toBeDefined();
    // @ts-expect-error
    expect(plugin({ a: 'a' })).toBeDefined();
    // @ts-expect-error
    expect(plugin({})).toBeDefined();
  });

  it('should create a BackendPlugin with options as interface', () => {
    interface TestOptions {
      a: string;
    }
    const plugin = createBackendPlugin((_options: TestOptions) => ({
      id: 'x',
      register() {},
    }));
    expect(plugin).toBeDefined();
    expect(plugin({ a: 'a' })).toBeDefined();
    expect(plugin({ a: 'a' }).id).toBe('x');
    // @ts-expect-error
    expect(plugin()).toBeDefined();
    // @ts-expect-error
    expect(plugin({ b: 'b' })).toBeDefined();
  });

  it('should create plugins with optional options as interface', () => {
    interface TestOptions {
      a: string;
    }
    const plugin = createBackendPlugin((_options?: TestOptions) => ({
      id: 'x',
      register() {},
    }));
    expect(plugin).toBeDefined();
    expect(plugin({ a: 'a' })).toBeDefined();
    expect(plugin()).toBeDefined();
    // @ts-expect-error
    expect(plugin({ b: 'b' })).toBeDefined();
  });
});

describe('createBackendModule', () => {
  it('should create a BackendModule', () => {
    const mod = createBackendModule((_options: { a: string }) => ({
      pluginId: 'x',
      moduleId: 'y',
      register() {},
    }));
    expect(mod).toBeDefined();
    expect(mod({ a: 'a' })).toBeDefined();
    expect(mod({ a: 'a' }).id).toBe('x.y');
    // @ts-expect-error
    expect(mod()).toBeDefined();
    // @ts-expect-error
    expect(mod({ b: 'b' })).toBeDefined();
  });

  it('should create modules with optional options', () => {
    const mod = createBackendModule((_options?: { a: string }) => ({
      pluginId: 'x',
      moduleId: 'y',
      register() {},
    }));
    expect(mod).toBeDefined();
    expect(mod({ a: 'a' })).toBeDefined();
    expect(mod()).toBeDefined();
    // @ts-expect-error
    expect(mod({ b: 'b' })).toBeDefined();
  });

  it('should create modules without options', () => {
    const mod = createBackendModule({
      pluginId: 'x',
      moduleId: 'y',
      register() {},
    });
    expect(mod).toBeDefined();
    // @ts-expect-error
    expect(mod({ a: 'a' })).toBeDefined();
    // @ts-expect-error
    expect(mod({})).toBeDefined();
  });

  it('should create a BackendModule as interface', () => {
    interface TestOptions {
      a: string;
    }
    const mod = createBackendModule((_options: TestOptions) => ({
      pluginId: 'x',
      moduleId: 'y',
      register() {},
    }));
    expect(mod).toBeDefined();
    expect(mod({ a: 'a' })).toBeDefined();
    expect(mod({ a: 'a' }).id).toBe('x.y');
    // @ts-expect-error
    expect(mod()).toBeDefined();
    // @ts-expect-error
    expect(mod({ b: 'b' })).toBeDefined();
  });

  it('should create modules with optional options as interface', () => {
    interface TestOptions {
      a: string;
    }
    const mod = createBackendModule((_options?: TestOptions) => ({
      pluginId: 'x',
      moduleId: 'y',
      register() {},
    }));
    expect(mod).toBeDefined();
    expect(mod({ a: 'a' })).toBeDefined();
    expect(mod()).toBeDefined();
    // @ts-expect-error
    expect(mod({ b: 'b' })).toBeDefined();
  });
});
