/*
 * Copyright 2024 The Backstage Authors
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

import type { ExtensionConditionFunc } from '@backstage/frontend-plugin-api';
import {
  AuthorizeResult,
  type BasicPermission,
} from '@backstage/plugin-permission-common';
import { permissionApiRef } from './apis';

/**
 * Creates a condition function that checks if a user has a specific permission.
 *
 * @public
 * @example
 * ```typescript
 * import { catalogReadPermission } from '@backstage/plugin-catalog-common';
 *
 * PageBlueprint.make({
 *   params: {
 *     enabled: createPermissionCondition(catalogReadPermission),
 *   },
 * });
 * ```
 */
export function createPermissionCondition(
  permission: BasicPermission,
): ExtensionConditionFunc {
  return async (_, { apiHolder }) => {
    const permissionApi = apiHolder.get(permissionApiRef);
    if (!permissionApi) {
      return false;
    }
    const { result } = await permissionApi.authorize({ permission });
    return result === AuthorizeResult.ALLOW;
  };
}
