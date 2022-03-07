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

/**
 * A request with a UUID identifier, so that batched responses can be matched up with the original
 * requests.
 * @public
 */
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
 * An individual request for {@link PermissionClient#authorize}.
 * @public
 */
export type AuthorizeQuery = {
  permission: Permission;
  resourceRef?: string;
};

/**
 * A batch of authorization requests from {@link PermissionClient#authorize}.
 * @public
 */
export type AuthorizeRequest = {
  items: Identified<AuthorizeQuery>[];
};

/**
 * An request for a {@link @backstage/plugin-permission-node#PermissionPolicy}
 * to evaluate a permission..
 *
 * @remarks
 *
 * This differs from {@link AuthorizeQuery} in that `resourceRef` should never
 * be provided. This forces policies to be written in a way that's compatible
 * with filtering collections of resources at data load time.
 *
 * @public
 */
export type PolicyQuery<TPermission extends Permission = Permission> = {
  permission: TPermission;
  resourceRef?: never;
};

/**
 * A definitive decision returned by a
 * {@link @backstage/plugin-permission-node#PermissionPolicy}.
 *
 * @remarks
 *
 * This indicates that the policy unconditionally allows (or denies) the
 * request.
 *
 * @public
 */
export type DefinitivePolicyDecision = {
  result: AuthorizeResult.ALLOW | AuthorizeResult.DENY;
};

/**
 * A conditional decision returned by a
 * {@link @backstage/plugin-permission-node#PermissionPolicy}.
 *
 * @remarks
 *
 * This indicates that the policy allows authorization for the request, given
 * that the returned conditions hold when evaluated. The conditions will be
 * evaluated by the corresponding plugin which knows about the referenced
 * permission rules.
 *
 * Similar to {@link @backstage/permission-common#AuthorizeDecision}, but with
 * the plugin and resource identifiers needed to evaluate the returned
 * conditions.
 * @public
 */
export type ConditionalPolicyDecision = {
  result: AuthorizeResult.CONDITIONAL;
  pluginId: string;
  resourceType: string;
  conditions: PermissionCriteria<PermissionCondition>;
};

/**
 * A decision returned by a
 * {@link @backstage/plugin-permission-node#PermissionPolicy}.
 *
 * @public
 */
export type PolicyDecision =
  | DefinitivePolicyDecision
  | ConditionalPolicyDecision;

/**
 * A condition returned with a CONDITIONAL authorization response.
 *
 * Conditions are a reference to a rule defined by a plugin, and parameters to apply the rule. For
 * example, a rule might be `isOwner` from the catalog-backend, and params may be a list of entity
 * claims from a identity token.
 * @public
 */
export type PermissionCondition<TParams extends unknown[] = unknown[]> = {
  rule: string;
  params: TParams;
};

/**
 * Utility type to represent an array with 1 or more elements.
 * @ignore
 */
type NonEmptyArray<T> = [T, ...T[]];

/**
 * Represents a logical AND for the provided criteria.
 * @public
 */
export type AllOfCriteria<TQuery> = {
  allOf: NonEmptyArray<PermissionCriteria<TQuery>>;
};

/**
 * Represents a logical OR for the provided criteria.
 * @public
 */
export type AnyOfCriteria<TQuery> = {
  anyOf: NonEmptyArray<PermissionCriteria<TQuery>>;
};

/**
 * Represents a negation of the provided criteria.
 * @public
 */
export type NotCriteria<TQuery> = {
  not: PermissionCriteria<TQuery>;
};

/**
 * Composes several {@link PermissionCondition}s as criteria with a nested AND/OR structure.
 * @public
 */
export type PermissionCriteria<TQuery> =
  | AllOfCriteria<TQuery>
  | AnyOfCriteria<TQuery>
  | NotCriteria<TQuery>
  | TQuery;

/**
 * An individual authorization response from {@link PermissionClient#authorize}.
 * @public
 */
export type AuthorizeDecision =
  | { result: AuthorizeResult.ALLOW | AuthorizeResult.DENY }
  | {
      result: AuthorizeResult.CONDITIONAL;
      conditions: PermissionCriteria<PermissionCondition>;
    };

/**
 * A batch of authorization responses from {@link PermissionClient#authorize}.
 * @public
 */
export type AuthorizeResponse = {
  items: Identified<AuthorizeDecision>[];
};
