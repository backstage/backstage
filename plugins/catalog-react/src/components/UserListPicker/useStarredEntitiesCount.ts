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

import { QueryEntitiesInitialRequest } from '@backstage/catalog-client';
import { parseEntityRef, stringifyEntityRef } from '@backstage/catalog-model';
import { useApi } from '@backstage/core-plugin-api';
import { compact, isEqual } from 'lodash';
import { useMemo, useRef } from 'react';
import useAsync from 'react-use/esm/useAsync';
import { catalogApiRef } from '../../api';
import { EntityUserFilter } from '../../filters';
import { useEntityList, useStarredEntities } from '../../hooks';
import { reduceCatalogFilters } from '../../utils/filters';

export function useStarredEntitiesCount() {
  const catalogApi = useApi(catalogApiRef);
  const { filters } = useEntityList();
  const { starredEntities } = useStarredEntities();

  const prevRequest = useRef<QueryEntitiesInitialRequest>();
  const request = useMemo(() => {
    const { user, ...allFilters } = filters;
    const compacted = compact(Object.values(allFilters));
    const catalogFilters = reduceCatalogFilters(compacted);

    const facet = 'metadata.name';

    const newRequest: QueryEntitiesInitialRequest = {
      ...catalogFilters,
      filter: {
        ...catalogFilters.filter,
        /**
         * here we are filtering entities by `name`. Given this filter,
         * the response might contain more entities than expected, in case multiple entities
         * of different kind or namespace share the same name. Those extra entities are filtered out
         * client side by `EntityUserFilter`, so they won't be visible to the user.
         */
        [facet]: Array.from(starredEntities).map(e => parseEntityRef(e).name),
      },
      /**
       * limit is set to a high value as we are not expecting many starred entities
       */
      limit: 1000,
    };
    if (isEqual(newRequest, prevRequest.current)) {
      return prevRequest.current;
    }
    prevRequest.current = newRequest;

    return newRequest;
  }, [filters, starredEntities]);

  const { value: count, loading } = useAsync(async () => {
    if (!starredEntities.size) {
      return 0;
    }

    /**
     * given a list of starred entity refs and some filters coming from CatalogPage,
     * it reduces the list of starred entities, to a list of entities that matches the
     * provided filters. It won't be possible to getEntitiesByRefs
     * as the method doesn't accept any filter.
     */
    const response = await catalogApi.queryEntities(request);

    return response.items
      .map(e =>
        stringifyEntityRef({
          kind: e.kind,
          namespace: e.metadata.namespace,
          name: e.metadata.name,
        }),
      )
      .filter(e => starredEntities.has(e)).length;
  }, [request, starredEntities]);

  const filter = useMemo(
    () => EntityUserFilter.starred(Array.from(starredEntities)),
    [starredEntities],
  );

  return { count, loading, filter };
}
