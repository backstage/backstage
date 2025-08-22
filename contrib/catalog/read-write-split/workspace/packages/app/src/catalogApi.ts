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
  GetLocationsResponse,
  Location,
  QueryEntitiesRequest,
  QueryEntitiesResponse,
  ValidateEntityResponse,
} from '@backstage/catalog-client';
import { CompoundEntityRef, Entity } from '@backstage/catalog-model';
import {
  createApiFactory,
  DiscoveryApi,
  discoveryApiRef,
  FetchApi,
  fetchApiRef,
} from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import {
  AnalyzeLocationRequest,
  AnalyzeLocationResponse,
} from '@backstage/plugin-catalog-common';

/**
 * Implements the catalog client for frontends, by using a custom service
 * discovery to achieve read/write segregation.
 */
export class ReadWriteSplitCatalogClient implements CatalogApi {
  #write: CatalogApi;
  #read: CatalogApi;

  constructor(options: { discoveryApi: DiscoveryApi; fetchApi: FetchApi }) {
    this.#read = new CatalogClient({
      fetchApi: options.fetchApi,
      discoveryApi: {
        // This uses the normal "catalog" plugin ID
        getBaseUrl: () => options.discoveryApi.getBaseUrl('catalog'),
      },
    });
    this.#write = new CatalogClient({
      fetchApi: options.fetchApi,
      discoveryApi: {
        // This uses the made-up "catalog-write" plugin ID (see app-config.yaml
        // which defines a custom discovery endpoint for this)
        getBaseUrl: () => options.discoveryApi.getBaseUrl('catalog-write'),
      },
    });
  }

  getEntities(
    request?: GetEntitiesRequest,
    options?: CatalogRequestOptions,
  ): Promise<GetEntitiesResponse> {
    return this.#read.getEntities(request, options);
  }

  getEntitiesByRefs(
    request: GetEntitiesByRefsRequest,
    options?: CatalogRequestOptions,
  ): Promise<GetEntitiesByRefsResponse> {
    return this.#read.getEntitiesByRefs(request, options);
  }

  queryEntities(
    request?: QueryEntitiesRequest,
    options?: CatalogRequestOptions,
  ): Promise<QueryEntitiesResponse> {
    return this.#read.queryEntities(request, options);
  }

  getEntityAncestors(
    request: GetEntityAncestorsRequest,
    options?: CatalogRequestOptions,
  ): Promise<GetEntityAncestorsResponse> {
    return this.#read.getEntityAncestors(request, options);
  }

  getEntityByRef(
    entityRef: string | CompoundEntityRef,
    options?: CatalogRequestOptions,
  ): Promise<Entity | undefined> {
    return this.#read.getEntityByRef(entityRef, options);
  }

  removeEntityByUid(
    uid: string,
    options?: CatalogRequestOptions,
  ): Promise<void> {
    return this.#write.removeEntityByUid(uid, options);
  }

  refreshEntity(
    entityRef: string,
    options?: CatalogRequestOptions,
  ): Promise<void> {
    return this.#write.refreshEntity(entityRef, options);
  }

  getEntityFacets(
    request: GetEntityFacetsRequest,
    options?: CatalogRequestOptions,
  ): Promise<GetEntityFacetsResponse> {
    return this.#read.getEntityFacets(request, options);
  }

  getLocations(
    request?: {},
    options?: CatalogRequestOptions,
  ): Promise<GetLocationsResponse> {
    return this.#read.getLocations(request, options);
  }

  getLocationById(
    id: string,
    options?: CatalogRequestOptions,
  ): Promise<Location | undefined> {
    return this.#read.getLocationById(id, options);
  }

  getLocationByRef(
    locationRef: string,
    options?: CatalogRequestOptions,
  ): Promise<Location | undefined> {
    return this.#read.getLocationByRef(locationRef, options);
  }

  addLocation(
    location: AddLocationRequest,
    options?: CatalogRequestOptions,
  ): Promise<AddLocationResponse> {
    return this.#write.addLocation(location, options);
  }

  removeLocationById(
    id: string,
    options?: CatalogRequestOptions,
  ): Promise<void> {
    return this.#write.removeLocationById(id, options);
  }

  getLocationByEntity(
    entityRef: string | CompoundEntityRef,
    options?: CatalogRequestOptions,
  ): Promise<Location | undefined> {
    return this.#read.getLocationByEntity(entityRef, options);
  }

  validateEntity(
    entity: Entity,
    locationRef: string,
    options?: CatalogRequestOptions,
  ): Promise<ValidateEntityResponse> {
    return this.#write.validateEntity(entity, locationRef, options);
  }

  analyzeLocation(
    location: AnalyzeLocationRequest,
    options?: CatalogRequestOptions,
  ): Promise<AnalyzeLocationResponse> {
    return this.#write.analyzeLocation(location, options);
  }
}

// You should pass this to createApp.
export const catalogApiFactory = createApiFactory({
  api: catalogApiRef,
  deps: { discoveryApi: discoveryApiRef, fetchApi: fetchApiRef },
  factory: ({ discoveryApi, fetchApi }) => {
    return new ReadWriteSplitCatalogClient({
      discoveryApi,
      fetchApi,
    });
  },
});
