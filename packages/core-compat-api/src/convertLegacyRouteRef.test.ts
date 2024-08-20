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
  RouteRef as OldRouteRef,
  SubRouteRef as OldSubRouteRef,
  ExternalRouteRef as OldExternalRouteRef,
  createRouteRef as createOldRouteRef,
  createSubRouteRef as createOldSubRouteRef,
  createExternalRouteRef as createOldExternalRouteRef,
} from '@backstage/core-plugin-api';
import {
  RouteRef as NewRouteRef,
  SubRouteRef as NewSubRouteRef,
  ExternalRouteRef as NewExternalRouteRef,
  createRouteRef as createNewRouteRef,
  createSubRouteRef as createNewSubRouteRef,
  createExternalRouteRef as createNewExternalRouteRef,
} from '@backstage/frontend-plugin-api';
import { convertLegacyRouteRef } from './convertLegacyRouteRef';

// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { toInternalRouteRef as toInternalNewRouteRef } from '../../frontend-plugin-api/src/routing/RouteRef';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { toInternalSubRouteRef as toInternalNewSubRouteRef } from '../../frontend-plugin-api/src/routing/SubRouteRef';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { toInternalExternalRouteRef as toInternalNewExternalRouteRef } from '../../frontend-plugin-api/src/routing/ExternalRouteRef';

