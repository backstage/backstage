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
  AuthorizeRequest,
  AuthorizeResult,
  PermissionCondition,
  PermissionCriteria,
} from '@backstage/plugin-permission-common';
import { BackstageIdentityResponse } from '@backstage/plugin-auth-backend';

/**
 * An authorization request to be evaluated by the {@link PermissionPolicy}.
 *
 * @remarks
 *
 * This differs from {@link @backstage/permission-common#AuthorizeRequest} in that `resourceRef`
 * should never be provided. This forces policies to be written in a way that's compatible with
 * filtering collections of resources at data load time.
 *
 * @public
 */
export type PolicyAuthorizeRequest = Omit<AuthorizeRequest, 'resourceRef'>;

/**
 * A definitive result to an authorization request, returned by the {@link PermissionPolicy}.
 *
 * @remarks
 *
 * This indicates that the policy unconditionally allows (or denies) the request.
 *
 * @public
 */
export type DefinitivePolicyDecision = {
  result: AuthorizeResult.ALLOW | AuthorizeResult.DENY;
};

/**
 * A conditional result to an authorization request, returned by the {@link PermissionPolicy}.
 *
 * @remarks
 *
 * This indicates that the policy allows authorization for the request, given that the returned
 * conditions hold when evaluated. The conditions will be evaluated by the corresponding plugin
 * which knows about the referenced permission rules.
 *
 * Similar to {@link @backstage/permission-common#AuthorizeResult}, but with the plugin and resource
 * identifiers needed to evaluate the returned conditions.
 * @public
 */
export type ConditionalPolicyDecision = {
  result: AuthorizeResult.CONDITIONAL;
  pluginId: string;
  resourceType: string;
  conditions: PermissionCriteria<PermissionCondition>;
};

/**
 * The result of evaluating an authorization request with a {@link PermissionPolicy}.
 *
 * @public
 */
export type PolicyDecision =
  | DefinitivePolicyDecision
  | ConditionalPolicyDecision;

/**
 * A policy to evaluate authorization requests for any permissioned action performed in Backstage.
 *
 * @remarks
 *
 * This takes as input a permission and an optional Backstage identity, and should return ALLOW if
 * the user is permitted to execute that action; otherwise DENY. For permissions relating to
 * resources, such a catalog entities, a conditional response can also be returned. This states
 * that the action is allowed if the conditions provided hold true.
 *
 * Conditions are a rule, and parameters to evaluate against that rule. For example, the rule might
 * be `isOwner` and the parameters a collection of entityRefs; if one of the entityRefs matches
 * the `owner` field on a catalog entity, this would resolve to ALLOW.
 *
 * @public
 */
export interface PermissionPolicy {
  handle(
    request: PolicyAuthorizeRequest,
    user?: BackstageIdentityResponse,
  ): Promise<PolicyDecision>;
}
