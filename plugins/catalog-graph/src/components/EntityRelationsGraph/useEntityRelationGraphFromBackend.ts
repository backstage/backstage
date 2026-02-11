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

import { useCallback, useRef, useState } from 'react';

import jsonStableStringify from 'fast-json-stable-stringify';

import { errorApiRef, useApi } from '@backstage/core-plugin-api';
import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import { GraphQueryRequest } from '@backstage/plugin-catalog-graph-common';

import { useRelations } from '../../hooks';
import { catalogGraphApiRef } from '../../api';

export interface UseEntityRelationGraphFromBackendOptions {
  /**
   * Disable fetching of data.
   * If set to true, the hook will return an empty graph.
   */
  noFetch: boolean;
}

export interface UseBackendGraphResult {
  entities?: { [ref: string]: Entity };
  loading: boolean;
  error?: Error;
}

function getRequestSignature(request: GraphQueryRequest) {
  const requestCopy = JSON.parse(JSON.stringify(request));
  delete requestCopy.maxDepth;
  return jsonStableStringify(requestCopy);
}

export function useEntityRelationGraphFromBackend(
  query: GraphQueryRequest,
  { noFetch }: UseEntityRelationGraphFromBackendOptions,
): UseBackendGraphResult {
  const { relationsToInclude } = useRelations({ relations: query.relations });
  const catalogGraphApi = useApi(catalogGraphApiRef);
  const { maxDepth: systemMaxDepth } = catalogGraphApi;

  // maxDepth sent to the backend. For very small graphs, it's 1 above the query,
  // so that when maxDepth is increased in the UI, the data already there.
  const fetchMaxDepth = useCallback(
    (depth: number | undefined) => {
      if (typeof depth === 'undefined') {
        return undefined;
      }
      const inc = depth < 4 ? 1 : 0;
      return Math.min(systemMaxDepth, depth + inc);
    },
    [systemMaxDepth],
  );

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
    lastFetched?: {
      maxDepth: number | undefined;
      requestSignature: string;
    };
  }>({
    loading: true,
    entities: {},
  });

  const currentRequest: GraphQueryRequest = {
    rootEntityRefs: query.rootEntityRefs,
    maxDepth: fetchMaxDepth(query.maxDepth),
    relations: relationsToInclude,
    filter: query.filter,
    fields: query.fields,
  };

  const requestSignature = getRequestSignature(currentRequest);

  // Function to perform the graph query. It will only update the state if
  // <isActive> is still true, meaning the query hasn't changed while fetching.
  const queryGraph = useCallback(
    ({
      isActive,
      request,
    }: {
      isActive: () => boolean;
      request: GraphQueryRequest;
    }) => {
      const performQuery = async () => {
        try {
          const graph = await catalogGraphApi.fetchGraph(request);

          if (graph.cutoff && isActive()) {
            errorApi.post(
              new Error(
                `Graph was cut off after ${graph.entities.length} entities due to being too large`,
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
              lastFetched: {
                maxDepth: request.maxDepth,
                requestSignature: getRequestSignature(request),
              },
            };
            refresh({});
          }
        } catch (e) {
          if (isActive()) {
            entityStore.current = {
              loading: false,
              error: e instanceof Error ? e : new Error(`Unknown error: ${e}`),
              entities: entityStore.current.entities,
            };
            refresh({});
          }
        }
      };

      performQuery();
    },
    [catalogGraphApi, errorApi],
  );

  if (noFetch) {
    return { entities: undefined, loading: false };
  }

  if (
    (query.maxDepth ?? Number.POSITIVE_INFINITY) >
      (depthRef.current ?? Number.POSITIVE_INFINITY) ||
    queryRef.current !== requestSignature
  ) {
    // maxDepth has increased or the rest of the query has changed, so
    // re-fetching for more data.
    // Because of an async call, set loading to true. When the value has
    // settled, loading will be set to false.

    queryRef.current = requestSignature;
    depthRef.current = query.maxDepth;

    const { lastFetched } = entityStore.current;
    if (
      requestSignature !== lastFetched?.requestSignature ||
      (query.maxDepth ?? Number.POSITIVE_INFINITY) >
        (lastFetched?.maxDepth ?? Number.POSITIVE_INFINITY)
    ) {
      // Set loading if fetching a new graph, or the maxDepth is increasing.
      // Otherwise, the graph has already been fetched and will be reused.
      entityStore.current.loading = true;
    }

    ++callRef.current;
    const lastCall = callRef.current;
    queryGraph({
      isActive: () => lastCall === callRef.current,
      request: currentRequest,
    });
  }

  return entityStore.current;
}
