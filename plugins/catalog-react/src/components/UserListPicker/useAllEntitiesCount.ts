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
import useAsync from 'react-use/esm/useAsync';
import { catalogApiRef } from '../../api';
import { useEntityList } from '../../hooks';
import { reduceCatalogFilters } from '../../utils/filters';

export function useAllEntitiesCount() {
  const catalogApi = useApi(catalogApiRef);
  const { filters } = useEntityList();

  const prevRequest = useRef<QueryEntitiesInitialRequest>();
  const request = useMemo(() => {
    const { user, ...allFilters } = filters;
    const compacted = compact(Object.values(allFilters));
    const catalogFilters = reduceCatalogFilters(compacted);
    const newRequest: QueryEntitiesInitialRequest = {
      ...catalogFilters,
      limit: 0,
    };

    if (Object.keys(catalogFilters.filter).length === 0) {
      prevRequest.current = undefined;
      return prevRequest.current;
    }

    if (isEqual(newRequest, prevRequest.current)) {
      return prevRequest.current;
    }
    prevRequest.current = newRequest;
    return newRequest;
  }, [filters]);

  const { value: count, loading } = useAsync(async () => {
    if (request === undefined) {
      return 0;
    }
    const { totalItems } = await catalogApi.queryEntities(request);

    return totalItems;
  }, [request]);

  return { count, loading };
}
