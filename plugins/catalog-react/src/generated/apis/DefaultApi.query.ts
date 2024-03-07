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
} from '@backstage/catalog-client/alpha';
import { CatalogClient } from '@backstage/catalog-client/alpha';
import { useQuery } from '@tanstack/react-query';
import {
  createApiFactory,
  createApiRef,
  discoveryApiRef,
  fetchApiRef,
  useApi,
} from '@backstage/core-plugin-api';

export const catalogApiRef = createApiRef<CatalogClient>({
  id: 'core.catalog',
});

export const defaultCatalogApi = createApiFactory({
  api: catalogApiRef,
  deps: {
    discoveryApi: discoveryApiRef,
    fetchApi: fetchApiRef,
  },
  factory: ({ discoveryApi, fetchApi }) =>
    new CatalogClient({ discoveryApi, fetchApi }),
});

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

export function useAnalyzeLocation(request: AnalyzeLocation) {
  const catalogApi = useApi(catalogApiRef);
  return useQuery(queryKeys.analyzeLocation(request), () => {
    return catalogApi.analyzeLocation(request);
  });
}

export function useCreateLocation(request: CreateLocation) {
  const catalogApi = useApi(catalogApiRef);
  return useQuery(queryKeys.createLocation(request), () => {
    return catalogApi.createLocation(request);
  });
}

export function useDeleteEntityByUid(request: DeleteEntityByUid) {
  const catalogApi = useApi(catalogApiRef);
  return useQuery(queryKeys.deleteEntityByUid(request), () => {
    return catalogApi.deleteEntityByUid(request);
  });
}

export function useDeleteLocation(request: DeleteLocation) {
  const catalogApi = useApi(catalogApiRef);
  return useQuery(queryKeys.deleteLocation(request), () => {
    return catalogApi.deleteLocation(request);
  });
}

export function useGetEntities(request: GetEntities) {
  const catalogApi = useApi(catalogApiRef);
  return useQuery(queryKeys.getEntities(request), () => {
    return catalogApi.getEntities(request);
  });
}

export function useGetEntitiesByQuery(request: GetEntitiesByQuery) {
  const catalogApi = useApi(catalogApiRef);
  return useQuery(queryKeys.getEntitiesByQuery(request), () => {
    return catalogApi.getEntitiesByQuery(request);
  });
}

export function useGetEntitiesByRefs(request: GetEntitiesByRefs) {
  const catalogApi = useApi(catalogApiRef);
  return useQuery(queryKeys.getEntitiesByRefs(request), () => {
    return catalogApi.getEntitiesByRefs(request);
  });
}

export function useGetEntityAncestryByName(request: GetEntityAncestryByName) {
  const catalogApi = useApi(catalogApiRef);
  return useQuery(queryKeys.getEntityAncestryByName(request), () => {
    return catalogApi.getEntityAncestryByName(request);
  });
}

export function useGetEntityByName(request: GetEntityByName) {
  const catalogApi = useApi(catalogApiRef);
  return useQuery(queryKeys.getEntityByName(request), () => {
    return catalogApi.getEntityByName(request);
  });
}

export function useGetEntityByUid(request: GetEntityByUid) {
  const catalogApi = useApi(catalogApiRef);
  return useQuery(queryKeys.getEntityByUid(request), () => {
    return catalogApi.getEntityByUid(request);
  });
}

export function useGetEntityFacets(request: GetEntityFacets) {
  const catalogApi = useApi(catalogApiRef);
  return useQuery(queryKeys.getEntityFacets(request), () => {
    return catalogApi.getEntityFacets(request);
  });
}

export function useGetLocation(request: GetLocation) {
  const catalogApi = useApi(catalogApiRef);
  return useQuery(queryKeys.getLocation(request), () => {
    return catalogApi.getLocation(request);
  });
}

export function useGetLocationByEntity(request: GetLocationByEntity) {
  const catalogApi = useApi(catalogApiRef);
  return useQuery(queryKeys.getLocationByEntity(request), () => {
    return catalogApi.getLocationByEntity(request);
  });
}

export function useGetLocations(request: GetLocations) {
  const catalogApi = useApi(catalogApiRef);
  return useQuery(queryKeys.getLocations(request), () => {
    return catalogApi.getLocations(request);
  });
}

export function useRefreshEntity(request: RefreshEntity) {
  const catalogApi = useApi(catalogApiRef);
  return useQuery(queryKeys.refreshEntity(request), () => {
    return catalogApi.refreshEntity(request);
  });
}

export function useValidateEntity(request: ValidateEntity) {
  const catalogApi = useApi(catalogApiRef);
  return useQuery(queryKeys.validateEntity(request), () => {
    return catalogApi.validateEntity(request);
  });
}
