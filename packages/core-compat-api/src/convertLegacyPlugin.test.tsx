/*
 * Copyright 2024 The Backstage Authors
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
  createPlugin as createLegacyPlugin,
  createRouteRef as createLegacyRouteRef,
  createExternalRouteRef as createLegacyExternalRouteRef,
  createApiFactory,
  createApiRef,
} from '@backstage/core-plugin-api';
import { convertLegacyPlugin } from './convertLegacyPlugin';
import { PageBlueprint } from '@backstage/frontend-plugin-api';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { toInternalFrontendPlugin } from '../../frontend-plugin-api/src/wiring/createFrontendPlugin';

describe('convertLegacyPlugin', () => {
  it('should convert a plain legacy plugin to a new plugin', () => {
    expect(
      convertLegacyPlugin(createLegacyPlugin({ id: 'test' }), {
        extensions: [],
      }),
    ).toMatchInlineSnapshot(`
      {
        "$$type": "@backstage/FrontendPlugin",
        "extensions": [],
        "externalRoutes": {},
        "featureFlags": [],
        "getExtension": [Function],
        "id": "test",
        "routes": {},
        "toString": [Function],
        "version": "v1",
        "withOverrides": [Function],
      }
    `);
  });

  it('should convert a legacy plugin with options to a new plugin', () => {
    const apiRef = createApiRef<string>({ id: 'plugin.test.client' });

    const routeRef = createLegacyRouteRef({ id: 'test' });
    const extRouteRef = createLegacyExternalRouteRef({ id: 'testExt' });

    const converted = convertLegacyPlugin(
      createLegacyPlugin({
        id: 'test',
        apis: [createApiFactory(apiRef, 'hello')],
        routes: { test: routeRef },
        externalRoutes: {
          testExt: extRouteRef,
        },
        featureFlags: [{ name: 'test-flag' }],
      }),
      {
        extensions: [
          PageBlueprint.make({
            params: { defaultPath: '/test', loader: async () => ({} as any) },
          }),
        ],
      },
    );

    const internalConverted = toInternalFrontendPlugin(converted);

    expect(internalConverted.id).toBe('test');
    expect(internalConverted.routes).toEqual({
      test: routeRef,
    });
    expect(internalConverted.externalRoutes).toEqual({
      testExt: extRouteRef,
    });
    expect(internalConverted.featureFlags).toEqual([{ name: 'test-flag' }]);
    expect(internalConverted.extensions.map(e => e.id)).toEqual([
      'api:test/plugin.test.client',
      'page:test',
    ]);
  });
});
