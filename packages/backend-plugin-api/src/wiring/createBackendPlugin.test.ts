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
import { ID_PATTERN } from './constants';
import { createBackendPlugin } from './createBackendPlugin';
import { createExtensionPoint } from './createExtensionPoint';
import { InternalBackendRegistrations } from './types';

describe('createBackendPlugin', () => {
  it('should create a BackendPlugin', () => {
    const result = createBackendPlugin({
      pluginId: 'x',
      register(r) {
        r.registerInit({ deps: {}, async init() {} });
      },
    });

    const plugin = result as unknown as InternalBackendRegistrations;
    expect(plugin.$$type).toEqual('@backstage/BackendFeature');
    expect(plugin.version).toEqual('v1');
    expect(plugin.getRegistrations).toEqual(expect.any(Function));
    expect(plugin.getRegistrations()).toEqual([
      {
        type: 'plugin-v1.1',
        pluginId: 'x',
        extensionPoints: [],
        init: {
          deps: expect.any(Object),
          func: expect.any(Function),
        },
      },
    ]);
  });

  it('should be able to depend on all compatible dependencies', () => {
    const singleServiceRef = createServiceRef<string>({ id: 'single' });
    const multiServiceRef = createServiceRef<string>({
      id: 'multi',
      multiton: true,
    });

    const plugin = createBackendPlugin({
      pluginId: 'x',
      register(r) {
        r.registerInit({
          deps: {
            single: singleServiceRef,
            multi: multiServiceRef,
          },
          async init({ single, multi }) {
            const a: string = single;
            const b: string[] = multi;
            expect([a, b]).toBe('unused');
          },
        });
      },
    });

    expect(plugin.$$type).toEqual('@backstage/BackendFeature');
  });

  it('should not be able to depend on extension points', () => {
    const extensionPoint = createExtensionPoint<string>({ id: 'point' });

    const plugin = createBackendPlugin({
      pluginId: 'x',
      register(r) {
        r.registerInit({
          deps: {
            // @ts-expect-error
            point: extensionPoint,
          },
          async init() {},
        });
      },
    });

    expect(plugin.$$type).toEqual('@backstage/BackendFeature');
  });
  it('should reject plugins with invalid pluginId', async () => {
    expect(() =>
      createBackendPlugin({
        pluginId: 'test:invalid&id',
        register(reg) {
          reg.registerInit({
            deps: {},
            async init() {},
          });
        },
      }),
    ).toThrow(
      `Invalid pluginId 'test:invalid&id', must match the pattern ${ID_PATTERN} (letters, digits, and dashes only, starting with a letter)`,
    );
  });
});
