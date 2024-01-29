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
import StatsTable from './StatsTable';

describe('StatsTable', () => {
  it('renders loading spinner when data is null', () => {
    render(<StatsTable />);
    const loadingSpinner = screen.getByRole('progressbar');
    expect(loadingSpinner).toBeInTheDocument();
  });

  it('renders table with data when data is not null', () => {
    const mockData = [
      { id: '1', sum: 10, team: 'Team A', template_name: 'Template 1' },
      { id: '2', sum: 20, team: 'Team B', template_name: 'Template 2' },
    ];
    render(<StatsTable />);
    const tableRows = screen.getAllByRole('row');
    expect(tableRows).toHaveLength(mockData.length + 1); // +1 for header row
  });
});
