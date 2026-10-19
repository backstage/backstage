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

function getRouteRefKey(ref: RouteRef): string | RouteRef {
  return OpaqueRouteRef.toInternal(ref).getExtensionId?.() ?? ref;
}

export class RouteRedirects {
  private readonly targets = new Map<
    string | RouteRef,
    { name: string; ref: RouteRef }
  >();

  add(
    name: string,
    source: RouteRef | SubRouteRef,
    target: RouteRef | SubRouteRef,
  ) {
    if (source === target) {
      return;
    }
    if (OpaqueSubRouteRef.isType(source) || OpaqueSubRouteRef.isType(target)) {
      if (
        OpaqueSubRouteRef.isType(source) &&
        OpaqueSubRouteRef.isType(target) &&
        source.path === target.path &&
        getRouteRefKey(OpaqueSubRouteRef.toInternal(source).getParent()) ===
          getRouteRefKey(OpaqueSubRouteRef.toInternal(target).getParent())
      ) {
        return;
      }
      throw new Error(
        `Route override '${name}' must replace an absolute route reference with another absolute route reference; subroutes cannot be overridden`,
      );
    }
    const sourceRef = OpaqueRouteRef.toInternal(source);
    const targetRef = OpaqueRouteRef.toInternal(target);
    const key = getRouteRefKey(sourceRef);
    if (key === getRouteRefKey(targetRef)) {
      return;
    }
    const previous = this.targets.get(key);
    if (
      previous &&
      getRouteRefKey(previous.ref) !== getRouteRefKey(targetRef)
    ) {
      throw new Error(
        `Conflicting route overrides '${
          previous.name
        }' and '${name}' redirect ${key} to different targets ${getRouteRefKey(
          previous.ref,
        )} and ${getRouteRefKey(targetRef)}`,
      );
    }
    const sourceParams = sourceRef.getParams();
    const targetParams = targetRef.getParams();
    if (
      JSON.stringify([...sourceParams].sort()) !==
      JSON.stringify([...targetParams].sort())
    ) {
      throw new Error(
        `Route override '${name}' has incompatible parameters, expected [${sourceParams}] but received [${targetParams}]`,
      );
    }
    this.targets.set(key, { name, ref: targetRef });
  }

  resolve(source: RouteRef | SubRouteRef): { ref: RouteRef; path: string } {
    const subRoute = OpaqueSubRouteRef.isType(source)
      ? OpaqueSubRouteRef.toInternal(source)
      : undefined;
    let ref = subRoute?.getParent() ?? OpaqueRouteRef.toInternal(source);
    const path = subRoute?.path ?? '';
    const visited = new Set<string | RouteRef>();
    for (;;) {
      const key = getRouteRefKey(ref);
      if (visited.has(key)) {
        throw new Error(`Route redirect cycle detected for ${key}`);
      }
      visited.add(key);
      const target = this.targets.get(key);
      if (!target) {
        return { ref, path };
      }
      ref = target.ref;
    }
  }
}
