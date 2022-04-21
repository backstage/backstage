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
import { ResourcePermission } from '@backstage/plugin-permission-common';
import { usePermission } from '@backstage/plugin-permission-react';
import { useAsyncEntity } from './useEntity';

/**
 * A thin wrapper around the
 * {@link @backstage/plugin-permission-react#usePermission} hook which uses the
 * current entity in context to make an authorization request for the given
 * {@link @backstage/plugin-catalog-common#CatalogEntityPermission}.
 *
 * Note: this hook blocks the permission request until the entity has loaded in
 * context. If you have the entityRef and need concurrent requests, use the
 * `usePermission` hook directly.
 * @alpha
 */
export function useEntityPermission(
  // TODO(joeporpeglia) Replace with `CatalogEntityPermission` when the issue described in
  // https://github.com/backstage/backstage/pull/10128 is fixed.
  permission: ResourcePermission<'catalog-entity'>,
): {
  loading: boolean;
  allowed: boolean;
  error?: Error;
} {
  const {
    entity,
    loading: loadingEntity,
    error: entityError,
  } = useAsyncEntity();
  const {
    allowed,
    loading: loadingPermission,
    error: permissionError,
  } = usePermission({
    permission,
    resourceRef: entity ? stringifyEntityRef(entity) : undefined,
  });

  if (loadingEntity || loadingPermission) {
    return { loading: true, allowed: false };
  }
  if (entityError) {
    return { loading: false, allowed: false, error: entityError };
  }
  return { loading: false, allowed, error: permissionError };
}
