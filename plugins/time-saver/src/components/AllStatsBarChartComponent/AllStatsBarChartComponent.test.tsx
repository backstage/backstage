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
import { AllStatsBarChart } from './AllStatsBarChartComponent';

describe('AllStatsBarChart', () => {
  it('renders loading spinner when data is not available', () => {
    render(<AllStatsBarChart />);
    const loadingSpinner = screen.getByRole('progressbar');
    expect(loadingSpinner).toBeInTheDocument();
  });

  it('renders chart when data is available', () => {
    const mockData = {
      stats: [
        { sum: 10, team: 'Team A', template_name: 'Template 1' },
        { sum: 20, team: 'Team B', template_name: 'Template 1' },
        { sum: 30, team: 'Team A', template_name: 'Template 2' },
        { sum: 40, team: 'Team B', template_name: 'Template 2' },
      ],
    };

    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockData),
    } as any);

    render(<AllStatsBarChart />);
    const chart = screen.getByRole('img');
    expect(chart).toBeInTheDocument();
  });

  it('displays correct chart options', () => {
    const mockData = {
      stats: [
        { sum: 10, team: 'Team A', template_name: 'Template 1' },
        { sum: 20, team: 'Team B', template_name: 'Template 1' },
        { sum: 30, team: 'Team A', template_name: 'Template 2' },
        { sum: 40, team: 'Team B', template_name: 'Template 2' },
      ],
    };

    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockData),
    } as any);

    render(<AllStatsBarChart />);
    const chart = screen.getByRole('img');

    expect(chart).toHaveAttribute('data-testid', 'bar-chart');
    expect(chart).toHaveAttribute('data-label', 'All Statistics');
    expect(chart).toHaveAttribute('data-responsive', 'true');
    expect(chart).toHaveAttribute('data-interaction-mode', 'index');
    expect(chart).toHaveAttribute('data-intersect', 'false');
    expect(chart).toHaveAttribute('data-stacked-x', 'true');
    expect(chart).toHaveAttribute('data-stacked-y', 'true');
  });
});
