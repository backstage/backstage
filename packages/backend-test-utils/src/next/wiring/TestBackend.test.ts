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
  createServiceFactory,
  createServiceRef,
} from '@backstage/backend-plugin-api';
import { createTestBackend, startTestBackend } from './TestBackend';

describe('TestBackend', () => {
  it('should get a type error if service implementation does not match', () => {
    const serviceRef = createServiceRef<{ a: string; b: string }>({ id: 'a' });
    const backend = createTestBackend({
      services: [
        [serviceRef, { a: 'a' }],
        [serviceRef, { a: 'a', b: 'b' }],
        // @ts-expect-error
        [serviceRef, { c: 'c' }],
        // @ts-expect-error
        [serviceRef, { a: 'a', c: 'c' }],
        // @ts-expect-error
        [serviceRef, { a: 'a', b: 'b', c: 'c' }],
      ],
    });
    expect(backend).toBeDefined();
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
      registrables: [testModule({})],
    });

    expect(testFn).toBeCalledWith('winning');
  });
});
