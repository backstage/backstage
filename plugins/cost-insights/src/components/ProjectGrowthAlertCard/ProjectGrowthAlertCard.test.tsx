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
import ProjectGrowthAlertCard from './ProjectGrowthAlertCard';
import { createMockProjectGrowthData } from '../../utils/mockData';
import { MockCurrencyProvider, MockConfigProvider } from '../../utils/tests';
import { AlertCost, defaultCurrencies, findAlways } from '../../types';

const engineers = findAlways(defaultCurrencies, c => c.kind === null);

const MockProject = 'test-project-1';
const MockAlertCosts: AlertCost[] = [
  { id: 'test-id-1', aggregation: [150, 200] },
  { id: 'test-id-2', aggregation: [235, 400] },
];

const MockProjectGrowthAlert = createMockProjectGrowthData(data => ({
  ...data,
  project: MockProject,
  products: MockAlertCosts,
}));

describe('<ProjectGrowthAlertCard />', () => {
  it('renders the correct title and subheader for multiple services', async () => {
    const subheader = new RegExp(
      `${MockAlertCosts.length} products, sorted by cost`,
    );
    const title = new RegExp(`Project growth for ${MockProject}`);
    const rendered = await renderInTestApp(
      <MockConfigProvider
        metrics={[]}
        products={[]}
        icons={[]}
        engineerCost={200_000}
        currencies={[]}
      >
        <MockCurrencyProvider currency={engineers} setCurrency={jest.fn()}>
          <ProjectGrowthAlertCard alert={MockProjectGrowthAlert} />,
        </MockCurrencyProvider>
      </MockConfigProvider>,
    );
    expect(rendered.getByText(title)).toBeInTheDocument();
    expect(rendered.getByText(subheader)).toBeInTheDocument();
  });

  it('renders the correct title and subheader for a single service', async () => {
    const subheader = new RegExp('1 product');
    const title = new RegExp(`Project growth for ${MockProject}`);
    const rendered = await renderInTestApp(
      <MockConfigProvider
        metrics={[]}
        products={[]}
        icons={[]}
        engineerCost={200_000}
        currencies={[]}
      >
        <MockCurrencyProvider currency={engineers} setCurrency={jest.fn()}>
          <ProjectGrowthAlertCard
            alert={{
              ...MockProjectGrowthAlert,
              products: [{ id: 'test-alert-id', aggregation: [0, 100] }],
            }}
          />
        </MockCurrencyProvider>
      </MockConfigProvider>,
    );
    expect(rendered.getByText(title)).toBeInTheDocument();
    expect(rendered.getByText(subheader)).toBeInTheDocument();
  });
});
