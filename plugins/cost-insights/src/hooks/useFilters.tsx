/*
 * Copyright 2020 Spotify AB
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

import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  getDefaultPageFilters,
  PageFilters,
  ProductFilters,
  Duration,
  Group,
} from '../types';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQueryParams } from './useQueryParams';
import { stringify } from '../utils/history';
import { useGroups } from './useGroups';
import { useConfig } from './useConfig';

const getInitialPageState = (
  groups: Group[],
  queryParams?: Partial<PageFilters>,
) => {
  // The group is written initially to queryParams as null, since user groups are asynchronously
  // loaded. We preserve nulls in queryParams for other parameters where null is meaningful; for
  // group, avoid overwriting the default with null after groups are loaded.
  const { group, ...otherParams } = queryParams || {};
  return {
    ...getDefaultPageFilters(groups),
    ...otherParams,
    ...(group ? { group: group } : {}),
  };
};

export type FilterContextProps = {
  pageFilters: PageFilters;
  productFilters: ProductFilters;
  setPageFilters: Dispatch<SetStateAction<PageFilters>>;
  setProductFilters: Dispatch<SetStateAction<ProductFilters>>;
};

export type MapFiltersToProps<T> = (props: FilterContextProps) => T;

export type FilterProviderProps = {
  children: ReactNode;
};

export const FilterContext = React.createContext<
  FilterContextProps | undefined
>(undefined);

export const FilterProvider = ({ children }: FilterProviderProps) => {
  const config = useConfig();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = useQueryParams();
  const qsRef = useRef('');
  const groups = useGroups();

  const defaultProductFilters = config.products.map(product => ({
    productType: product.kind,
    duration: Duration.P1M,
  }));

  const getInitialProductState = (productFilters?: ProductFilters) => {
    if (!productFilters) return defaultProductFilters;
    return defaultProductFilters.map(product => {
      return (
        productFilters.find(
          param => param.productType === product.productType,
        ) || product
      );
    });
  };

  const [productFilters, setProductFilters] = useState(
    getInitialProductState(queryParams.productFilters),
  );
  const [pageFilters, setPageFilters] = useState(
    getInitialPageState(groups, queryParams.pageFilters),
  );

  // TODO: Figure out why pageFilters doesn't get updated by the above when groups are loaded.
  useEffect(() => {
    const initialState = getInitialPageState(groups, queryParams.pageFilters);
    const defaultMetric = config.metrics.find(m => m.default);
    setPageFilters({ ...initialState, metric: defaultMetric?.kind ?? null });
  }, [groups]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const queryString = stringify({ ...pageFilters, products: productFilters });
    if (queryString === qsRef.current) return;
    qsRef.current = queryString;
    // TODO Remove workaround once issue is resolved in react-router
    // (https://github.com/ReactTraining/react-router/issues/7496)
    // navigate({ ...location, search: queryString });
    navigate({ ...location, search: `?${queryString}` });
  }, [pageFilters, productFilters]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <FilterContext.Provider
      value={{
        pageFilters: pageFilters,
        productFilters: productFilters,
        setPageFilters: setPageFilters,
        setProductFilters: setProductFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export function useFilters<T>(mapFiltersToProps: MapFiltersToProps<T>): T {
  const context = useContext(FilterContext);

  if (!context) {
    assertNever();
  }

  return mapFiltersToProps({
    pageFilters: context.pageFilters,
    productFilters: context.productFilters,
    setPageFilters: context.setPageFilters,
    setProductFilters: context.setProductFilters,
  });
}

function assertNever(): never {
  throw Error('Cannot use useFilters outside of FilterProvider');
}
