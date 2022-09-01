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
  createExtensionPoint,
  createServiceFactory,
  createServiceRef,
} from '@backstage/backend-plugin-api';
import { startTestBackend } from './TestBackend';

describe('TestBackend', () => {
  it('should get a type error if service implementation does not match', async () => {
    type Obj = { a: string; b: string };
    const serviceRef = createServiceRef<Obj>({ id: 'a' });
    const extensionPoint1 = createExtensionPoint<Obj>({ id: 'b1' });
    const extensionPoint2 = createExtensionPoint<Obj>({ id: 'b2' });
    const extensionPoint3 = createExtensionPoint<Obj>({ id: 'b3' });
    const extensionPoint4 = createExtensionPoint<Obj>({ id: 'b4' });
    const extensionPoint5 = createExtensionPoint<Obj>({ id: 'b5' });
    await startTestBackend({
      services: [
        // @ts-expect-error
        [extensionPoint1, { a: 'a' }],
        [serviceRef, { a: 'a' }],
        [serviceRef, { a: 'a', b: 'b' }],
        // @ts-expect-error
        [serviceRef, { c: 'c' }],
        // @ts-expect-error
        [serviceRef, { a: 'a', c: 'c' }],
        // @ts-expect-error
        [serviceRef, { a: 'a', b: 'b', c: 'c' }],
      ],
      extensionPoints: [
        // @ts-expect-error
        [serviceRef, { a: 'a' }],
        [extensionPoint1, { a: 'a' }],
        [extensionPoint2, { a: 'a', b: 'b' }],
        // @ts-expect-error
        [extensionPoint3, { c: 'c' }],
        // @ts-expect-error
        [extensionPoint4, { a: 'a', c: 'c' }],
        // @ts-expect-error
        [extensionPoint5, { a: 'a', b: 'b', c: 'c' }],
      ],
    });
    expect(1).toBe(1);
  });

  it('should start the test backend', async () => {
    const testRef = createServiceRef<(v: string) => void>({ id: 'test' });
    const testFn = jest.fn();

    const sf = createServiceFactory({
      deps: {},
      service: testRef,
      factory: async () => {
        return async () => testFn;
      },
    });

    const testModule = createBackendModule({
      moduleId: 'test.module',
      pluginId: 'test',
      register(env) {
        env.registerInit({
          deps: {
            test: testRef,
          },
          async init({ test }) {
            test('winning');
          },
        });
      },
    });

    await startTestBackend({
      services: [sf],
      features: [testModule({})],
    });

    expect(testFn).toHaveBeenCalledWith('winning');
  });
});
