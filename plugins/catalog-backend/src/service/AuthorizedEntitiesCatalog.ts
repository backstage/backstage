/*
 * Copyright 2022 The Backstage Authors
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

import { stringifyEntityRef } from '@backstage/catalog-model';
import { NotAllowedError } from '@backstage/errors';
import {
  catalogEntityDeletePermission,
  catalogEntityReadPermission,
} from '@backstage/plugin-catalog-common';
import {
  AuthorizeResult,
  PermissionAuthorizer,
} from '@backstage/plugin-permission-common';
import { ConditionTransformer } from '@backstage/plugin-permission-node';
import {
  EntitiesCatalog,
  EntitiesRequest,
  EntitiesResponse,
  EntityAncestryResponse,
  EntityFilter,
} from '../catalog/types';
import { basicEntityFilter } from './request/basicEntityFilter';

export class AuthorizedEntitiesCatalog implements EntitiesCatalog {
  constructor(
    private readonly entitiesCatalog: EntitiesCatalog,
    private readonly permissionApi: PermissionAuthorizer,
    private readonly transformConditions: ConditionTransformer<EntityFilter>,
  ) {}

  async entities(request?: EntitiesRequest): Promise<EntitiesResponse> {
    const authorizeResponse = (
      await this.permissionApi.authorize(
        [{ permission: catalogEntityReadPermission }],
        { token: request?.authorizationToken },
      )
    )[0];

    if (authorizeResponse.result === AuthorizeResult.DENY) {
      return {
        entities: [],
        pageInfo: { hasNextPage: false },
      };
    }

    if (authorizeResponse.result === AuthorizeResult.CONDITIONAL) {
      const permissionFilter: EntityFilter = this.transformConditions(
        authorizeResponse.conditions,
      );
      return this.entitiesCatalog.entities({
        ...request,
        filter: request?.filter
          ? { allOf: [permissionFilter, request.filter] }
          : permissionFilter,
      });
    }

    return this.entitiesCatalog.entities(request);
  }

  async removeEntityByUid(
    uid: string,
    authorizationToken?: string,
  ): Promise<void> {
    const { entities } = await this.entitiesCatalog.entities({
      filter: basicEntityFilter({ 'metadata.uid': uid }),
    });
    if (entities.length === 0) {
      throw new NotAllowedError();
    }

    const authorizeResponse = (
      await this.permissionApi.authorize(
        [
          {
            permission: catalogEntityDeletePermission,
            resourceRef: stringifyEntityRef(entities[0]),
          },
        ],
        { token: authorizationToken },
      )
    )[0];
    if (authorizeResponse.result !== AuthorizeResult.ALLOW) {
      throw new NotAllowedError();
    }
    return this.entitiesCatalog.removeEntityByUid(uid);
  }

  entityAncestry(entityRef: string): Promise<EntityAncestryResponse> {
    // TODO: Implement permissioning
    return this.entitiesCatalog.entityAncestry(entityRef);
  }
}
