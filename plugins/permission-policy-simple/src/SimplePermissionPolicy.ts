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
  BackstageIdentity,
  getIdentityClaims,
} from '@backstage/plugin-auth-backend';
import {
  AuthorizeResult,
  OpaqueAuthorizeRequest,
  TechDocsPermission,
} from '@backstage/permission-common';
import {
  PermissionPolicy,
  conditionFor,
  PolicyResult,
} from '@backstage/plugin-permission-node';
import {
  conditions as catalogConditions,
  createConditions as createCatalogConditions,
} from '@backstage/plugin-catalog-backend';
import { RESOURCE_TYPE_CATALOG_ENTITY } from '@backstage/catalog-model';
import { isComponentType as isComponentTypeRule } from './rules';

const { isEntityOwner, isEntityKind } = catalogConditions;
const isComponentType = conditionFor(isComponentTypeRule);

export class SimplePermissionPolicy implements PermissionPolicy {
  async handle(
    request: OpaqueAuthorizeRequest,
    identity?: BackstageIdentity,
  ): Promise<PolicyResult> {
    if (TechDocsPermission.includes(request.permission)) {
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

      if (request.permission.isRead) {
        return {
          result: AuthorizeResult.MAYBE,
          conditions: createCatalogConditions({
            anyOf: [
              {
                allOf: [isEntityOwner(getIdentityClaims(identity))],
              },
              {
                allOf: [isComponentType(['website'])],
              },
              {
                allOf: [isEntityKind(['template'])],
              },
            ],
          }),
        };
      }

      return {
        result: AuthorizeResult.MAYBE,
        conditions: createCatalogConditions({
          anyOf: [
            {
              allOf: [isEntityOwner(getIdentityClaims(identity))],
            },
            // TODO(authorization-framework) we probably need the ability
            // to do negative matching (i.e. exclude all entities of type X)
          ],
        }),
      };
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
