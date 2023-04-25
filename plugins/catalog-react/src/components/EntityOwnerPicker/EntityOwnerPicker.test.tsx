/*
 * Copyright 2021 The Backstage Authors
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

import { Entity } from '@backstage/catalog-model';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { MockEntityListContextProvider } from '../../testUtils/providers';
import { EntityOwnerFilter } from '../../filters';
import { EntityOwnerPicker } from './EntityOwnerPicker';
import { ApiProvider } from '@backstage/core-app-api';
import {
  MockErrorApi,
  renderWithEffects,
  TestApiRegistry,
} from '@backstage/test-utils';
import { catalogApiRef, CatalogApi } from '../..';
import { errorApiRef } from '@backstage/core-plugin-api';
import { QueryEntitiesCursorRequest } from '@backstage/catalog-client';

const ownerEntitiesBatch1: Entity[] = [
  {
    apiVersion: '1',
    kind: 'Group',
    metadata: {
      name: 'some-owner',
    },
  },
  {
    apiVersion: '1',
    kind: 'Group',
    metadata: {
      name: 'some-owner-2',
    },
    spec: {
      profile: {
        displayName: 'Some Owner 2',
      },
    },
  },
  {
    apiVersion: '1',
    kind: 'Group',
    metadata: {
      name: 'another-owner',
      title: 'Another Owner',
    },
  },
  {
    apiVersion: '1',
    kind: 'Group',
    metadata: {
      namespace: 'test-namespace',
      name: 'another-owner-2',
      title: 'Another Owner in Another Namespace',
    },
  },
];

const ownerEntitiesBatch2: Entity[] = [
  {
    apiVersion: '1',
    kind: 'Group',
    metadata: {
      name: 'some-owner-batch-2',
    },
  },
  {
    apiVersion: '1',
    kind: 'Group',
    metadata: {
      name: 'some-owner-2-batch-2',
    },
    spec: {
      profile: {
        displayName: 'Some Owner Batch 2',
      },
    },
  },
  {
    apiVersion: '1',
    kind: 'Group',
    metadata: {
      name: 'another-owner-batch-2',
      title: 'Another Owner Batch 2',
    },
  },
  {
    apiVersion: '1',
    kind: 'Group',
    metadata: {
      namespace: 'test-namespace',
      name: 'another-owner-2-batch-2',
      title: 'Another Owner in Another Namespace Batch 2',
    },
  },
];

const mockedQueryEntities: jest.MockedFn<CatalogApi['queryEntities']> =
  jest.fn();

const mockCatalogApi: Partial<CatalogApi> = {
  queryEntities: mockedQueryEntities,
};

const mockErrorApi = new MockErrorApi();

describe('<EntityOwnerPicker/>', () => {
  const mockApis = TestApiRegistry.from(
    [catalogApiRef, mockCatalogApi],
    [errorApiRef, mockErrorApi],
  );

  beforeEach(() => {
    jest.resetAllMocks();

    mockedQueryEntities.mockImplementation(async request => {
      const totalItems =
        ownerEntitiesBatch1.length + ownerEntitiesBatch2.length;
      if ((request as QueryEntitiesCursorRequest).cursor) {
        return {
          items: ownerEntitiesBatch2,
          pageInfo: {},
          totalItems,
        };
      }
      return {
        items: ownerEntitiesBatch1,
        pageInfo: {
          nextCursor: 'nextCursor',
        },
        totalItems,
      };
    });
  });

  it('renders all owners', async () => {
    await renderWithEffects(
      <ApiProvider apis={mockApis}>
        <MockEntityListContextProvider value={{}}>
          <EntityOwnerPicker />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );
    expect(screen.getByText('Owner')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('owner-picker-expand'));

    await waitFor(() =>
      expect(screen.getByText('Another Owner')).toBeInTheDocument(),
    );

    [
      'some-owner',
      'Some Owner 2',
      'Another Owner in Another Namespace',
    ].forEach(owner => {
      expect(screen.getByText(owner)).toBeInTheDocument();
    });

    expect(mockedQueryEntities).toHaveBeenCalledTimes(1);

    fireEvent.scroll(screen.getByTestId('owner-picker-listbox'));

    await waitFor(() =>
      expect(screen.getByText('some-owner-batch-2')).toBeInTheDocument(),
    );

    [
      'some-owner-batch-2',
      'Some Owner Batch 2',
      'Another Owner in Another Namespace Batch 2',
    ].forEach(owner => {
      expect(screen.getByText(owner)).toBeInTheDocument();
    });

    expect(mockedQueryEntities).toHaveBeenCalledTimes(2);
  });

  it('respects the query parameter filter value', async () => {
    const updateFilters = jest.fn();
    const queryParameters = { owners: ['another-owner'] };
    await renderWithEffects(
      <ApiProvider apis={mockApis}>
        <MockEntityListContextProvider
          value={{
            updateFilters,
            queryParameters,
          }}
        >
          <EntityOwnerPicker />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );

    expect(updateFilters).toHaveBeenLastCalledWith({
      owners: new EntityOwnerFilter(['group:default/another-owner']),
    });
  });

  it('adds owners to filters', async () => {
    const updateFilters = jest.fn();
    await renderWithEffects(
      <ApiProvider apis={mockApis}>
        <MockEntityListContextProvider
          value={{
            updateFilters,
          }}
        >
          <EntityOwnerPicker />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );
    expect(updateFilters).toHaveBeenLastCalledWith({
      owners: undefined,
    });

    fireEvent.click(screen.getByTestId('owner-picker-expand'));
    await waitFor(() => screen.getByText('some-owner'));

    fireEvent.click(screen.getByText('some-owner'));
    expect(updateFilters).toHaveBeenLastCalledWith({
      owners: new EntityOwnerFilter(['group:default/some-owner']),
    });
  });

  it('removes owners from filters', async () => {
    const updateFilters = jest.fn();
    await renderWithEffects(
      <ApiProvider apis={mockApis}>
        <MockEntityListContextProvider
          value={{
            updateFilters,
            filters: { owners: new EntityOwnerFilter(['some-owner']) },
          }}
        >
          <EntityOwnerPicker />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );
    expect(updateFilters).toHaveBeenLastCalledWith({
      owners: new EntityOwnerFilter(['group:default/some-owner']),
    });
    fireEvent.click(screen.getByTestId('owner-picker-expand'));

    await waitFor(() =>
      expect(screen.getByLabelText('some-owner')).toBeChecked(),
    );

    fireEvent.click(screen.getByLabelText('some-owner'));
    expect(updateFilters).toHaveBeenLastCalledWith({
      owner: undefined,
    });
  });

  it('responds to external queryParameters changes', async () => {
    const updateFilters = jest.fn();
    const rendered = await renderWithEffects(
      <ApiProvider apis={mockApis}>
        <MockEntityListContextProvider
          value={{
            updateFilters,
            queryParameters: { owners: ['team-a'] },
          }}
        >
          <EntityOwnerPicker />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );
    expect(updateFilters).toHaveBeenLastCalledWith({
      owners: new EntityOwnerFilter(['group:default/team-a']),
    });
    rendered.rerender(
      <ApiProvider apis={mockApis}>
        <MockEntityListContextProvider
          value={{
            updateFilters,
            queryParameters: { owners: ['team-b'] },
          }}
        >
          <EntityOwnerPicker />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );
    expect(updateFilters).toHaveBeenLastCalledWith({
      owners: new EntityOwnerFilter(['group:default/team-b']),
    });
  });
});
