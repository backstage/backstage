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
import { MockPluginProvider } from '@backstage/test-utils/alpha';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import {
  changeOf,
  MockAggregatedDailyCosts,
  MockBillingDateProvider,
  MockConfigProvider,
  MockFilterProvider,
  MockScrollProvider,
  trendlineOf,
} from '../../testUtils';
import { CostInsightsThemeProvider } from '../CostInsightsPage/CostInsightsThemeProvider';
import { EntityCostsCard } from './EntityCosts';
import { CostInsightsApi, costInsightsApiRef } from '../../api';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import { Entity } from '@backstage/catalog-model';
import { LoadingProvider } from '../../hooks';
import { Cost } from '@backstage/plugin-cost-insights-common';

function renderInContext(children: JSX.Element) {
  const mockEntity = {
    metadata: { name: 'mock' },
    kind: 'MockKind',
  } as Entity;
  const mockGroupDailyCost: Cost = {
    id: 'test-group',
    aggregation: MockAggregatedDailyCosts,
    change: changeOf(MockAggregatedDailyCosts),
    trendline: trendlineOf(MockAggregatedDailyCosts),
  };
  const mockApi: jest.Mocked<CostInsightsApi> = {
    getLastCompleteBillingDate: jest.fn().mockResolvedValue('2022-10-30'),
    getUserGroups: jest.fn().mockResolvedValue(['team-a']),
    getGroupProjects: jest.fn().mockResolvedValue(['project-a', 'project-b']),
    getCatalogEntityDailyCost: jest.fn().mockResolvedValue(mockGroupDailyCost),
    getGroupDailyCost: jest.fn().mockResolvedValue({}),
    getProjectDailyCost: jest.fn().mockResolvedValue({}),
    getDailyMetricData: jest.fn().mockResolvedValue({}),
    getProductInsights: jest.fn().mockResolvedValue({}),
    getAlerts: jest.fn().mockResolvedValue({}),
  };

  return renderInTestApp(
    <TestApiProvider apis={[[costInsightsApiRef, mockApi]]}>
      <EntityProvider entity={mockEntity}>
        <CostInsightsThemeProvider>
          <MockConfigProvider>
            <LoadingProvider>
              <MockFilterProvider>
                <MockBillingDateProvider>
                  <MockScrollProvider>
                    <MockScrollProvider>
                      <MockPluginProvider>{children}</MockPluginProvider>
                    </MockScrollProvider>
                  </MockScrollProvider>
                </MockBillingDateProvider>
              </MockFilterProvider>
            </LoadingProvider>
          </MockConfigProvider>
        </CostInsightsThemeProvider>
      </EntityProvider>
    </TestApiProvider>,
  );
}

describe('<EntityCostsCard/>', () => {
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
    const { getByText } = await renderInContext(<EntityCostsCard />);
    expect(getByText('Cloud Cost')).toBeInTheDocument();
  });
});
