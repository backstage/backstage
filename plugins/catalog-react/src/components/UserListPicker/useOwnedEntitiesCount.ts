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

import { QueryEntitiesInitialRequest } from '@backstage/catalog-client';
import { identityApiRef, useApi } from '@backstage/core-plugin-api';
import { compact, intersection, isEqual } from 'lodash';
import { useMemo, useRef } from 'react';
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

  const refRequest = useRef<QueryEntitiesInitialRequest>();
  useMemo(async () => {
    const compacted = compact(Object.values(filters));
    const allFilter = reduceCatalogFilters(compacted);

    const { ['metadata.name']: metadata, ...filter } = allFilter;

    const facet = 'relations.ownedBy';

    const ownedByFilter = Array.isArray(filter[facet])
      ? (filter[facet] as string[])
      : [];

    const commonOwnedBy = intersection(ownedByFilter, refs);

    const ownedBy = ownedByFilter.length > 0 ? ownedByFilter : refs;
    if (ownedByFilter.length > 0 && commonOwnedBy.length === 0) {
      // don't send any request if another filter sets
      // totally different values for relations.ownedBy filter.
      refRequest.current = undefined;
      return null;
    }
    const request: QueryEntitiesInitialRequest = {
      filter: {
        ...filter,
        'relations.ownedBy': ownedBy ?? [],
      },
      limit: 0,
    };

    if (isEqual(request, refRequest.current)) {
      return refRequest.current;
    }
    refRequest.current = request;

    return request;
  }, [filters, refs]);

  const { value: count, loading: loadingEntityOwnership } =
    useAsync(async () => {
      if (!refs?.length) {
        return 0;
      }
      if (!refRequest.current) {
        return 0;
      }
      const { totalItems } = await catalogApi.queryEntities(refRequest.current);

      return totalItems;
    }, [refRequest.current]);

  const loading = loadingEntityRefs || loadingEntityOwnership;
  const filter = useMemo(() => UserListFilter.owned(refs ?? []), [refs]);

  return {
    count,
    loading,
    filter,
  };
}
