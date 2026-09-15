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

import { createRouteRef } from '@backstage/frontend-plugin-api';
import { createMockRouteResolutionApi } from './createMockRouteResolutionApi';

describe('createMockRouteResolutionApi', () => {
  it('should resolve parameter-less routes from the routes map', () => {
    const home = createRouteRef();
    const api = createMockRouteResolutionApi({
      routes: [[home, '/home']],
    });

    const routeFunc = api.resolve(home);
    expect(routeFunc?.()).toBe('/home');
  });

  it('should substitute path params from the routes map', () => {
    const entity = createRouteRef({
      params: ['namespace', 'kind', 'name'],
    });
    const api = createMockRouteResolutionApi({
      routes: [[entity, '/catalog/:namespace/:kind/:name']],
    });

    const routeFunc = api.resolve(entity);
    expect(
      routeFunc?.({
        namespace: 'default',
        kind: 'component',
        name: 'widget',
      }),
    ).toBe('/catalog/default/component/widget');
  });

  it('should return undefined for unmapped routes', () => {
    const missing = createRouteRef();
    const api = createMockRouteResolutionApi({ routes: [] });
    expect(api.resolve(missing)).toBeUndefined();
  });

  it('should prefer an explicit resolve implementation', () => {
    const home = createRouteRef();
    const resolve = jest.fn(() => () => '/custom');
    const api = createMockRouteResolutionApi({
      routes: [[home, '/ignored']],
      resolve,
    });

    expect(api.resolve(home)?.()).toBe('/custom');
    expect(resolve).toHaveBeenCalledWith(home);
  });

  it('should expose resolve as a jest mock for assertions', () => {
    const home = createRouteRef();
    const api = createMockRouteResolutionApi({
      routes: [[home, '/home']],
    });
    api.resolve(home, { sourcePath: '/current' });
    expect(api.resolve).toHaveBeenCalledWith(home, { sourcePath: '/current' });
  });

  it('should set RouteFunc.length from the route ref params', () => {
    const home = createRouteRef();
    const entity = createRouteRef({
      params: ['namespace', 'kind', 'name'],
    });
    const api = createMockRouteResolutionApi({
      routes: [
        [home, '/home'],
        // Arity comes from the route ref, not from `:param` segments.
        [entity, '/catalog/:namespace/:kind/:name'],
      ],
    });

    expect(api.resolve(home)?.length).toBe(0);
    expect(api.resolve(entity)?.length).toBe(1);
  });
});