describe('convertLegacyRouteRef', () => {
  it('converts old to new', () => {
    const ref1 = createOldRouteRef({ id: 'ref1' });
    const ref2 = createOldRouteRef({ id: 'ref2', params: ['p1', 'p2'] });
    const ref1sub1 = createOldSubRouteRef({
      id: 'sub1',
      parent: ref1,
      path: '/sub1',
    });
    const ref1sub2 = createOldSubRouteRef({
      id: 'sub2',
      parent: ref1,
      path: '/sub2/:p3',
    });
    const ref2sub1 = createOldSubRouteRef({
      id: 'sub1',
      parent: ref2,
      path: '/sub1/:p3',
    });
    const ref3 = createOldExternalRouteRef({
      id: 'ref3',
    });
    const ref4 = createOldExternalRouteRef({
      id: 'ref4',
      optional: true,
      defaultTarget: 'ref2',
      params: ['p1', 'p2'],
    });

    const ref1Converted: NewRouteRef = convertLegacyRouteRef(ref1);
    const ref2Converted: NewRouteRef = convertLegacyRouteRef(ref2);
    const ref1sub1Converted: NewSubRouteRef = convertLegacyRouteRef(ref1sub1);
    const ref1sub2Converted: NewSubRouteRef = convertLegacyRouteRef(ref1sub2);
    const ref2sub1Converted: NewSubRouteRef = convertLegacyRouteRef(ref2sub1);
    const ref3Converted: NewExternalRouteRef = convertLegacyRouteRef(ref3);
    const ref4Converted: NewExternalRouteRef = convertLegacyRouteRef(ref4);

    // Check for reference equality
    expect(ref1).toBe(ref1Converted);
    expect(ref2).toBe(ref2Converted);
    expect(ref1sub1).toBe(ref1sub1Converted);
    expect(ref1sub2).toBe(ref1sub2Converted);
    expect(ref2sub1).toBe(ref2sub1Converted);
    expect(ref3).toBe(ref3Converted);
    expect(ref4).toBe(ref4Converted);

    const ref1Internal = toInternalNewRouteRef(ref1Converted);
    const ref2Internal = toInternalNewRouteRef(ref2Converted);
    const ref1sub1Internal = toInternalNewSubRouteRef(ref1sub1Converted);
    const ref1sub2Internal = toInternalNewSubRouteRef(ref1sub2Converted);
    const ref2sub1Internal = toInternalNewSubRouteRef(ref2sub1Converted);
    const ref3Internal = toInternalNewExternalRouteRef(ref3Converted);
    const ref4Internal = toInternalNewExternalRouteRef(ref4Converted);

    expect(ref1Internal.getDescription()).toBe(
      'routeRef{type=absolute,id=ref1}',
    );
    expect(ref1Internal.getParams()).toEqual([]);
    expect(ref2Internal.getDescription()).toBe(
      'routeRef{type=absolute,id=ref2}',
    );
    expect(ref2Internal.getParams()).toEqual(['p1', 'p2']);

    expect(ref1sub1Internal.getDescription()).toBe(
      'routeRef{type=sub,id=sub1}',
    );
    expect(ref1sub1Internal.getParams()).toEqual([]);
    expect(ref1sub1Internal.getParent()).toBe(ref1);
    expect(ref1sub2Internal.getDescription()).toBe(
      'routeRef{type=sub,id=sub2}',
    );
    expect(ref1sub2Internal.getParams()).toEqual(['p3']);
    expect(ref1sub2Internal.getParent()).toBe(ref1);
    expect(ref2sub1Internal.getDescription()).toBe(
      'routeRef{type=sub,id=sub1}',
    );
    expect(ref2sub1Internal.getParams()).toEqual(['p1', 'p2', 'p3']);
    expect(ref2sub1Internal.getParent()).toBe(ref2);

    expect(ref3Internal.getDefaultTarget()).toBe(undefined);
    expect(ref3Internal.getDescription()).toBe(
      'routeRef{type=external,id=ref3}',
    );
    expect(ref3Internal.getParams()).toEqual([]);
    expect(ref4Internal.getDefaultTarget()).toBe('ref2');
    expect(ref4Internal.getDescription()).toBe(
      'routeRef{type=external,id=ref4}',
    );
    expect(ref4Internal.getParams()).toEqual(['p1', 'p2']);
  });

  it('converts new to old', () => {
    const ref1 = createNewRouteRef();
    const ref2 = createNewRouteRef({ params: ['p1', 'p2'] });
    const ref1sub1 = createNewSubRouteRef({
      parent: ref1,
      path: '/sub1',
    });
    const ref1sub2 = createNewSubRouteRef({
      parent: ref1,
      path: '/sub2/:p3',
    });
    const ref2sub1 = createNewSubRouteRef({
      parent: ref2,
      path: '/sub1/:p3',
    });
    const ref3 = createNewExternalRouteRef();
    const ref4 = createNewExternalRouteRef({
      defaultTarget: 'ref2',
      params: ['p1', 'p2'],
    });

    const ref1Converted: OldRouteRef = convertLegacyRouteRef(ref1);
    const ref2Converted: OldRouteRef = convertLegacyRouteRef(ref2);
    const ref1sub1Converted: OldSubRouteRef = convertLegacyRouteRef(ref1sub1);
    const ref1sub2Converted: OldSubRouteRef = convertLegacyRouteRef(ref1sub2);
    const ref2sub1Converted: OldSubRouteRef = convertLegacyRouteRef(ref2sub1);
    const ref3Converted: OldExternalRouteRef = convertLegacyRouteRef(ref3);
    const ref4Converted: OldExternalRouteRef = convertLegacyRouteRef(ref4);

    // Check for reference equality
    expect(ref1).toBe(ref1Converted);
    expect(ref2).toBe(ref2Converted);
    expect(ref1sub1).toBe(ref1sub1Converted);
    expect(ref1sub2).toBe(ref1sub2Converted);
    expect(ref2sub1).toBe(ref2sub1Converted);
    expect(ref3).toBe(ref3Converted);
    expect(ref4).toBe(ref4Converted);

    expect(String(ref1Converted)).toMatch(/^RouteRef\{created at '.*'\}$/);
    expect(ref1Converted.params).toEqual([]);
    expect(String(ref2Converted)).toMatch(/^RouteRef\{created at '.*'\}$/);
    expect(ref2Converted.params).toEqual(['p1', 'p2']);

    expect(String(ref1sub1Converted)).toMatch(
      /^SubRouteRef\{at \/sub1 with parent created at '.*'\}$/,
    );
    expect(ref1sub1Converted.params).toEqual([]);
    expect(ref1sub1Converted.parent).toBe(ref1);
    expect(String(ref1sub2Converted)).toMatch(
      /^SubRouteRef\{at \/sub2\/:p3 with parent created at '.*'\}$/,
    );
    expect(ref1sub2Converted.params).toEqual(['p3']);
    expect(ref1sub2Converted.parent).toBe(ref1);
    expect(String(ref2sub1Converted)).toMatch(
      /^SubRouteRef\{at \/sub1\/:p3 with parent created at '.*'\}$/,
    );
    expect(ref2sub1Converted.params).toEqual(['p1', 'p2', 'p3']);
    expect(ref2sub1Converted.parent).toBe(ref2);

    expect(String(ref3Converted)).toMatch(
      /^ExternalRouteRef\{created at '.*'\}$/,
    );
    expect(ref3Converted.params).toEqual([]);
    expect(ref3Converted.optional).toBe(true);
    expect(String(ref4Converted)).toMatch(
      /^ExternalRouteRef\{created at '.*'\}$/,
    );
    expect(ref4Converted.params).toEqual(['p1', 'p2']);
    expect(ref4Converted.optional).toBe(true);
  });
});
