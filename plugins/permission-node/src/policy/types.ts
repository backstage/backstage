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
  Permission,
  PolicyDecision,
} from '@backstage/plugin-permission-common';
import { BackstageUserIdentity } from '@backstage/plugin-auth-node';
import {
  BackstageCredentials,
  BackstageUserInfo,
} from '@backstage/backend-plugin-api';

/**
 * A query to be evaluated by the {@link PermissionPolicy}.
 *
 * @remarks
 *
 * Unlike other parts of the permission API, the policy does not accept a resource ref. This keeps
 * the policy decoupled from the resource loading and condition applying logic.
 *
 * @public
 */
export type PolicyQuery = {
  permission: Permission;
};

/**
 * The context within which a policy query is evaluated.
 *
 * @public
 */
export type PolicyQueryUser = {
  /**
   * The token used to authenticate the user within Backstage.
   *
   * @deprecated User the `credentials` field in combination with `coreServices.auth` to generate a request token instead.
   */
  token: string;

  /**
   * The number of seconds until the token expires. If not set, it can be assumed that the token does not expire.
   *
   * @deprecated This field is deprecated and will be removed in a future release.
   */
  expiresInSeconds?: number;

  /**
   * A plaintext description of the identity that is encapsulated within the token.
   *
   * @deprecated Use the `info` field instead.
   */
  identity: BackstageUserIdentity;

  /**
   * The credentials of the user making the request.
   */
  credentials: BackstageCredentials;

  /**
   * The information for the user making the request.
   */
  info: BackstageUserInfo;
};

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
  handle(request: PolicyQuery, user?: PolicyQueryUser): Promise<PolicyDecision>;
}
