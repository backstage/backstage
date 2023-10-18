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

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { MockEntityListContextProvider } from '../../testUtils/providers';
import { EntityLifecycleFilter } from '../../filters';
import { EntityLifecyclePicker } from './EntityLifecyclePicker';
import { TestApiProvider } from '@backstage/test-utils';
import { catalogApiRef } from '../../api';
import { CatalogApi } from '@backstage/catalog-client';

describe('<EntityLifecyclePicker/>', () => {
  const catalogApi = {
    getEntityFacets: jest.fn(),
  } as unknown as jest.Mocked<CatalogApi>;

  beforeEach(() => {
    catalogApi.getEntityFacets.mockResolvedValue({
      facets: {
        'spec.lifecycle': [
          { count: 1, value: 'experimental' },
          { count: 1, value: 'production' },
        ],
      },
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders all lifecycles', async () => {
    render(
      <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
        <MockEntityListContextProvider value={{}}>
          <EntityLifecyclePicker />
        </MockEntityListContextProvider>
      </TestApiProvider>,
    );
    expect(await screen.findByText('Lifecycle')).toBeInTheDocument();

    fireEvent.click(await screen.findByTestId('lifecycles-picker-expand'));
    expect(screen.getByText('experimental')).toBeInTheDocument();
    expect(screen.getByText('production')).toBeInTheDocument();
  });

  it('respects the query parameter filter value', async () => {
    const updateFilters = jest.fn();
    const queryParameters = { lifecycles: ['experimental'] };
    render(
      <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
        <MockEntityListContextProvider
          value={{
            updateFilters,
            queryParameters,
          }}
        >
          <EntityLifecyclePicker />
        </MockEntityListContextProvider>
      </TestApiProvider>,
    );

    await waitFor(() => expect(catalogApi.getEntityFacets).toHaveBeenCalled());
    expect(updateFilters).toHaveBeenLastCalledWith({
      lifecycles: new EntityLifecycleFilter(['experimental']),
    });
  });

  it('adds lifecycles to filters', async () => {
    const updateFilters = jest.fn();
    render(
      <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
        <MockEntityListContextProvider
          value={{
            updateFilters,
          }}
        >
          <EntityLifecyclePicker />
        </MockEntityListContextProvider>
      </TestApiProvider>,
    );
    expect(updateFilters).toHaveBeenLastCalledWith({
      lifecycles: undefined,
    });

    fireEvent.click(await screen.findByTestId('lifecycles-picker-expand'));
    fireEvent.click(screen.getByText('production'));
    expect(updateFilters).toHaveBeenLastCalledWith({
      lifecycles: new EntityLifecycleFilter(['production']),
    });
  });

  it('removes lifecycles from filters', async () => {
    const updateFilters = jest.fn();
    render(
      <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
        <MockEntityListContextProvider
          value={{
            updateFilters,
            filters: { lifecycles: new EntityLifecycleFilter(['production']) },
          }}
        >
          <EntityLifecyclePicker />
        </MockEntityListContextProvider>
      </TestApiProvider>,
    );

    await waitFor(() => expect(catalogApi.getEntityFacets).toHaveBeenCalled());
    expect(updateFilters).toHaveBeenLastCalledWith({
      lifecycles: new EntityLifecycleFilter(['production']),
    });
    fireEvent.click(screen.getByTestId('lifecycles-picker-expand'));
    expect(screen.getByLabelText('production')).toBeChecked();

    fireEvent.click(screen.getByLabelText('production'));
    expect(updateFilters).toHaveBeenLastCalledWith({
      lifecycles: undefined,
    });
  });

  it('responds to external queryParameters changes', async () => {
    const updateFilters = jest.fn();
    const rendered = render(
      <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
        <MockEntityListContextProvider
          value={{
            updateFilters,
            queryParameters: { lifecycles: ['experimental'] },
          }}
        >
          <EntityLifecyclePicker />
        </MockEntityListContextProvider>
      </TestApiProvider>,
    );

    await waitFor(() => expect(catalogApi.getEntityFacets).toHaveBeenCalled());
    expect(updateFilters).toHaveBeenLastCalledWith({
      lifecycles: new EntityLifecycleFilter(['experimental']),
    });

    rendered.rerender(
      <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
        <MockEntityListContextProvider
          value={{
            updateFilters,
            queryParameters: { lifecycles: ['production'] },
          }}
        >
          <EntityLifecyclePicker />
        </MockEntityListContextProvider>
      </TestApiProvider>,
    );
    expect(updateFilters).toHaveBeenLastCalledWith({
      lifecycles: new EntityLifecycleFilter(['production']),
    });
  });

  it('removes lifecycles from filters if there are no available lifecycles', async () => {
    catalogApi.getEntityFacets.mockResolvedValue({
      facets: {
        'spec.lifecycle': [],
      },
    });

    const updateFilters = jest.fn();
    render(
      <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
        <MockEntityListContextProvider
          value={{
            updateFilters,
            queryParameters: { lifecycles: ['experimental'] },
          }}
        >
          <EntityLifecyclePicker />
        </MockEntityListContextProvider>
      </TestApiProvider>,
    );

    await waitFor(() => expect(catalogApi.getEntityFacets).toHaveBeenCalled());
    expect(updateFilters).toHaveBeenLastCalledWith({
      lifecycles: undefined,
    });
  });

  it('responds to initialFilter prop', async () => {
    const updateFilters = jest.fn();
    render(
      <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
        <MockEntityListContextProvider
          value={{
            updateFilters,
          }}
        >
          <EntityLifecyclePicker initialFilter={['production']} />
        </MockEntityListContextProvider>
      </TestApiProvider>,
    );

    await waitFor(() => expect(catalogApi.getEntityFacets).toHaveBeenCalled());
    expect(updateFilters).toHaveBeenLastCalledWith({
      lifecycles: new EntityLifecycleFilter(['production']),
    });
  });
});
