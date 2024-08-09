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

import { createServiceRef } from '../services';
import { createBackendModule } from './createBackendModule';
import { createExtensionPoint } from './createExtensionPoint';
import { InternalBackendRegistrations } from './types';

describe('createBackendModule', () => {
  it('should create a BackendModule', () => {
    const result = createBackendModule({
      pluginId: 'x',
      moduleId: 'y',
      register(r) {
        r.registerInit({ deps: {}, async init() {} });
      },
    });

    // legacy form
    const legacy = result() as unknown as InternalBackendRegistrations;
    expect(legacy.$$type).toEqual('@backstage/BackendFeature');
    expect(legacy.version).toEqual('v1');
    expect(legacy.getRegistrations).toEqual(expect.any(Function));

    // new form
    const module = result as unknown as InternalBackendRegistrations;
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

  it('should be able to depend on all types of dependencies', () => {
    const extensionPoint = createExtensionPoint<string>({ id: 'point' });
    const singleServiceRef = createServiceRef<string>({ id: 'single' });
    const multiServiceRef = createServiceRef<string>({
      id: 'multi',
      multiton: true,
    });

    const plugin = createBackendModule({
      pluginId: 'x',
      moduleId: 'y',
      register(r) {
        r.registerInit({
          deps: {
            point: extensionPoint,
            single: singleServiceRef,
            multi: multiServiceRef,
          },
          async init({ point, single, multi }) {
            const a: string = point;
            const b: string = single;
            const c: string[] = multi;
            expect([a, b, c]).toBe('unused');
          },
        });
      },
    });

    expect(plugin.$$type).toEqual('@backstage/BackendFeature');
  });
});
