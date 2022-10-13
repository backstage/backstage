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

import { useApi } from '@backstage/core-plugin-api';
import { compact } from 'lodash';
import useAsync from 'react-use/lib/useAsync';
import { catalogApiRef } from '../../api';
import { useEntityList } from '../../hooks';
import { reduceCatalogFilters } from '../../utils';

/**
 * TODO(vinzscam): we need to find a better way
 * for retrieving this value. One possible way, could be to use
 * the /entities endpoint: since this method is paginated,
 * it should also return how many items matching the provided filters
 *  are in the catalog
 */
export function useAllEntitiesCount() {
  const catalogApi = useApi(catalogApiRef);
  const { filters } = useEntityList();

  const { value: count, loading } = useAsync(async () => {
    const { user, ...allFilters } = filters;
    const compacted = compact(Object.values(allFilters));
    const filter = reduceCatalogFilters(compacted);

    const { totalItems } = (await catalogApi.getPaginatedEntities?.({
      filter,
      limit: 0,
    })) ?? { totalItems: 0 };

    return totalItems;
  }, [filters]);

  return { count, loading };
}
