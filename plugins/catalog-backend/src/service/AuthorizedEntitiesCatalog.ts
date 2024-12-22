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

import { NotAllowedError } from '@backstage/errors';
import {
  catalogEntityDeletePermission,
  catalogEntityReadPermission,
} from '@backstage/plugin-catalog-common/alpha';
import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import { ConditionTransformer } from '@backstage/plugin-permission-node';
import {
  Cursor,
  EntitiesBatchRequest,
  EntitiesBatchResponse,
  EntitiesCatalog,
  EntitiesRequest,
  EntitiesResponse,
  EntityAncestryResponse,
  EntityFacetsRequest,
  EntityFacetsResponse,
  QueryEntitiesRequest,
  QueryEntitiesResponse,
} from '../catalog/types';
import { basicEntityFilter } from './request';
import { isQueryEntitiesCursorRequest } from './util';
import { EntityFilter } from '@backstage/plugin-catalog-node';
import {
  BackstageCredentials,
  PermissionsService,
} from '@backstage/backend-plugin-api';

export class AuthorizedEntitiesCatalog implements EntitiesCatalog {
  constructor(
    private readonly entitiesCatalog: EntitiesCatalog,
    private readonly permissionApi: PermissionsService,
    private readonly transformConditions: ConditionTransformer<EntityFilter>,
  ) {}

