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

import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import { EntityListProvider, useStarredEntities } from '../../hooks';
import { catalogApiRef } from '../../api';
import { ApiRef } from '@backstage/core-plugin-api';
import { MemoryRouter } from 'react-router-dom';
import { useStarredEntitiesCount } from './useStarredEntitiesCount';
import { renderHook, waitFor } from '@testing-library/react';

const mockCatalogApi = catalogApiMock.mock();

const mockStarredEntities: jest.MockedFn<() => Set<string>> = jest.fn();

const mockUseStarredEntities: ReturnType<typeof useStarredEntities> = {
  get starredEntities() {
    return mockStarredEntities();
  },
} as ReturnType<typeof useStarredEntities>;

jest.mock('../../hooks', () => {
  const actual = jest.requireActual('../../hooks');
  return { ...actual, useStarredEntities: () => mockUseStarredEntities };
});

jest.mock('@backstage/core-plugin-api', () => {
  const actual = jest.requireActual('@backstage/core-plugin-api');
  return {
    ...actual,
    useApi: (ref: ApiRef<any>) =>
      ref === catalogApiRef ? mockCatalogApi : actual.useApi(ref),
  };
});

describe('useStarredEntitiesCount', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return the count', async () => {
    mockStarredEntities.mockReturnValue(
      new Set(['component:default/favourite1', 'component:default/favourite2']),
    );
    mockCatalogApi.queryEntities.mockResolvedValue({
      items: [
        {
          apiVersion: '1',
          kind: 'component',
          metadata: { name: 'favourite1' },
        },
        {
          apiVersion: '1',
          kind: 'component',
          metadata: { name: 'favourite2' },
        },
      ],
      totalItems: 2,
      pageInfo: {},
    });

    const { result } = renderHook(() => useStarredEntitiesCount(), {
      wrapper: ({ children }) => (
        <MemoryRouter>
          <EntityListProvider>{children}</EntityListProvider>
        </MemoryRouter>
      ),
    });

    await waitFor(() => {
      expect(mockCatalogApi.queryEntities).toHaveBeenCalledWith({
        filter: {
          'metadata.name': ['favourite1', 'favourite2'],
        },
        limit: 1000,
      });
      expect(result.current).toEqual({
        count: 2,
        loading: false,
        filter: {
          refs: [
            'component:default/favourite1',
            'component:default/favourite2',
          ],
          value: 'starred',
        },
      });
    });
  });

  it(`shouldn't invoke the endpoint if there are no starred entities`, async () => {
    mockStarredEntities.mockReturnValue(new Set());

    const { result } = renderHook(() => useStarredEntitiesCount(), {
      wrapper: ({ children }) => (
        <MemoryRouter>
          <EntityListProvider>{children}</EntityListProvider>
        </MemoryRouter>
      ),
    });

    await expect(
      waitFor(() => expect(mockCatalogApi.queryEntities).toHaveBeenCalled()),
    ).rejects.toThrow();
    expect(result.current).toEqual({
      count: 0,
      loading: false,
      filter: { refs: [], value: 'starred' },
    });
  });
});
