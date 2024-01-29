/*
 * Copyright 2024 The Backstage Authors
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
import { render, screen } from '@testing-library/react';
import { ByTeamBarChart } from './ByTeamBarChartComponent';

describe('ByTeamBarChart', () => {
  it('renders loading indicator when data is not available', () => {
    render(<ByTeamBarChart team="example-team" />);
    const loadingIndicator = screen.getByRole('progressbar');
    expect(loadingIndicator).toBeInTheDocument();
  });

  it('renders chart with correct options and data when data is available', () => {
    const mockData = {
      team: 'example-team',
      stats: [
        { sum: 10, template_name: 'Template 1' },
        { sum: 20, template_name: 'Template 2' },
      ],
    };

    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockData),
    } as any);

    render(<ByTeamBarChart team="example-team" />);

    // Assert chart options
    const chartOptions = screen.getByText('example-team');
    expect(chartOptions).toBeInTheDocument();

    // Assert chart data
    const chartData = screen.getByLabelText('Time Saved');
    expect(chartData).toBeInTheDocument();
    expect(chartData).toHaveAttribute('data-labels', 'Template 1,Template 2');
    expect(chartData).toHaveAttribute('data-datasets', '10,20');
  });
});
