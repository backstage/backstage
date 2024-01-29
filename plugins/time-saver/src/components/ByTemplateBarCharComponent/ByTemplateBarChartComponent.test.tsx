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
import { ByTemplateBarChart } from './ByTemplateBarChartComponent';

describe('ByTemplateBarChart', () => {
  it('renders loading indicator when data is not available', () => {
    render(<ByTemplateBarChart template_name="example_template" />);
    const loadingIndicator = screen.getByRole('progressbar');
    expect(loadingIndicator).toBeInTheDocument();
  });

  it('renders chart with correct options and data when data is available', () => {
    const mockData = {
      template_name: 'example_template',
      stats: [
        { sum: 10, team: 'Team A' },
        { sum: 20, team: 'Team B' },
        { sum: 30, team: 'Team C' },
      ],
    };

    jest.spyOn(global, 'fetch').mockResolvedValueOnce(
      Promise.resolve({
        json: jest.fn().mockResolvedValueOnce(mockData),
      }) as unknown as Response,
    );

    render(<ByTemplateBarChart template_name="example_template" />);

    // Assert that the chart title is rendered correctly
    const chartTitle = screen.getByText('example_template');
    expect(chartTitle).toBeInTheDocument();

    // Assert that the chart is rendered with the correct data
    const chart = screen.getByRole('img');
    expect(chart).toBeInTheDocument();

    // Assert that the chart has the correct number of bars
    const bars = screen.getAllByRole('bar');
    expect(bars.length).toBe(mockData.stats.length);
  });
});
