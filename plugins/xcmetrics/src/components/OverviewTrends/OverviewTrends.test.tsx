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
import { OverviewTrends } from './OverviewTrends';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { xcmetricsApiRef } from '../../api';
import userEvent from '@testing-library/user-event';

jest.mock('../../api/XcmetricsClient');
const client = require('../../api/XcmetricsClient');

describe('OverviewTrends', () => {
  it('should render', async () => {
    const rendered = await renderInTestApp(
      <TestApiProvider apis={[[xcmetricsApiRef, client.XcmetricsClient]]}>
        <OverviewTrends />
      </TestApiProvider>,
    );
    expect(rendered.getByText('Trends for')).toBeInTheDocument();
    expect(rendered.getAllByText('Build Count').length).toEqual(3);
    expect(rendered.getByText('Avg. Build Time (P50)')).toBeInTheDocument();
  });

  it('should render empty state', async () => {
    const api = client.XcmetricsClient;
    api.getBuildCounts = jest.fn().mockResolvedValue([]);

    const rendered = await renderInTestApp(
      <TestApiProvider apis={[[xcmetricsApiRef, api]]}>
        <OverviewTrends />
      </TestApiProvider>,
    );
    expect(rendered.getByText('--')).toBeInTheDocument();
  });

  it('should change number of days when select is changed', async () => {
    const rendered = await renderInTestApp(
      <TestApiProvider apis={[[xcmetricsApiRef, client.XcmetricsClient]]}>
        <OverviewTrends />
      </TestApiProvider>,
    );

    await userEvent.click(rendered.getByText('14 days'));
    await userEvent.click(await rendered.findByText('30 days'));
    expect(await rendered.findByText('30 days')).toBeInTheDocument();
  });

  it('should show errors when API not responding', async () => {
    const api = client.XcmetricsClient;
    const buildCountError = 'MockBuildCountErrorMessage';
    const buildTimesError = 'MockBuildTimesErrorMessage';

    api.getBuildCounts = jest
      .fn()
      .mockRejectedValue({ message: buildCountError });
    api.getBuildTimes = jest
      .fn()
      .mockRejectedValue({ message: buildTimesError });

    const rendered = await renderInTestApp(
      <TestApiProvider apis={[[xcmetricsApiRef, api]]}>
        <OverviewTrends />
      </TestApiProvider>,
    );
    expect(rendered.getByText(buildCountError)).toBeInTheDocument();
    expect(rendered.getByText(buildTimesError)).toBeInTheDocument();
  });
});
