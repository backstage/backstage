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
import { DailyTimeSummaryLineChartTeamWise } from './TeamWiseDailyTimeLinearComponent';

describe('TeamWiseDailyTimeLinearComponent', () => {
  it('renders without error', () => {
    render(<DailyTimeSummaryLineChartTeamWise />);
    expect(
      screen.getByTestId('team-wise-daily-time-linear-component'),
    ).toBeInTheDocument();
  });

  it('renders loading state when data is null', () => {
    render(<DailyTimeSummaryLineChartTeamWise />);
    expect(screen.getByTestId('circular-progress')).toBeInTheDocument();
  });

  it('renders chart with correct options and data', () => {
    const mockData = {
      stats: [
        { date: '2022-01-01', team: 'Team A', total_time_saved: 10 },
        { date: '2022-01-02', team: 'Team A', total_time_saved: 20 },
        { date: '2022-01-01', team: 'Team B', total_time_saved: 15 },
        { date: '2022-01-02', team: 'Team B', total_time_saved: 25 },
      ],
    };

    jest.spyOn(global, 'fetch').mockImplementation(
      () =>
        Promise.resolve({
          json: () => Promise.resolve(mockData),
        }) as Promise<Response>,
    );

    render(<DailyTimeSummaryLineChartTeamWise />);

    expect(screen.getByText('Daily Time Summary by Team')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Total Time Saved')).toBeInTheDocument();

    expect(screen.getByText('Team A')).toBeInTheDocument();
    expect(screen.getByText('Team B')).toBeInTheDocument();

    expect(screen.getByText('2022-01-01')).toBeInTheDocument();
    expect(screen.getByText('2022-01-02')).toBeInTheDocument();

    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();

    (global.fetch as jest.Mock).mockRestore();
  });

  it('renders chart with filtered data when team prop is provided', () => {
    const mockData = {
      stats: [
        { date: '2022-01-01', team: 'Team A', total_time_saved: 10 },
        { date: '2022-01-02', team: 'Team A', total_time_saved: 20 },
        { date: '2022-01-01', team: 'Team B', total_time_saved: 15 },
        { date: '2022-01-02', team: 'Team B', total_time_saved: 25 },
      ],
    };

    jest.spyOn(global, 'fetch').mockImplementation(
      () =>
        Promise.resolve({
          json: () => Promise.resolve({ stats: mockData.stats }),
          headers: new Headers(),
          ok: true,
          redirected: false,
          status: 200,
          statusText: 'OK',
          type: 'basic',
          url: '',
        }) as Promise<Response>,
    );

    render(<DailyTimeSummaryLineChartTeamWise team="Team A" />);

    expect(screen.getByText('Daily Time Summary by Team')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Total Time Saved')).toBeInTheDocument();

    expect(screen.getByText('Team A')).toBeInTheDocument();

    expect(screen.getByText('2022-01-01')).toBeInTheDocument();
    expect(screen.getByText('2022-01-02')).toBeInTheDocument();

    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();

    expect(screen.queryByText('Team B')).not.toBeInTheDocument();
    expect(screen.queryByText('15')).not.toBeInTheDocument();
    expect(screen.queryByText('25')).not.toBeInTheDocument();

    (global.fetch as jest.Mock).mockRestore();
  });
});
