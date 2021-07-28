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
import { renderInTestApp } from '@backstage/test-utils';
import { xcmetricsApiRef } from '../../api';
import { ApiProvider, ApiRegistry } from '@backstage/core-app-api';
import { OverviewComponent } from './OverviewComponent';

jest.mock('../../api/XcmetricsClient');
const client = require('../../api/XcmetricsClient');

jest.mock('../OverviewTrendsComponent', () => ({
  OverviewTrendsComponent: () => 'OverviewTrendsComponent',
}));

jest.mock('../StatusMatrixComponent', () => ({
  StatusMatrixComponent: () => 'StatusMatrixComponent',
}));

describe('OverviewComponent', () => {
  it('should render', async () => {
    const rendered = await renderInTestApp(
      <ApiProvider
        apis={ApiRegistry.with(xcmetricsApiRef, client.XcmetricsClient)}
      >
        <OverviewComponent />
      </ApiProvider>,
    );

    expect(rendered.getByText('XCMetrics Dashboard')).toBeInTheDocument();
    expect(rendered.getByText(client.mockBuild.userid)).toBeInTheDocument();
  });

  it('should render an empty state when no builds exist', async () => {
    const api = client.XcmetricsClient;
    api.getBuilds = jest.fn().mockResolvedValue([]);

    const rendered = await renderInTestApp(
      <ApiProvider apis={ApiRegistry.with(xcmetricsApiRef, api)}>
        <OverviewComponent />
      </ApiProvider>,
    );

    expect(rendered.getByText('No builds to show')).toBeInTheDocument();
  });

  it('should show an error when API not responding', async () => {
    const api = client.XcmetricsClient;
    const errorMessage = 'MockErrorMessage';

    api.getBuilds = jest.fn().mockRejectedValue({ message: errorMessage });

    const rendered = await renderInTestApp(
      <ApiProvider apis={ApiRegistry.with(xcmetricsApiRef, api)}>
        <OverviewComponent />
      </ApiProvider>,
    );

    expect(rendered.getByText(errorMessage)).toBeInTheDocument();
  });
});
