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
import { Tooltip } from './Tooltip';
import { CostInsightsThemeProvider } from '../CostInsightsPage/CostInsightsThemeProvider';

const mockTooltipItems = [
  {
    label: 'Cost',
    value: '$1,000,000',
    fill: '#FFF',
  },
  {
    label: 'Test Metric',
    value: '100,000,000',
    fill: '#FFF',
  },
];

describe('<Tooltip/>', () => {
  it('renders without exploding', async () => {
    const rendered = await renderInTestApp(
      <CostInsightsThemeProvider>
        <Tooltip label="05/16/2020" items={mockTooltipItems} />
      </CostInsightsThemeProvider>,
    );
    expect(
      rendered.container.querySelector('.tooltip-content'),
    ).toBeInTheDocument();
  });

  it('formats label and tooltip item text correctly', async () => {
    const rendered = await renderInTestApp(
      <CostInsightsThemeProvider>
        <Tooltip label="05/16/2020" items={mockTooltipItems} />
      </CostInsightsThemeProvider>,
    );
    expect(rendered.getByText('05/16/2020')).toBeInTheDocument();
    expect(rendered.getByText('Cost')).toBeInTheDocument();
    expect(rendered.getByText('Test Metric')).toBeInTheDocument();
    expect(rendered.getByText('$1,000,000')).toBeInTheDocument();
    expect(rendered.getByText('100,000,000')).toBeInTheDocument();
  });
});
