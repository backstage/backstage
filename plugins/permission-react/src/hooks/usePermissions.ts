/*
 * Copyright 2022 The Backstage Authors
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
  isResourcePermission,
  Permission,
  ResourcePermission,
} from '@backstage/plugin-permission-common';
import { AsyncPermissionResult, usePermission } from './usePermission';

/**
 * React hook for authorization of multiple permissions. This wraps
 * {@link @backstage/plugin-permission-react#usePermission} to return a Record of {
 * [permissionName]: AsyncPermissionResult }.
 * @public
 */
export function usePermissions(
  input:
    | {
        permissions: Array<Exclude<Permission, ResourcePermission>>;
        resourceRef?: never;
      }
    | {
        permissions: Array<ResourcePermission>;
        resourceRef: string | undefined;
      },
): Record<string, AsyncPermissionResult> {
  const { permissions, resourceRef } = input;

  const results: Record<string, AsyncPermissionResult> = {};
  for (const permission of permissions) {
    if (!results[permission.name]) {
      if (isResourcePermission(permission)) {
        results[permission.name] = usePermission({ permission, resourceRef });
      } else {
        results[permission.name] = usePermission({ permission });
      }
    }
  }
  return results;
}
