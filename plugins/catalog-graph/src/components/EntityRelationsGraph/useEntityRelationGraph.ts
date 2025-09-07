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
import { useApi } from '@backstage/core-plugin-api';
import { Entity } from '@backstage/catalog-model';
import { useMemo } from 'react';
import { pickBy } from 'lodash';
import { useEntityRelationGraphFromBackend } from './useEntityRelationGraphFromBackend';
import { useEntityRelationGraphFilter } from './useEntityRelationFilter';
import { catalogGraphApiRef } from '../../api';

/**
 * Discover the graph of entities connected by relations, starting from a set of
 * root entities. Filters are used to select which relations to includes.
 * Returns all discovered entities once they are loaded.
 */
export function useEntityRelationGraph({
  rootEntityRefs,
  filter: { maxDepth: userMaxDepth, relations, kinds, entityFilter } = {},
}: {
  rootEntityRefs: string[];
  filter?: {
    maxDepth?: number;
    relations?: string[];
    kinds?: string[];
    entityFilter?: (entity: Entity) => boolean;
  };
}): {
  entities: { [ref: string]: Entity };
  loading: boolean;
  error?: Error;
} {
  const { maxDepth: systemMaxDepth } = useApi(catalogGraphApiRef);

  const maxDepth = Math.max(
    1,
    Math.min(userMaxDepth ?? Number.POSITIVE_INFINITY, systemMaxDepth),
  );

  const backendEntities = useEntityRelationGraphFromBackend({
    rootEntityRefs,
    maxDepth,
    relations,
    kinds,
  });

  // The backendEntities can contain more entities than wanted, as it caches
  // results to avoid excessive re-fetching when the user is changing maxDepth
  // down (or back up again). So the filtering logic is applied here to ensure
  // the right entities are returned, and also to respect entityFilter if set.
  const filteredBackendEntities = useEntityRelationGraphFilter({
    rootEntityRefs,
    allEntities: backendEntities.entities,
    entityFilter,
    kinds,
    maxDepth,
    relations,
  });

  // As there might be no change to what entities are returned, the result is
  // memoized, to avoid unnecessary re-renders.
  const memoizedEntities = useMemo(
    () => filteredBackendEntities,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(Object.keys(filteredBackendEntities).sort())],
  );

  const filteredEntities = useMemo(() => {
    return entityFilter
      ? pickBy(memoizedEntities, (value, _key) => entityFilter(value))
      : memoizedEntities;
  }, [memoizedEntities, entityFilter]);

  return {
    entities: filteredEntities,
    loading: backendEntities.loading,
    error: backendEntities.error,
  };
}
