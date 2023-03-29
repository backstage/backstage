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
import { EntityNamespaceFilter } from '../../filters';
import { EntityNamespacePicker } from './EntityNamespacePicker';
import { TestApiProvider } from '@backstage/test-utils';
import { catalogApiRef } from '../../api';
import { CatalogApi } from '@backstage/catalog-client';

const namespaces = ['namespace-1', 'namespace-2', 'namespace-3'];

describe('<EntityNamespacePicker/>', () => {
  const mockCatalogApiRef = {
    getEntityFacets: async () => ({
      facets: {
        'metadata.namespace': namespaces.map((value, idx) => ({
          value,
          count: idx,
        })),
      },
    }),
  } as unknown as CatalogApi;

  it('renders all namespaces', async () => {
    render(
      <TestApiProvider apis={[[catalogApiRef, mockCatalogApiRef]]}>
        <MockEntityListContextProvider value={{}}>
          <EntityNamespacePicker />
        </MockEntityListContextProvider>
      </TestApiProvider>,
    );
    await waitFor(() =>
      expect(screen.getByText('Namespace')).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByTestId('namespace-picker-expand'));
    namespaces.forEach(namespace => {
      expect(screen.getByText(namespace as string)).toBeInTheDocument();
    });
  });

  it('renders unique namespaces in alphabetical order', async () => {
    render(
      <TestApiProvider apis={[[catalogApiRef, mockCatalogApiRef]]}>
        <MockEntityListContextProvider value={{}}>
          <EntityNamespacePicker />
        </MockEntityListContextProvider>
      </TestApiProvider>,
    );
    await waitFor(() =>
      expect(screen.getByText('Namespace')).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByTestId('namespace-picker-expand'));

    expect(screen.getAllByRole('option').map(o => o.textContent)).toEqual([
      'namespace-1',
      'namespace-2',
      'namespace-3',
    ]);
  });

  it('respects the query parameter filter value', async () => {
    const updateFilters = jest.fn();
    const queryParameters = { namespace: ['namespace-1'] };
    render(
      <TestApiProvider apis={[[catalogApiRef, mockCatalogApiRef]]}>
        <MockEntityListContextProvider
          value={{
            updateFilters,
            queryParameters,
          }}
        >
          <EntityNamespacePicker />
        </MockEntityListContextProvider>
      </TestApiProvider>,
    );

    await waitFor(() =>
      expect(updateFilters).toHaveBeenLastCalledWith({
        namespace: new EntityNamespaceFilter(['namespace-1']),
      }),
    );
  });

  it('adds namespaces to filters', async () => {
    const updateFilters = jest.fn();
    render(
      <TestApiProvider apis={[[catalogApiRef, mockCatalogApiRef]]}>
        <MockEntityListContextProvider
          value={{
            updateFilters,
          }}
        >
          <EntityNamespacePicker />
        </MockEntityListContextProvider>
      </TestApiProvider>,
    );
    await waitFor(() =>
      expect(updateFilters).toHaveBeenLastCalledWith({
        namespace: undefined,
      }),
    );

    fireEvent.click(screen.getByTestId('namespace-picker-expand'));
    fireEvent.click(screen.getByText('namespace-2'));
    expect(updateFilters).toHaveBeenLastCalledWith({
      namespace: new EntityNamespaceFilter(['namespace-2']),
    });
  });

  it('removes namespaces from filters', async () => {
    const updateFilters = jest.fn();
    render(
      <TestApiProvider apis={[[catalogApiRef, mockCatalogApiRef]]}>
        <MockEntityListContextProvider
          value={{
            updateFilters,
            filters: { namespace: new EntityNamespaceFilter(['namespace-2']) },
          }}
        >
          <EntityNamespacePicker />
        </MockEntityListContextProvider>
      </TestApiProvider>,
    );
    await waitFor(() =>
      expect(updateFilters).toHaveBeenLastCalledWith({
        namespace: new EntityNamespaceFilter(['namespace-2']),
      }),
    );

    fireEvent.click(screen.getByTestId('namespace-picker-expand'));
    expect(screen.getByLabelText('namespace-2')).toBeChecked();

    fireEvent.click(screen.getByLabelText('namespace-2'));
    expect(updateFilters).toHaveBeenLastCalledWith({
      namespace: undefined,
    });
  });

  it('responds to external queryParameters changes', async () => {
    const updateFilters = jest.fn();
    const rendered = render(
      <TestApiProvider apis={[[catalogApiRef, mockCatalogApiRef]]}>
        <MockEntityListContextProvider
          value={{
            updateFilters,
            queryParameters: { namespace: ['namespace-1'] },
          }}
        >
          <EntityNamespacePicker />
        </MockEntityListContextProvider>
      </TestApiProvider>,
    );
    await waitFor(() =>
      expect(updateFilters).toHaveBeenLastCalledWith({
        namespace: new EntityNamespaceFilter(['namespace-1']),
      }),
    );
    rendered.rerender(
      <TestApiProvider apis={[[catalogApiRef, mockCatalogApiRef]]}>
        <MockEntityListContextProvider
          value={{
            updateFilters,
            queryParameters: { namespace: ['namespace-2'] },
          }}
        >
          <EntityNamespacePicker />
        </MockEntityListContextProvider>
      </TestApiProvider>,
    );
    expect(updateFilters).toHaveBeenLastCalledWith({
      namespace: new EntityNamespaceFilter(['namespace-2']),
    });
  });
  it('removes namespaces from filters if there are no available namespaces', async () => {
    const updateFilters = jest.fn();
    const mockCatalogApiRefNoNamespace = {
      getEntityFacets: async () => ({
        facets: {
          'metadata.namespace': {},
        },
      }),
    } as unknown as CatalogApi;

    render(
      <TestApiProvider apis={[[catalogApiRef, mockCatalogApiRefNoNamespace]]}>
        <MockEntityListContextProvider
          value={{
            updateFilters,
            queryParameters: { namespace: ['namespace-1'] },
          }}
        >
          <EntityNamespacePicker />
        </MockEntityListContextProvider>
      </TestApiProvider>,
    );
    await waitFor(() =>
      expect(updateFilters).toHaveBeenLastCalledWith({
        namespace: undefined,
      }),
    );
  });
  it('namespace picker is invisible if there are only 1 available option', async () => {
    const defaultNamespaces = ['default', 'default', 'default'];
    const mockCatalogApiRefDefaultNamespace = {
      getEntityFacets: async () => ({
        facets: {
          'metadata.namespace': defaultNamespaces.map((value, idx) => ({
            value,
            count: idx,
          })),
        },
      }),
    } as unknown as CatalogApi;
    render(
      <TestApiProvider
        apis={[[catalogApiRef, mockCatalogApiRefDefaultNamespace]]}
      >
        <MockEntityListContextProvider value={{}}>
          <EntityNamespacePicker />
        </MockEntityListContextProvider>
      </TestApiProvider>,
    );
    await waitFor(() =>
      expect(screen.queryByText('Namespace')).not.toBeInTheDocument(),
    );
  });
});
