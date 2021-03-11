/*
 * Copyright 2020 Spotify AB
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

import { CatalogApi } from '@backstage/catalog-client';
import { Entity } from '@backstage/catalog-model';
import {
  ApiProvider,
  ApiRegistry,
  IdentityApi,
  identityApiRef,
  storageApiRef,
} from '@backstage/core';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { MockStorageApi, wrapInTestApp } from '@backstage/test-utils';
import { fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';
import { EntityFilterGroupsProvider } from '../../filter';
import { ButtonGroup, CatalogFilter } from './CatalogFilter';

describe('Catalog Filter', () => {
  const catalogApi: Partial<CatalogApi> = {
    getEntities: () =>
      Promise.resolve({
        items: [
          {
            apiVersion: 'backstage.io/v1alpha1',
            kind: 'Component',
            metadata: {
              name: 'Entity1',
            },
            spec: {
              owner: 'tools@example.com',
              type: 'service',
            },
          },
          {
            apiVersion: 'backstage.io/v1alpha1',
            kind: 'Component',
            metadata: {
              name: 'Entity2',
            },
            spec: {
              owner: 'not-tools@example.com',
              type: 'service',
            },
          },
        ] as Entity[],
      }),
  };

  const identityApi: Partial<IdentityApi> = {
    getUserId: () => 'tools@example.com',
  };

  const renderWrapped = (children: React.ReactNode) =>
    render(
      wrapInTestApp(
        <ApiProvider
          apis={ApiRegistry.from([
            [catalogApiRef, catalogApi],
            [identityApiRef, identityApi],
            [storageApiRef, MockStorageApi.create()],
          ])}
        >
          <EntityFilterGroupsProvider>{children}</EntityFilterGroupsProvider>,
        </ApiProvider>,
      ),
    );

  it('should render the different groups', async () => {
    const mockGroups: ButtonGroup[] = [
      { name: 'Test Group 1', items: [] },
      { name: 'Test Group 2', items: [] },
    ];
    const { findByText } = renderWrapped(
      <CatalogFilter buttonGroups={mockGroups} initiallySelected="" />,
    );
    for (const group of mockGroups) {
      expect(await findByText(group.name)).toBeInTheDocument();
    }
  });

  it('should render the different items and their names', async () => {
    const mockGroups: ButtonGroup[] = [
      {
        name: 'Test Group 1',
        items: [
          {
            id: 'all',
            label: 'First Label',
            filterFn: () => true,
          },
          {
            id: 'starred',
            label: 'Second Label',
            filterFn: () => false,
          },
        ],
      },
    ];

    const { findByText } = renderWrapped(
      <CatalogFilter buttonGroups={mockGroups} initiallySelected="all" />,
    );

    for (const item of mockGroups[0].items) {
      expect(await findByText(item.label)).toBeInTheDocument();
    }
  });

  it('selects the first item if no desired initial one is set', async () => {
    const mockGroups: ButtonGroup[] = [
      {
        name: 'Test Group 1',
        items: [
          {
            id: 'all',
            label: 'First Label',
            filterFn: () => true,
          },
          {
            id: 'starred',
            label: 'Second Label',
            filterFn: () => false,
          },
        ],
      },
    ];

    const onChange = jest.fn();

    renderWrapped(
      <CatalogFilter
        buttonGroups={mockGroups}
        initiallySelected="all"
        onChange={onChange}
      />,
    );

    await waitFor(() => {
      expect(onChange).toHaveBeenLastCalledWith({
        id: 'all',
        label: 'First Label',
      });
    });
  });

  it('selects the initial item', async () => {
    const mockGroups: ButtonGroup[] = [
      {
        name: 'Test Group 1',
        items: [
          {
            id: 'all',
            label: 'First Label',
            filterFn: () => true,
          },
          {
            id: 'starred',
            label: 'Second Label',
            filterFn: () => false,
          },
        ],
      },
    ];

    const onChange = jest.fn();

    renderWrapped(
      <CatalogFilter
        buttonGroups={mockGroups}
        onChange={onChange}
        initiallySelected="starred"
      />,
    );

    await waitFor(() => {
      expect(onChange).toHaveBeenLastCalledWith({
        id: 'starred',
        label: 'Second Label',
      });
    });
  });

  it('can change the selected item', async () => {
    const mockGroups: ButtonGroup[] = [
      {
        name: 'Test Group 1',
        items: [
          {
            id: 'all',
            label: 'First Label',
            filterFn: () => true,
          },
          {
            id: 'starred',
            label: 'Second Label',
            filterFn: () => false,
          },
        ],
      },
    ];

    const onChange = jest.fn();

    const { findByText } = renderWrapped(
      <CatalogFilter
        buttonGroups={mockGroups}
        initiallySelected="all"
        onChange={onChange}
      />,
    );

    await waitFor(() => {
      expect(onChange).toHaveBeenLastCalledWith({
        id: 'all',
        label: 'First Label',
      });
    });

    fireEvent.click(await findByText('Second Label'));

    await waitFor(() => {
      expect(onChange).toHaveBeenLastCalledWith({
        id: 'starred',
        label: 'Second Label',
      });
    });
  });

  it('displays match counts properly', async () => {
    const mockGroups: ButtonGroup[] = [
      {
        name: 'Test Group 1',
        items: [
          {
            id: 'owned',
            label: 'First Label',
            filterFn: entity => entity.spec?.owner === 'tools@example.com',
          },
        ],
      },
    ];

    const { findByText } = renderWrapped(
      <CatalogFilter buttonGroups={mockGroups} initiallySelected="owned" />,
    );

    expect(await findByText('1')).toBeInTheDocument();
  });
});
