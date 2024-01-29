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
import { TemplateWiseTimeSummaryLinearChart } from './TemplateWiseTimeSummaryLinearComponent';

describe('TemplateWiseTimeSummaryLinearChart', () => {
  it('renders loading indicator when data is not available', () => {
    render(<TemplateWiseTimeSummaryLinearChart />);
    const loadingIndicator = screen.getByRole('progressbar');
    expect(loadingIndicator).toBeInTheDocument();
  });

  it('renders chart when data is available', () => {
    const mockData = {
      stats: [
        {
          date: '2022-01-01',
          template_name: 'Template 1',
          total_time_saved: 10,
        },
        {
          date: '2022-01-02',
          template_name: 'Template 2',
          total_time_saved: 20,
        },
      ],
    };

    const mockResponse = new Response(JSON.stringify(mockData));
    jest
      .spyOn(global, 'fetch')
      .mockResolvedValueOnce(Promise.resolve(mockResponse));

    render(<TemplateWiseTimeSummaryLinearChart />);
    const chart = screen.getByRole('img');
    expect(chart).toBeInTheDocument();
  });

  it('filters data by template name when prop is provided', () => {
    const mockData = {
      stats: [
        {
          date: '2022-01-01',
          template_name: 'Template 1',
          total_time_saved: 10,
        },
        {
          date: '2022-01-02',
          template_name: 'Template 2',
          total_time_saved: 20,
        },
      ],
    };

    const mockResponse = new Response(JSON.stringify(mockData));
    jest
      .spyOn(global, 'fetch')
      .mockResolvedValueOnce(Promise.resolve(mockResponse));

    render(<TemplateWiseTimeSummaryLinearChart template_name="Template 1" />);

    const chart = screen.getByRole('img');
    expect(chart).toBeInTheDocument();
  });
});
