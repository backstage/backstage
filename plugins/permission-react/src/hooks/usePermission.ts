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
  Permission,
} from '@backstage/plugin-permission-common';
import useSWR from 'swr';

/** @public */
export type AsyncPermissionResult = {
  loading: boolean;
  allowed: boolean;
  error?: Error;
};

/**
 * React hook utility for authorization. Given a
 * {@link @backstage/plugin-permission-common#Permission} and an optional
 * resourceRef, it will return whether or not access is allowed (for the given
 * resource, if resourceRef is provided). See
 * {@link @backstage/plugin-permission-common/PermissionClient#authorize} for
 * more details.
 *
 * Note: This hook uses stale-while-revalidate to help avoid flicker in UI
 * elements that would be conditionally rendered based on the `allowed` result
 * of this hook.
 * @public
 */
export const usePermission = (
  permission: Permission,
  resourceRef?: string,
): AsyncPermissionResult => {
  const permissionApi = useApi(permissionApiRef);
  const { data, error } = useSWR({ permission, resourceRef }, async args => {
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
};
