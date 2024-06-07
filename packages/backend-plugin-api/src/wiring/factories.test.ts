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

import { BackendFeature } from '../types';
import {
  createBackendModule,
  createBackendPlugin,
  createExtensionPoint,
} from './factories';
import { InternalBackendFeature } from './types';

describe('createExtensionPoint', () => {
  it('should create an ExtensionPoint', () => {
    const extensionPoint = createExtensionPoint({ id: 'x' });
    expect(extensionPoint).toBeDefined();
    expect(extensionPoint.id).toBe('x');
    expect(() => extensionPoint.T).not.toThrow();
    expect(String(extensionPoint)).toBe('extensionPoint{x}');
  });
});

describe('createBackendPlugin', () => {
  it('should create a BackendPlugin', () => {
    const result: BackendFeature = createBackendPlugin({
      pluginId: 'x',
      register(r) {
        r.registerInit({ deps: {}, async init() {} });
      },
    }) as InternalBackendFeature;

    const plugin = result as InternalBackendFeature;

    // legacy form
    const legacy = plugin() as InternalBackendFeature;
    expect(legacy.$$type).toEqual('@backstage/BackendFeature');
    expect(legacy.version).toEqual('v1');
    expect(legacy.getRegistrations).toEqual(expect.any(Function));

    // new form
    expect(plugin.$$type).toEqual('@backstage/BackendFeature');
    expect(plugin.version).toEqual('v1');
    expect(plugin.getRegistrations).toEqual(expect.any(Function));

    expect(plugin.getRegistrations()).toEqual([
      {
        type: 'plugin',
        pluginId: 'x',
        extensionPoints: [],
        init: {
          deps: expect.any(Object),
          func: expect.any(Function),
        },
      },
    ]);

    // @ts-expect-error
    expect(plugin({ a: 'a' })).toBeDefined();
  });
});

describe('createBackendModule', () => {
  it('should create a BackendModule', () => {
    const result: BackendFeature = createBackendModule({
      pluginId: 'x',
      moduleId: 'y',
      register(r) {
        r.registerInit({ deps: {}, async init() {} });
      },
    });

    const module: InternalBackendFeature = result as InternalBackendFeature;

    // legacy form
    const legacy = module() as InternalBackendFeature;
    expect(legacy.$$type).toEqual('@backstage/BackendFeature');
    expect(legacy.version).toEqual('v1');
    expect(legacy.getRegistrations).toEqual(expect.any(Function));

    // new form
    expect(module.$$type).toEqual('@backstage/BackendFeature');
    expect(module.version).toEqual('v1');
    expect(module.getRegistrations).toEqual(expect.any(Function));

    expect(module.getRegistrations()).toEqual([
      {
        type: 'module',
        pluginId: 'x',
        moduleId: 'y',
        extensionPoints: [],
        init: {
          deps: expect.any(Object),
          func: expect.any(Function),
        },
      },
    ]);

    // @ts-expect-error
    expect(module({ a: 'a' })).toBeDefined();
  });
});
