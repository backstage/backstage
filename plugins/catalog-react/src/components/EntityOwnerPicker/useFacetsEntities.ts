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
import { useApi, useApiHolder } from '@backstage/core-plugin-api';
import useAsyncFn from 'react-use/esm/useAsyncFn';
import { catalogApiRef } from '../../api';
import { useState } from 'react';
import {
  Entity,
  parseEntityRef,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import type { EntityPresentationApi } from '../../apis';
import {
  entityPresentationApiRef,
  defaultEntityPresentation,
} from '../../apis';

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
  const apis = useApiHolder();
  const entityPresentationApi = apis.get(entityPresentationApiRef);

  const [facetsPromise] = useState(async () => {
    if (!enabled) {
      return [];
    }
    const facet = 'relations.ownedBy';

    return catalogApi
      .getEntityFacets({ facets: [facet] })
      .then(async response => {
        const buckets = response.facets[facet] ?? [];
        if (!buckets.length) {
          return [] as Entity[];
        }
        const entityRefs = buckets
          .map(e => e.value)
          .map(ref => {
            const { kind, name, namespace } = parseEntityRef(ref);
            return {
              apiVersion: 'backstage.io/v1beta1',
              kind,
              metadata: { name, namespace },
            } as Entity;
          });

        return await sortEntitiesByPresentation(
          entityRefs,
          entityPresentationApi,
        );
      })
      .then(entities => entities)
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

async function sortEntitiesByPresentation(
  entities: Entity[],
  presentationApi?: EntityPresentationApi,
): Promise<Entity[]> {
  const keys = await Promise.all(
    entities.map(async e => {
      const namespaceKey = e.metadata.namespace || '';
      const entityRef = stringifyEntityRef(e);
      const snapshot = presentationApi
        ? await presentationApi
            .forEntity(entityRef)
            .promise.catch(() => defaultEntityPresentation(e))
        : defaultEntityPresentation(e);
      const titleKey = snapshot.primaryTitle;

      const kindKey = e.kind;
      return { e, namespaceKey, titleKey, kindKey };
    }),
  );

  keys.sort(
    (a, b) =>
      a.namespaceKey.localeCompare(b.namespaceKey, 'en-US') ||
      a.titleKey.localeCompare(b.titleKey, 'en-US') ||
      a.kindKey.localeCompare(b.kindKey, 'en-US'),
  );

  return keys.map(k => k.e);
}
