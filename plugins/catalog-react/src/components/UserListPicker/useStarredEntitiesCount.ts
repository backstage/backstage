/*
 * Copyright 2022 The Backstage Authors
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

import { parseEntityRef, stringifyEntityRef } from '@backstage/catalog-model';
import { useApi } from '@backstage/core-plugin-api';
import { compact } from 'lodash';
import { useMemo } from 'react';
import useAsync from 'react-use/lib/useAsync';
import { catalogApiRef } from '../../api';
import { UserListFilter } from '../../filters';
import { useEntityList, useStarredEntities } from '../../hooks';
import { reduceCatalogFilters } from '../../utils';

export function useStarredEntitiesCount() {
  const catalogApi = useApi(catalogApiRef);
  const { filters } = useEntityList();
  const { starredEntities } = useStarredEntities();

  const { value: count, loading } = useAsync(async () => {
    if (!starredEntities.size) {
      return 0;
    }
    const { user, ...allFilters } = filters;
    const compacted = compact(Object.values(allFilters));
    const filter = reduceCatalogFilters(compacted);

    const facet = 'metadata.name';

    const response = (await catalogApi.getPaginatedEntities?.({
      filter: {
        ...filter,
        [facet]: Array.from(starredEntities).map(e => parseEntityRef(e).name),
      },
      limit: 1000,
    })) ?? { entities: [] };

    return response.entities
      .map(e =>
        stringifyEntityRef({
          kind: e.kind,
          namespace: e.metadata.namespace,
          name: e.metadata.name,
        }),
      )
      .filter(e => starredEntities.has(e)).length;
  }, [filters, starredEntities]);

  const filter = useMemo(
    () => UserListFilter.starred(Array.from(starredEntities)),
    [starredEntities],
  );

  return { count, loading, filter };
}
