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

import useSWR, { Middleware } from 'swr';
import { useApi } from '@backstage/core-plugin-api';
import { catalogApiRef } from '../api';
import { useEntityList } from './useEntityListProvider';
import { useCallback, useEffect, useRef } from 'react';

export function useEntityFilter(facet: string) {
  const { filters, filterFacets } = useEntityList();

  useEffect(() => {
    const currentFacets = filterFacets.current;
    currentFacets.push(facet);

    return () => {
      const i = currentFacets.findIndex(e => e === facet);
      currentFacets.splice(i, 1);
    };
  }, [facet, filterFacets]);

  const catalogApi = useApi(catalogApiRef);

  const debouncedFilters = filters;

  const { data } = useSWR(
    debouncedFilters,
    async f => {
      if (filterFacets.current.length === 0) {
        return {};
      }
      return (
        await catalogApi.getEntityFacets({
          facets: filterFacets.current,
          filter: f.kind?.getCatalogFilters(),
        })
      ).facets;
    },
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    { focusThrottleInterval: 5000, revalidateOnFocus: false, use: [laggy] },
  );

  return data?.[facet];
}

// This is a SWR middleware for keeping the data even if key changes.
// https://swr.vercel.app/docs/middleware#keep-previous-result
const laggy: Middleware = useSWRNext => {
  return (key, fetcher, config) => {
    // Use a ref to store previous returned data.
    const laggyDataRef = useRef<{}>();

    // Actual SWR hook.
    const swr = useSWRNext(key, fetcher, config);

    useEffect(() => {
      // Update ref if data is not undefined.
      if (swr.data !== undefined) {
        laggyDataRef.current = swr.data;
      }
    }, [swr.data]);

    // Expose a method to clear the laggy data, if any.
    const resetLaggy = useCallback(() => {
      laggyDataRef.current = undefined;
    }, []);

    // Fallback to previous data if the current data is undefined.
    const dataOrLaggyData =
      swr.data === undefined ? laggyDataRef.current : swr.data;

    // Is it showing previous data?
    const isLagging =
      swr.data === undefined && laggyDataRef.current !== undefined;

    // Also add a `isLagging` field to SWR.
    return Object.assign({}, swr, {
      data: dataOrLaggyData,
      isLagging,
      resetLaggy,
    });
  };
};
