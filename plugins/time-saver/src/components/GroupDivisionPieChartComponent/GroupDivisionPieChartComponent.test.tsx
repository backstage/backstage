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
import { GroupDivisionPieChart } from './GroupDivisionPieChartComponent';

describe('GroupDivisionPieChart', () => {
  it('should render CircularProgress when data is null', () => {
    render(<GroupDivisionPieChart />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should render Pie chart when data is available', async () => {
    const mockData = {
      stats: [
        { percentage: '30', team: 'Team A' },
        { percentage: '40', team: 'Team B' },
        { percentage: '30', team: 'Team C' },
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
      } as unknown as Response),
    );

    render(<GroupDivisionPieChart />);

    await waitFor(() => {
      expect(
        screen.getByText('Team Percentage Distribution'),
      ).toBeInTheDocument();
      expect(screen.getByRole('img')).toBeInTheDocument();
    });
  });
});
