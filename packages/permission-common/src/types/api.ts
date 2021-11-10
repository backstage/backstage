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

import { Permission } from './permission';

export type Identified<T> = T & { id: string };

/**
 * The result of an authorization request.
 * @public
 */
export enum AuthorizeResult {
  /**
   * The authorization request is denied.
   */
  DENY = 'DENY',
  /**
   * The authorization request is allowed.
   */
  ALLOW = 'ALLOW',
  /**
   * The authorization request is allowed if the provided conditions are met.
   */
  CONDITIONAL = 'CONDITIONAL',
}

/**
 * An authorization request for {@link PermissionClient#authorize}.
 * @public
 */
export type AuthorizeRequest = {
  permission: Permission;
  resourceRef?: string;
};

/**
 * A condition returned with a CONDITIONAL authorization response.
 *
 * Conditions are a reference to a rule defined by a plugin, and parameters to apply the rule. For
 * example, a rule might be `isOwner` from the catalog-backend, and params may be a list of entity
 * claims from a identity token.
 * @public
 */
export type PermissionCondition<TParams> = {
  rule: string;
  params: TParams;
};

/**
 * Composes several {@link PermissionCondition}s as criteria with a nested AND/OR structure.
 * @public
 */
export type PermissionCriteria<TQuery> =
  | { allOf: PermissionCriteria<TQuery>[] }
  | { anyOf: PermissionCriteria<TQuery>[] }
  | { not: PermissionCriteria<TQuery> }
  | PermissionCondition<TQuery>;

/**
 * An authorization response from {@link PermissionClient#authorize}.
 * @public
 */
export type AuthorizeResponse =
  | { result: AuthorizeResult.ALLOW | AuthorizeResult.DENY }
  | {
      result: AuthorizeResult.CONDITIONAL;
      conditions: PermissionCriteria<unknown>;
    };
