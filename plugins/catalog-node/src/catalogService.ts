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

import {
  createServiceFactory,
  createServiceRef,
  coreServices,
  BackstageCredentials,
  DiscoveryService,
  AuthService,
} from '@backstage/backend-plugin-api';
import {
  AddLocationRequest,
  AddLocationResponse,
  CatalogApi,
  CatalogClient,
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

/**
 * @public
 */
export interface CatalogServiceRequestOptions extends CatalogRequestOptions {
  credentials?: BackstageCredentials;
}

/**
 * A version of the {@link CatalogApi | CatalogApi} that
 * accepts backend credentials in addition to a token.
 *
 * @public
 */
export interface CatalogService extends CatalogApi {
  getEntities(
    request?: GetEntitiesRequest,
    options?: CatalogServiceRequestOptions,
  ): Promise<GetEntitiesResponse>;

  getEntitiesByRefs(
    request: GetEntitiesByRefsRequest,
    options?: CatalogServiceRequestOptions,
  ): Promise<GetEntitiesByRefsResponse>;

  queryEntities(
    request?: QueryEntitiesRequest,
    options?: CatalogServiceRequestOptions,
  ): Promise<QueryEntitiesResponse>;

  getEntityAncestors(
    request: GetEntityAncestorsRequest,
    options?: CatalogServiceRequestOptions,
  ): Promise<GetEntityAncestorsResponse>;

  getEntityByRef(
    entityRef: string | CompoundEntityRef,
    options?: CatalogServiceRequestOptions,
  ): Promise<Entity | undefined>;

  removeEntityByUid(
    uid: string,
    options?: CatalogServiceRequestOptions,
  ): Promise<void>;

  refreshEntity(
    entityRef: string,
    options?: CatalogServiceRequestOptions,
  ): Promise<void>;

  getEntityFacets(
    request: GetEntityFacetsRequest,
    options?: CatalogServiceRequestOptions,
  ): Promise<GetEntityFacetsResponse>;

  getLocationById(
    id: string,
    options?: CatalogServiceRequestOptions,
  ): Promise<Location | undefined>;

  getLocationByRef(
    locationRef: string,
    options?: CatalogServiceRequestOptions,
  ): Promise<Location | undefined>;

  addLocation(
    location: AddLocationRequest,
    options?: CatalogServiceRequestOptions,
  ): Promise<AddLocationResponse>;

  removeLocationById(
    id: string,
    options?: CatalogServiceRequestOptions,
  ): Promise<void>;

  getLocationByEntity(
    entityRef: string | CompoundEntityRef,
    options?: CatalogServiceRequestOptions,
  ): Promise<Location | undefined>;

  validateEntity(
    entity: Entity,
    locationRef: string,
    options?: CatalogServiceRequestOptions,
  ): Promise<ValidateEntityResponse>;
}

class DefaultCatalogService extends CatalogClient {
  readonly #auth: AuthService;

  constructor({
    discoveryApi,
    auth,
  }: {
    discoveryApi: DiscoveryService;
    auth: AuthService;
  }) {
    super({ discoveryApi });
    this.#auth = auth;
  }

  async getEntities(
    request?: GetEntitiesRequest,
    options?: CatalogServiceRequestOptions,
  ): Promise<GetEntitiesResponse> {
    return super.getEntities(request, await this.#getOptions(options));
  }

  async getEntitiesByRefs(
    request: GetEntitiesByRefsRequest,
    options?: CatalogServiceRequestOptions,
  ): Promise<GetEntitiesByRefsResponse> {
    return super.getEntitiesByRefs(request, await this.#getOptions(options));
  }

  async queryEntities(
    request?: QueryEntitiesRequest,
    options?: CatalogServiceRequestOptions,
  ): Promise<QueryEntitiesResponse> {
    return super.queryEntities(request, await this.#getOptions(options));
  }

  async getEntityAncestors(
    request: GetEntityAncestorsRequest,
    options?: CatalogServiceRequestOptions,
  ): Promise<GetEntityAncestorsResponse> {
    return super.getEntityAncestors(request, await this.#getOptions(options));
  }

  async getEntityByRef(
    entityRef: string | CompoundEntityRef,
    options?: CatalogServiceRequestOptions,
  ): Promise<Entity | undefined> {
    return super.getEntityByRef(entityRef, await this.#getOptions(options));
  }

  async removeEntityByUid(
    uid: string,
    options?: CatalogServiceRequestOptions,
  ): Promise<void> {
    return super.removeEntityByUid(uid, await this.#getOptions(options));
  }

  async refreshEntity(
    entityRef: string,
    options?: CatalogServiceRequestOptions,
  ): Promise<void> {
    return super.refreshEntity(entityRef, await this.#getOptions(options));
  }

  async getEntityFacets(
    request: GetEntityFacetsRequest,
    options?: CatalogServiceRequestOptions,
  ): Promise<GetEntityFacetsResponse> {
    return super.getEntityFacets(request, await this.#getOptions(options));
  }

  async getLocationById(
    id: string,
    options?: CatalogServiceRequestOptions,
  ): Promise<Location | undefined> {
    return super.getLocationById(id, await this.#getOptions(options));
  }

  async getLocationByRef(
    locationRef: string,
    options?: CatalogServiceRequestOptions,
  ): Promise<Location | undefined> {
    return super.getLocationByRef(locationRef, await this.#getOptions(options));
  }

  async addLocation(
    location: AddLocationRequest,
    options?: CatalogServiceRequestOptions,
  ): Promise<AddLocationResponse> {
    return super.addLocation(location, await this.#getOptions(options));
  }

  async removeLocationById(
    id: string,
    options?: CatalogServiceRequestOptions,
  ): Promise<void> {
    return super.removeLocationById(id, await this.#getOptions(options));
  }

  async getLocationByEntity(
    entityRef: string | CompoundEntityRef,
    options?: CatalogServiceRequestOptions,
  ): Promise<Location | undefined> {
    return super.getLocationByEntity(
      entityRef,
      await this.#getOptions(options),
    );
  }

  async validateEntity(
    entity: Entity,
    locationRef: string,
    options?: CatalogServiceRequestOptions,
  ): Promise<ValidateEntityResponse> {
    return super.validateEntity(
      entity,
      locationRef,
      await this.#getOptions(options),
    );
  }

  async #getOptions(
    options?: CatalogServiceRequestOptions,
  ): Promise<CatalogRequestOptions | undefined> {
    if (options?.token) {
      return options;
    }
    if (options?.credentials) {
      return this.#auth.getPluginRequestToken({
        onBehalfOf: options.credentials,
        targetPluginId: 'catalog',
      });
    }
    return options;
  }
}

/**
 * The catalogService provides the catalog API.
 *
 * @public
 */
export const catalogServiceRef = createServiceRef<CatalogService>({
  id: 'catalog-client',
  defaultFactory: async service =>
    createServiceFactory({
      service,
      deps: {
        auth: coreServices.auth,
        discoveryApi: coreServices.discovery,
      },
      async factory(deps) {
        return new DefaultCatalogService(deps);
      },
    }),
});
