/*
 * Copyright 2021 The Backstage Authors
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
import { fireEvent } from '@testing-library/react';
import { MockPluginProvider } from '@backstage/test-utils/alpha';
import { renderInTestApp } from '@backstage/test-utils';
import { CostOverviewCard } from './CostOverviewCard';
import { Cost } from '@backstage/plugin-cost-insights-common';
import {
  changeOf,
  getGroupedProducts,
  getGroupedProjects,
  MockAggregatedDailyCosts,
  MockBillingDateProvider,
  MockConfigProvider,
  MockFilterProvider,
  MockScrollProvider,
  trendlineOf,
} from '../../testUtils';
import { CostInsightsThemeProvider } from '../CostInsightsPage/CostInsightsThemeProvider';

const mockGroupDailyCost: Cost = {
  id: 'test-group',
  aggregation: MockAggregatedDailyCosts,
  change: changeOf(MockAggregatedDailyCosts),
  trendline: trendlineOf(MockAggregatedDailyCosts),
};

function renderInContext(children: JSX.Element) {
  return renderInTestApp(
    <CostInsightsThemeProvider>
      <MockConfigProvider>
        <MockFilterProvider>
          <MockBillingDateProvider>
            <MockScrollProvider>
              <MockPluginProvider>{children}</MockPluginProvider>
            </MockScrollProvider>
          </MockBillingDateProvider>
        </MockFilterProvider>
      </MockConfigProvider>
    </CostInsightsThemeProvider>,
  );
}

describe('<CostOverviewCard/>', () => {
  beforeEach(() => {
    // @ts-expect-error: Since we have strictNullChecks enabled, this will throw an error as window.ResizeObserver
    // it's not an optional operand
    delete window.ResizeObserver;
    window.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
  });

  afterEach(() => {
    window.ResizeObserver = ResizeObserver;
    jest.restoreAllMocks();
  });

  it('Renders without exploding', async () => {
    const { getByText } = await renderInContext(
      <CostOverviewCard dailyCostData={mockGroupDailyCost} metricData={null} />,
    );
    expect(getByText('Cloud Cost')).toBeInTheDocument();
  });

  it('Shows breakdown tabs if provided', async () => {
    const mockDailyCostWithBreakdowns = {
      ...mockGroupDailyCost,
      groupedCosts: {
        product: getGroupedProducts('R2/P90D/2021-01-01'),
        project: getGroupedProjects('R2/P90D/2021-01-01'),
      },
    };
    const { getByText } = await renderInContext(
      <CostOverviewCard
        dailyCostData={mockDailyCostWithBreakdowns}
        metricData={null}
      />,
    );
    expect(getByText('Cloud Cost')).toBeInTheDocument();
    expect(getByText('Breakdown by product')).toBeInTheDocument();
    expect(getByText('Breakdown by project')).toBeInTheDocument();

    fireEvent.click(getByText('Breakdown by product'));
    expect(getByText('Cloud Cost By Product')).toBeInTheDocument();

    fireEvent.click(getByText('Breakdown by project'));
    expect(getByText('Cloud Cost By Project')).toBeInTheDocument();
  });
});
