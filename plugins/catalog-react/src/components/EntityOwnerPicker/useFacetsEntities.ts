/*
 * Copyright 2023 The Backstage Authors
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
import useAsyncFn from 'react-use/esm/useAsyncFn';
import { catalogApiRef } from '../../api';
import { useState } from 'react';
import { Entity, parseEntityRef } from '@backstage/catalog-model';

type FacetsCursor = {
  start: number;
  text: string;
};

type FacetsEntitiesResponse = {
  items: Entity[];
  cursor?: string;
};

type FacetsInitialRequest = {
  text: string;
};

/**
 * This hook asynchronously loads the entity owners using the facets endpoint.
 * EntityOwnerPicker uses this hook when mode="owners-only" is passed as prop.
 * All the owners are kept internally in memory and rendered in batches once requested
 * by the frontend. The values returned by this hook are compatible with `useQueryEntities`
 * hook, which is also used by EntityOwnerPicker.
 * In this mode, the EntityOwnerPicker won't show detailed information of the owners.
 */
export function useFacetsEntities({ enabled }: { enabled: boolean }) {
  const catalogApi = useApi(catalogApiRef);

  const [facetsPromise] = useState(async () => {
    if (!enabled) {
      return [];
    }
    const facet = 'relations.ownedBy';

    return catalogApi
      .getEntityFacets({ facets: [facet] })
      .then(response =>
        response.facets[facet]
          .map(e => e.value)
          .map(ref => {
            const { kind, name, namespace } = parseEntityRef(ref);
            return {
              apiVersion: 'backstage.io/v1beta1',
              kind,
              metadata: { name, namespace },
            };
          })
          .sort(
            (a, b) =>
              a.kind.localeCompare(b.kind, 'en-US') ||
              a.metadata.namespace.localeCompare(
                b.metadata.namespace,
                'en-US',
              ) ||
              a.metadata.name.localeCompare(b.metadata.name, 'en-US'),
          ),
      )
      .catch(() => []);
  });

  return useAsyncFn<
    (
      request: FacetsInitialRequest | FacetsEntitiesResponse,
      options?: { limit?: number },
    ) => Promise<FacetsEntitiesResponse>
  >(
    async (request, options) => {
      const facets = await facetsPromise;

      if (!facets) {
        return {
          items: [],
        };
      }

      const limit = options?.limit ?? 20;

      const { text, start } = decodeCursor(request);
      const filteredRefs = facets.filter(e => filterEntity(text, e));
      const end = start + limit;
      return {
        items: filteredRefs.slice(0, end),
        ...encodeCursor({
          entities: filteredRefs,
          limit: end,
          payload: {
            text,
            start: end,
          },
        }),
      };
    },
    [facetsPromise],
    { loading: true, value: { items: [] } },
  );
}

function decodeCursor(
  request: FacetsInitialRequest | FacetsEntitiesResponse,
): FacetsCursor {
  if (isFacetsResponse(request) && request.cursor) {
    return JSON.parse(atob(request.cursor));
  }
  return {
    text: (request as FacetsInitialRequest).text || '',
    start: 0,
  };
}

function isFacetsResponse(
  request: FacetsInitialRequest | FacetsEntitiesResponse,
): request is FacetsEntitiesResponse {
  return !!(request as FacetsEntitiesResponse).cursor;
}

function encodeCursor({
  entities,
  limit,
  payload,
}: {
  entities: Entity[];
  limit: number;
  payload: { text: string; start: number };
}) {
  if (entities.length > limit) {
    return { cursor: btoa(JSON.stringify(payload)) };
  }
  return {};
}

function filterEntity(text: string, entity: Entity) {
  const normalizedText = text.trim();
  return (
    entity.kind.includes(normalizedText) ||
    entity.metadata.namespace?.includes(normalizedText) ||
    entity.metadata.name.includes(normalizedText)
  );
}
