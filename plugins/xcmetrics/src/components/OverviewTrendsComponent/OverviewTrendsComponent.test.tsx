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
import { OverviewTrendsComponent } from './OverviewTrendsComponent';
import { renderInTestApp } from '@backstage/test-utils';
import { xcmetricsApiRef } from '../../api';
import { ApiProvider, ApiRegistry } from '@backstage/core-app-api';
import { createMockXcmetricsApi } from '../../test-utils';

describe('OverviewTrendsComponent', () => {
  it('should render', async () => {
    const rendered = await renderInTestApp(
      <ApiProvider
        apis={ApiRegistry.with(xcmetricsApiRef, createMockXcmetricsApi())}
      >
        <OverviewTrendsComponent days={14} />
      </ApiProvider>,
    );
    expect(rendered.getByText('Last 14 Days')).toBeInTheDocument();
    expect(rendered.getAllByText('Build Count').length).toEqual(3);
    expect(rendered.getByText('Avg. Build Time (P50)')).toBeInTheDocument();
  });

  it('should render empty state', async () => {
    const api = createMockXcmetricsApi();
    api.getBuildCounts = jest.fn().mockResolvedValue([]);

    const rendered = await renderInTestApp(
      <ApiProvider apis={ApiRegistry.with(xcmetricsApiRef, api)}>
        <OverviewTrendsComponent days={14} />
      </ApiProvider>,
    );
    expect(rendered.getByText('--')).toBeInTheDocument();
  });

  it('should show errors when API not responding', async () => {
    const api = createMockXcmetricsApi();
    const buildCountError = 'MockBuildCountErrorMessage';
    const buildTimesError = 'MockBuildTimesErrorMessage';

    api.getBuildCounts = jest
      .fn()
      .mockRejectedValue({ message: buildCountError });
    api.getBuildTimes = jest
      .fn()
      .mockRejectedValue({ message: buildTimesError });

    const rendered = await renderInTestApp(
      <ApiProvider apis={ApiRegistry.with(xcmetricsApiRef, api)}>
        <OverviewTrendsComponent days={14} />
      </ApiProvider>,
    );
    expect(rendered.getByText(buildCountError)).toBeInTheDocument();
    expect(rendered.getByText(buildTimesError)).toBeInTheDocument();
  });
});
