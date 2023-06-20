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
import { EntityOwnerFilter, EntityUserListFilter } from '../../filters';
import { useEntityList } from '../../hooks';
import { reduceCatalogFilters } from '../../utils';

export function useOwnedEntitiesCount() {
  const identityApi = useApi(identityApiRef);
  const catalogApi = useApi(catalogApiRef);

  const { filters } = useEntityList();

  const { value: ownershipEntityRefs, loading: loadingEntityRefs } = useAsync(
    async () => (await identityApi.getBackstageIdentity()).ownershipEntityRefs,
    // load only on mount
    [],
  );

  const prevRequest = useRef<QueryEntitiesInitialRequest>();

  const request = useMemo(() => {
    const { user, owners, ...allFilters } = filters;
    const compacted = compact(Object.values(allFilters));
    const allFilter = reduceCatalogFilters(compacted);
    const { ['metadata.name']: metadata, ...filter } = allFilter;

    const countFilter = getOwnedCountClaims(owners, ownershipEntityRefs);

    if (
      ownershipEntityRefs?.length === 0 ||
      countFilter === undefined ||
      Object.keys(filter).length === 0
    ) {
      prevRequest.current = undefined;
      return undefined;
    }
    const newRequest: QueryEntitiesInitialRequest = {
      filter: {
        ...filter,
        'relations.ownedBy': countFilter,
      },
      limit: 0,
    };

    if (isEqual(newRequest, prevRequest.current)) {
      return prevRequest.current;
    }

    prevRequest.current = newRequest;

    return newRequest;
  }, [filters, ownershipEntityRefs]);

  const { value: count, loading: loadingEntityOwnership } =
    useAsync(async () => {
      if (!request) {
        return 0;
      }
      const { totalItems } = await catalogApi.queryEntities(request);
      return totalItems;
    }, [request]);

  const loading = loadingEntityRefs || loadingEntityOwnership;
  const filter = useMemo(
    () => EntityUserListFilter.owned(ownershipEntityRefs ?? []),
    [ownershipEntityRefs],
  );

  return {
    count,
    loading,
    filter,
    ownershipEntityRefs,
  };
}

function getOwnedCountClaims(
  owners: EntityOwnerFilter | undefined,
  ownershipEntityRefs: string[] | undefined,
) {
  if (ownershipEntityRefs === undefined) {
    return undefined;
  }
  const ownersRefs = owners?.values ?? [];
  if (ownersRefs.length) {
    const commonOwnedBy = intersection(ownersRefs, ownershipEntityRefs);
    if (commonOwnedBy.length === 0) {
      return undefined;
    }
    return commonOwnedBy;
  }
  return ownershipEntityRefs;
}
