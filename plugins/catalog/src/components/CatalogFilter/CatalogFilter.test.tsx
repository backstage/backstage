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

import { Entity } from '@backstage/catalog-model';
import {
  ApiProvider,
  ApiRegistry,
  IdentityApi,
  identityApiRef,
  storageApiRef,
} from '@backstage/core';
import { MockStorageApi, wrapInTestApp } from '@backstage/test-utils';
import { fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';
import { CatalogApi, catalogApiRef } from '../../api/types';
import { EntityGroup } from '../../data/filters';
import { EntityFilterGroupsProvider } from '../../filter';
import { CatalogFilter, CatalogFilterGroup } from './CatalogFilter';

describe('Catalog Filter', () => {
  const catalogApi: Partial<CatalogApi> = {
    getEntities: () =>
      Promise.resolve([
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
      ] as Entity[]),
  };

  const indentityApi: Partial<IdentityApi> = {
    getUserId: () => 'tools@example.com',
  };

  const renderWrapped = (children: React.ReactNode) =>
    render(
      wrapInTestApp(
        <ApiProvider
          apis={ApiRegistry.from([
            [catalogApiRef, catalogApi],
            [identityApiRef, indentityApi],
            [storageApiRef, MockStorageApi.create()],
          ])}
        >
          <EntityFilterGroupsProvider>{children}</EntityFilterGroupsProvider>,
        </ApiProvider>,
      ),
    );

  it('should render the different groups', async () => {
    const mockGroups: CatalogFilterGroup[] = [
      { name: 'Test Group 1', items: [] },
      { name: 'Test Group 2', items: [] },
    ];
    const { findByText } = renderWrapped(
      <CatalogFilter filterGroups={mockGroups} />,
    );
    for (const group of mockGroups) {
      expect(await findByText(group.name)).toBeInTheDocument();
    }
  });

  it('should render the different items and their names', async () => {
    const mockGroups: CatalogFilterGroup[] = [
      {
        name: 'Test Group 1',
        items: [
          {
            id: EntityGroup.ALL,
            label: 'First Label',
          },
          {
            id: EntityGroup.STARRED,
            label: 'Second Label',
          },
        ],
      },
    ];

    const { findByText } = renderWrapped(
      <CatalogFilter filterGroups={mockGroups} />,
    );

    for (const item of mockGroups[0].items) {
      expect(await findByText(item.label)).toBeInTheDocument();
    }
  });

  it('selects the first item if no desired initial one is set', async () => {
    const mockGroups: CatalogFilterGroup[] = [
      {
        name: 'Test Group 1',
        items: [
          {
            id: EntityGroup.ALL,
            label: 'First Label',
          },
          {
            id: EntityGroup.STARRED,
            label: 'Second Label',
          },
        ],
      },
    ];

    const onChange = jest.fn();

    renderWrapped(
      <CatalogFilter filterGroups={mockGroups} onChange={onChange} />,
    );

    await waitFor(() => {
      expect(onChange).toHaveBeenLastCalledWith({
        id: EntityGroup.ALL,
        label: 'First Label',
      });
    });
  });

  it('selects the initial item', async () => {
    const mockGroups: CatalogFilterGroup[] = [
      {
        name: 'Test Group 1',
        items: [
          {
            id: EntityGroup.ALL,
            label: 'First Label',
          },
          {
            id: EntityGroup.STARRED,
            label: 'Second Label',
          },
        ],
      },
    ];

    const onChange = jest.fn();

    renderWrapped(
      <CatalogFilter
        filterGroups={mockGroups}
        onChange={onChange}
        initiallySelected={EntityGroup.STARRED}
      />,
    );

    await waitFor(() => {
      expect(onChange).toHaveBeenLastCalledWith({
        id: EntityGroup.STARRED,
        label: 'Second Label',
      });
    });
  });

  it('can change the selected item', async () => {
    const mockGroups: CatalogFilterGroup[] = [
      {
        name: 'Test Group 1',
        items: [
          {
            id: EntityGroup.ALL,
            label: 'First Label',
          },
          {
            id: EntityGroup.STARRED,
            label: 'Second Label',
          },
        ],
      },
    ];

    const onChange = jest.fn();

    const { findByText } = renderWrapped(
      <CatalogFilter filterGroups={mockGroups} onChange={onChange} />,
    );

    await waitFor(() => {
      expect(onChange).toHaveBeenLastCalledWith({
        id: EntityGroup.ALL,
        label: 'First Label',
      });
    });

    fireEvent.click(await findByText('Second Label'));

    await waitFor(() => {
      expect(onChange).toHaveBeenLastCalledWith({
        id: EntityGroup.STARRED,
        label: 'Second Label',
      });
    });
  });

  it('displays match counts properly', async () => {
    const mockGroups: CatalogFilterGroup[] = [
      {
        name: 'Test Group 1',
        items: [
          {
            id: EntityGroup.OWNED,
            label: 'First Label',
          },
        ],
      },
    ];

    const { findByText } = renderWrapped(
      <CatalogFilter filterGroups={mockGroups} />,
    );

    expect(await findByText('1')).toBeInTheDocument();
  });
});
