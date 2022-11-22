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
import { EntityFieldFilter } from '../../filters';
import { EntityGenericPicker } from './EntityGenericPicker';

const mockEntities: Entity[] = [
  {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      name: 'component-1',
      domain: 'domain1',
      tags: ['tag4', 'tag1', 'tag2'],
    },
  },
  {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      name: 'component-2',
      domain: 'domain2',
      tags: ['tag3', 'tag4'],
    },
  },
  {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      name: 'component-3',
      domain: 'domain2',
      tags: ['tag3', 'tag4'],
    },
  },
];

const EntityDomainPicker = () => (
  <EntityGenericPicker name="domain" filterValue="metadata.domain" />
);

describe('<EntityGenericPicker/>', () => {
  it('renders all options', () => {
    render(
      <MockEntityListContextProvider
        value={{ entities: mockEntities, backendEntities: mockEntities }}
      >
        <EntityDomainPicker />
      </MockEntityListContextProvider>,
    );
    expect(screen.getByText(/domain/i)).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('domain-picker-expand'));
    mockEntities
      .flatMap(e => e.metadata.domain!)
      .forEach(domain => {
        expect(screen.getByText(domain as string)).toBeInTheDocument();
      });
  });

  it('renders unique options in alphabetical order', () => {
    render(
      <MockEntityListContextProvider
        value={{ entities: mockEntities, backendEntities: mockEntities }}
      >
        <EntityDomainPicker />
      </MockEntityListContextProvider>,
    );
    expect(screen.getByText(/domain/i)).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('domain-picker-expand'));

    expect(screen.getAllByRole('option').map(o => o.textContent)).toEqual([
      'domain1',
      'domain2',
    ]);
  });

  it('select a value from filter', () => {
    const updateFilters = jest.fn();
    render(
      <MockEntityListContextProvider
        value={{
          entities: mockEntities,
          backendEntities: mockEntities,
          updateFilters,
        }}
      >
        <EntityDomainPicker />
      </MockEntityListContextProvider>,
    );

    fireEvent.click(screen.getByTestId('domain-picker-expand'));
    fireEvent.click(screen.getByText('domain1'));
    expect(updateFilters).toHaveBeenLastCalledWith({
      option: new EntityFieldFilter(['domain1'], 'metadata.domain'),
    });
  });

  it('respects the query parameter filter value', () => {
    const updateFilters = jest.fn();
    const queryParameters = { option: ['domain2'] };
    render(
      <MockEntityListContextProvider
        value={{
          entities: mockEntities,
          backendEntities: mockEntities,
          updateFilters,
          queryParameters,
        }}
      >
        <EntityDomainPicker />
      </MockEntityListContextProvider>,
    );

    expect(updateFilters).toHaveBeenLastCalledWith({
      option: new EntityFieldFilter(['domain2'], 'metadata.domain'),
    });
  });

  it('adds a value from available options to filters', () => {
    const updateFilters = jest.fn();
    render(
      <MockEntityListContextProvider
        value={{
          entities: mockEntities,
          backendEntities: mockEntities,
          updateFilters,
        }}
      >
        <EntityDomainPicker />
      </MockEntityListContextProvider>,
    );
    expect(updateFilters).toHaveBeenLastCalledWith({
      option: undefined,
    });

    fireEvent.click(screen.getByTestId('domain-picker-expand'));
    fireEvent.click(screen.getByText('domain1'));
    expect(updateFilters).toHaveBeenLastCalledWith({
      option: new EntityFieldFilter(['domain1'], 'metadata.domain'),
    });
  });

  it('removes a value from filters', () => {
    const updateFilters = jest.fn();
    render(
      <MockEntityListContextProvider
        value={{
          entities: mockEntities,
          backendEntities: mockEntities,
          updateFilters,
          filters: {
            option: new EntityFieldFilter(['domain1'], 'metadata.domain'),
          },
        }}
      >
        <EntityDomainPicker />
      </MockEntityListContextProvider>,
    );
    expect(updateFilters).toHaveBeenLastCalledWith({
      option: new EntityFieldFilter(['domain1'], 'metadata.domain'),
    });
    fireEvent.click(screen.getByTestId('domain-picker-expand'));
    expect(screen.getByLabelText('domain1')).toBeChecked();

    fireEvent.click(screen.getByLabelText('domain1'));
    expect(updateFilters).toHaveBeenLastCalledWith({
      option: undefined,
    });
  });

  it('responds to external queryParameters changes', () => {
    const updateFilters = jest.fn();
    const rendered = render(
      <MockEntityListContextProvider
        value={{
          updateFilters,
          queryParameters: { option: ['domain2'] },
        }}
      >
        <EntityDomainPicker />
      </MockEntityListContextProvider>,
    );
    expect(updateFilters).toHaveBeenLastCalledWith({
      option: new EntityFieldFilter(['domain2'], 'metadata.domain'),
    });
    rendered.rerender(
      <MockEntityListContextProvider
        value={{
          updateFilters,
          queryParameters: { option: ['domain1'] },
        }}
      >
        <EntityDomainPicker />
      </MockEntityListContextProvider>,
    );
    expect(updateFilters).toHaveBeenLastCalledWith({
      option: new EntityFieldFilter(['domain1'], 'metadata.domain'),
    });
  });
});
