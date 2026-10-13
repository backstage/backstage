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

import {
  coreExtensionData,
  createRouteRef,
  createSubRouteRef,
  PageBlueprint,
  RouteRef,
  SubRouteRef,
} from '@backstage/frontend-plugin-api';
import { createExtensionTester } from '@backstage/frontend-test-utils';
import {
  OpaqueExternalRouteRef,
  OpaqueRouteRef,
  OpaqueSubRouteRef,
} from '@internal/frontend';
import { AnyRouteRef } from './types';
import { joinPaths } from './joinPaths';

describe('previous frontend system route lookup compatibility', () => {
  it('should resolve updated refs only when the blueprint retains its routeRef registration', () => {
    const rootRouteRef = createRouteRef({ extensionId: 'page:example' });
    const detailsRouteRef = createSubRouteRef({
      parent: rootRouteRef,
      path: '/details/:id',
    });

    for (const retainRegistration of [true, false]) {
      const page = PageBlueprint.make({
        name: 'example',
        params: {
          path: '/example',
          loader: async () => <div>Example</div>,
          ...(retainRegistration ? { routeRef: rootRouteRef } : {}),
        },
      });
      const tester = createExtensionTester(page);
      const registeredRef = tester.get(coreExtensionData.routeRef);
      expect(registeredRef).toBe(retainRegistration ? rootRouteRef : undefined);

      // Older apps discover mounts through extension outputs, not extensionId.
      const routePaths = new Map<RouteRef, string>();
      if (registeredRef) {
        routePaths.set(registeredRef, tester.get(coreExtensionData.routePath));
      }
      expect(
        resolveTargetRef(rootRouteRef, routePaths, new Map(), new Map()),
      ).toEqual(
        retainRegistration ? [rootRouteRef, '/example'] : [undefined, ''],
      );
      expect(
        resolveTargetRef(detailsRouteRef, routePaths, new Map(), new Map()),
      ).toEqual(
        retainRegistration
          ? [rootRouteRef, '/example/details/:id']
          : [undefined, ''],
      );
    }
  });
});

// Frozen target lookup from RouteResolver.ts at 0936a21568ad, before
// extension-targeted routing. Keep this independent of the current resolver;
// this tests the old lookup contract, not a complete historical app runtime.
function resolveTargetRef(
  targetRouteRef: AnyRouteRef,
  routePaths: Map<RouteRef, string>,
  routeBindings: Map<AnyRouteRef, AnyRouteRef | undefined>,
  routeRefsById: Map<string, RouteRef | SubRouteRef>,
): readonly [RouteRef | undefined, string] {
  // First we figure out which absolute route ref we're dealing with, an if there was an sub route path to append.
  // For sub routes it will be the parent path, while for external routes it will be the bound route.
  let ref: AnyRouteRef = targetRouteRef;
  let path = '';

  if (OpaqueExternalRouteRef.isType(ref)) {
    let resolvedRoute = routeBindings.get(ref);
    if (!resolvedRoute) {
      const internal = OpaqueExternalRouteRef.toInternal(ref);
      const defaultTarget = internal.getDefaultTarget();
      if (defaultTarget) {
        resolvedRoute = routeRefsById.get(defaultTarget);
      }
    }
    if (!resolvedRoute) {
      return [undefined, ''];
    }
    ref = resolvedRoute;
  }

  if (OpaqueSubRouteRef.isType(ref)) {
    const internal = OpaqueSubRouteRef.toInternal(ref);
    path = ref.path;
    ref = internal.getParent();
  }

  if (!OpaqueRouteRef.isType(ref)) {
    throw new Error(
      `Unexpectedly resolved ${targetRouteRef} to a non-route ref ${ref}`,
    );
  }

  // Find the path that our target route is bound to
  const resolvedPath = routePaths.get(ref);
  if (resolvedPath === undefined) {
    return [undefined, ''];
  }

  return [ref, path ? joinPaths(resolvedPath, path) : resolvedPath];
}
