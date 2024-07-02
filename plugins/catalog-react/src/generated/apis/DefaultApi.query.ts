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
import type {
  AnalyzeLocation,
  CreateLocation,
  DeleteEntityByUid,
  DeleteLocation,
  GetEntities,
  GetEntitiesByQuery,
  GetEntitiesByRefs,
  GetEntityAncestryByName,
  GetEntityByName,
  GetEntityByUid,
  GetEntityFacets,
  GetLocation,
  GetLocationByEntity,
  GetLocations,
  RefreshEntity,
  ValidateEntity,
  AnalyzeLocationResponse,
  CreateLocation201Response,
  EntitiesBatchResponse,
  EntitiesQueryResponse,
  Entity,
  EntityAncestryResponse,
  EntityFacetsResponse,
  GetLocations200ResponseInner,
  Location,
} from '@backstage/catalog-common/client';
import { CatalogClient } from '@backstage/catalog-common/client';
import {
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import {
  createApiFactory,
  createApiRef,
  discoveryApiRef,
  fetchApiRef,
  useApi,
} from '@backstage/core-plugin-api';

/**
 * @public
 */
export const catalogApiRef = createApiRef<CatalogClient>({
  id: 'core.catalog',
});

/**
 * @public
 */
export const defaultCatalogApi = createApiFactory({
  api: catalogApiRef,
  deps: {
    discoveryApi: discoveryApiRef,
    fetchApi: fetchApiRef,
  },
  factory: ({ discoveryApi, fetchApi }) =>
    new CatalogClient({ discoveryApi, fetchApi }),
});

/**
 * @public
 */
export const queryKeys = {
  all: [{ scope: 'catalog' }] as const,
  analyzeLocation: (request: AnalyzeLocation) =>
    [{ ...queryKeys.all[0], request, reqName: 'analyzeLocation' }] as const,
  createLocation: (request: CreateLocation) =>
    [{ ...queryKeys.all[0], request, reqName: 'createLocation' }] as const,
  deleteEntityByUid: (request: DeleteEntityByUid) =>
    [{ ...queryKeys.all[0], request, reqName: 'deleteEntityByUid' }] as const,
  deleteLocation: (request: DeleteLocation) =>
    [{ ...queryKeys.all[0], request, reqName: 'deleteLocation' }] as const,
  getEntities: (request: GetEntities) =>
    [{ ...queryKeys.all[0], request, reqName: 'getEntities' }] as const,
  getEntitiesByQuery: (request: GetEntitiesByQuery) =>
    [{ ...queryKeys.all[0], request, reqName: 'getEntitiesByQuery' }] as const,
  getEntitiesByRefs: (request: GetEntitiesByRefs) =>
    [{ ...queryKeys.all[0], request, reqName: 'getEntitiesByRefs' }] as const,
  getEntityAncestryByName: (request: GetEntityAncestryByName) =>
    [
      { ...queryKeys.all[0], request, reqName: 'getEntityAncestryByName' },
    ] as const,
  getEntityByName: (request: GetEntityByName) =>
    [{ ...queryKeys.all[0], request, reqName: 'getEntityByName' }] as const,
  getEntityByUid: (request: GetEntityByUid) =>
    [{ ...queryKeys.all[0], request, reqName: 'getEntityByUid' }] as const,
  getEntityFacets: (request: GetEntityFacets) =>
    [{ ...queryKeys.all[0], request, reqName: 'getEntityFacets' }] as const,
  getLocation: (request: GetLocation) =>
    [{ ...queryKeys.all[0], request, reqName: 'getLocation' }] as const,
  getLocationByEntity: (request: GetLocationByEntity) =>
    [{ ...queryKeys.all[0], request, reqName: 'getLocationByEntity' }] as const,
  getLocations: (request: GetLocations) =>
    [{ ...queryKeys.all[0], request, reqName: 'getLocations' }] as const,
  refreshEntity: (request: RefreshEntity) =>
    [{ ...queryKeys.all[0], request, reqName: 'refreshEntity' }] as const,
  validateEntity: (request: ValidateEntity) =>
    [{ ...queryKeys.all[0], request, reqName: 'validateEntity' }] as const,
};

/**
 * @public
 */
export function useQuery_AnalyzeLocation(
  request: AnalyzeLocation,
  options?: UseQueryOptions<AnalyzeLocationResponse, unknown>,
) {
  const catalogApi = useApi(catalogApiRef);
  return useQuery<AnalyzeLocationResponse, unknown>({
    queryKey: queryKeys.analyzeLocation(request),
    queryFn: async () => {
      return (await catalogApi.analyzeLocation(request)).json();
    },
    ...options,
  });
}

/**
 * @public
 */
export function useMutation_AnalyzeLocation(
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof CatalogClient.prototype.analyzeLocation>>,
    unknown,
    AnalyzeLocation
  >,
) {
  const catalogApi = useApi(catalogApiRef);
  return useMutation<
    Awaited<ReturnType<typeof CatalogClient.prototype.analyzeLocation>>,
    unknown,
    AnalyzeLocation
  >({
    mutationFn: (data: AnalyzeLocation) => {
      return catalogApi.analyzeLocation(data);
    },
    ...options,
  });
}

/**
 * @public
 */
export function useQuery_CreateLocation(
  request: CreateLocation,
  options?: UseQueryOptions<CreateLocation201Response, unknown>,
) {
  const catalogApi = useApi(catalogApiRef);
  return useQuery<CreateLocation201Response, unknown>({
    queryKey: queryKeys.createLocation(request),
    queryFn: async () => {
      return (await catalogApi.createLocation(request)).json();
    },
    ...options,
  });
}

/**
 * @public
 */
export function useMutation_CreateLocation(
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof CatalogClient.prototype.createLocation>>,
    unknown,
    CreateLocation
  >,
) {
  const catalogApi = useApi(catalogApiRef);
  return useMutation<
    Awaited<ReturnType<typeof CatalogClient.prototype.createLocation>>,
    unknown,
    CreateLocation
  >({
    mutationFn: (data: CreateLocation) => {
      return catalogApi.createLocation(data);
    },
    ...options,
  });
}

/**
 * @public
 */
export function useQuery_DeleteEntityByUid(
  request: DeleteEntityByUid,
  options?: UseQueryOptions<void, unknown>,
) {
  const catalogApi = useApi(catalogApiRef);
  return useQuery<void, unknown>({
    queryKey: queryKeys.deleteEntityByUid(request),
    queryFn: async () => {
      return (await catalogApi.deleteEntityByUid(request)).json();
    },
    ...options,
  });
}

/**
 * @public
 */
export function useMutation_DeleteEntityByUid(
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof CatalogClient.prototype.deleteEntityByUid>>,
    unknown,
    DeleteEntityByUid
  >,
) {
  const catalogApi = useApi(catalogApiRef);
  return useMutation<
    Awaited<ReturnType<typeof CatalogClient.prototype.deleteEntityByUid>>,
    unknown,
    DeleteEntityByUid
  >({
    mutationFn: (data: DeleteEntityByUid) => {
      return catalogApi.deleteEntityByUid(data);
    },
    ...options,
  });
}

/**
 * @public
 */
export function useQuery_DeleteLocation(
  request: DeleteLocation,
  options?: UseQueryOptions<void, unknown>,
) {
  const catalogApi = useApi(catalogApiRef);
  return useQuery<void, unknown>({
    queryKey: queryKeys.deleteLocation(request),
    queryFn: async () => {
      return (await catalogApi.deleteLocation(request)).json();
    },
    ...options,
  });
}

/**
 * @public
 */
export function useMutation_DeleteLocation(
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof CatalogClient.prototype.deleteLocation>>,
    unknown,
    DeleteLocation
  >,
) {
  const catalogApi = useApi(catalogApiRef);
  return useMutation<
    Awaited<ReturnType<typeof CatalogClient.prototype.deleteLocation>>,
    unknown,
    DeleteLocation
  >({
    mutationFn: (data: DeleteLocation) => {
      return catalogApi.deleteLocation(data);
    },
    ...options,
  });
}

/**
 * @public
 */
export function useQuery_GetEntities(
  request: GetEntities,
  options?: UseQueryOptions<Array<Entity>, unknown>,
) {
  const catalogApi = useApi(catalogApiRef);
  return useQuery<Array<Entity>, unknown>({
    queryKey: queryKeys.getEntities(request),
    queryFn: async () => {
      return (await catalogApi.getEntities(request)).json();
    },
    ...options,
  });
}

/**
 * @public
 */
export function useMutation_GetEntities(
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof CatalogClient.prototype.getEntities>>,
    unknown,
    GetEntities
  >,
) {
  const catalogApi = useApi(catalogApiRef);
  return useMutation<
    Awaited<ReturnType<typeof CatalogClient.prototype.getEntities>>,
    unknown,
    GetEntities
  >({
    mutationFn: (data: GetEntities) => {
      return catalogApi.getEntities(data);
    },
    ...options,
  });
}

/**
 * @public
 */
export function useQuery_GetEntitiesByQuery(
  request: GetEntitiesByQuery,
  options?: UseQueryOptions<EntitiesQueryResponse, unknown>,
) {
  const catalogApi = useApi(catalogApiRef);
  return useQuery<EntitiesQueryResponse, unknown>({
    queryKey: queryKeys.getEntitiesByQuery(request),
    queryFn: async () => {
      return (await catalogApi.getEntitiesByQuery(request)).json();
    },
    ...options,
  });
}

/**
 * @public
 */
export function useMutation_GetEntitiesByQuery(
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof CatalogClient.prototype.getEntitiesByQuery>>,
    unknown,
    GetEntitiesByQuery
  >,
) {
  const catalogApi = useApi(catalogApiRef);
  return useMutation<
    Awaited<ReturnType<typeof CatalogClient.prototype.getEntitiesByQuery>>,
    unknown,
    GetEntitiesByQuery
  >({
    mutationFn: (data: GetEntitiesByQuery) => {
      return catalogApi.getEntitiesByQuery(data);
    },
    ...options,
  });
}

/**
 * @public
 */
export function useQuery_GetEntitiesByRefs(
  request: GetEntitiesByRefs,
  options?: UseQueryOptions<EntitiesBatchResponse, unknown>,
) {
  const catalogApi = useApi(catalogApiRef);
  return useQuery<EntitiesBatchResponse, unknown>({
    queryKey: queryKeys.getEntitiesByRefs(request),
    queryFn: async () => {
      return (await catalogApi.getEntitiesByRefs(request)).json();
    },
    ...options,
  });
}

/**
 * @public
 */
export function useMutation_GetEntitiesByRefs(
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof CatalogClient.prototype.getEntitiesByRefs>>,
    unknown,
    GetEntitiesByRefs
  >,
) {
  const catalogApi = useApi(catalogApiRef);
  return useMutation<
    Awaited<ReturnType<typeof CatalogClient.prototype.getEntitiesByRefs>>,
    unknown,
    GetEntitiesByRefs
  >({
    mutationFn: (data: GetEntitiesByRefs) => {
      return catalogApi.getEntitiesByRefs(data);
    },
    ...options,
  });
}

/**
 * @public
 */
export function useQuery_GetEntityAncestryByName(
  request: GetEntityAncestryByName,
  options?: UseQueryOptions<EntityAncestryResponse, unknown>,
) {
  const catalogApi = useApi(catalogApiRef);
  return useQuery<EntityAncestryResponse, unknown>({
    queryKey: queryKeys.getEntityAncestryByName(request),
    queryFn: async () => {
      return (await catalogApi.getEntityAncestryByName(request)).json();
    },
    ...options,
  });
}

/**
 * @public
 */
export function useMutation_GetEntityAncestryByName(
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof CatalogClient.prototype.getEntityAncestryByName>>,
    unknown,
    GetEntityAncestryByName
  >,
) {
  const catalogApi = useApi(catalogApiRef);
  return useMutation<
    Awaited<ReturnType<typeof CatalogClient.prototype.getEntityAncestryByName>>,
    unknown,
    GetEntityAncestryByName
  >({
    mutationFn: (data: GetEntityAncestryByName) => {
      return catalogApi.getEntityAncestryByName(data);
    },
    ...options,
  });
}

/**
 * @public
 */
export function useQuery_GetEntityByName(
  request: GetEntityByName,
  options?: UseQueryOptions<Entity, unknown>,
) {
  const catalogApi = useApi(catalogApiRef);
  return useQuery<Entity, unknown>({
    queryKey: queryKeys.getEntityByName(request),
    queryFn: async () => {
      return (await catalogApi.getEntityByName(request)).json();
    },
    ...options,
  });
}

/**
 * @public
 */
export function useMutation_GetEntityByName(
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof CatalogClient.prototype.getEntityByName>>,
    unknown,
    GetEntityByName
  >,
) {
  const catalogApi = useApi(catalogApiRef);
  return useMutation<
    Awaited<ReturnType<typeof CatalogClient.prototype.getEntityByName>>,
    unknown,
    GetEntityByName
  >({
    mutationFn: (data: GetEntityByName) => {
      return catalogApi.getEntityByName(data);
    },
    ...options,
  });
}

/**
 * @public
 */
export function useQuery_GetEntityByUid(
  request: GetEntityByUid,
  options?: UseQueryOptions<Entity, unknown>,
) {
  const catalogApi = useApi(catalogApiRef);
  return useQuery<Entity, unknown>({
    queryKey: queryKeys.getEntityByUid(request),
    queryFn: async () => {
      return (await catalogApi.getEntityByUid(request)).json();
    },
    ...options,
  });
}

/**
 * @public
 */
export function useMutation_GetEntityByUid(
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof CatalogClient.prototype.getEntityByUid>>,
    unknown,
    GetEntityByUid
  >,
) {
  const catalogApi = useApi(catalogApiRef);
  return useMutation<
    Awaited<ReturnType<typeof CatalogClient.prototype.getEntityByUid>>,
    unknown,
    GetEntityByUid
  >({
    mutationFn: (data: GetEntityByUid) => {
      return catalogApi.getEntityByUid(data);
    },
    ...options,
  });
}

/**
 * @public
 */
export function useQuery_GetEntityFacets(
  request: GetEntityFacets,
  options?: UseQueryOptions<EntityFacetsResponse, unknown>,
) {
  const catalogApi = useApi(catalogApiRef);
  return useQuery<EntityFacetsResponse, unknown>({
    queryKey: queryKeys.getEntityFacets(request),
    queryFn: async () => {
      return (await catalogApi.getEntityFacets(request)).json();
    },
    ...options,
  });
}

/**
 * @public
 */
export function useMutation_GetEntityFacets(
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof CatalogClient.prototype.getEntityFacets>>,
    unknown,
    GetEntityFacets
  >,
) {
  const catalogApi = useApi(catalogApiRef);
  return useMutation<
    Awaited<ReturnType<typeof CatalogClient.prototype.getEntityFacets>>,
    unknown,
    GetEntityFacets
  >({
    mutationFn: (data: GetEntityFacets) => {
      return catalogApi.getEntityFacets(data);
    },
    ...options,
  });
}

/**
 * @public
 */
export function useQuery_GetLocation(
  request: GetLocation,
  options?: UseQueryOptions<Location, unknown>,
) {
  const catalogApi = useApi(catalogApiRef);
  return useQuery<Location, unknown>({
    queryKey: queryKeys.getLocation(request),
    queryFn: async () => {
      return (await catalogApi.getLocation(request)).json();
    },
    ...options,
  });
}

/**
 * @public
 */
export function useMutation_GetLocation(
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof CatalogClient.prototype.getLocation>>,
    unknown,
    GetLocation
  >,
) {
  const catalogApi = useApi(catalogApiRef);
  return useMutation<
    Awaited<ReturnType<typeof CatalogClient.prototype.getLocation>>,
    unknown,
    GetLocation
  >({
    mutationFn: (data: GetLocation) => {
      return catalogApi.getLocation(data);
    },
    ...options,
  });
}

/**
 * @public
 */
export function useQuery_GetLocationByEntity(
  request: GetLocationByEntity,
  options?: UseQueryOptions<Location, unknown>,
) {
  const catalogApi = useApi(catalogApiRef);
  return useQuery<Location, unknown>({
    queryKey: queryKeys.getLocationByEntity(request),
    queryFn: async () => {
      return (await catalogApi.getLocationByEntity(request)).json();
    },
    ...options,
  });
}

/**
 * @public
 */
export function useMutation_GetLocationByEntity(
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof CatalogClient.prototype.getLocationByEntity>>,
    unknown,
    GetLocationByEntity
  >,
) {
  const catalogApi = useApi(catalogApiRef);
  return useMutation<
    Awaited<ReturnType<typeof CatalogClient.prototype.getLocationByEntity>>,
    unknown,
    GetLocationByEntity
  >({
    mutationFn: (data: GetLocationByEntity) => {
      return catalogApi.getLocationByEntity(data);
    },
    ...options,
  });
}

/**
 * @public
 */
export function useQuery_GetLocations(
  request: GetLocations,
  options?: UseQueryOptions<Array<GetLocations200ResponseInner>, unknown>,
) {
  const catalogApi = useApi(catalogApiRef);
  return useQuery<Array<GetLocations200ResponseInner>, unknown>({
    queryKey: queryKeys.getLocations(request),
    queryFn: async () => {
      return (await catalogApi.getLocations(request)).json();
    },
    ...options,
  });
}

/**
 * @public
 */
export function useMutation_GetLocations(
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof CatalogClient.prototype.getLocations>>,
    unknown,
    GetLocations
  >,
) {
  const catalogApi = useApi(catalogApiRef);
  return useMutation<
    Awaited<ReturnType<typeof CatalogClient.prototype.getLocations>>,
    unknown,
    GetLocations
  >({
    mutationFn: (data: GetLocations) => {
      return catalogApi.getLocations(data);
    },
    ...options,
  });
}

/**
 * @public
 */
export function useQuery_RefreshEntity(
  request: RefreshEntity,
  options?: UseQueryOptions<void, unknown>,
) {
  const catalogApi = useApi(catalogApiRef);
  return useQuery<void, unknown>({
    queryKey: queryKeys.refreshEntity(request),
    queryFn: async () => {
      return (await catalogApi.refreshEntity(request)).json();
    },
    ...options,
  });
}

/**
 * @public
 */
export function useMutation_RefreshEntity(
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof CatalogClient.prototype.refreshEntity>>,
    unknown,
    RefreshEntity
  >,
) {
  const catalogApi = useApi(catalogApiRef);
  return useMutation<
    Awaited<ReturnType<typeof CatalogClient.prototype.refreshEntity>>,
    unknown,
    RefreshEntity
  >({
    mutationFn: (data: RefreshEntity) => {
      return catalogApi.refreshEntity(data);
    },
    ...options,
  });
}

/**
 * @public
 */
export function useQuery_ValidateEntity(
  request: ValidateEntity,
  options?: UseQueryOptions<void, unknown>,
) {
  const catalogApi = useApi(catalogApiRef);
  return useQuery<void, unknown>({
    queryKey: queryKeys.validateEntity(request),
    queryFn: async () => {
      return (await catalogApi.validateEntity(request)).json();
    },
    ...options,
  });
}

/**
 * @public
 */
export function useMutation_ValidateEntity(
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof CatalogClient.prototype.validateEntity>>,
    unknown,
    ValidateEntity
  >,
) {
  const catalogApi = useApi(catalogApiRef);
  return useMutation<
    Awaited<ReturnType<typeof CatalogClient.prototype.validateEntity>>,
    unknown,
    ValidateEntity
  >({
    mutationFn: (data: ValidateEntity) => {
      return catalogApi.validateEntity(data);
    },
    ...options,
  });
}
