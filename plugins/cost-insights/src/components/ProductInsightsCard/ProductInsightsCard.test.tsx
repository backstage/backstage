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
import { renderInTestApp } from '@backstage/test-utils';
import { ProductInsightsCard } from './ProductInsightsCard';
import { CostInsightsApi } from '../../api';
import {
  createMockEntity,
  mockDefaultLoadingState,
  MockComputeEngine,
  MockProductFilters,
} from '../../utils/mockData';
import {
  MockCostInsightsApiProvider,
  MockBillingDateProvider,
  MockConfigProvider,
  MockCurrencyProvider,
  MockFilterProvider,
  MockGroupsProvider,
  MockScrollProvider,
  MockLoadingProvider,
} from '../../utils/tests';
import { Duration, Entity, Product, ProductPeriod } from '../../types';

const costInsightsApi = (entity: Entity): Partial<CostInsightsApi> => ({
  getProductInsights: () => Promise.resolve(entity),
});

const mockProductCost = createMockEntity(() => ({
  id: 'test-id',
  entities: [],
  aggregation: [3000, 4000],
  change: {
    ratio: 0.23,
    amount: 1000,
  },
}));

const renderProductInsightsCardInTestApp = async (
  entity: Entity,
  product: Product,
  duration: Duration,
) =>
  await renderInTestApp(
    <MockCostInsightsApiProvider costInsightsApi={costInsightsApi(entity)}>
      <MockConfigProvider>
        <MockLoadingProvider state={mockDefaultLoadingState}>
          <MockGroupsProvider>
            <MockBillingDateProvider>
              <MockFilterProvider
                productFilters={MockProductFilters.map((p: ProductPeriod) => ({
                  ...p,
                  duration: duration,
                }))}
              >
                <MockScrollProvider>
                  <MockCurrencyProvider>
                    <ProductInsightsCard product={product} />
                  </MockCurrencyProvider>
                </MockScrollProvider>
              </MockFilterProvider>
            </MockBillingDateProvider>
          </MockGroupsProvider>
        </MockLoadingProvider>
      </MockConfigProvider>
    </MockCostInsightsApiProvider>,
  );

describe('<ProductInsightsCard/>', () => {
  it('Renders the scroll anchors', async () => {
    const rendered = await renderProductInsightsCardInTestApp(
      mockProductCost,
      MockComputeEngine,
      Duration.P1M,
    );
    expect(
      rendered.queryByTestId(`scroll-test-compute-engine`),
    ).toBeInTheDocument();
  });

  it('Should render the right subheader for products with cost data', async () => {
    const entity = {
      ...mockProductCost,
      entities: [...Array(1000)].map(createMockEntity),
    };
    const rendered = await renderProductInsightsCardInTestApp(
      entity,
      MockComputeEngine,
      Duration.P1M,
    );
    const subheader = 'entities, sorted by cost';
    const subheaderRgx = new RegExp(`${entity.entities.length} ${subheader}`);
    expect(rendered.getByText(subheaderRgx)).toBeInTheDocument();
  });

  it('Should render the right subheader if there is no cost data or change data', async () => {
    const entity: Entity = {
      id: 'test-id',
      entities: [],
      aggregation: [0, 0],
      change: { ratio: 0, amount: 0 },
    };
    const subheader = `There are no ${MockComputeEngine.name} costs within this timeframe for your team's projects.`;
    const rendered = await renderProductInsightsCardInTestApp(
      entity,
      MockComputeEngine,
      Duration.P1M,
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

  describe.each`
    duration         | periodStartText    | periodEndText
    ${Duration.P30D} | ${'First 30 Days'} | ${'Last 30 Days'}
    ${Duration.P90D} | ${'First 90 Days'} | ${'Last 90 Days'}
  `(
    'Should display the correct relative time',
    ({ duration, periodStartText, periodEndText }) => {
      it(`Should display the correct relative time for ${duration}`, async () => {
        const entity = {
          ...mockProductCost,
          entities: [...Array(3)].map(createMockEntity),
        };
        const rendered = await renderProductInsightsCardInTestApp(
          entity,
          MockComputeEngine,
          duration,
        );
        expect(rendered.getByText(periodStartText)).toBeInTheDocument();
        expect(rendered.getByText(periodEndText)).toBeInTheDocument();
      });
    },
  );
});
