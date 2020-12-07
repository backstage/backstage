/*
 * Copyright 2020 Spotify AB
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

import { createExternalRouteRef, createRouteRef } from '../routing/RouteRef';
import { generateBoundRoutes } from './App';

describe('generateBoundRoutes', () => {
  it('runs happy path', () => {
    const external = { myRoute: createExternalRouteRef() };
    const ref = createRouteRef({ path: '', title: '' });
    const result = generateBoundRoutes(({ bind }) => {
      bind(external, { myRoute: ref });
    });

    expect(result.get(external.myRoute)).toBe(ref);
  });

  it('throws on unknown keys', () => {
    const external = { myRoute: createExternalRouteRef() };
    const ref = createRouteRef({ path: '', title: '' });
    expect(() =>
      generateBoundRoutes(({ bind }) => {
        bind(external, { someOtherRoute: ref } as any);
      }),
    ).toThrow('Key someOtherRoute is not an existing external route');
  });
});
