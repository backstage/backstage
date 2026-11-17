/*
 * Copyright 2021 The Backstage Authors
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

import { createPlugin } from './Plugin';
import { createApiFactory, createApiRef } from '../apis';
import { createApiRef as createFrontendApiRef } from '@backstage/frontend-plugin-api';

describe('Plugin APIs', () => {
  it('should reject async API refs in registrations and dependencies at compile time', () => {
    const oldRef = createApiRef<string>({ id: 'test.old' });
    const syncRef = createFrontendApiRef<string>().with({ id: 'test.sync' });
    const asyncRef = createFrontendApiRef<string>().with({
      id: 'test.async',
      loading: 'async',
    });
    const oldFactory = createApiFactory(oldRef, 'old');
    const syncFactory = createApiFactory(syncRef, 'sync');
    // Even a synchronous implementation cannot make an async ref compatible.
    const asyncFactory = createApiFactory(asyncRef, 'async');

    const plugin = createPlugin({
      id: 'test',
      apis: [oldFactory, syncFactory],
    });
    expect([...plugin.getApis()]).toEqual([oldFactory, syncFactory]);

    createPlugin({
      id: 'test',
      // @ts-expect-error Old-system plugins cannot register async refs.
      apis: [asyncFactory],
    });
    createPlugin({
      id: 'test',
      // @ts-expect-error Old-system API dependencies must also be synchronous.
      apis: [
        {
          api: syncRef,
          deps: {
            value: asyncRef,
          },
          factory: () => 'value',
        },
      ],
    });
  });
});

describe('Plugin Feature Flag', () => {
  it('should be able to register and receive feature flags', () => {
    expect(
      createPlugin({
        id: 'test',
        featureFlags: [{ name: 'test' }],
      }).getFeatureFlags(),
    ).toEqual([{ name: 'test' }]);

    expect(
      createPlugin({
        id: 'test',
      }).getFeatureFlags(),
    ).toEqual([]);
  });
});
