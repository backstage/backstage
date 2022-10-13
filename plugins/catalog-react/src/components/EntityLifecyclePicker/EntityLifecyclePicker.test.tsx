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
import { fireEvent, render, waitFor } from '@testing-library/react';
import React, { ReactNode } from 'react';
import { MockEntityListContextProvider } from '../../testUtils/providers';
import { EntityLifecycleFilter } from '../../filters';
import { EntityLifecyclePicker } from './EntityLifecyclePicker';
import { SWRConfig } from 'swr';
import { TestApiProvider } from '@backstage/test-utils';
import { catalogApiRef } from '../../api';
import { CatalogApi } from '@backstage/catalog-client';

const sampleEntities: Entity[] = [
  {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      name: 'component-1',
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
    },
    spec: {
      lifecycle: 'experimental',
    },
  },
];

const lifecycles = ['experimental', 'production'];

const getEntityFacets = jest.fn().mockImplementation(async () => ({
  facets: {
    'spec.lifecycle': lifecycles.map(value => ({ count: 1, value })),
  },
}));

const mockCatalogApi: Partial<CatalogApi> = {
  getEntities: jest
    .fn()
    .mockImplementation(async () => ({ items: sampleEntities })),
  getEntityByRef: async () => undefined,
  getEntityFacets,
};

describe('<EntityLifecyclePicker/>', () => {
  it('renders all lifecycles', async () => {
    const rendered = renderWrapped(
      <MockEntityListContextProvider value={{ entities: sampleEntities }}>
        <EntityLifecyclePicker />
      </MockEntityListContextProvider>,
    );
    await waitFor(() =>
      expect(rendered.getByText('Lifecycle')).toBeInTheDocument(),
    );

    fireEvent.click(rendered.getByTestId('lifecycle-picker-expand'));
    sampleEntities
      .map(e => e.spec?.lifecycle!)
      .forEach(lifecycle => {
        expect(rendered.getByText(lifecycle as string)).toBeInTheDocument();
      });
  });

  it('renders unique lifecycles in alphabetical order', async () => {
    const rendered = renderWrapped(
      <MockEntityListContextProvider value={{ entities: sampleEntities }}>
        <EntityLifecyclePicker />
      </MockEntityListContextProvider>,
    );
    await waitFor(() =>
      expect(rendered.getByText('Lifecycle')).toBeInTheDocument(),
    );

    fireEvent.click(rendered.getByTestId('lifecycle-picker-expand'));

    expect(rendered.getAllByRole('option').map(o => o.textContent)).toEqual([
      'experimental',
      'production',
    ]);
  });

  it('respects the query parameter filter value', async () => {
    const updateFilters = jest.fn();
    const queryParameters = { lifecycles: ['experimental'] };
    renderWrapped(
      <MockEntityListContextProvider
        value={{
          entities: sampleEntities,
          updateFilters,
          queryParameters,
        }}
      >
        <EntityLifecyclePicker />
      </MockEntityListContextProvider>,
    );

    await waitFor(() =>
      expect(updateFilters).toHaveBeenLastCalledWith({
        lifecycles: new EntityLifecycleFilter(['experimental']),
      }),
    );
  });

  it('adds lifecycles to filters', async () => {
    const updateFilters = jest.fn();
    const rendered = renderWrapped(
      <MockEntityListContextProvider
        value={{
          entities: sampleEntities,
          updateFilters,
        }}
      >
        <EntityLifecyclePicker />
      </MockEntityListContextProvider>,
    );
    await waitFor(() =>
      expect(updateFilters).toHaveBeenLastCalledWith({
        lifecycles: undefined,
      }),
    );

    fireEvent.click(rendered.getByTestId('lifecycle-picker-expand'));
    fireEvent.click(rendered.getByText('production'));
    expect(updateFilters).toHaveBeenLastCalledWith({
      lifecycles: new EntityLifecycleFilter(['production']),
    });
  });

  it('removes lifecycles from filters', async () => {
    const updateFilters = jest.fn();
    const rendered = renderWrapped(
      <MockEntityListContextProvider
        value={{
          entities: sampleEntities,
          updateFilters,
          filters: { lifecycles: new EntityLifecycleFilter(['production']) },
        }}
      >
        <EntityLifecyclePicker />
      </MockEntityListContextProvider>,
    );
    await waitFor(() =>
      expect(updateFilters).toHaveBeenLastCalledWith({
        lifecycles: new EntityLifecycleFilter(['production']),
      }),
    );
    fireEvent.click(rendered.getByTestId('lifecycle-picker-expand'));
    expect(rendered.getByLabelText('production')).toBeChecked();

    fireEvent.click(rendered.getByLabelText('production'));
    expect(updateFilters).toHaveBeenLastCalledWith({
      lifecycles: undefined,
    });
  });

  it('responds to external queryParameters changes', async () => {
    const updateFilters = jest.fn();
    const rendered = renderWrapped(
      <MockEntityListContextProvider
        value={{
          updateFilters,
          queryParameters: { lifecycles: ['experimental'] },
        }}
      >
        <EntityLifecyclePicker />
      </MockEntityListContextProvider>,
    );
    await waitFor(() =>
      expect(updateFilters).toHaveBeenLastCalledWith({
        lifecycles: new EntityLifecycleFilter(['experimental']),
      }),
    );
    rendered.rerender(
      <SWRConfig value={{ provider: () => new Map() }}>
        <TestApiProvider apis={[[catalogApiRef, mockCatalogApi]]}>
          <MockEntityListContextProvider
            value={{
              updateFilters,
              queryParameters: { lifecycles: ['production'] },
            }}
          >
            <EntityLifecyclePicker />
          </MockEntityListContextProvider>
        </TestApiProvider>
      </SWRConfig>,
    );
    expect(updateFilters).toHaveBeenLastCalledWith({
      lifecycles: new EntityLifecycleFilter(['production']),
    });
  });
});

function renderWrapped(component: ReactNode) {
  return render(
    <SWRConfig value={{ provider: () => new Map() }}>
      <TestApiProvider apis={[[catalogApiRef, mockCatalogApi]]}>
        {component}
      </TestApiProvider>
    </SWRConfig>,
  );
}
