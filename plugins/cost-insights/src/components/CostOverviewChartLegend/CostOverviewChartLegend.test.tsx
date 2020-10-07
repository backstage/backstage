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

import { renderInTestApp } from '@backstage/test-utils';
import CostOverviewChartLegend from './CostOverviewChartLegend';
import React from 'react';
import { ChangeStatistic } from '../../types';

describe('<CostOverviewChartLegend />', () => {
  it('Correctly displays text if change is not supplied', async () => {
    const rendered = await renderInTestApp(
      <CostOverviewChartLegend title="mock-metric-name" />,
    );
    expect(rendered.queryByText('Unclear')).toBeInTheDocument();
  });
  it('Correctly displays formatted change percentage', async () => {
    const change = {
      ratio: 0.3456,
      amount: 40000,
    } as ChangeStatistic;
    const rendered = await renderInTestApp(
      <CostOverviewChartLegend change={change} title="mock-metric-name" />,
    );
    expect(rendered.queryByText('Unclear')).not.toBeInTheDocument();
    expect(rendered.queryByText('35%')).toBeInTheDocument();
  });
});
