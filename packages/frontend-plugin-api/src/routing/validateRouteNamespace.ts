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

import { OpaqueRouteRef, OpaqueSubRouteRef } from '@internal/frontend';
import { RouteRef } from './RouteRef';
import { SubRouteRef } from './SubRouteRef';

export function validateRouteNamespace(
  pluginId: string,
  routes: Record<string, RouteRef | SubRouteRef>,
) {
  for (const [name, ref] of Object.entries(routes)) {
    const root = OpaqueSubRouteRef.isType(ref)
      ? OpaqueSubRouteRef.toInternal(ref).getParent()
      : ref;
    const extensionId = OpaqueRouteRef.toInternal(root).getExtensionId?.();
    if (
      extensionId !== undefined &&
      extensionId.replace(/^[^/:]+:/, '').split('/')[0] !== pluginId
    ) {
      throw new Error(
        `Route '${pluginId}.${name}' targets extension '${extensionId}' outside the '${pluginId}' plugin namespace`,
      );
    }
  }
}
