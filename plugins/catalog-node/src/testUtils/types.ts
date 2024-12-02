/*
 * Copyright 2024 The Backstage Authors
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
  AddLocationRequest,
  AddLocationResponse,
  CatalogApi,
  CatalogRequestOptions,
  GetEntitiesByRefsRequest,
  GetEntitiesByRefsResponse,
  GetEntitiesRequest,
  GetEntitiesResponse,
  GetEntityAncestorsRequest,
  GetEntityAncestorsResponse,
  GetEntityFacetsRequest,
  GetEntityFacetsResponse,
  Location,
  QueryEntitiesRequest,
  QueryEntitiesResponse,
  ValidateEntityResponse,
} from '@backstage/catalog-client';
import { CompoundEntityRef, Entity } from '@backstage/catalog-model';
import {
  CatalogService,
  CatalogServiceRequestOptions,
} from '@backstage/plugin-catalog-node';

/**
 * A mock friendly version of `CatalogService` /
 * {@link @backstage/catalog-client#CatalogApi | CatalogApi}.
 *
 * @public
 * @remarks
 *
 * This interface supports both API types at the same time, and has an optional
 * second argument to simplify testing since the mock implementation does not
 * care about credentials.
 */
export interface CatalogServiceMock extends CatalogService, CatalogApi {
  getEntities(
    request?: GetEntitiesRequest,
    options?: CatalogServiceRequestOptions | CatalogRequestOptions,
  ): Promise<GetEntitiesResponse>;

  getEntitiesByRefs(
    request: GetEntitiesByRefsRequest,
    options?: CatalogServiceRequestOptions | CatalogRequestOptions,
  ): Promise<GetEntitiesByRefsResponse>;

  queryEntities(
    request?: QueryEntitiesRequest,
    options?: CatalogServiceRequestOptions | CatalogRequestOptions,
  ): Promise<QueryEntitiesResponse>;

  getEntityAncestors(
    request: GetEntityAncestorsRequest,
    options?: CatalogServiceRequestOptions | CatalogRequestOptions,
  ): Promise<GetEntityAncestorsResponse>;

  getEntityByRef(
    entityRef: string | CompoundEntityRef,
    options?: CatalogServiceRequestOptions | CatalogRequestOptions,
  ): Promise<Entity | undefined>;

  removeEntityByUid(
    uid: string,
    options?: CatalogServiceRequestOptions | CatalogRequestOptions,
  ): Promise<void>;

  refreshEntity(
    entityRef: string,
    options?: CatalogServiceRequestOptions | CatalogRequestOptions,
  ): Promise<void>;

  getEntityFacets(
    request: GetEntityFacetsRequest,
    options?: CatalogServiceRequestOptions | CatalogRequestOptions,
  ): Promise<GetEntityFacetsResponse>;

  getLocationById(
    id: string,
    options?: CatalogServiceRequestOptions | CatalogRequestOptions,
  ): Promise<Location | undefined>;

  getLocationByRef(
    locationRef: string,
    options?: CatalogServiceRequestOptions | CatalogRequestOptions,
  ): Promise<Location | undefined>;

  addLocation(
    location: AddLocationRequest,
    options?: CatalogServiceRequestOptions | CatalogRequestOptions,
  ): Promise<AddLocationResponse>;

  removeLocationById(
    id: string,
    options?: CatalogServiceRequestOptions | CatalogRequestOptions,
  ): Promise<void>;

  getLocationByEntity(
    entityRef: string | CompoundEntityRef,
    options?: CatalogServiceRequestOptions | CatalogRequestOptions,
  ): Promise<Location | undefined>;

  validateEntity(
    entity: Entity,
    locationRef: string,
    options?: CatalogServiceRequestOptions | CatalogRequestOptions,
  ): Promise<ValidateEntityResponse>;
}
