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

import CostOverviewChart from './CostOverviewChart';
import { renderInTestApp } from '@backstage/test-utils';
import React from 'react';
import { DateAggregation, Trendline } from '../../types';
import { CostInsightsThemeProvider } from '../CostInsightsPage/CostInsightsThemeProvider';

const mockAggregation = [
  { date: '2020-04-01', amount: 100 },
  { date: '2020-04-02', amount: 101 },
  { date: '2020-04-03', amount: 102 },
  { date: '2020-04-04', amount: 103 },
] as Array<DateAggregation>;

const mockTrendline = { slope: 0.3, intercept: 101.5 } as Trendline;
const mockMetric = 'mock-metric';

describe('<CostOverviewChart/>', () => {
  it('Renders without exploding', async () => {
    const rendered = await renderInTestApp(
      <CostInsightsThemeProvider>
        <CostOverviewChart
          responsive={false}
          aggregation={mockAggregation}
          trendline={mockTrendline}
          metric={mockMetric}
          tooltip="Mock tooltip text"
        />
      </CostInsightsThemeProvider>,
    );
    expect(
      rendered.container.querySelector('.cost-overview-chart'),
    ).toBeInTheDocument();
  });
});
