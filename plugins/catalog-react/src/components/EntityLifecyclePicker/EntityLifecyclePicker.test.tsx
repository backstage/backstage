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
import { EntityLifecycleFilter } from '../../filters';
import { EntityLifecyclePicker } from './EntityLifecyclePicker';

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

describe('<EntityLifecyclePicker/>', () => {
  it('renders all lifecycles', () => {
    render(
      <MockEntityListContextProvider
        value={{ entities: sampleEntities, backendEntities: sampleEntities }}
      >
        <EntityLifecyclePicker />
      </MockEntityListContextProvider>,
    );
    expect(screen.getByText('Lifecycle')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('lifecycle-picker-expand'));
    sampleEntities
      .map(e => e.spec?.lifecycle!)
      .forEach(lifecycle => {
        expect(screen.getByText(lifecycle as string)).toBeInTheDocument();
      });
  });

  it('renders unique lifecycles in alphabetical order', () => {
    render(
      <MockEntityListContextProvider
        value={{ entities: sampleEntities, backendEntities: sampleEntities }}
      >
        <EntityLifecyclePicker />
      </MockEntityListContextProvider>,
    );
    expect(screen.getByText('Lifecycle')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('lifecycle-picker-expand'));

    expect(screen.getAllByRole('option').map(o => o.textContent)).toEqual([
      'experimental',
      'production',
    ]);
  });

  it('respects the query parameter filter value', () => {
    const updateFilters = jest.fn();
    const queryParameters = { lifecycles: ['experimental'] };
    render(
      <MockEntityListContextProvider
        value={{
          entities: sampleEntities,
          backendEntities: sampleEntities,
          updateFilters,
          queryParameters,
        }}
      >
        <EntityLifecyclePicker />
      </MockEntityListContextProvider>,
    );

    expect(updateFilters).toHaveBeenLastCalledWith({
      lifecycles: new EntityLifecycleFilter(['experimental']),
    });
  });

  it('adds lifecycles to filters', () => {
    const updateFilters = jest.fn();
    render(
      <MockEntityListContextProvider
        value={{
          entities: sampleEntities,
          backendEntities: sampleEntities,
          updateFilters,
        }}
      >
        <EntityLifecyclePicker />
      </MockEntityListContextProvider>,
    );
    expect(updateFilters).toHaveBeenLastCalledWith({
      lifecycles: undefined,
    });

    fireEvent.click(screen.getByTestId('lifecycle-picker-expand'));
    fireEvent.click(screen.getByText('production'));
    expect(updateFilters).toHaveBeenLastCalledWith({
      lifecycles: new EntityLifecycleFilter(['production']),
    });
  });

  it('removes lifecycles from filters', () => {
    const updateFilters = jest.fn();
    render(
      <MockEntityListContextProvider
        value={{
          entities: sampleEntities,
          backendEntities: sampleEntities,
          updateFilters,
          filters: { lifecycles: new EntityLifecycleFilter(['production']) },
        }}
      >
        <EntityLifecyclePicker />
      </MockEntityListContextProvider>,
    );
    expect(updateFilters).toHaveBeenLastCalledWith({
      lifecycles: new EntityLifecycleFilter(['production']),
    });
    fireEvent.click(screen.getByTestId('lifecycle-picker-expand'));
    expect(screen.getByLabelText('production')).toBeChecked();

    fireEvent.click(screen.getByLabelText('production'));
    expect(updateFilters).toHaveBeenLastCalledWith({
      lifecycles: undefined,
    });
  });

  it('responds to external queryParameters changes', () => {
    const updateFilters = jest.fn();
    const rendered = render(
      <MockEntityListContextProvider
        value={{
          updateFilters,
          queryParameters: { lifecycles: ['experimental'] },
          backendEntities: sampleEntities,
        }}
      >
        <EntityLifecyclePicker />
      </MockEntityListContextProvider>,
    );
    expect(updateFilters).toHaveBeenLastCalledWith({
      lifecycles: new EntityLifecycleFilter(['experimental']),
    });
    rendered.rerender(
      <MockEntityListContextProvider
        value={{
          updateFilters,
          queryParameters: { lifecycles: ['production'] },
          backendEntities: sampleEntities,
        }}
      >
        <EntityLifecyclePicker />
      </MockEntityListContextProvider>,
    );
    expect(updateFilters).toHaveBeenLastCalledWith({
      lifecycles: new EntityLifecycleFilter(['production']),
    });
  });
  it('removes lifecycles from filters if there are no available lifecycles', () => {
    const updateFilters = jest.fn();
    render(
      <MockEntityListContextProvider
        value={{
          updateFilters,
          queryParameters: { lifecycles: ['experimental'] },
          backendEntities: [],
        }}
      >
        <EntityLifecyclePicker />
      </MockEntityListContextProvider>,
    );
    expect(updateFilters).toHaveBeenLastCalledWith({
      lifecycles: undefined,
    });
  });
});
