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
import { ProductInsightsCardList } from './ProductInsightsCardList';
import { ProductInsightsOptions } from '../../api';
import { mockDefaultLoadingState, MockProducts } from '../../utils/mockData';
import {
  MockConfigProvider,
  MockCostInsightsApiProvider,
  MockCurrencyProvider,
  MockFilterProvider,
  MockBillingDateProvider,
  MockScrollProvider,
  MockLoadingProvider,
} from '../../utils/tests';
import { Entity } from '../../types';

// suppress recharts componentDidUpdate warnings
jest.spyOn(console, 'warn').mockImplementation(() => {});

const MockComputeEngineInsights: Entity = {
  id: 'compute-engine',
  entities: [],
  aggregation: [0, 0],
  change: {
    ratio: 0,
    amount: 0,
  },
};

const MockCloudDataflowInsights: Entity = {
  id: 'cloud-dataflow',
  entities: [],
  aggregation: [1_000, 2_000],
  change: {
    ratio: 1,
    amount: 1_000,
  },
};

const MockCloudStorageInsights: Entity = {
  id: 'cloud-storage',
  entities: [],
  aggregation: [2_000, 4_000],
  change: {
    ratio: 1,
    amount: 2_000,
  },
};

const MockBigQueryInsights: Entity = {
  id: 'big-query',
  entities: [],
  aggregation: [8_000, 16_000],
  change: {
    ratio: 1,
    amount: 8_000,
  },
};

const MockBigTableInsights: Entity = {
  id: 'big-table',
  entities: [],
  aggregation: [16_000, 32_000],
  change: {
    ratio: 1,
    amount: 16_000,
  },
};

const MockCloudPubSubInsights: Entity = {
  id: 'cloud-pub-sub',
  entities: [],
  aggregation: [32_000, 64_000],
  change: {
    ratio: 1,
    amount: 32_000,
  },
};

const ProductEntityMap = {
  [MockBigQueryInsights.id!]: MockBigQueryInsights,
  [MockBigTableInsights.id!]: MockBigTableInsights,
  [MockCloudPubSubInsights.id!]: MockCloudPubSubInsights,
  [MockCloudStorageInsights.id!]: MockCloudStorageInsights,
  [MockCloudDataflowInsights.id!]: MockCloudDataflowInsights,
  [MockComputeEngineInsights.id!]: MockComputeEngineInsights,
};

const costInsightsApi = {
  getProductInsights: ({ product }: ProductInsightsOptions): Promise<Entity> =>
    Promise.resolve(ProductEntityMap[product]),
};

function renderInContext(children: JSX.Element) {
  return renderInTestApp(
    <MockCostInsightsApiProvider costInsightsApi={costInsightsApi}>
      <MockConfigProvider>
        <MockFilterProvider>
          <MockCurrencyProvider>
            <MockLoadingProvider state={mockDefaultLoadingState}>
              <MockBillingDateProvider>
                <MockScrollProvider>{children}</MockScrollProvider>
              </MockBillingDateProvider>
            </MockLoadingProvider>
          </MockCurrencyProvider>
        </MockFilterProvider>
      </MockConfigProvider>
    </MockCostInsightsApiProvider>,
  );
}

describe('<ProductInsightsCardList />', () => {
  it('should render each product panel', async () => {
    const noComputeEngineCostsRgx = /There are no Compute Engine costs within this timeframe for your team's projects./;
    const { getByText } = await renderInContext(
      <ProductInsightsCardList products={MockProducts} />,
    );
    expect(getByText(noComputeEngineCostsRgx)).toBeInTheDocument();
    MockProducts.forEach(product =>
      expect(getByText(product.name)).toBeInTheDocument(),
    );
  });

  it('product panels should be sorted by total aggregated cost', async () => {
    const { queryAllByTestId } = await renderInContext(
      <ProductInsightsCardList products={MockProducts} />,
    );
    const expectedOrder = MockProducts.map(
      product => `product-list-item-${product.kind}`,
    ).reverse();
    const productPanels = queryAllByTestId(/^product-list-item/);

    expect(productPanels.length).toBe(MockProducts.length);
    Array.from(productPanels)
      .map(el => el.getAttribute('data-testid'))
      .forEach((id, i) => {
        expect(id).toBe(expectedOrder[i]);
      });
  });
});
