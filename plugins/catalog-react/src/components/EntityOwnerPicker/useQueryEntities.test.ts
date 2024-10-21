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

import { renderHook, waitFor } from '@testing-library/react';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import { useQueryEntities } from './useQueryEntities';

const mockCatalogApi = catalogApiMock.mock();

jest.mock('@backstage/core-plugin-api', () => ({
  ...jest.requireActual('@backstage/core-plugin-api'),
  useApi: () => mockCatalogApi,
}));

describe('useQueryEntities', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it(`should not invoke queryEntities on mount`, () => {
    mockCatalogApi.queryEntities.mockResolvedValue({
      items: [],
      pageInfo: {},
      totalItems: 0,
    });

    renderHook(() => useQueryEntities());
    expect(mockCatalogApi.queryEntities).not.toHaveBeenCalled();
  });

  it(`should fetch the data accordingly`, async () => {
    mockCatalogApi.queryEntities
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

    const { result } = renderHook(() => useQueryEntities());
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
    expect(mockCatalogApi.queryEntities).toHaveBeenCalledWith({
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
    expect(mockCatalogApi.queryEntities).toHaveBeenCalledWith({
      cursor: 'next',
      limit: 20,
    });
  });
});
