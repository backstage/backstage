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

import React, { ReactElement, ReactNode } from 'react';
import { useApp } from '@backstage/core-plugin-api';
import { usePermission } from '../hooks';
import {
  isResourcePermission,
  Permission,
  ResourcePermission,
} from '@backstage/plugin-permission-common';

/**
 * A simple rendering bounrdary which only renders children when authorized. If
 * unauthorized, the Route will render a NotFoundErrorPage (see
 * {@link @backstage/core-app-api#AppComponents}) or the provided
 * unauthorizedComponent.
 *
 * @public
 */
export function RequirePermission(
  props: {
    unauthorizedComponent?: ReactElement | null;
    children: ReactNode;
  } & (
    | {
        permission: Exclude<Permission, ResourcePermission>;
        resourceRef?: never;
      }
    | {
        permission: ResourcePermission;
        resourceRef: string | undefined;
      }
  ),
) {
  const { permission, resourceRef, unauthorizedComponent, children } = props;

  const permissionResult = usePermission(
    isResourcePermission(permission)
      ? { permission, resourceRef }
      : { permission },
  );
  const app = useApp();
  const { NotFoundErrorPage } = app.getComponents();

  if (permissionResult.loading) {
    return null;
  }
  const unauthorizedResult =
    unauthorizedComponent === undefined ? (
      <NotFoundErrorPage />
    ) : (
      unauthorizedComponent
    );
  return permissionResult.allowed ? <>{children}</> : unauthorizedResult;
}
