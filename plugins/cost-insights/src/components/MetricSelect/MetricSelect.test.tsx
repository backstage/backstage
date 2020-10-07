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
import { waitFor } from '@testing-library/react';
import UserEvent from '@testing-library/user-event';
import MetricSelect, { MetricSelectProps } from './MetricSelect';
import { renderInTestApp } from '@backstage/test-utils';

describe('<MetricSelect />', () => {
  it('should display a metric', async () => {
    const mockProps: MetricSelectProps = {
      metric: 'test',
      metrics: [{ kind: 'test', name: 'some-name' }],
      onSelect: jest.fn(),
    };
    const { getByText } = await renderInTestApp(
      <MetricSelect {...mockProps} />,
    );
    expect(getByText(/some-name/)).toBeInTheDocument();
  });

  it('should display a null metric', async () => {
    const mockProps: MetricSelectProps = {
      metric: null,
      metrics: [{ kind: null, name: 'billie-nullish' }],
      onSelect: jest.fn(),
    };
    const { getByText } = await renderInTestApp(
      <MetricSelect {...mockProps} />,
    );
    expect(getByText(/billie-nullish/)).toBeInTheDocument();
  });

  it('should display all metrics', async () => {
    const mockProps: MetricSelectProps = {
      metric: null,
      metrics: [
        { kind: null, name: 'billie-nullish' },
        { kind: 'MAU1M', name: 'Cost Per Million MAU' },
        { kind: 'my-cool-metric', name: 'metric-mcmetric-face' },
      ],
      onSelect: jest.fn(),
    };
    const { getAllByText, getByText, getByRole } = await renderInTestApp(
      <MetricSelect {...mockProps} />,
    );
    const button = getByRole('button');

    UserEvent.click(button);

    await waitFor(() => getAllByText(/billie-nullish/));

    // The active metric should display in the popver list and in the input
    expect(getAllByText(/billie-nullish/).length).toBe(2);
    expect(getByText(/Cost Per Million MAU/)).toBeInTheDocument();
    expect(getByText(/metric-mcmetric-face/)).toBeInTheDocument();
  });
});
