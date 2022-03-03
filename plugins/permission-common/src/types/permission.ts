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

import { AuthorizeQuery, AuthorizeDecision } from './api';

/**
 * The attributes related to a given permission; these should be generic and widely applicable to
 * all permissions in the system.
 * @public
 */
export type PermissionAttributes = {
  action?: 'create' | 'read' | 'update' | 'delete';
};

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
export type BasicPermission = {
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
};

/**
 * ResourcePermissions are {@link Permission}s that can be authorized based on
 * characteristics of a resource such a catalog entity.
 * @public
 */
export type ResourcePermission<T extends string = string> = BasicPermission & {
  /**
   * Denotes the type of the resource whose resourceRef should be passed when
   * authorizing.
   */
  resourceType: T;
};

/**
 * A client interacting with the permission backend can implement this authorizer interface.
 * @public
 */
export interface PermissionAuthorizer {
  authorize(
    queries: AuthorizeQuery[],
    options?: AuthorizeRequestOptions,
  ): Promise<AuthorizeDecision[]>;
}

/**
 * Options for authorization requests.
 * @public
 */
export type AuthorizeRequestOptions = {
  token?: string;
};
