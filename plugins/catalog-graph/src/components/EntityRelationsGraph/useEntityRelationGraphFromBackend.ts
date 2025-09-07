/*
 * Copyright 2025 The Backstage Authors
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

import { useCallback, useMemo, useRef, useState } from 'react';

import {
  discoveryApiRef,
  errorApiRef,
  fetchApiRef,
  useApi,
} from '@backstage/core-plugin-api';
import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import {
  GraphQueryParams,
  GraphQueryResult,
} from '@backstage/plugin-catalog-graph-common';
import { useRelations } from '../../hooks';

export interface UseBackendGraphResult {
  entities: { [ref: string]: Entity };
  loading: boolean;
  error?: Error;
}

function makeQueryParams(query: GraphQueryParams) {
  const searchParams = new URLSearchParams();
  for (const rootEntityRef of query.rootEntityRefs) {
    searchParams.append('rootEntityRefs', rootEntityRef);
  }
  for (const relation of query.relations ?? []) {
    searchParams.append('relations', relation);
  }
  for (const kind of query.kinds ?? []) {
    searchParams.append('kinds', kind);
  }
  if (
    typeof query.maxDepth === 'number' &&
    query.maxDepth !== Number.POSITIVE_INFINITY
  ) {
    searchParams.append('maxDepth', query.maxDepth.toString(10));
  }
  return searchParams.toString();
}

export function useEntityRelationGraphFromBackend(
  query: GraphQueryParams,
): UseBackendGraphResult {
  const { relationsToInclude } = useRelations({ relations: query.relations });

  // Call counter to ensure we set the state only if the query hasn't been
  // changed. This is necessary if the query changes while we are waiting for
  // the fetch to complete. It limits re-renderings to only when the latest
  // fetch completes.
  const callRef = useRef<number>(0);
  // Keep track of the last query we sent, so that we can avoid re-fetching
  const queryRef = useRef<string | undefined>(undefined);
  // Keep track of the last maxDepth separately, as the fetch result can be
  // re-used, if the depth is decreased.
  const depthRef = useRef<number | undefined>(undefined);

  const discoveryApi = useApi(discoveryApiRef);
  const { fetch } = useApi(fetchApiRef);
  const errorApi = useApi(errorApiRef);

  // A dummy state, that is updated when the entityStore changes, and a ref to
  // store the state. This is done to avoid unnecessary re-renders of setState's
  // and to keep the old entities while fetching new (loading: true), which
  // allows for a smoother UI.
  const [_, refresh] = useState<{}>({});
  const entityStore = useRef<{
    loading: boolean;
    error?: Error;
    entities: { [ref: string]: Entity };
  }>({
    loading: true,
    entities: {},
  });

  const queryParamsWithoutDepth = useMemo(
    () =>
      makeQueryParams({
        rootEntityRefs: query.rootEntityRefs,
        kinds: query.kinds,
        relations: relationsToInclude,
      }),
    [query.rootEntityRefs, query.kinds, relationsToInclude],
  );
  const queryParams = useMemo(
    () =>
      makeQueryParams({
        rootEntityRefs: query.rootEntityRefs,
        kinds: query.kinds,
        maxDepth: query.maxDepth,
        relations: relationsToInclude,
      }),
    [query.rootEntityRefs, query.kinds, query.maxDepth, relationsToInclude],
  );

  // Function to perform the graph query. It will only update the state if
  // <isActive> is still true, meaning the query hasn't changed while fetching.
  const queryGraph = useCallback(
    ({ isActive, urlPath }: { isActive: () => boolean; urlPath: string }) => {
      const performQuery = async () => {
        try {
          const baseUrl = await discoveryApi.getBaseUrl('catalog-graph');

          const url = `${baseUrl}${urlPath}`;

          const resp = await fetch(url);
          const graph = (await resp.json()) as GraphQueryResult;

          if (typeof graph.cutoff === 'number' && isActive()) {
            errorApi.post(
              new Error(
                `Graph was cut off after ${graph.entities} entities due to being too large`,
              ),
            );
          }

          if (isActive()) {
            entityStore.current = {
              loading: false,
              error: undefined,
              entities: Object.fromEntries(
                graph.entities.map(entity => [
                  stringifyEntityRef(entity),
                  entity,
                ]),
              ),
            };
            refresh({});
          }
        } catch (e) {
          if (isActive()) {
            entityStore.current = {
              loading: false,
              error: e instanceof Error ? e : new Error(`Unknown error: {e}`),
              entities: entityStore.current.entities,
            };
            refresh({});
          }
        }
      };

      performQuery();
    },
    [discoveryApi, fetch, errorApi],
  );

  if (
    (query.maxDepth ?? Number.POSITIVE_INFINITY) >
      (depthRef.current ?? Number.POSITIVE_INFINITY) ||
    queryRef.current !== queryParamsWithoutDepth
  ) {
    // maxDepth has increased or the rest of the query has changed, so
    // re-fetching for more data.
    // Because of an async call, set loading to true. When the value has
    // settled, loading will be set to false.

    queryRef.current = queryParamsWithoutDepth;
    depthRef.current = query.maxDepth;
    entityStore.current.loading = true;

    ++callRef.current;
    const lastCall = callRef.current;
    queryGraph({
      isActive: () => lastCall === callRef.current,
      urlPath: `/graph?${queryParams}`,
    });
  }

  return entityStore.current;
}
