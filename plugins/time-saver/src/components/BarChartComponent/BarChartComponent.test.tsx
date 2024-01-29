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
import { BarChart } from './BarChartComponent';

describe('BarChart', () => {
  it('renders loading state when data is not available', () => {
    render(<BarChart templateTaskId="templateTaskId" />);
    const loadingElement = screen.getByRole('progressbar');
    expect(loadingElement).toBeInTheDocument();
  });

  it('renders chart with correct data when data is available', async () => {
    const mockData = {
      templateTaskId: 'templateTaskId',
      templateName: 'Template Name',
      stats: [
        { sum: 10, team: 'Team A' },
        { sum: 20, team: 'Team B' },
      ],
    };

    jest.spyOn(global, 'fetch').mockResolvedValueOnce(
      Promise.resolve({
        json: jest.fn().mockResolvedValueOnce(mockData),
        headers: new Headers(),
        ok: true,
        redirected: false,
        status: 200,
        statusText: 'OK',
        type: 'basic',
        url: 'http://example.com',
        clone: jest.fn(),
        body: null,
        bodyUsed: false,
        arrayBuffer: jest.fn(),
        blob: jest.fn(),
        formData: jest.fn(),
        text: jest.fn(),
      }) as unknown as Response,
    );

    render(<BarChart templateTaskId="templateTaskId" />);

    // Wait for data to be fetched and chart to render
    await screen.findByText('Template Name');

    const chartElement = screen.getByRole('img');
    expect(chartElement).toBeInTheDocument();
    expect(chartElement).toHaveAttribute('data-testid', 'bar-chart');

    const legendElement = screen.getByText('Time Saved');
    expect(legendElement).toBeInTheDocument();

    const teamALabel = screen.getByText('Team A');
    expect(teamALabel).toBeInTheDocument();

    const teamBLabel = screen.getByText('Team B');
    expect(teamBLabel).toBeInTheDocument();

    const teamAData = screen.getByText('10');
    expect(teamAData).toBeInTheDocument();

    const teamBData = screen.getByText('20');
    expect(teamBData).toBeInTheDocument();
  });
});
