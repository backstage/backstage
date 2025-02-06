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

import { identityApiRef, useApi } from '@backstage/core-plugin-api';
import { compact, intersection } from 'lodash';
import { useMemo } from 'react';
import useAsync from 'react-use/esm/useAsync';
import { catalogApiRef } from '../../api';
import { EntityOwnerFilter, EntityUserFilter } from '../../filters';
import { useEntityList } from '../../hooks';
import { CatalogFilters, reduceCatalogFilters } from '../../utils/filters';
import useAsyncFn from 'react-use/esm/useAsyncFn';
import useDeepCompareEffect from 'react-use/esm/useDeepCompareEffect';

export function useOwnedEntitiesCount() {
  const identityApi = useApi(identityApiRef);
  const catalogApi = useApi(catalogApiRef);

  const { filters } = useEntityList();

  const { value: ownershipEntityRefs, loading: loadingEntityRefs } = useAsync(
    async () => (await identityApi.getBackstageIdentity()).ownershipEntityRefs,
    // load only on mount
    [],
  );

  const { user, owners, ...allFilters } = filters;
  const catalogFilters = reduceCatalogFilters(
    compact(Object.values(allFilters)),
  );

  const [{ value: count, loading: loadingEntityOwnership }, fetchEntities] =
    useAsyncFn(
      async (req: {
        ownershipEntityRefs: string[];
        owners: EntityOwnerFilter | undefined;
        filter: CatalogFilters;
      }) => {
        const ownedClaims = getOwnedCountClaims(
          req.owners,
          req.ownershipEntityRefs,
        );
        if (ownedClaims === undefined) {
          // this implicitly means that there aren't claims in common with
          // the logged in users, so avoid invoking the queryEntities endpoint
          // which will implicitly returns 0
          return 0;
        }

        const { ['metadata.name']: metadata, ...filter } = req.filter.filter;

        const { totalItems } = await catalogApi.queryEntities({
          ...req.filter,
          filter: {
            ...filter,
            'relations.ownedBy': ownedClaims,
          },
          limit: 0,
        });
        return totalItems;
      },
      [],
      { loading: true },
    );

  useDeepCompareEffect(() => {
    // context contains no filter, wait
    if (Object.keys(catalogFilters.filter).length === 0) {
      return;
    }
    // ownershipEntityRefs is loading, wait
    if (ownershipEntityRefs === undefined) {
      return;
    }
    fetchEntities({
      ownershipEntityRefs,
      owners,
      filter: catalogFilters,
    });
  }, [ownershipEntityRefs, owners, catalogFilters]);

  const loading = loadingEntityRefs || loadingEntityOwnership;

  return {
    count,
    loading,
    filter: useMemo(
      () => EntityUserFilter.owned(ownershipEntityRefs ?? []),
      [ownershipEntityRefs],
    ),
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
