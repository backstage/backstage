/*
 * Copyright 2026 The Backstage Authors
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
import { render, screen } from '@testing-library/react';
import { useApi } from '@backstage/core-plugin-api';
import useAsync from 'react-use/esm/useAsync';
import { GoldenPathsRecentlyVisited } from './GoldenPathsRecentlyVisited';

jest.mock('@backstage/core-plugin-api', () => ({
  useApi: jest.fn(),
}));

jest.mock('@backstage/plugin-golden-paths-react', () => ({
  goldenPathsApiRef: {},
}));

jest.mock('react-use/esm/useAsync', () => jest.fn());

jest.mock('./RecentlyVisitedCard/RecentlyVisitedCard', () => ({
  RecentlyVisitedGoldenPathCard: jest.fn(() => (
    <div>RecentlyVisitedGoldenPathCard</div>
  )),
}));

jest.mock('@backstage/core-components', () => ({
  ErrorPanel: jest.fn(() => <div>ErrorPanel</div>),
  EmptyState: jest.fn(() => <div>EmptyState</div>),
  LinkButton: jest.fn(() => <div>LinkButton</div>),
}));

describe('GoldenPathsRecentlyVisited', () => {
  const mockGoldenPathsApi = {
    listTasks: jest.fn(),
  };

  beforeEach(() => {
    (useApi as jest.Mock).mockReturnValue(mockGoldenPathsApi);
  });

  it('renders loading state', () => {
    (useAsync as jest.Mock).mockReturnValue({ loading: true });
    render(<GoldenPathsRecentlyVisited />);
    expect(screen.queryByText('ErrorPanel')).not.toBeInTheDocument();
    expect(screen.queryByText('EmptyState')).not.toBeInTheDocument();
    expect(
      screen.queryByText('RecentlyVisitedGoldenPathCard'),
    ).not.toBeInTheDocument();
  });

  it('renders error state', () => {
    (useAsync as jest.Mock).mockReturnValue({ error: new Error('Test error') });
    render(<GoldenPathsRecentlyVisited />);
    expect(screen.getByText('ErrorPanel')).toBeInTheDocument();
    expect(screen.getByText('EmptyState')).toBeInTheDocument();
  });

  it('renders empty state when no tasks', () => {
    (useAsync as jest.Mock).mockReturnValue({ value: { tasks: [] } });
    render(<GoldenPathsRecentlyVisited />);
    expect(screen.queryByText('ErrorPanel')).not.toBeInTheDocument();
    expect(screen.queryByText('EmptyState')).not.toBeInTheDocument();
    expect(
      screen.queryByText('RecentlyVisitedGoldenPathCard'),
    ).not.toBeInTheDocument();
  });

  it('renders tasks', () => {
    const tasks = [
      { id: '1', spec: {}, createdAt: '2023-01-01', status: 'completed' },
      { id: '2', spec: {}, createdAt: '2023-01-02', status: 'in-progress' },
    ];
    (useAsync as jest.Mock).mockReturnValue({
      loading: false,
      value: { tasks },
      error: null,
    });

    render(<GoldenPathsRecentlyVisited />);
    expect(screen.queryByText('ErrorPanel')).not.toBeInTheDocument();
    expect(screen.queryByText('EmptyState')).not.toBeInTheDocument();
  });
});
