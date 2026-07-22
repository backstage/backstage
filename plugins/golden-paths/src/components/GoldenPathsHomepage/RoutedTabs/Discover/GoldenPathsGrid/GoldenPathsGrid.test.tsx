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
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { useEntityList } from '@backstage/plugin-catalog-react';
import { ApiRef, ErrorApi, errorApiRef } from '@backstage/core-plugin-api';
import { toString } from 'lodash';

import { GoldenPathsGrid } from './GoldenPathsGrid';
import { entities } from '../../../../../test-utils';

const MOCK_TEXT = 'MockComponent';

jest.mock('@backstage/plugin-catalog-react', () => ({
  useEntityList: jest.fn(),
  CatalogFilterLayout: jest.fn(),
  EntityProvider: jest.fn(() => <div>{MOCK_TEXT}</div>),
  catalogApiRef: jest.fn(),
  StarredEntitiesApi: jest.fn(),
  starredEntitiesApiRef: jest.fn(),
}));

jest.mock('../GoldenPathCard', () => ({
  GoldenPathCard: jest.fn(),
}));

const apis: [ApiRef<ErrorApi>, Partial<ErrorApi>][] = [[errorApiRef, {}]];

describe('GoldenPathsGrid', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should render progress during loading', async () => {
    (useEntityList as jest.Mock).mockReturnValue({ loading: true });

    const { findByTestId } = await renderInTestApp(
      <TestApiProvider apis={apis}>
        <GoldenPathsGrid />
      </TestApiProvider>,
    );

    const progress = await findByTestId('progress');
    expect(progress).toBeInTheDocument();
  });

  it('should display error message in case of error', async () => {
    const mockError = new Error('test message');
    (useEntityList as jest.Mock).mockReturnValue({ error: mockError });

    const { findByText } = await renderInTestApp(
      <TestApiProvider apis={apis}>
        <GoldenPathsGrid />
      </TestApiProvider>,
    );

    const error = await findByText(toString(mockError));
    expect(error).toBeInTheDocument();
  });

  it("should display proper text when 'entities' value is null", async () => {
    (useEntityList as jest.Mock).mockReturnValue({ entities: null });

    const { findByText } = await renderInTestApp(
      <TestApiProvider apis={apis}>
        <GoldenPathsGrid />
      </TestApiProvider>,
    );

    const text = await findByText(/No Golden Paths found/);
    expect(text).toBeInTheDocument();
  });

  it("should display proper text when 'entities' has no values", async () => {
    (useEntityList as jest.Mock).mockReturnValue({ entities: [] });

    const { findByText } = await renderInTestApp(
      <TestApiProvider apis={apis}>
        <GoldenPathsGrid />
      </TestApiProvider>,
    );

    const text = await findByText(/No Golden Paths found/);
    expect(text).toBeInTheDocument();
  });

  it('should display Golden Paths and pagination', async () => {
    (useEntityList as jest.Mock).mockReturnValue({
      entities,
      setOffset: () => {},
      offset: 0,
      limit: 6,
    });

    const { findByText, findAllByText } = await renderInTestApp(
      <TestApiProvider apis={apis}>
        <GoldenPathsGrid />
      </TestApiProvider>,
    );

    const goldenPathItems = await findAllByText(MOCK_TEXT);
    expect(goldenPathItems).toHaveLength(2);

    const pagination = await findByText('Golden Paths per page:');
    expect(pagination).toBeInTheDocument();
  });
});
