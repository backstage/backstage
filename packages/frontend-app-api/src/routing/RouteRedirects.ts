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

import { RouteRef, SubRouteRef } from '@backstage/frontend-plugin-api';
import { OpaqueRouteRef, OpaqueSubRouteRef } from '@internal/frontend';
import { joinPaths } from './joinPaths';

function getRouteRefKey(
  ref: RouteRef | SubRouteRef,
): string | RouteRef | SubRouteRef {
  const root = OpaqueSubRouteRef.isType(ref)
    ? OpaqueSubRouteRef.toInternal(ref).getParent()
    : ref;
  const id = OpaqueRouteRef.toInternal(root).getExtensionId?.();
  return id === undefined
    ? ref
    : JSON.stringify([id, OpaqueSubRouteRef.isType(ref) ? ref.path : '']);
}

export class RouteRedirects {
  private readonly targets = new Map<
    string | RouteRef | SubRouteRef,
    { name: string; ref: RouteRef | SubRouteRef }
  >();

  add(
    name: string,
    source: RouteRef | SubRouteRef,
    target: RouteRef | SubRouteRef,
  ) {
    const key = getRouteRefKey(source);
    if (key === getRouteRefKey(target)) {
      return;
    }
    const previous = this.targets.get(key);
    if (previous && getRouteRefKey(previous.ref) !== getRouteRefKey(target)) {
      throw new Error(
        `Conflicting route overrides '${
          previous.name
        }' and '${name}' redirect ${key} to different targets ${getRouteRefKey(
          previous.ref,
        )} and ${getRouteRefKey(target)}`,
      );
    }
    const sourceParams = OpaqueSubRouteRef.isType(source)
      ? OpaqueSubRouteRef.toInternal(source).getParams()
      : OpaqueRouteRef.toInternal(source).getParams();
    const targetParams = OpaqueSubRouteRef.isType(target)
      ? OpaqueSubRouteRef.toInternal(target).getParams()
      : OpaqueRouteRef.toInternal(target).getParams();
    if (
      JSON.stringify([...sourceParams].sort()) !==
      JSON.stringify([...targetParams].sort())
    ) {
      throw new Error(
        `Route override '${name}' has incompatible parameters, expected [${sourceParams}] but received [${targetParams}]`,
      );
    }
    this.targets.set(key, { name, ref: target });
  }

  resolve(source: RouteRef | SubRouteRef): { ref: RouteRef; path: string } {
    let ref = source;
    let path = '';
    const visited = new Set<string | RouteRef | SubRouteRef>();
    for (;;) {
      const key = getRouteRefKey(ref);
      if (visited.has(key)) {
        throw new Error(`Route redirect cycle detected for ${key}`);
      }
      visited.add(key);
      const target = this.targets.get(key);
      if (target) {
        ref = target.ref;
      } else if (OpaqueSubRouteRef.isType(ref)) {
        path = path ? joinPaths(ref.path, path) : ref.path;
        ref = OpaqueSubRouteRef.toInternal(ref).getParent();
      } else {
        return { ref, path };
      }
    }
  }
}
