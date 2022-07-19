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

import {
  AuthorizePermissionRequest,
  AuthorizePermissionResponse,
  DefinitivePolicyDecision,
  EvaluatorRequestOptions,
  Permission,
  PermissionAuthorizer,
  PermissionEvaluator,
  QueryPermissionRequest,
  QueryPermissionResponse,
  ResourcePermission,
} from '../types';

/**
 * Check if the two parameters are equivalent permissions.
 * @public
 */
export function isPermission<T extends Permission>(
  permission: Permission,
  comparedPermission: T,
): permission is T {
  return permission.name === comparedPermission.name;
}

/**
 * Check if a given permission is a {@link ResourcePermission}. When
 * `resourceType` is supplied as the second parameter, also checks if
 * the permission has the specified resource type.
 * @public
 */
export function isResourcePermission<T extends string = string>(
  permission: Permission,
  resourceType?: T,
): permission is ResourcePermission<T> {
  if (!('resourceType' in permission)) {
    return false;
  }

  return !resourceType || permission.resourceType === resourceType;
}

/**
 * Check if a given permission is related to a create action.
 * @public
 */
export function isCreatePermission(permission: Permission) {
  return permission.attributes.action === 'create';
}

/**
 * Check if a given permission is related to a read action.
 * @public
 */
export function isReadPermission(permission: Permission) {
  return permission.attributes.action === 'read';
}

/**
 * Check if a given permission is related to an update action.
 * @public
 */
export function isUpdatePermission(permission: Permission) {
  return permission.attributes.action === 'update';
}

/**
 * Check if a given permission is related to a delete action.
 * @public
 */
export function isDeletePermission(permission: Permission) {
  return permission.attributes.action === 'delete';
}

/**
 * Convert {@link PermissionAuthorizer} to {@link PermissionEvaluator}.
 *
 * @public
 */
export function toPermissionEvaluator(
  permissionAuthorizer: PermissionAuthorizer,
): PermissionEvaluator {
  return {
    authorize: async (
      requests: AuthorizePermissionRequest[],
      options?: EvaluatorRequestOptions,
    ): Promise<AuthorizePermissionResponse[]> => {
      const response = await permissionAuthorizer.authorize(requests, options);

      return response as DefinitivePolicyDecision[];
    },
    authorizeConditional(
      requests: QueryPermissionRequest[],
      options?: EvaluatorRequestOptions,
    ): Promise<QueryPermissionResponse[]> {
      const parsedRequests =
        requests as unknown as AuthorizePermissionRequest[];
      return permissionAuthorizer.authorize(parsedRequests, options);
    },
  };
}
