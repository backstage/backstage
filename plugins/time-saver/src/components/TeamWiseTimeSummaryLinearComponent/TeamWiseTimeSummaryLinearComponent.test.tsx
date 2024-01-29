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
import { render } from '@testing-library/react';
import { TeamWiseTimeSummaryLinearChart } from './TeamWiseTimeSummaryLinearComponent';

describe('TeamWiseTimeSummaryLinearComponent', () => {
  it('renders loading spinner when data is not available', () => {
    const { getByTestId } = render(<TeamWiseTimeSummaryLinearChart />);
    expect(getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders chart with correct options and data', () => {
    // Mock the fetch API response
    jest.spyOn(global, 'fetch').mockImplementation(
      () =>
        Promise.resolve({
          json: () =>
            Promise.resolve({
              stats: [
                {
                  date: '2022-01-01',
                  team: 'Team A',
                  total_time_saved: 10,
                },
                {
                  date: '2022-01-02',
                  team: 'Team A',
                  total_time_saved: 20,
                },
                {
                  date: '2022-01-01',
                  team: 'Team B',
                  total_time_saved: 15,
                },
                {
                  date: '2022-01-02',
                  team: 'Team B',
                  total_time_saved: 25,
                },
              ],
            }),
        }) as unknown as Promise<Response>,
    );

    const { getByText } = render(<TeamWiseTimeSummaryLinearChart />);
    expect(getByText('Time Summary by Team')).toBeInTheDocument();
    expect(getByText('Date')).toBeInTheDocument();
    expect(getByText('Total Time Saved')).toBeInTheDocument();
    expect(getByText('Team A')).toBeInTheDocument();
    expect(getByText('Team B')).toBeInTheDocument();
    expect(getByText('2022-01-01')).toBeInTheDocument();
    expect(getByText('2022-01-02')).toBeInTheDocument();
    expect(getByText('10')).toBeInTheDocument();
    expect(getByText('20')).toBeInTheDocument();
    expect(getByText('15')).toBeInTheDocument();
    expect(getByText('25')).toBeInTheDocument();
  });
});
