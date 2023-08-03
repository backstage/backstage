/*
 * Copyright 2023 The Backstage Authors
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
import { renderHook } from '@testing-library/react-hooks';
import { CatalogApi } from '@backstage/catalog-client';
import { useQueryEntities } from './useQueryEntities';

const mockedQueryEntities: jest.MockedFn<CatalogApi['queryEntities']> =
  jest.fn();

const mockCatalogApi: Partial<CatalogApi> = {
  queryEntities: mockedQueryEntities,
};

jest.mock('@backstage/core-plugin-api', () => ({
  ...jest.requireActual('@backstage/core-plugin-api'),
  useApi: () => mockCatalogApi,
}));

describe('useQueryEntities', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it(`should not invoke queryEntities on mount`, () => {
    mockedQueryEntities.mockResolvedValue({
      items: [],
      pageInfo: {},
      totalItems: 0,
    });

    renderHook(() => useQueryEntities());
    expect(mockedQueryEntities).not.toHaveBeenCalled();
  });

  it(`should fetch the data accordingly`, async () => {
    mockedQueryEntities
      .mockResolvedValueOnce({
        items: [
          { apiVersion: '1', kind: 'kind', metadata: { name: 'name-1' } },
        ],
        pageInfo: { nextCursor: 'next' },
        totalItems: 2,
      })
      .mockResolvedValueOnce({
        items: [
          { apiVersion: '1', kind: 'kind', metadata: { name: 'name-2' } },
        ],
        pageInfo: {},
        totalItems: 2,
      });

    const { result, waitFor } = renderHook(() => useQueryEntities());
    const [, fetch] = result.current!;
    fetch({ text: 'text' });

    await waitFor(() =>
      expect(result.current[0].value!).toEqual({
        items: [
          { apiVersion: '1', kind: 'kind', metadata: { name: 'name-1' } },
        ],
        cursor: 'next',
      }),
    );
    expect(mockedQueryEntities).toHaveBeenCalledWith({
      filter: { kind: ['User', 'Group'] },
      fullTextFilter: {
        fields: [
          'metadata.name',
          'kind',
          'spec.profile.displayname',
          'metadata.title',
        ],
        term: 'text',
      },
      limit: 20,
      orderFields: [{ field: 'metadata.name', order: 'asc' }],
    });

    fetch(result.current[0].value!);
    await waitFor(() =>
      expect(result.current[0].value!).toEqual({
        items: [
          { apiVersion: '1', kind: 'kind', metadata: { name: 'name-1' } },
          { apiVersion: '1', kind: 'kind', metadata: { name: 'name-2' } },
        ],
      }),
    );
    expect(mockedQueryEntities).toHaveBeenCalledWith({
      cursor: 'next',
      limit: 20,
    });
  });
});
