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

import { Entity, parseEntityRef } from '@backstage/catalog-model';
import React, { ReactNode } from 'react';
import {
  fireEvent,
  render as renderComponent,
  screen,
  waitFor,
} from '@testing-library/react';
import { MockEntityListContextProvider } from '../../testUtils/providers';
import { EntityOwnerFilter } from '../../filters';
import { EntityOwnerPicker } from './EntityOwnerPicker';
import { TestApiProvider } from '@backstage/test-utils';
import { catalogApiRef } from '../../api';
import { IdentityApi, identityApiRef } from '@backstage/core-plugin-api';
import { CatalogApi } from '@backstage/catalog-client';
import { SWRConfig } from 'swr';

const sampleEntities: Entity[] = [
  {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      name: 'component-1',
    },
  },
  {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      name: 'component-2',
    },
  },
  {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      name: 'component-3',
    },
  },
];

const sampleGroupOwners = [
  'group:default/some-owner',
  'group:default/some-owner-2',
  'group:default/another-owner',
  'group:default/team-a',
  'group:default/team-b',
];

const sampleUserOwners = ['user:default/someone'];

const sampleOwners = [...sampleGroupOwners, ...sampleUserOwners];

const mockIdentityApi: Partial<IdentityApi> = {
  getBackstageIdentity: async () => ({
    type: 'user',
    userEntityRef: 'user:default/guest',
    ownershipEntityRefs: [],
  }),
  getCredentials: async () => ({ token: undefined }),
};

const getEntityFacets = jest.fn().mockImplementation(async () => ({
  facets: {
    'relations.ownedBy': sampleOwners.map(value => ({ count: 1, value })),
  },
}));
const mockCatalogApi: Partial<CatalogApi> = {
  getEntities: jest
    .fn()
    .mockImplementation(async () => ({ items: sampleEntities })),
  getEntityByRef: async () => undefined,
  getEntityFacets,
};

describe('<EntityOwnerPicker/>', () => {
  it('renders all owners', async () => {
    render(
      <MockEntityListContextProvider value={{ entities: sampleEntities }}>
        <EntityOwnerPicker />
      </MockEntityListContextProvider>,
    );
    await waitFor(() => expect(screen.getByText('Owner')).toBeInTheDocument());

    fireEvent.click(screen.getByTestId('owner-picker-expand'));
    sampleGroupOwners
      .map(r => parseEntityRef(r).name)
      .forEach(owner => {
        expect(screen.getByText(owner)).toBeInTheDocument();
      });

    sampleUserOwners
      .map(r => {
        const { name, kind } = parseEntityRef(r);
        return [kind, name].join(':');
      })
      .forEach(owner => {
        expect(screen.getByText(owner)).toBeInTheDocument();
      });
  });

  it('renders unique owners in alphabetical order using group as default kind', async () => {
    render(
      <MockEntityListContextProvider value={{ entities: sampleEntities }}>
        <EntityOwnerPicker />
      </MockEntityListContextProvider>,
    );
    await waitFor(() => expect(screen.getByText('Owner')).toBeInTheDocument());

    fireEvent.click(screen.getByTestId('owner-picker-expand'));

    expect(screen.getAllByRole('option').map(o => o.textContent)).toEqual([
      'another-owner',
      'some-owner',
      'some-owner-2',
      'team-a',
      'team-b',
      'user:someone',
    ]);
  });

  it('respects the query parameter filter value', async () => {
    const updateFilters = jest.fn();
    const queryParameters = { owners: ['another-owner'] };
    render(
      <MockEntityListContextProvider
        value={{
          entities: sampleEntities,
          updateFilters,
          queryParameters,
        }}
      >
        <EntityOwnerPicker />
      </MockEntityListContextProvider>,
    );

    await waitFor(() =>
      expect(updateFilters).toHaveBeenLastCalledWith({
        owners: new EntityOwnerFilter(['another-owner']),
      }),
    );
  });

  it('adds owners to filters', async () => {
    const updateFilters = jest.fn();
    render(
      <MockEntityListContextProvider
        value={{
          entities: sampleEntities,
          updateFilters,
          filters: { owners: new EntityOwnerFilter([]) },
        }}
      >
        <EntityOwnerPicker />
      </MockEntityListContextProvider>,
    );
    expect(updateFilters).toHaveBeenLastCalledWith({
      owners: undefined,
    });
    await waitFor(() => screen.getByTestId('owner-picker-expand'));
    fireEvent.click(screen.getByTestId('owner-picker-expand'));
    fireEvent.click(screen.getByText('some-owner'));
    await waitFor(() =>
      expect(updateFilters).toHaveBeenLastCalledWith({
        owners: new EntityOwnerFilter(['some-owner']),
      }),
    );
  });

  it('removes owners from filters', async () => {
    const updateFilters = jest.fn();

    render(
      <MockEntityListContextProvider
        value={{
          entities: sampleEntities,
          updateFilters,
          filters: { owners: new EntityOwnerFilter(['some-owner']) },
        }}
      >
        <EntityOwnerPicker />
      </MockEntityListContextProvider>,
    );

    expect(updateFilters).toHaveBeenLastCalledWith({
      owners: new EntityOwnerFilter(['some-owner']),
    });
    await waitFor(() => screen.getByTestId('owner-picker-expand'));
    fireEvent.click(screen.getByTestId('owner-picker-expand'));
    expect(screen.getByLabelText('some-owner')).toBeChecked();

    fireEvent.click(screen.getByLabelText('some-owner'));
    expect(updateFilters).toHaveBeenLastCalledWith({
      owner: undefined,
    });
  });

  it('responds to external queryParameters changes', async () => {
    const updateFilters = jest.fn();
    const rendered = render(
      <MockEntityListContextProvider
        value={{
          updateFilters,
          queryParameters: { owners: ['team-a'] },
        }}
      >
        <EntityOwnerPicker />
      </MockEntityListContextProvider>,
    );
    expect(updateFilters).toHaveBeenLastCalledWith({
      owners: new EntityOwnerFilter(['team-a']),
    });
    rendered.rerender(
      <TestApiProvider
        apis={[
          [catalogApiRef, mockCatalogApi],
          [identityApiRef, mockIdentityApi],
        ]}
      >
        <MockEntityListContextProvider
          value={{
            updateFilters,
            queryParameters: { owners: ['team-b'] },
          }}
        >
          <EntityOwnerPicker />
        </MockEntityListContextProvider>
      </TestApiProvider>,
    );

    await waitFor(() =>
      expect(updateFilters).toHaveBeenLastCalledWith({
        owners: new EntityOwnerFilter(['team-b']),
      }),
    );
  });
  it('removes owners from filters if there are none available', () => {
    const updateFilters = jest.fn();
    render(
      <MockEntityListContextProvider
        value={{
          updateFilters,
          queryParameters: { owners: ['team-a'] },
        }}
      >
        <EntityOwnerPicker />
      </MockEntityListContextProvider>,
    );
    expect(updateFilters).toHaveBeenLastCalledWith({
      owners: undefined,
    });
  });
});

function render(component: ReactNode) {
  return renderComponent(
    <SWRConfig value={{ provider: () => new Map() }}>
      <TestApiProvider
        apis={[
          [catalogApiRef, mockCatalogApi],
          [identityApiRef, mockIdentityApi],
        ]}
      >
        {component}
      </TestApiProvider>
    </SWRConfig>,
  );
}
