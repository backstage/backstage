/*
 * Copyright 2020 The Backstage Authors
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

import React, { PropsWithChildren } from 'react';
import {
  LoadingContext,
  LoadingContextProps,
  GroupsContext,
  GroupsContextProps,
  FilterContext,
  FilterContextProps,
  ConfigContext,
  ConfigContextProps,
  CurrencyContext,
  CurrencyContextProps,
  BillingDateContext,
  BillingDateContextProps,
  ScrollContext,
  ScrollContextProps,
} from '../hooks';
import { Duration, EngineerThreshold } from '../types';
import { createCurrencyFormat } from '../utils/currency';

export type MockFilterProviderProps = PropsWithChildren<
  Partial<FilterContextProps>
>;

export const MockFilterProvider = ({
  children,
  ...context
}: MockFilterProviderProps) => {
  const defaultContext: FilterContextProps = {
    pageFilters: {
      group: 'tech',
      project: null,
      duration: Duration.P90D,
      metric: null,
    },
    productFilters: [],
    setPageFilters: jest.fn(),
    setProductFilters: jest.fn(),
  };
  return (
    <FilterContext.Provider value={{ ...defaultContext, ...context }}>
      {children}
    </FilterContext.Provider>
  );
};

export type MockLoadingProviderProps = PropsWithChildren<
  Partial<LoadingContextProps>
>;

export const MockLoadingProvider = ({
  children,
  ...context
}: MockLoadingProviderProps) => {
  const defaultContext: LoadingContextProps = {
    state: {},
    actions: [],
    dispatch: jest.fn(),
  };
  return (
    <LoadingContext.Provider value={{ ...defaultContext, ...context }}>
      {children}
    </LoadingContext.Provider>
  );
};

/** @public */
export type MockConfigProviderProps = PropsWithChildren<
  Partial<ConfigContextProps>
>;

/** @public */
export const MockConfigProvider = (props: MockConfigProviderProps) => {
  const { children, ...context } = props;

  const defaultContext: ConfigContextProps = {
    baseCurrency: createCurrencyFormat(),
    metrics: [],
    products: [],
    icons: [],
    engineerCost: 0,
    engineerThreshold: EngineerThreshold,
    currencies: [],
  };

  return (
    <ConfigContext.Provider value={{ ...defaultContext, ...context }}>
      {children}
    </ConfigContext.Provider>
  );
};

/** @public */
export type MockCurrencyProviderProps = PropsWithChildren<
  Partial<CurrencyContextProps>
>;

/** @public */
export const MockCurrencyProvider = (props: MockCurrencyProviderProps) => {
  const { children, ...context } = props;

  const defaultContext: CurrencyContextProps = {
    currency: {
      kind: null,
      label: 'Engineers 🛠',
      unit: 'engineer',
    },
    setCurrency: jest.fn(),
  };

  return (
    <CurrencyContext.Provider value={{ ...defaultContext, ...context }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export type MockBillingDateProviderProps = PropsWithChildren<
  Partial<BillingDateContextProps>
>;

export const MockBillingDateProvider = ({
  children,
  ...context
}: MockBillingDateProviderProps) => {
  const defaultContext: BillingDateContextProps = {
    lastCompleteBillingDate: '2020-10-01',
  };
  return (
    <BillingDateContext.Provider value={{ ...defaultContext, ...context }}>
      {children}
    </BillingDateContext.Provider>
  );
};

export type MockScrollProviderProps = PropsWithChildren<{}>;

export const MockScrollProvider = ({ children }: MockScrollProviderProps) => {
  const defaultContext: ScrollContextProps = {
    scroll: null,
    setScroll: jest.fn(),
  };
  return (
    <ScrollContext.Provider value={defaultContext}>
      {children}
    </ScrollContext.Provider>
  );
};

export type MockGroupsProviderProps = PropsWithChildren<
  Partial<GroupsContextProps>
>;

export const MockGroupsProvider = ({
  children,
  ...context
}: MockGroupsProviderProps) => {
  const defaultContext: GroupsContextProps = {
    groups: [],
  };
  return (
    <GroupsContext.Provider value={{ ...defaultContext, ...context }}>
      {children}
    </GroupsContext.Provider>
  );
};
