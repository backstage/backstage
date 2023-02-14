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
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { MockEntityListContextProvider } from '../../testUtils/providers';
import { EntityNamespaceFilter } from '../../filters';
import { EntityNamespacePicker } from './EntityNamespacePicker';

const sampleEntities: Entity[] = [
  {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      name: 'component-1',
      namespace: 'namespace-1',
    },
    spec: {
      lifecycle: 'production',
    },
  },
  {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      name: 'component-2',
      namespace: 'namespace-2',
    },
    spec: {
      lifecycle: 'experimental',
    },
  },
  {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      name: 'component-3',
      namespace: 'namespace-3',
    },
    spec: {
      lifecycle: 'experimental',
    },
  },
];

describe('<EntityNamespacePicker/>', () => {
  it('renders all namespaces', () => {
    render(
      <MockEntityListContextProvider
        value={{ entities: sampleEntities, backendEntities: sampleEntities }}
      >
        <EntityNamespacePicker />
      </MockEntityListContextProvider>,
    );
    expect(screen.getByText('Namespace')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('namespace-picker-expand'));
    sampleEntities
      .map(e => e.metadata.namespace!)
      .forEach(namespace => {
        expect(screen.getByText(namespace as string)).toBeInTheDocument();
      });
  });

  it('renders unique namespaces in alphabetical order', () => {
    render(
      <MockEntityListContextProvider
        value={{ entities: sampleEntities, backendEntities: sampleEntities }}
      >
        <EntityNamespacePicker />
      </MockEntityListContextProvider>,
    );
    expect(screen.getByText('Namespace')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('namespace-picker-expand'));

    expect(screen.getAllByRole('option').map(o => o.textContent)).toEqual([
      'namespace-1',
      'namespace-2',
      'namespace-3',
    ]);
  });

  it('respects the query parameter filter value', () => {
    const updateFilters = jest.fn();
    const queryParameters = { namespace: ['namespace-1'] };
    render(
      <MockEntityListContextProvider
        value={{
          entities: sampleEntities,
          backendEntities: sampleEntities,
          updateFilters,
          queryParameters,
        }}
      >
        <EntityNamespacePicker />
      </MockEntityListContextProvider>,
    );

    expect(updateFilters).toHaveBeenLastCalledWith({
      namespace: new EntityNamespaceFilter(['namespace-1']),
    });
  });

  it('adds namespaces to filters', () => {
    const updateFilters = jest.fn();
    render(
      <MockEntityListContextProvider
        value={{
          entities: sampleEntities,
          backendEntities: sampleEntities,
          updateFilters,
        }}
      >
        <EntityNamespacePicker />
      </MockEntityListContextProvider>,
    );
    expect(updateFilters).toHaveBeenLastCalledWith({
      namespace: undefined,
    });

    fireEvent.click(screen.getByTestId('namespace-picker-expand'));
    fireEvent.click(screen.getByText('namespace-2'));
    expect(updateFilters).toHaveBeenLastCalledWith({
      namespace: new EntityNamespaceFilter(['namespace-2']),
    });
  });

  it('removes namespaces from filters', () => {
    const updateFilters = jest.fn();
    render(
      <MockEntityListContextProvider
        value={{
          entities: sampleEntities,
          backendEntities: sampleEntities,
          updateFilters,
          filters: { namespace: new EntityNamespaceFilter(['namespace-2']) },
        }}
      >
        <EntityNamespacePicker />
      </MockEntityListContextProvider>,
    );
    expect(updateFilters).toHaveBeenLastCalledWith({
      namespace: new EntityNamespaceFilter(['namespace-2']),
    });
    fireEvent.click(screen.getByTestId('namespace-picker-expand'));
    expect(screen.getByLabelText('namespace-2')).toBeChecked();

    fireEvent.click(screen.getByLabelText('namespace-2'));
    expect(updateFilters).toHaveBeenLastCalledWith({
      namespace: undefined,
    });
  });

  it('responds to external queryParameters changes', () => {
    const updateFilters = jest.fn();
    const rendered = render(
      <MockEntityListContextProvider
        value={{
          updateFilters,
          queryParameters: { namespace: ['namespace-1'] },
          backendEntities: sampleEntities,
        }}
      >
        <EntityNamespacePicker />
      </MockEntityListContextProvider>,
    );
    expect(updateFilters).toHaveBeenLastCalledWith({
      namespace: new EntityNamespaceFilter(['namespace-1']),
    });
    rendered.rerender(
      <MockEntityListContextProvider
        value={{
          updateFilters,
          queryParameters: { namespace: ['namespace-2'] },
          backendEntities: sampleEntities,
        }}
      >
        <EntityNamespacePicker />
      </MockEntityListContextProvider>,
    );
    expect(updateFilters).toHaveBeenLastCalledWith({
      namespace: new EntityNamespaceFilter(['namespace-2']),
    });
  });
  it('removes namespaces from filters if there are no available namespaces', () => {
    const updateFilters = jest.fn();
    render(
      <MockEntityListContextProvider
        value={{
          updateFilters,
          queryParameters: { namespace: ['namespace-1'] },
          backendEntities: [],
        }}
      >
        <EntityNamespacePicker />
      </MockEntityListContextProvider>,
    );
    expect(updateFilters).toHaveBeenLastCalledWith({
      namespace: undefined,
    });
  });
  it('responds to initialFilter prop', () => {
    const updateFilters = jest.fn();
    render(
      <MockEntityListContextProvider
        value={{
          entities: sampleEntities,
          backendEntities: sampleEntities,
          updateFilters,
        }}
      >
        <EntityNamespacePicker initialFilter={['namespace-2']} />
      </MockEntityListContextProvider>,
    );
    expect(updateFilters).toHaveBeenLastCalledWith({
      namespace: new EntityNamespaceFilter(['namespace-2']),
    });
  });
});
