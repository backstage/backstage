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
import { ProfileInfo, useApi } from '@backstage/core-plugin-api';
import useAsyncFn from 'react-use/esm/useAsyncFn';
import { catalogApiRef } from '../../api';
import { useState } from 'react';
import { Entity } from '@backstage/catalog-model';

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

  const [getEntitiesPromise] = useState(async () => {
    if (!enabled) {
      return [];
    }
    const facet = 'relations.ownedBy';

    try {
      const entityRefs = await catalogApi
        .getEntityFacets({ facets: [facet] })
        .then(response => response.facets[facet].map(e => e.value));

      const catalogResponse = await catalogApi.getEntitiesByRefs({
        entityRefs: entityRefs,
        fields: [
          'metadata.name',
          'metadata.namespace',
          'metadata.title',
          'kind',
          'spec.profile.displayName',
        ],
      });

      const ownerEntities = catalogResponse.items.filter(entity => !!entity);

      return ownerEntities.sort(
        (a, b) =>
          entityRefs.indexOf(a.metadata.name) -
          entityRefs.indexOf(b.metadata.name),
      );
    } catch {
      return [];
    }
  });

  return useAsyncFn<
    (
      request: FacetsInitialRequest | FacetsEntitiesResponse,
      options?: { limit?: number },
    ) => Promise<FacetsEntitiesResponse>
  >(
    async (request, options) => {
      const entities = await getEntitiesPromise;
      if (!entities) {
        return {
          items: [],
        };
      }

      const limit = options?.limit ?? 20;
      const { text, start } = decodeCursor(request);
      const filteredEntities = entities.filter(e => filterEntity(text, e));
      const end = start + limit;

      return {
        items: filteredEntities.slice(0, end),
        ...encodeCursor({
          entities: filteredEntities,
          limit: end,
          payload: {
            text,
            start: end,
          },
        }),
      };
    },
    [getEntitiesPromise],
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
  const normalizedText = text.trim().toLocaleLowerCase();

  const profile: ProfileInfo | undefined =
    (entity.spec?.profile as ProfileInfo) ?? undefined;
  const displayName = profile?.displayName?.toLocaleLowerCase() ?? '';

  return (
    entity.kind.toLocaleLowerCase().includes(normalizedText) ||
    entity.metadata.namespace?.toLocaleLowerCase().includes(normalizedText) ||
    entity.metadata.name.toLocaleLowerCase().includes(normalizedText) ||
    entity.metadata.title?.toLocaleLowerCase().includes(normalizedText) ||
    displayName.includes(normalizedText)
  );
}
