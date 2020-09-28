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

import React from 'react';
import ProductInsightsCard from './ProductInsightsCard';
import {
  MockComputeEngine,
  createMockEntity,
  mockDefaultState,
  createMockProductCost,
} from '../../utils/mockData';
import {
  IdentityApi,
  ApiRegistry,
  identityApiRef,
  ApiProvider,
} from '@backstage/core';
import { costInsightsApiRef, CostInsightsApi } from '../../api';
import { renderInTestApp } from '@backstage/test-utils';
import { GroupsContext } from '../../hooks/useGroups';
import { LoadingContext } from '../../hooks/useLoading';
import {
  Product,
  ProductCost,
  defaultCurrencies,
  findAlways,
} from '../../types';
import {
  MockConfigProvider,
  MockFilterProvider,
  MockCurrencyProvider,
  MockScrollProvider,
} from '../../utils/tests';

const mockLoadingDispatch = jest.fn();
const mockSetPageFilters = jest.fn();
const mockSetProductFilters = jest.fn();
const mockSetCurrency = jest.fn();
const engineers = findAlways(defaultCurrencies, c => c.kind === null);

const identityApi: Partial<IdentityApi> = {
  getProfile: () => ({
    email: 'test-email@example.com',
    displayName: 'User 1',
  }),
};

const costInsightsApi = (
  productCost: ProductCost,
): Partial<CostInsightsApi> => ({
  getProductInsights: () =>
    Promise.resolve(productCost) as Promise<ProductCost>,
});

const getApis = (productCost: ProductCost) => {
  return ApiRegistry.from([
    [identityApiRef, identityApi],
    [costInsightsApiRef, costInsightsApi(productCost)],
  ]);
};

const mockProductCost = createMockProductCost(() => ({
  entities: [],
  aggregation: [3000, 4000],
  change: {
    ratio: 0.23,
    amount: 1000,
  },
}));

const renderProductInsightsCardInTestApp = async (
  productCost: ProductCost,
  product: Product,
) =>
  await renderInTestApp(
    <ApiProvider apis={getApis(productCost)}>
      <MockConfigProvider
        metrics={[]}
        products={[]}
        icons={[]}
        engineerCost={0}
        currencies={[]}
      >
        <LoadingContext.Provider
          value={{
            state: mockDefaultState,
            actions: [],
            dispatch: mockLoadingDispatch,
          }}
        >
          <GroupsContext.Provider value={{ groups: [{ id: 'test-group' }] }}>
            <MockFilterProvider
              setPageFilters={mockSetPageFilters}
              setProductFilters={mockSetProductFilters}
            >
              <MockScrollProvider>
                <MockCurrencyProvider
                  currency={engineers}
                  setCurrency={mockSetCurrency}
                >
                  <ProductInsightsCard product={product} />
                </MockCurrencyProvider>
              </MockScrollProvider>
            </MockFilterProvider>
          </GroupsContext.Provider>
        </LoadingContext.Provider>
      </MockConfigProvider>
    </ApiProvider>,
  );

describe('<ProductInsightsCard/>', () => {
  it('Renders the scroll anchors', async () => {
    const rendered = await renderProductInsightsCardInTestApp(
      mockProductCost,
      MockComputeEngine,
    );
    expect(
      rendered.queryByTestId(`scroll-test-compute-engine`),
    ).toBeInTheDocument();
  });

  it('Should render the right subheader for products with cost data', async () => {
    const productCost = {
      ...mockProductCost,
      entities: [...Array(1000)].map(createMockEntity),
    };
    const rendered = await renderProductInsightsCardInTestApp(
      productCost,
      MockComputeEngine,
    );
    const subheader = 'entities, sorted by cost';
    const subheaderRgx = new RegExp(
      `${productCost.entities.length} ${subheader}`,
    );
    expect(rendered.getByText(subheaderRgx)).toBeInTheDocument();
  });

  it('Should render the right subheader if there is no cost data or change data', async () => {
    const productCost = { entities: [], aggregation: [0, 0] } as ProductCost;
    const subheader = `There are no ${MockComputeEngine.name} costs within this timeframe for your team's projects.`;
    const rendered = await renderProductInsightsCardInTestApp(
      productCost,
      MockComputeEngine,
    );
    const subheaderRgx = new RegExp(subheader);
    expect(rendered.getByText(subheaderRgx)).toBeInTheDocument();
    expect(
      rendered.queryByTestId('.resource-growth-chart-legend'),
    ).not.toBeInTheDocument();
    expect(
      rendered.queryByTestId('.insights-bar-chart'),
    ).not.toBeInTheDocument();
  });
});
