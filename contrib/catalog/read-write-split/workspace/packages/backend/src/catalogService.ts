import {
  AuthService,
  coreServices,
  createServiceFactory,
  DiscoveryService,
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
  GetLocationsResponse,
  Location,
  QueryEntitiesRequest,
  QueryEntitiesResponse,
  ValidateEntityResponse,
} from '@backstage/catalog-client';
import { CompoundEntityRef, Entity } from '@backstage/catalog-model';
import {
  AnalyzeLocationRequest,
  AnalyzeLocationResponse,
} from '@backstage/plugin-catalog-common';
import {
  CatalogService,
  CatalogServiceRequestOptions,
  catalogServiceRef,
} from '@backstage/plugin-catalog-node';

/**
 * Implements the catalog client for backends, by using a custom service
 * discovery to achieve read/write segregation.
 */
export class ReadWriteSplitCatalogService implements CatalogService {
  readonly #auth: AuthService;
  readonly #catalogRead: CatalogApi;
  readonly #catalogWrite: CatalogApi;

  constructor(options: { auth: AuthService; discovery: DiscoveryService }) {
    this.#auth = options.auth;
    this.#catalogRead = new CatalogClient({
      discoveryApi: {
        // This uses the normal "catalog" plugin ID
        getBaseUrl: () => options.discovery.getBaseUrl('catalog'),
      },
    });
    this.#catalogWrite = new CatalogClient({
      discoveryApi: {
        // This uses the made-up "catalog-write" plugin ID (see app-config.yaml
        // which defines a custom discovery endpoint for this)
        getBaseUrl: () => options.discovery.getBaseUrl('catalog-write'),
      },
    });
  }

  async getEntities(
    request: GetEntitiesRequest | undefined,
    options: CatalogServiceRequestOptions,
  ): Promise<GetEntitiesResponse> {
    return this.#catalogRead.getEntities(
      request,
      await this.#getOptions(options),
    );
  }

  async getEntitiesByRefs(
    request: GetEntitiesByRefsRequest,
    options: CatalogServiceRequestOptions,
  ): Promise<GetEntitiesByRefsResponse> {
    return this.#catalogRead.getEntitiesByRefs(
      request,
      await this.#getOptions(options),
    );
  }

  async queryEntities(
    request: QueryEntitiesRequest | undefined,
    options: CatalogServiceRequestOptions,
  ): Promise<QueryEntitiesResponse> {
    return this.#catalogRead.queryEntities(
      request,
      await this.#getOptions(options),
    );
  }

  async getEntityAncestors(
    request: GetEntityAncestorsRequest,
    options: CatalogServiceRequestOptions,
  ): Promise<GetEntityAncestorsResponse> {
    return this.#catalogRead.getEntityAncestors(
      request,
      await this.#getOptions(options),
    );
  }

  async getEntityByRef(
    entityRef: string | CompoundEntityRef,
    options: CatalogServiceRequestOptions,
  ): Promise<Entity | undefined> {
    return this.#catalogRead.getEntityByRef(
      entityRef,
      await this.#getOptions(options),
    );
  }

  async removeEntityByUid(
    uid: string,
    options: CatalogServiceRequestOptions,
  ): Promise<void> {
    return this.#catalogWrite.removeEntityByUid(
      uid,
      await this.#getOptions(options),
    );
  }

  async refreshEntity(
    entityRef: string,
    options: CatalogServiceRequestOptions,
  ): Promise<void> {
    return this.#catalogWrite.refreshEntity(
      entityRef,
      await this.#getOptions(options),
    );
  }

  async getEntityFacets(
    request: GetEntityFacetsRequest,
    options: CatalogServiceRequestOptions,
  ): Promise<GetEntityFacetsResponse> {
    return this.#catalogRead.getEntityFacets(
      request,
      await this.#getOptions(options),
    );
  }

  async getLocations(
    request: object | undefined,
    options: CatalogServiceRequestOptions,
  ): Promise<GetLocationsResponse> {
    return this.#catalogRead.getLocations(
      request,
      await this.#getOptions(options),
    );
  }

  async getLocationById(
    id: string,
    options: CatalogServiceRequestOptions,
  ): Promise<Location | undefined> {
    return this.#catalogRead.getLocationById(
      id,
      await this.#getOptions(options),
    );
  }

  async getLocationByRef(
    locationRef: string,
    options: CatalogServiceRequestOptions,
  ): Promise<Location | undefined> {
    return this.#catalogRead.getLocationByRef(
      locationRef,
      await this.#getOptions(options),
    );
  }

  async addLocation(
    location: AddLocationRequest,
    options: CatalogServiceRequestOptions,
  ): Promise<AddLocationResponse> {
    return this.#catalogWrite.addLocation(
      location,
      await this.#getOptions(options),
    );
  }

  async removeLocationById(
    id: string,
    options: CatalogServiceRequestOptions,
  ): Promise<void> {
    return this.#catalogWrite.removeLocationById(
      id,
      await this.#getOptions(options),
    );
  }

  async getLocationByEntity(
    entityRef: string | CompoundEntityRef,
    options: CatalogServiceRequestOptions,
  ): Promise<Location | undefined> {
    return this.#catalogRead.getLocationByEntity(
      entityRef,
      await this.#getOptions(options),
    );
  }

  async validateEntity(
    entity: Entity,
    locationRef: string,
    options: CatalogServiceRequestOptions,
  ): Promise<ValidateEntityResponse> {
    return this.#catalogWrite.validateEntity(
      entity,
      locationRef,
      await this.#getOptions(options),
    );
  }

  async analyzeLocation(
    location: AnalyzeLocationRequest,
    options: CatalogServiceRequestOptions,
  ): Promise<AnalyzeLocationResponse> {
    return this.#catalogWrite.analyzeLocation(
      location,
      await this.#getOptions(options),
    );
  }

  async #getOptions(
    options: CatalogServiceRequestOptions,
  ): Promise<CatalogRequestOptions> {
    return this.#auth.getPluginRequestToken({
      onBehalfOf: options.credentials,
      targetPluginId: 'catalog',
    });
  }
}

// You should register this in your backend.
export const catalogService = createServiceFactory({
  service: catalogServiceRef,
  deps: {
    auth: coreServices.auth,
    discovery: coreServices.discovery,
  },
  async factory({ auth, discovery }) {
    return new ReadWriteSplitCatalogService({
      auth,
      discovery,
    });
  },
});
