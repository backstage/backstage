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
import React, { Dispatch, ReactNode, SetStateAction } from 'react';
import {
  getDefaultPageFilters,
  Maybe,
  PageFilters,
  ProductFilters,
  Group,
} from '../types';
import { FilterContext } from '../hooks/useFilters';
import { ConfigContext, ConfigContextProps } from '../hooks/useConfig';
import { CurrencyContext, CurrencyContextProps } from '../hooks/useCurrency';
import { ScrollContext, ScrollProviderProps } from '../hooks/useScroll';
import { MockProductFilters } from './mockData';

export const MockGroups: Group[] = [{ id: 'tech' }, { id: 'mock-group' }];

type MockFilterProviderProps = {
  setPageFilters: Dispatch<SetStateAction<Maybe<PageFilters>>>;
  setProductFilters: Dispatch<SetStateAction<Maybe<ProductFilters>>>;
  children: ReactNode;
};

export const MockFilterProvider = ({
  setPageFilters,
  setProductFilters,
  children,
}: MockFilterProviderProps) => {
  const pageFilters = getDefaultPageFilters(MockGroups);
  return (
    <FilterContext.Provider
      value={{
        pageFilters: pageFilters,
        productFilters: MockProductFilters,
        setPageFilters: setPageFilters,
        setProductFilters: setProductFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const MockConfigProvider = ({
  metrics,
  products,
  icons,
  engineerCost,
  currencies,
  children,
}: ConfigContextProps & { children: React.ReactNode }) => (
  <ConfigContext.Provider
    value={{ metrics, products, icons, engineerCost, currencies }}
  >
    {children}
  </ConfigContext.Provider>
);

export const MockCurrencyProvider = ({
  currency,
  setCurrency,
  children,
}: CurrencyContextProps & { children: React.ReactNode }) => (
  <CurrencyContext.Provider value={{ currency, setCurrency }}>
    {children}
  </CurrencyContext.Provider>
);

export const MockScrollProvider = ({ children }: ScrollProviderProps) => (
  <ScrollContext.Provider value={{ scrollTo: null, setScrollTo: jest.fn() }}>
    {children}
  </ScrollContext.Provider>
);
