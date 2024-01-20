/*
 * Copyright 2023 The Backstage Authors
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
  createRouteRef,
  createExternalRouteRef,
  createPlugin,
} from '@backstage/frontend-plugin-api';
import { collectRouteIds } from './collectRouteIds';

describe('collectRouteIds', () => {
  it('should assign IDs to routes', () => {
    const ref = createRouteRef();
    const extRef = createExternalRouteRef();

    expect(String(ref)).toMatch(
      /^RouteRef\{created at '.*collectRouteIds\.test\.ts.*'\}$/,
    );
    expect(String(extRef)).toMatch(
      /^ExternalRouteRef\{created at '.*collectRouteIds\.test\.ts.*'\}$/,
    );

    const collected = collectRouteIds([
      createPlugin({ id: 'test', routes: { ref }, externalRoutes: { extRef } }),
    ]);
    expect(Object.fromEntries(collected.routes)).toEqual({
      'test.ref': ref,
    });
    expect(Object.fromEntries(collected.externalRoutes)).toEqual({
      'test.extRef': extRef,
    });

    expect(String(ref)).toBe('RouteRef{test.ref}');
    expect(String(extRef)).toBe('ExternalRouteRef{test.extRef}');
  });
});
