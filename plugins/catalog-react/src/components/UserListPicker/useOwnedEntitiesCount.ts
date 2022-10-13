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

import { identityApiRef, useApi } from '@backstage/core-plugin-api';
import { compact, intersection } from 'lodash';
import { useMemo } from 'react';
import useAsync from 'react-use/lib/useAsync';
import { catalogApiRef } from '../../api';
import { UserListFilter } from '../../filters';
import { useEntityList } from '../../hooks';
import { reduceCatalogFilters } from '../../utils';

export function useOwnedEntitiesCount() {
  const identityApi = useApi(identityApiRef);
  const catalogApi = useApi(catalogApiRef);

  const { filters } = useEntityList();
  // Trigger load only on mount
  const { value: refs, loading: loadingEntityRefs } = useAsync(async () => {
    const { ownershipEntityRefs } = await identityApi.getBackstageIdentity();
    return ownershipEntityRefs;
  }, []);

  const {
    value: count,
    loading: loadingEntityOwnership,
    error,
  } = useAsync(async () => {
    if (!refs?.length) {
      return undefined;
    }
    const compacted = compact(Object.values(filters));
    const filter = reduceCatalogFilters(compacted);
    const facet = 'relations.ownedBy';

    const ownedByFilter = Array.isArray(filter[facet])
      ? (filter[facet] as string[])
      : [];

    const commonOwnedBy = intersection(ownedByFilter, refs);

    if (ownedByFilter.length > 0 && commonOwnedBy.length === 0) {
      // don't send any request if another filter sets
      // totally different values for relations.ownedBy filter.
      return 0;
    }

    const ownedBy = ownedByFilter.length > 0 ? ownedByFilter : refs;
    const { totalItems } = (await catalogApi.getPaginatedEntities?.({
      filter: {
        ...filter,
        'relations.ownedBy': ownedBy,
      },
      limit: 0,
    })) ?? { totalItems: 0 };

    console.log('xxxx', totalItems);
    return totalItems;
  }, [filters, refs]);

  console.log('errore', error);
  const loading = loadingEntityRefs || loadingEntityOwnership;
  const filter = useMemo(() => UserListFilter.owned(refs ?? []), [refs]);

  return {
    count,
    loading,
    filter,
  };
}