  async entities(request: EntitiesRequest): Promise<EntitiesResponse> {
    const authorizeDecision = (
      await this.permissionApi.authorizeConditional(
        [{ permission: catalogEntityReadPermission }],
        { credentials: request.credentials },
      )
    )[0];

    if (authorizeDecision.result === AuthorizeResult.DENY) {
      return {
        entities: { type: 'object', entities: [] },
        pageInfo: { hasNextPage: false },
      };
    }

    if (authorizeDecision.result === AuthorizeResult.CONDITIONAL) {
      const permissionFilter: EntityFilter = this.transformConditions(
        authorizeDecision.conditions,
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

  async entitiesBatch(
    request: EntitiesBatchRequest,
  ): Promise<EntitiesBatchResponse> {
    const authorizeDecision = (
      await this.permissionApi.authorizeConditional(
        [{ permission: catalogEntityReadPermission }],
        { credentials: request.credentials },
      )
    )[0];

    if (authorizeDecision.result === AuthorizeResult.DENY) {
      return {
        items: {
          type: 'object',
          entities: new Array(request.entityRefs.length).fill(null),
        },
      };
    }

    if (authorizeDecision.result === AuthorizeResult.CONDITIONAL) {
      const permissionFilter: EntityFilter = this.transformConditions(
        authorizeDecision.conditions,
      );
      return this.entitiesCatalog.entitiesBatch({
        ...request,
        filter: request?.filter
          ? { allOf: [permissionFilter, request.filter] }
          : permissionFilter,
      });
    }

    return this.entitiesCatalog.entitiesBatch(request);
  }

  async queryEntities(
    request: QueryEntitiesRequest,
  ): Promise<QueryEntitiesResponse> {
    const authorizeDecision = (
      await this.permissionApi.authorizeConditional(
        [{ permission: catalogEntityReadPermission }],
        { credentials: request.credentials },
      )
    )[0];

    if (authorizeDecision.result === AuthorizeResult.DENY) {
      return {
        items: { type: 'object', entities: [] },
        pageInfo: {},
        totalItems: 0,
      };
    }

    if (authorizeDecision.result === AuthorizeResult.CONDITIONAL) {
      const permissionFilter: EntityFilter = this.transformConditions(
        authorizeDecision.conditions,
      );

      let permissionedRequest: QueryEntitiesRequest;
      let requestFilter: EntityFilter | undefined;

      if (isQueryEntitiesCursorRequest(request)) {
        requestFilter = request.cursor.filter;

        permissionedRequest = {
          ...request,
          cursor: {
            ...request.cursor,
            filter: request.cursor.filter
              ? { allOf: [permissionFilter, request.cursor.filter] }
              : permissionFilter,
          },
        };
      } else {
        permissionedRequest = {
          ...request,
          filter: request.filter
            ? { allOf: [permissionFilter, request.filter] }
            : permissionFilter,
        };
        requestFilter = request.filter;
      }

      const response = await this.entitiesCatalog.queryEntities(
        permissionedRequest,
      );

      const prevCursor: Cursor | undefined = response.pageInfo.prevCursor && {
        ...response.pageInfo.prevCursor,
        filter: requestFilter,
      };

      const nextCursor: Cursor | undefined = response.pageInfo.nextCursor && {
        ...response.pageInfo.nextCursor,
        filter: requestFilter,
      };

      return {
        ...response,
        pageInfo: {
          prevCursor,
          nextCursor,
        },
      };
    }

    return this.entitiesCatalog.queryEntities(request);
  }

  async removeEntityByUid(
    uid: string,
    options: { credentials: BackstageCredentials },
  ): Promise<void> {
    const authorizeResponse = (
      await this.permissionApi.authorizeConditional(
        [{ permission: catalogEntityDeletePermission }],
        { credentials: options.credentials },
      )
    )[0];
    if (authorizeResponse.result === AuthorizeResult.DENY) {
      throw new NotAllowedError();
    }
    if (authorizeResponse.result === AuthorizeResult.CONDITIONAL) {
      const permissionFilter: EntityFilter = this.transformConditions(
        authorizeResponse.conditions,
      );
      const { entities } = await this.entitiesCatalog.entities({
        credentials: options.credentials,
        filter: {
          allOf: [permissionFilter, basicEntityFilter({ 'metadata.uid': uid })],
        },
      });
      if (entities.entities.length === 0) {
        throw new NotAllowedError();
      }
    }
    return this.entitiesCatalog.removeEntityByUid(uid, {
      credentials: options.credentials,
    });
  }

  async entityAncestry(
    entityRef: string,
    options: { credentials: BackstageCredentials },
  ): Promise<EntityAncestryResponse> {
    const rootEntityAuthorizeResponse = (
      await this.permissionApi.authorize(
        [{ permission: catalogEntityReadPermission, resourceRef: entityRef }],
        { credentials: options.credentials },
      )
    )[0];
    if (rootEntityAuthorizeResponse.result === AuthorizeResult.DENY) {
      throw new NotAllowedError();
    }

    const ancestryResult = await this.entitiesCatalog.entityAncestry(
      entityRef,
      { credentials: options.credentials },
    );
    const authorizeResponse = await this.permissionApi.authorize(
      ancestryResult.items.map(item => ({
        permission: catalogEntityReadPermission,
        resourceRef: stringifyEntityRef(item.entity),
      })),
      { credentials: options.credentials },
    );
    const unauthorizedAncestryItems = ancestryResult.items.filter(
      (_, index) => authorizeResponse[index].result === AuthorizeResult.DENY,
    );
    if (unauthorizedAncestryItems.length === 0) {
      return ancestryResult;
    }
    const rootUnauthorizedEntityRefs = unauthorizedAncestryItems.map(
      ancestryItem => stringifyEntityRef(ancestryItem.entity),
    );
    const allUnauthorizedEntityRefs = new Set(
      rootUnauthorizedEntityRefs.flatMap(rootEntityRef =>
        this.findParents(
          rootEntityRef,
          ancestryResult.items,
          new Set(rootUnauthorizedEntityRefs),
        ),
      ),
    );
    return {
      rootEntityRef: ancestryResult.rootEntityRef,
      items: ancestryResult.items.filter(
        ancestryItem =>
          !allUnauthorizedEntityRefs.has(
            stringifyEntityRef(ancestryItem.entity),
          ),
      ),
    };
  }

  async facets(request: EntityFacetsRequest): Promise<EntityFacetsResponse> {
    const authorizeDecision = (
      await this.permissionApi.authorizeConditional(
        [{ permission: catalogEntityReadPermission }],
        { credentials: request.credentials },
      )
    )[0];

    if (authorizeDecision.result === AuthorizeResult.DENY) {
      return {
        facets: Object.fromEntries(request.facets.map(f => [f, []])),
      };
    }

    if (authorizeDecision.result === AuthorizeResult.CONDITIONAL) {
      const permissionFilter: EntityFilter = this.transformConditions(
        authorizeDecision.conditions,
      );
      return this.entitiesCatalog.facets({
        ...request,
        filter: request?.filter
          ? { allOf: [permissionFilter, request.filter] }
          : permissionFilter,
      });
    }

    return this.entitiesCatalog.facets(request);
  }

  private findParents(
    entityRef: string,
    allAncestryItems: { entity: Entity; parentEntityRefs: string[] }[],
    seenEntityRefs: Set<string>,
  ): string[] {
    const entity = allAncestryItems.find(
      ancestryItem => stringifyEntityRef(ancestryItem.entity) === entityRef,
    );
    if (!entity) return [];

    const newSeenEntityRefs = new Set(seenEntityRefs);
    entity.parentEntityRefs.forEach(parentRef =>
      newSeenEntityRefs.add(parentRef),
    );

    return [
      entityRef,
      ...entity.parentEntityRefs.flatMap(parentRef =>
        seenEntityRefs.has(parentRef)
          ? []
          : this.findParents(parentRef, allAncestryItems, newSeenEntityRefs),
      ),
    ];
  }
}
