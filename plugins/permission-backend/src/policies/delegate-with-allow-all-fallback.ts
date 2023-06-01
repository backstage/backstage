/*
 * Copyright 2023 The Backstage Authors
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

import { BackstageIdentityResponse } from '@backstage/plugin-auth-node';
import {
  AuthorizeResult,
  PolicyDecision,
} from '@backstage/plugin-permission-common';
import {
  MainPermissionPolicy,
  PolicyQuery,
  SubPermissionPolicy,
} from '@backstage/plugin-permission-node';

/**
 * A permission policy that delegates to added sub-policies,
 * and allows all requests as a fallback if not sub-policy matched
 * the permission.
 *
 * @public
 */
export class DelegateWithAllowAllFallbackPermissionPolicy
  implements MainPermissionPolicy
{
  private subPolicies: SubPermissionPolicy[] = [];

  async handle(
    request: PolicyQuery,
    user?: BackstageIdentityResponse,
  ): Promise<PolicyDecision> {
    for (const subPolicy of this.subPolicies) {
      if (subPolicy.enabled(request.permission)) {
        const decision = await subPolicy.handle(request, user);
        return decision;
      }
    }

    return { result: AuthorizeResult.ALLOW };
  }

  addSubPolicies(...subPolicies: SubPermissionPolicy[]): void {
    this.subPolicies.push(...subPolicies);
  }
}
