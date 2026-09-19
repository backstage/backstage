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

import { ReactNode } from 'react';
import { useApp } from '@backstage/core-plugin-api';
import { usePermission } from '../hooks';
import {
  Permission,
  ResourcePermission,
} from '@backstage/plugin-permission-common';

/**
 * Properties for {@link RequirePermission}
 *
 * @public
 */
export type RequirePermissionProps = (
  | {
      permission: Exclude<Permission, ResourcePermission>;
      resourceRef?: never;
    }
  | {
      permission: ResourcePermission;
      /** A resource reference, false for unconditional access, or undefined while loading. */
      resourceRef: string | false | undefined;
    }
) & {
  /**
   * The error page to be displayed if the user is not allowed access.
   *
   * Defaults to the `NotFoundErrorPage` app component.
   */
  errorPage?: ReactNode;
  children: ReactNode;
};

/**
 * A boundary that only renders its child elements if the user has the specified permission.
 *
 * While loading, nothing will be rendered. If the user does not have
 * permission, the `errorPage` element will be rendered, falling back
 * to the `NotFoundErrorPage` app component if no `errorPage` is provider.
 *
 * @public
 */
export function RequirePermission(
  props: RequirePermissionProps,
): JSX.Element | null {
  const { children, errorPage, ...input } = props;
  const permissionResult = usePermission(input);
  const app = useApp();

  if (permissionResult.loading) {
    return null;
  } else if (permissionResult.allowed) {
    return <>{children}</>;
  }

  if (errorPage) {
    return <>{errorPage}</>;
  }
  // If no explicit error element is provided, the not found page is used as fallback.
  const { NotFoundErrorPage } = app.getComponents();
  return <NotFoundErrorPage />;
}
