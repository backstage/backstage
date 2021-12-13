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
  BackstageUserIdentity,
  getIdentityClaims,
} from '@backstage/plugin-auth-backend';
import {
  AuthorizeRequest,
  AuthorizeResult,
  techdocsReadPermission,
} from '@backstage/plugin-permission-common';
import {
  PermissionPolicy,
  createConditionFactory,
  PolicyDecision,
} from '@backstage/plugin-permission-node';
import {
  conditions as catalogConditions,
  createPolicyDecision as createCatalogPolicyDecision,
} from '@backstage/plugin-catalog-backend';
import { RESOURCE_TYPE_CATALOG_ENTITY } from '@backstage/catalog-model';
import { isComponentType as isComponentTypeRule } from './rules';

const { isEntityOwner, isEntityKind } = catalogConditions;
const isComponentType = createConditionFactory(isComponentTypeRule);

export class SimplePermissionPolicy implements PermissionPolicy {
  async handle(
    request: Omit<AuthorizeRequest, 'resourceRef'>,
    identity?: BackstageUserIdentity,
  ): Promise<PolicyDecision> {
    if (request.permission.name === techdocsReadPermission.name) {
      return {
        result: AuthorizeResult.DENY,
      };
    }

    if (request.permission.resourceType === RESOURCE_TYPE_CATALOG_ENTITY) {
      if (!identity) {
        return {
          result: AuthorizeResult.DENY,
        };
      }

      if (request.permission.attributes.action === 'read') {
        return createCatalogPolicyDecision({
          anyOf: [
            isEntityOwner(getIdentityClaims(identity)),
            isComponentType(['website']),
            isEntityKind(['template']),
          ],
        });
      }

      return createCatalogPolicyDecision(
        isEntityOwner(getIdentityClaims(identity)),
      );
    }

    if (identity) {
      return {
        result: AuthorizeResult.ALLOW,
      };
    }

    return {
      result: AuthorizeResult.DENY,
    };
  }
}
