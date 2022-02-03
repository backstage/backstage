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
 * An individual authorization request for {@link PermissionClient#authorize}.
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
 * Composes several {@link PermissionCondition}s as criteria with a nested AND/OR structure.
 * @public
 */
export type PermissionCriteria<TQuery> =
  | { allOf: PermissionCriteria<TQuery>[] }
  | { anyOf: PermissionCriteria<TQuery>[] }
  | { not: PermissionCriteria<TQuery> }
  | TQuery;

export type DefinitiveAuthorizeDecision = {
  result: AuthorizeResult.ALLOW | AuthorizeResult.DENY;
};

export type ConditionalAuthorizeDecision = {
  result: AuthorizeResult.CONDITIONAL;
  conditions: PermissionCriteria<PermissionCondition>;
};

/**
 * An individual authorization response from {@link PermissionClient#authorize}.
 * @public
 */
export type AuthorizeDecision =
  | DefinitiveAuthorizeDecision
  | ConditionalAuthorizeDecision;

export type DefinitiveAuthorizeResponse = {
  items: Identified<DefinitiveAuthorizeDecision>[];
};

export type ConditionalAuthorizeResponse = {
  items: Identified<ConditionalAuthorizeDecision>[];
};

/**
 * A batch of authorization responses from {@link PermissionClient#authorize}.
 * @public
 */
export type AuthorizeResponse = {
  items: Identified<AuthorizeDecision>[];
};
