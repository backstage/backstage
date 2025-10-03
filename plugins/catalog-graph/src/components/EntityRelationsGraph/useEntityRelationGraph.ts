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
import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import { useMemo } from 'react';
import { pickBy } from 'lodash';
import { useEntityRelationGraphFromBackend } from './useEntityRelationGraphFromBackend';
import { useEntityRelationGraphFromFrontend } from './useEntityRelationGraphFromFrontend';
import { useEntityRelationGraphFilter } from './useEntityRelationFilter';
import { catalogGraphApiRef } from '../../api';
import { useFetchMethod } from './useFetchMethod';

/**
 * Discover the graph of entities connected by relations, starting from a set of
 * root entities. Filters are used to select which relations to includes.
 * Returns all discovered entities once they are loaded.
 */
export function useEntityRelationGraph({
  rootEntityRefs,
  filter: { maxDepth: userMaxDepth, relations, kinds, entityFilter } = {},
  entitySet,
}: {
  rootEntityRefs: string[];
  filter?: {
    maxDepth?: number;
    relations?: string[];
    kinds?: string[];
    entityFilter?: (entity: Entity) => boolean;
  };
  entitySet?: Entity[];
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

  const fetchMethod = useFetchMethod(!!entitySet);

  const backendEntities = useEntityRelationGraphFromBackend(
    {
      rootEntityRefs,
      maxDepth,
      relations,
      kinds,
    },
    { noFetch: fetchMethod !== 'backend' },
  );
  const frontendEntities = useEntityRelationGraphFromFrontend(
    {
      rootEntityRefs,
      maxDepth,
      relations,
      kinds,
    },
    { noFetch: fetchMethod !== 'frontend' },
  );
  const asyncEntities =
    fetchMethod === 'backend' ? backendEntities : frontendEntities;

  const fetchedEntities = useMemo(() => {
    if (entitySet) {
      return Object.fromEntries(entitySet.map(e => [stringifyEntityRef(e), e]));
    } else if (fetchMethod === 'frontend' || fetchMethod === 'backend') {
      return asyncEntities.entities;
    }
    return undefined;
  }, [entitySet, fetchMethod, asyncEntities.entities]);

  // The backendEntities can contain more entities than wanted, as it caches
  // results to avoid excessive re-fetching when the user is changing maxDepth
  // down (or back up again). So the filtering logic is applied here to:
  //  * Ensure only entities are returned when reusing a larger cache
  //  * Respect entityFilter (if provided)
  //  * Perform graph filtering when the set of entities is provided by the user
  const filteredAsyncEntities = useEntityRelationGraphFilter({
    rootEntityRefs,
    allEntities: fetchedEntities,
    entityFilter,
    kinds,
    maxDepth,
    relations,
  });

  // As there might be no change to what entities are returned, the result is
  // memoized, to avoid unnecessary re-renders.
  const memoizedEntities = useMemo(
    () => filteredAsyncEntities,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(Object.keys(filteredAsyncEntities).sort())],
  );

  const filteredEntities = useMemo(() => {
    return entityFilter
      ? pickBy(memoizedEntities, (value, _key) => entityFilter(value))
      : memoizedEntities;
  }, [memoizedEntities, entityFilter]);

  return {
    entities: filteredEntities,
    loading: fetchMethod === 'pending' ? true : asyncEntities.loading,
    error: asyncEntities.error,
  };
}
