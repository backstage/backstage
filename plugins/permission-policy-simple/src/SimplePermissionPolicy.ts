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

import { BackstageIdentityResponse } from '@backstage/plugin-auth-backend';
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import {
  PermissionPolicy,
  createConditionFactory,
  PolicyDecision,
  PolicyAuthorizeQuery,
} from '@backstage/plugin-permission-node';
import {
  catalogConditions,
  createCatalogPolicyDecision,
} from '@backstage/plugin-catalog-backend';
import { RESOURCE_TYPE_CATALOG_ENTITY } from '@backstage/plugin-catalog-common';
import { isComponentType as isComponentTypeRule } from './rules';

const { isEntityOwner, isEntityKind } = catalogConditions;
const isComponentType = createConditionFactory(isComponentTypeRule);

export class SimplePermissionPolicy implements PermissionPolicy {
  async handle(
    request: PolicyAuthorizeQuery,
    user?: BackstageIdentityResponse,
  ): Promise<PolicyDecision> {
    if (request.permission.resourceType === RESOURCE_TYPE_CATALOG_ENTITY) {
      if (!user) {
        return {
          result: AuthorizeResult.DENY,
        };
      }

      const { identity } = user;
      if (request.permission.attributes.action === 'read') {
        return createCatalogPolicyDecision({
          anyOf: [
            isEntityOwner(identity.ownershipEntityRefs),
            isComponentType(['website']),
            isEntityKind(['template']),
          ],
        });
      }

      return createCatalogPolicyDecision(
        isEntityOwner(identity.ownershipEntityRefs),
      );
    }

    if (user) {
      return {
        result: AuthorizeResult.ALLOW,
      };
    }

    return {
      result: AuthorizeResult.DENY,
    };
  }
}
