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

import { fireEvent, screen, waitFor } from '@testing-library/react';
import {
  MockEntityListContextProvider,
  catalogApiMock,
} from '@backstage/plugin-catalog-react/testUtils';
import { EntityNamespaceFilter } from '../../filters';
import { EntityNamespacePicker } from './EntityNamespacePicker';
import { TestApiProvider, renderInTestApp } from '@backstage/test-utils';
import { catalogApiRef } from '../../api';

const namespaces = ['namespace-1', 'namespace-2', 'namespace-3'];

describe('<EntityNamespacePicker/>', () => {
  const catalogApi = catalogApiMock.mock({
    getEntityFacets: async () => ({
      facets: {
        'metadata.namespace': namespaces.map((value, idx) => ({
          value,
          count: idx,
        })),
      },
    }),
  });

  it('renders all namespaces', async () => {
    await renderInTestApp(
      <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
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
    await renderInTestApp(
      <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
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
    await renderInTestApp(
      <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
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
    await renderInTestApp(
      <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
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
      expect(screen.getByTestId('namespace-picker-expand')).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByTestId('namespace-picker-expand'));
    fireEvent.click(screen.getByText('namespace-2'));
    expect(updateFilters).toHaveBeenLastCalledWith({
      namespace: new EntityNamespaceFilter(['namespace-2']),
    });
  });

  it('removes namespaces from filters', async () => {
    const updateFilters = jest.fn();
    await renderInTestApp(
      <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
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
    const rendered = await renderInTestApp(
      <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
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
      <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
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
    const mockCatalogApiRefNoNamespace = catalogApiMock.mock({
      getEntityFacets: async () => ({
        facets: {
          'metadata.namespace': [],
        },
      }),
    });

    await renderInTestApp(
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
  it('namespace picker is visible if there are only 1 available option', async () => {
    const defaultNamespaces = ['default', 'default', 'default'];
    const mockCatalogApiRefDefaultNamespace = catalogApiMock.mock({
      getEntityFacets: async () => ({
        facets: {
          'metadata.namespace': defaultNamespaces.map((value, idx) => ({
            value,
            count: idx,
          })),
        },
      }),
    });
    await renderInTestApp(
      <TestApiProvider
        apis={[[catalogApiRef, mockCatalogApiRefDefaultNamespace]]}
      >
        <MockEntityListContextProvider value={{}}>
          <EntityNamespacePicker />
        </MockEntityListContextProvider>
      </TestApiProvider>,
    );
    await waitFor(() =>
      expect(screen.queryByText('Namespace')).toBeInTheDocument(),
    );
  });
  it('namespace picker is invisible if there is zero available option', async () => {
    const mockCatalogApiRefDefaultNamespace = catalogApiMock.mock({
      getEntityFacets: async () => ({
        facets: {
          'metadata.namespace': [],
        },
      }),
    });
    await renderInTestApp(
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
  it('renders initially selected namespaces', async () => {
    renderInTestApp(
      <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
        <MockEntityListContextProvider value={{}}>
          <EntityNamespacePicker
            initiallySelectedNamespaces={['namespace-2', 'namespace-3']}
          />
        </MockEntityListContextProvider>
      </TestApiProvider>,
    );
    await waitFor(() =>
      expect(screen.getByText('Namespace')).toBeInTheDocument(),
    );

    const buttons = screen
      .getAllByRole('button')
      .map(o => o.textContent)
      .filter(b => b);

    expect(buttons).toEqual(['namespace-2', 'namespace-3']);
  });
});
