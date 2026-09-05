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

import { renderInTestApp } from '@backstage/test-utils';
import { ExternalDependenciesContent } from './ExternalDependenciesContent';
import { useExternalDependencies } from '../../../hooks';

jest.mock('../../../hooks', () => ({
  useExternalDependencies: jest.fn(),
}));

const mockUseExternalDependencies =
  useExternalDependencies as jest.MockedFunction<
    typeof useExternalDependencies
  >;

describe('ExternalDependenciesContent', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders external dependencies in a table', async () => {
    mockUseExternalDependencies.mockReturnValue({
      loading: false,
      externalDependencies: [
        {
          name: 'GitHub',
          type: 'rest',
          target: 'https://api.github.com',
          status: 'Healthy',
        },
        {
          name: 'Postgres',
          type: 'tcp',
          target: 'db.internal:5432',
          status: 'Unhealthy',
          error: 'connection refused',
        },
      ],
    });

    const { findByText } = await renderInTestApp(
      <ExternalDependenciesContent />,
    );

    expect(await findByText('GitHub')).toBeInTheDocument();
    expect(await findByText('https://api.github.com')).toBeInTheDocument();
    expect(await findByText('Postgres')).toBeInTheDocument();
    expect(await findByText('connection refused')).toBeInTheDocument();
  });

  it('renders an empty state when there are no dependencies', async () => {
    mockUseExternalDependencies.mockReturnValue({
      loading: false,
      externalDependencies: [],
    });

    const { getByText } = await renderInTestApp(
      <ExternalDependenciesContent />,
    );

    expect(getByText('No external dependencies found')).toBeInTheDocument();
  });

  it('renders an error state', async () => {
    mockUseExternalDependencies.mockReturnValue({
      loading: false,
      error: new Error('failed to fetch'),
    });

    const { queryByText } = await renderInTestApp(
      <ExternalDependenciesContent />,
    );

    expect(queryByText('GitHub')).not.toBeInTheDocument();
  });
});
