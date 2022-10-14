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

import { useApi } from '@backstage/core-plugin-api';
import {
  AuthorizeResult,
  Permission,
  ResourcePermission,
} from '@backstage/plugin-permission-common';
import useAsync from 'react-use/lib/useAsync';
import { permissionApiRef } from '../apis';
import { AsyncPermissionResult } from './usePermission';

/**
 * React hook for authorization of multiple permissions. This wraps
 * {@link @backstage/plugin-permission-react#usePermission} to return a Record of {
 * [permissionName]: AsyncPermissionResult }.
 * @public
 */
export function usePermissions(
  input: Array<
    | {
        permission: Exclude<Permission, ResourcePermission>;
        resourceRef?: never;
      }
    | {
        permission: ResourcePermission;
        resourceRef: string | undefined;
      }
  >,
): AsyncPermissionResult[] {
  const permissionApi = useApi(permissionApiRef);

  const { value, loading, error } = useAsync(
    async () => await permissionApi.authorizeAll(input),
  );
  return input.map((_, index) => ({
    loading,
    error,
    allowed: value?.[index].result === AuthorizeResult.ALLOW,
  }));
}
