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

import React, { ComponentProps, ReactElement } from 'react';
import { Route } from 'react-router';
import { useApp } from '@backstage/core-plugin-api';
import { usePermission } from '../hooks';
import {
  isResourcePermission,
  Permission,
  ResourcePermission,
} from '@backstage/plugin-permission-common';

/**
 * Returns a React Router Route which only renders the element when authorized. If unauthorized, the Route will render a
 * NotFoundErrorPage (see {@link @backstage/core-app-api#AppComponents}).
 *
 * @public
 */
export const PermissionedRoute = (
  props: ComponentProps<typeof Route> & {
    errorComponent?: ReactElement | null;
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
) => {
  const { permission, resourceRef, errorComponent, ...otherProps } = props;

  const permissionResult = usePermission(
    isResourcePermission(permission)
      ? { permission, resourceRef }
      : { permission },
  );
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
