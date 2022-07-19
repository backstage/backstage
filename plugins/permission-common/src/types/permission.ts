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

import { EvaluatePermissionRequest, EvaluatePermissionResponse } from './api';

/**
 * The attributes related to a given permission; these should be generic and widely applicable to
 * all permissions in the system.
 * @public
 */
export type PermissionAttributes = {
  action?: 'create' | 'read' | 'update' | 'delete';
};

/**
 * Generic type for building {@link Permission} types.
 * @public
 */
export type PermissionBase<TType extends string, TFields extends object> = {
  /**
   * The name of the permission.
   */
  name: string;
  /**
   * {@link PermissionAttributes} which describe characteristics of the permission, to help
   * policy authors make consistent decisions for similar permissions without referring to them
   * all by name.
   */
  attributes: PermissionAttributes;
} & {
  /**
   * String value indicating the type of the permission (e.g. 'basic',
   * 'resource'). The allowed authorization flows in the permission system
   * depend on the type. For example, a `resourceRef` should only be provided
   * when authorizing permissions of type 'resource'.
   */
  type: TType; // Property appears on separate object to prevent expansion of Permission types in api reports.
} & TFields;

/**
 * A permission that can be checked through authorization.
 *
 * @remarks
 *
 * Permissions are the "what" part of authorization, the action to be performed. This may be reading
 * an entity from the catalog, executing a software template, or any other action a plugin author
 * may wish to protect.
 *
 * To evaluate authorization, a permission is paired with a Backstage identity (the "who") and
 * evaluated using an authorization policy.
 * @public
 */
export type Permission = BasicPermission | ResourcePermission;

/**
 * A standard {@link Permission} with no additional capabilities or restrictions.
 * @public
 */
export type BasicPermission = PermissionBase<'basic', {}>;

/**
 * ResourcePermissions are {@link Permission}s that can be authorized based on
 * characteristics of a resource such a catalog entity.
 * @public
 */
export type ResourcePermission<TResourceType extends string = string> =
  PermissionBase<
    'resource',
    {
      /**
       * Denotes the type of the resource whose resourceRef should be passed when
       * authorizing.
       */
      resourceType: TResourceType;
    }
  >;

/**
 * A client interacting with the permission backend can implement this authorizer interface.
 * @public
 * @deprecated Use {@link @backstage/plugin-permission-common#PermissionEvaluator} instead
 */
export interface PermissionAuthorizer {
  authorize(
    requests: EvaluatePermissionRequest[],
    options?: AuthorizeRequestOptions,
  ): Promise<EvaluatePermissionResponse[]>;
}

/**
 * Options for authorization requests.
 * @public
 */
export type AuthorizeRequestOptions = {
  token?: string;
};
