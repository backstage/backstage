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
 * The resourceRef field is optional to allow calling this hook with an
 * entity that might be loading asynchronously, but when resourceRef is not
 * supplied, the value of `allowed` will always be false.
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
        resourceRef: string | undefined;
      },
): AsyncPermissionResult {
  const permissionApi = useApi(permissionApiRef);
  const { data, error } = useSWR(input, async (args: typeof input) => {
    // We could make the resourceRef parameter required to avoid this check, but
    // it would make using this hook difficult in situations where the entity
    // must be asynchronously loaded, so instead we short-circuit to a deny when
    // no resourceRef is supplied, on the assumption that the resourceRef is
    // still loading outside the hook.
    if (isResourcePermission(args.permission) && !args.resourceRef) {
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
