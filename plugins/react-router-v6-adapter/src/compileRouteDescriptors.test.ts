/*
 * Copyright 2026 The Backstage Authors
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

import { createRouteDescriptor } from '@backstage/frontend-plugin-api';
import { descriptorRoutePath } from './compileRouteDescriptors';

describe('descriptorRoutePath', () => {
  // Same battery of descriptor paths exercised by the TanStack compiler
  // tests (`descriptorPathToTanStack`), so both adapters can be checked
  // against equivalent splat/param semantics for the same descriptor.
  it.each([
    { path: undefined, expected: undefined },
    { path: 'overview', expected: 'overview/*' },
    {
      path: 'entities/:kind/:namespace/:name',
      expected: 'entities/:kind/:namespace/:name/*',
    },
    { path: 'docs/*', expected: 'docs/*' },
    { path: '*', expected: '*' },
    { path: 'entities/:id/*', expected: 'entities/:id/*' },
  ])(
    'derives the React Router path for descriptor path=$path',
    ({ path, expected }) => {
      const route = createRouteDescriptor({ path });
      expect(descriptorRoutePath(route)).toBe(expected);
    },
  );

  it('keeps a splat path as-is instead of appending another wildcard', () => {
    const route = createRouteDescriptor({ path: 'docs/*' });
    expect(route.splat).toBe(true);
    expect(descriptorRoutePath(route)).toBe(route.path);
  });

  it('returns undefined for an index route', () => {
    const route = createRouteDescriptor({ index: true });
    expect(descriptorRoutePath(route)).toBeUndefined();
  });
});
