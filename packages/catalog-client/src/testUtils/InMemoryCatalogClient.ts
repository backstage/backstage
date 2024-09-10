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
import { NotImplementedError } from '@backstage/errors';

/** @public */
export class InMemoryCatalogClient implements CatalogApi {
  getEntities(
    _request?: GetEntitiesRequest | undefined,
    _options?: CatalogRequestOptions | undefined,
  ): Promise<GetEntitiesResponse> {
    throw new NotImplementedError('Method not implemented.');
  }

  getEntitiesByRefs(
    _request: GetEntitiesByRefsRequest,
    _options?: CatalogRequestOptions | undefined,
  ): Promise<GetEntitiesByRefsResponse> {
    throw new NotImplementedError('Method not implemented.');
  }

  queryEntities(
    _request?: QueryEntitiesRequest | undefined,
    _options?: CatalogRequestOptions | undefined,
  ): Promise<QueryEntitiesResponse> {
    throw new NotImplementedError('Method not implemented.');
  }

  getEntityAncestors(
    _request: GetEntityAncestorsRequest,
    _options?: CatalogRequestOptions | undefined,
  ): Promise<GetEntityAncestorsResponse> {
    throw new NotImplementedError('Method not implemented.');
  }

  getEntityByRef(
    _entityRef: string | CompoundEntityRef,
    _options?: CatalogRequestOptions | undefined,
  ): Promise<Entity | undefined> {
    throw new NotImplementedError('Method not implemented.');
  }

  removeEntityByUid(
    _uid: string,
    _options?: CatalogRequestOptions | undefined,
  ): Promise<void> {
    throw new NotImplementedError('Method not implemented.');
  }

  refreshEntity(
    _entityRef: string,
    _options?: CatalogRequestOptions | undefined,
  ): Promise<void> {
    throw new NotImplementedError('Method not implemented.');
  }

  getEntityFacets(
    _request: GetEntityFacetsRequest,
    _options?: CatalogRequestOptions | undefined,
  ): Promise<GetEntityFacetsResponse> {
    throw new NotImplementedError('Method not implemented.');
  }

  getLocationById(
    _id: string,
    _options?: CatalogRequestOptions | undefined,
  ): Promise<Location | undefined> {
    throw new NotImplementedError('Method not implemented.');
  }

  getLocationByRef(
    _locationRef: string,
    _options?: CatalogRequestOptions | undefined,
  ): Promise<Location | undefined> {
    throw new NotImplementedError('Method not implemented.');
  }

  addLocation(
    _location: AddLocationRequest,
    _options?: CatalogRequestOptions | undefined,
  ): Promise<AddLocationResponse> {
    throw new NotImplementedError('Method not implemented.');
  }

  removeLocationById(
    _id: string,
    _options?: CatalogRequestOptions | undefined,
  ): Promise<void> {
    throw new NotImplementedError('Method not implemented.');
  }

  getLocationByEntity(
    _entityRef: string | CompoundEntityRef,
    _options?: CatalogRequestOptions | undefined,
  ): Promise<Location | undefined> {
    throw new NotImplementedError('Method not implemented.');
  }

  validateEntity(
    _entity: Entity,
    _locationRef: string,
    _options?: CatalogRequestOptions | undefined,
  ): Promise<ValidateEntityResponse> {
    throw new NotImplementedError('Method not implemented.');
  }
}
