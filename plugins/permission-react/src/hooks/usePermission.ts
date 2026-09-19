/*
 * Copyright 2021 The Backstage Authors
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

import { useApi } from '@backstage/core-plugin-api';
import { permissionApiRef } from '../apis';
import {
  AuthorizeResult,
  isResourcePermission,
  Permission,
  ResourcePermission,
} from '@backstage/plugin-permission-common';
import useSWR from 'swr';

/** @public */
export type AsyncPermissionResult = {
  loading: boolean;
  allowed: boolean;
  error?: Error;
};

/**
 * React hook utility for authorization. Given either a non-resource
 * {@link @backstage/plugin-permission-common#Permission} or a
 * {@link @backstage/plugin-permission-common#ResourcePermission} and an
 * optional resourceRef, it will return whether or not access is allowed (for
 * the given resource, if resourceRef is provided). See
 * {@link @backstage/plugin-permission-common/PermissionClient#authorize} for
 * more details.
 *
 * For resource permissions, `resourceRef` may be undefined while the resource
 * is loading asynchronously. This returns `allowed: false` without requesting
 * authorization. Pass `resourceRef: false` to require an unconditional grant
 * for all resources; conditional policy decisions are treated as denied.
 *
 * Note: This hook uses stale-while-revalidate to help avoid flicker in UI
 * elements that would be conditionally rendered based on the `allowed` result
 * of this hook.
 * @public
 */
export function usePermission(
  input:
    | {
        permission: Exclude<Permission, ResourcePermission>;
        resourceRef?: never;
      }
    | {
        permission: ResourcePermission;
        resourceRef: string | false | undefined;
      },
): AsyncPermissionResult {
  const permissionApi = useApi(permissionApiRef);
  const { data, error } = useSWR(input, async (args: typeof input) => {
    // Without an explicit universal check, a missing reference means the
    // resource is still loading outside the hook.
    if (
      isResourcePermission(args.permission) &&
      !args.resourceRef &&
      args.resourceRef !== false
    ) {
      return AuthorizeResult.DENY;
    }

    const { result } = await permissionApi.authorize(args);
    return result;
  });

  if (error) {
    return { error, loading: false, allowed: false };
  }
  if (data === undefined) {
    return { loading: true, allowed: false };
  }
  return { loading: false, allowed: data === AuthorizeResult.ALLOW };
}
