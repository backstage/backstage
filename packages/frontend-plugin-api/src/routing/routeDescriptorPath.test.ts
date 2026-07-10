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

import { createRouteDescriptor } from './RouteDescriptor';
import {
  collectRouteDescriptorParams,
  getRouteDescriptorParamName,
  isRouteDescriptorParamSegment,
  isRouteDescriptorSplatSegment,
  isSplatRouteDescriptorPath,
  joinRouteDescriptorPaths,
  splitRouteDescriptorPath,
} from './routeDescriptorPath';

describe('splitRouteDescriptorPath', () => {
  it('splits a path into its segments', () => {
    expect(splitRouteDescriptorPath('entities/:kind/:name')).toEqual([
      'entities',
      ':kind',
      ':name',
    ]);
  });

  it('returns an empty array for an undefined path', () => {
    expect(splitRouteDescriptorPath(undefined)).toEqual([]);
  });
});

describe('isRouteDescriptorSplatSegment / isRouteDescriptorParamSegment', () => {
  it('classifies splat, param, and literal segments', () => {
    expect(isRouteDescriptorSplatSegment('*')).toBe(true);
    expect(isRouteDescriptorSplatSegment(':id')).toBe(false);
    expect(isRouteDescriptorSplatSegment('overview')).toBe(false);

    expect(isRouteDescriptorParamSegment(':id')).toBe(true);
    expect(isRouteDescriptorParamSegment('*')).toBe(false);
    expect(isRouteDescriptorParamSegment('overview')).toBe(false);
  });

  it('extracts the param name from a param segment', () => {
    expect(getRouteDescriptorParamName(':id')).toBe('id');
  });
});

describe('isSplatRouteDescriptorPath / collectRouteDescriptorParams', () => {
  // Same battery of descriptor paths exercised by the React Router and
  // TanStack Router compiler tests, so all adapters can be checked against
  // the same splat/param semantics defined here.
  const cases: Array<{
    path: string | undefined;
    splat: boolean;
    params: string[];
  }> = [
    { path: undefined, splat: false, params: [] },
    { path: 'overview', splat: false, params: [] },
    {
      path: 'entities/:kind/:namespace/:name',
      splat: false,
      params: ['kind', 'namespace', 'name'],
    },
    { path: 'docs/*', splat: true, params: [] },
    { path: '*', splat: true, params: [] },
    { path: 'entities/:id/*', splat: true, params: ['id'] },
  ];

  it.each(cases)(
    'derives splat=$splat and params=$params for path=$path',
    ({ path, splat, params }) => {
      expect(isSplatRouteDescriptorPath(path)).toBe(splat);
      expect(collectRouteDescriptorParams(path)).toEqual(params);
    },
  );

  it('matches the splat/params computed on a created RouteDescriptor', () => {
    for (const { path, splat, params } of cases) {
      if (path === undefined) {
        continue;
      }
      const route = createRouteDescriptor({ path });
      expect(route.splat).toBe(splat);
      expect(route.params).toEqual(params);
    }
  });
});

describe('joinRouteDescriptorPaths', () => {
  it('joins a root parent path with a sub-path', () => {
    expect(joinRouteDescriptorPaths('/', 'overview')).toBe('/overview');
  });

  it('joins a nested parent path with a sub-path', () => {
    expect(joinRouteDescriptorPaths('/catalog', 'entities')).toBe(
      '/catalog/entities',
    );
  });

  it('normalizes leading and trailing slashes on the sub-path', () => {
    expect(joinRouteDescriptorPaths('/catalog', '/entities/')).toBe(
      '/catalog/entities',
    );
  });

  it('strips a trailing slash from the parent path before joining', () => {
    expect(joinRouteDescriptorPaths('/catalog/', 'entities')).toBe(
      '/catalog/entities',
    );
  });

  it('returns the parent path unchanged for an empty sub-path', () => {
    expect(joinRouteDescriptorPaths('/catalog', '')).toBe('/catalog');
    expect(joinRouteDescriptorPaths('/', '')).toBe('/');
  });
});
