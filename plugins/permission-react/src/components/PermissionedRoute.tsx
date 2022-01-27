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

import React, {
  ComponentProps,
  ComponentType,
  PropsWithChildren,
  ReactElement,
} from 'react';
import { Route } from 'react-router';
import { useApp } from '@backstage/core-plugin-api';
import { usePermission } from '../hooks';
import { Permission } from '@backstage/plugin-permission-common';

/**
 * Returns a React Router Route which only renders the element when authorized. If unauthorized, the Route will render a
 * NotFoundErrorPage (see {@link @backstage/core-app-api#AppComponents}).
 *
 * @public
 */
export const PermissionedRoute = (
  props: ComponentProps<typeof Route> & {
    permission: Permission;
    resourceRef?: string;
    errorComponent?: ReactElement | null;
  },
) => {
  const { permission, resourceRef, errorComponent, ...otherProps } = props;
  const permissionResult = usePermission(permission, resourceRef);
  const app = useApp();
  const { NotFoundErrorPage } = app.getComponents();

  let shownElement: ReactElement | null | undefined =
    errorComponent === undefined ? <NotFoundErrorPage /> : errorComponent;

  if (permissionResult.loading) {
    shownElement = null;
  } else if (permissionResult.allowed) {
    shownElement = props.element;
  }

  return <Route {...otherProps} element={shownElement} />;
};

export function createPermissionedComponent<T>(
  TargetComponent: ComponentType<T>,
  permission: Permission,
  helperComponents: {
    fallback?: ReactElement;
    loading?: ReactElement;
    error?: ReactElement;
  } = {},
) {
  const { error, fallback, loading } = helperComponents;

  function AuthorizedComponent({
    resourceRef,
    ...props
  }: T & { resourceRef?: string }) {
    const permissionResult = usePermission(permission, resourceRef);

    if (permissionResult.loading) {
      return loading ?? null;
    }
    if (permissionResult.error) {
      return error ?? null;
    }

    if (permissionResult.allowed) {
      return <TargetComponent {...(props as T)} />;
    }
    return fallback || null;
  }
  AuthorizedComponent.displayName = `Authorized(${
    TargetComponent.displayName || TargetComponent.name
  })`;

  return AuthorizedComponent;
}

export function Permissioned(
  props: PropsWithChildren<{
    permission: Permission;
    resourceRef?: string;
    fallback?: ReactElement;
    loading?: ReactElement;
    error?: ReactElement;
  }>,
) {
  const { children, permission, fallback, loading, error, resourceRef } = props;
  const permissionResult = usePermission(permission, resourceRef);

  if (permissionResult.loading) {
    return loading ?? null;
  }
  if (permissionResult.error) {
    return error ?? null;
  }

  if (permissionResult.allowed) {
    return <>{children}</>;
  }
  return fallback ?? null;
}
