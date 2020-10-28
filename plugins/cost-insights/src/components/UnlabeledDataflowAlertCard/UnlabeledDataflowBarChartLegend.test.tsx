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
import { UnlabeledDataflowBarChartLegend } from './UnlabeledDataflowBarChartLegend';
import { renderInTestApp } from '@backstage/test-utils';

describe('<UnlabeledDataflowBarChartLegend />', () => {
  it('Displays the correct text', async () => {
    const rendered = await renderInTestApp(
      <UnlabeledDataflowBarChartLegend
        unlabeledCost={9842.822}
        labeledCost={2309.1211}
      />,
    );
    expect(rendered.getByText('Total Unlabeled Cost')).toBeInTheDocument();
    expect(rendered.getByText('Total Labeled Cost')).toBeInTheDocument();
    expect(rendered.getByText('$9,843')).toBeInTheDocument();
    expect(rendered.getByText('$2,309')).toBeInTheDocument();
  });
});
