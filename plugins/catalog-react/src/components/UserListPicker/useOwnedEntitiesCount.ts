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
import { identityApiRef, useApi } from '@backstage/core-plugin-api';
import { compact, intersection, isEqual } from 'lodash';
import { useMemo, useRef } from 'react';
import useAsync from 'react-use/lib/useAsync';
import { catalogApiRef } from '../../api';
import { UserOwnersFilter } from '../../filters';
import { useEntityList } from '../../hooks';
import { reduceCatalogFilters } from '../../utils';

export function useOwnedEntitiesCount() {
  const identityApi = useApi(identityApiRef);
  const catalogApi = useApi(catalogApiRef);

  const { filters } = useEntityList();
  // Trigger load only on mount
  const { value: ownershipEntityRefs, loading: loadingEntityRefs } = useAsync(
    async () => (await identityApi.getBackstageIdentity()).ownershipEntityRefs,

    [],
  );

  const refRequest = useRef<QueryEntitiesInitialRequest>();

  useMemo(async () => {
    const compacted = compact(Object.values(filters));
    const allFilter = reduceCatalogFilters(compacted);
    const { ['metadata.name']: metadata, ...filter } = allFilter;

    const facet = 'relations.ownedBy';

    const ownedByFilter = Array.isArray(filter[facet])
      ? (filter[facet] as string[])
      : [];

    const commonOwnedBy = intersection(ownedByFilter, ownershipEntityRefs);

    const ownedBy =
      ownedByFilter.length > 0 ? ownedByFilter : ownershipEntityRefs;
    if (ownedByFilter.length > 0 && commonOwnedBy.length === 0) {
      // don't send any request if another filter sets
      // totally different values for relations.ownedBy filter.
      // TODO(vinzscam): check conflicts between UserOwnersFilter and EntityOwnerFilter.
      // both set filters on the same relations.ownedBy key, so the conflicts need
      // to be addressed properly.
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
  }, [filters, ownershipEntityRefs]);

  const { value: count, loading: loadingEntityOwnership } =
    useAsync(async () => {
      if (!ownershipEntityRefs?.length) {
        return 0;
      }
      if (!refRequest.current) {
        return 0;
      }
      const { totalItems } = await catalogApi.queryEntities(refRequest.current);

      return totalItems;
    }, [refRequest.current]);

  const loading = loadingEntityRefs || loadingEntityOwnership;
  const filter = useMemo(
    () => UserOwnersFilter.owned(ownershipEntityRefs ?? []),
    [ownershipEntityRefs],
  );

  return {
    count,
    loading,
    filter,
    ownershipEntityRefs,
  };
}
