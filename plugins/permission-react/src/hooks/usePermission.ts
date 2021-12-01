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

import { useAsync } from 'react-use';
import { useApi } from '@backstage/core-plugin-api';
import { permissionApiRef } from '../apis';
import {
  AuthorizeResult,
  Permission,
} from '@backstage/plugin-permission-common';

/** @public */
export type AsyncPermissionResult = {
  loading: boolean;
  allowed: boolean;
  error?: Error;
};

/**
 * React hook utlity for authorization. Given a {@link @backstage/plugin-permission-common#Permission} and an optional
 * resourceRef, it will return whether or not access is allowed (for the given resource, if resourceRef is provided). See
 * {@link @backstage/plugin-permission-common/PermissionClient#authorize} for more details.
 * @public
 */
export const usePermission = (
  permission: Permission,
  resourceRef?: string,
): AsyncPermissionResult => {
  const permissionApi = useApi(permissionApiRef);

  const { loading, error, value } = useAsync(async () => {
    const { result } = await permissionApi.authorize({
      permission,
      resourceRef,
    });

    return result;
  }, [permissionApi, permission, resourceRef]);

  if (loading) {
    return { loading: true, allowed: false };
  }
  if (error) {
    return { error, loading: false, allowed: false };
  }
  return { loading: false, allowed: value === AuthorizeResult.ALLOW };
};
