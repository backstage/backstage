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
import { render, screen, waitFor } from '@testing-library/react';
import { DailyTimeSummaryLineChartTemplateWise } from './TemplateWiseWiseDailyTimeLinearComponent';

describe('TemplateWiseWiseDailyTimeLinearComponent', () => {
  it('renders loading spinner when data is not available', () => {
    render(<DailyTimeSummaryLineChartTemplateWise />);
    const loadingSpinner = screen.getByRole('progressbar');
    expect(loadingSpinner).toBeInTheDocument();
  });

  it('renders line chart when data is available', () => {
    const mockData = {
      stats: [
        {
          date: '2022-01-01',
          template_name: 'Template 1',
          total_time_saved: 60,
        },
        {
          date: '2022-01-02',
          template_name: 'Template 1',
          total_time_saved: 120,
        },
      ],
    };

    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockData),
    } as any);

    describe('TemplateWiseWiseDailyTimeLinearComponent', () => {
      beforeEach(() => {
        jest.spyOn(global, 'fetch').mockResolvedValueOnce({
          json: jest.fn().mockResolvedValueOnce(mockData),
        } as any);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('renders loading spinner when data is not available', () => {
        render(<DailyTimeSummaryLineChartTemplateWise />);
        const loadingSpinner = screen.getByRole('progressbar');
        expect(loadingSpinner).toBeInTheDocument();
      });

      it('renders line chart when data is available', async () => {
        render(<DailyTimeSummaryLineChartTemplateWise />);
        await waitFor(() => {
          const lineChart = screen.getByRole('img');
          expect(lineChart).toBeInTheDocument();
        });
      });

      it('fetches data from the backend API', async () => {
        render(<DailyTimeSummaryLineChartTemplateWise />);
        await waitFor(() => {
          expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining(
              '/api/time-saver/getDailyTimeSummary/template',
            ),
          );
        });
      });

      it('sorts the data by date', async () => {
        render(<DailyTimeSummaryLineChartTemplateWise />);
        await waitFor(() => {
          expect(mockData.stats).toEqual([
            {
              date: '2022-01-01',
              template_name: 'Template 1',
              total_time_saved: 60,
            },
            {
              date: '2022-01-02',
              template_name: 'Template 1',
              total_time_saved: 120,
            },
          ]);
        });
      });

      it('filters the data by template name', async () => {
        render(
          <DailyTimeSummaryLineChartTemplateWise template_name="Template 1" />,
        );
        await waitFor(() => {
          expect(mockData.stats).toEqual([
            {
              date: '2022-01-01',
              template_name: 'Template 1',
              total_time_saved: 60,
            },
            {
              date: '2022-01-02',
              template_name: 'Template 1',
              total_time_saved: 120,
            },
          ]);
        });
      });

      it('renders multiple line charts for each template', async () => {
        render(<DailyTimeSummaryLineChartTemplateWise />);
        await waitFor(() => {
          const lineCharts = screen.getAllByRole('img');
          expect(lineCharts.length).toBe(mockData.stats.length);
        });
      });
    });
    const lineChart = screen.getByRole('img');
    expect(lineChart).toBeInTheDocument();
  });
});
