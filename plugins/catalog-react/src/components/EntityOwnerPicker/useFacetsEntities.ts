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
import useAsyncFn from 'react-use/lib/useAsyncFn';
import { catalogApiRef } from '../../api';
import { useState } from 'react';
import { Entity, parseEntityRef } from '@backstage/catalog-model';

type FacetsCursor = {
  start?: number;
  text: string;
};

type FacetsEntitiesResponse = {
  items: Entity[];
  cursor?: string;
};

export function useFacetsEntities({ enabled }: { enabled: boolean }) {
  const catalogApi = useApi(catalogApiRef);

  const [facetsPromise] = useState(() =>
    Promise.resolve().then(() => {
      if (!enabled) {
        return [];
      }
      const facet = 'relations.ownedBy';
      return catalogApi.getEntityFacets({ facets: [facet] }).then(response =>
        response.facets[facet]
          .map(e => e.value)
          .map<Entity>(ref => {
            const { kind, name, namespace } = parseEntityRef(ref);
            return {
              apiVersion: 'backstage.io/v1beta1',
              kind,
              metadata: { name, namespace },
            };
          })
          .sort(
            (a, b) =>
              (a.metadata.namespace || '').localeCompare(
                b.metadata.namespace || '',
                'en-US',
              ) ||
              a.metadata.name.localeCompare(b.metadata.name, 'en-US') ||
              a.kind.localeCompare(b.kind, 'en-US'),
          ),
      );
    }),
  );

  return useAsyncFn<
    (
      request: { text: string } | FacetsEntitiesResponse,
    ) => Promise<FacetsEntitiesResponse>
  >(
    async request => {
      const facets = await facetsPromise;

      if (!facets) {
        return {
          items: [],
        };
      }
      const initialRequest = request as { text: string };
      const cursorRequest = request as FacetsEntitiesResponse;

      const limit = 20;

      if (cursorRequest.cursor) {
        const { start, text } = JSON.parse(
          atob(cursorRequest.cursor),
        ) as FacetsCursor;
        const filteredRefs = facets.filter(e => filterEntity(text, e));
        if (start === undefined) {
          return request as FacetsEntitiesResponse;
        }
        const end = start + limit;

        return {
          items: filteredRefs.slice(0, end),
          cursor: btoa(
            JSON.stringify({
              text,
              ...(end < filteredRefs.length && { start: end }),
            }),
          ),
        };
      }

      return {
        items: facets
          .filter(e => filterEntity(initialRequest.text, e))
          .slice(0, limit),
        cursor: btoa(
          JSON.stringify({ text: initialRequest.text, start: limit }),
        ),
      };
    },
    [],
    { loading: true },
  );
}

function filterEntity(text: string, entity: Entity) {
  return (
    entity.kind.includes(text) ||
    entity.metadata.namespace?.includes(text) ||
    entity.metadata.name.includes(text)
  );
}
