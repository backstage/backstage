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
import ResourceGrowthBarChart from './ResourceGrowthBarChart';
import { renderInTestApp } from '@backstage/test-utils';
import { createMockEntity } from '../../utils/mockData';

const MockResources = [...Array(10)].map((_, index) =>
  createMockEntity(() => ({
    id: `test-id-${index + 1}`,
    // grow resource costs linearly for testing
    aggregation: [index * 1000, (index + 1) * 1000],
  })),
);

describe('<ResourceGrowthBarChart/>', () => {
  it('Pre-renders without exploding', async () => {
    const rendered = await renderInTestApp(
      <ResourceGrowthBarChart
        resources={MockResources}
        previousName="Q2 2020"
        currentName="Q3 2020"
      />,
    );
    expect(rendered.queryByTestId('bar-chart-wrapper')).toBeInTheDocument();
  });
});
