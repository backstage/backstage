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
import { useApi } from '@backstage/core-plugin-api';
import { compact, isEqual } from 'lodash';
import { useMemo, useRef } from 'react';
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

  const refRequest = useRef<QueryEntitiesInitialRequest>();
  useMemo(() => {
    const { user, ...allFilters } = filters;
    const compacted = compact(Object.values(allFilters));
    const filter = reduceCatalogFilters(compacted);
    const request: QueryEntitiesInitialRequest = {
      filter,
      limit: 0,
    };

    if (isEqual(request, refRequest.current)) {
      return refRequest.current;
    }
    refRequest.current = request;

    return request;
  }, [filters]);

  const { value: count, loading } = useAsync(async () => {
    const { totalItems } = await catalogApi.queryEntities(refRequest.current);

    return totalItems;
  }, [refRequest.current]);

  return { count, loading };
}
