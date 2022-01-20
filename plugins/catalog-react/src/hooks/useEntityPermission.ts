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

import { stringifyEntityRef } from '@backstage/catalog-model';
import { Permission } from '@backstage/plugin-permission-common';
import { usePermission } from '@backstage/plugin-permission-react';
import { useRef } from 'react';
import { useEntity } from './useEntity';

/**
 * A thin wrapper around the
 * {@link @backstage/plugin-permission-react#usePermission} hook which uses the
 * current entity in context to make an authorization request for the given
 * permission.
 *
 * This hook caches the authorization decision based on the permission + the
 * entity, and returns the cache match value as the default `allowed` value
 * while loading. This helps avoid flicker in UI elements that would be
 * conditionally rendered based on the `allowed` result of this hook.
 *
 * Note: this hook blocks the permission request until the entity has loaded in
 * context. If you have the entityRef and need concurrent requests, use the
 * `usePermission` hook directly.
 * @public
 */
export function useEntityPermission(permission: Permission): {
  loading: boolean;
  allowed: boolean;
  error?: Error;
} {
  const { entity, loading: loadingEntity, error: entityError } = useEntity();

  let defaultValue: boolean;
  const cache = useRef<Record<string, boolean>>({});
  if (
    entity &&
    cache.current[`${permission.name}${stringifyEntityRef(entity)}`]
  ) {
    defaultValue =
      cache.current[`${permission.name}${stringifyEntityRef(entity)}`];
  } else {
    defaultValue = false;
  }

  const {
    allowed,
    loading: loadingPermission,
    error: permissionError,
  } = usePermission(
    permission,
    entity ? stringifyEntityRef(entity) : undefined,
  );

  if (loadingEntity || loadingPermission) {
    return { loading: true, allowed: defaultValue };
  }
  if (entityError) {
    return { loading: false, allowed: false, error: entityError };
  }
  cache.current[`${permission.name}${stringifyEntityRef(entity)}`] = allowed;
  return { loading: false, allowed, error: permissionError };
}
