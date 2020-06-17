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

import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { wrapInTestApp } from '@backstage/test-utils';
import { CatalogFilter, CatalogFilterGroup } from './CatalogFilter';
import { EntityGroup } from '../../data/filters';

describe('Catalog Filter', () => {
  const comp1 = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
      name: 'my-component-1',
    },
    spec: {
      owner: 'team',
    },
  };
  const comp2 = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
      name: 'my-component-2',
    },
    spec: {
      owner: 'team',
    },
  };
  const comp3 = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
      name: 'my-component-3',
    },
    spec: {
      owner: '',
    },
  };
  const defaultFilterProps = {
    selectedFilter: EntityGroup.ALL,
    onFilterChange: (type: EntityGroup) => type,
    entitiesByFilter: {
      [EntityGroup.ALL]: [comp1, comp2, comp3],
      [EntityGroup.STARRED]: [comp1],
      [EntityGroup.OWNED]: [comp1],
    },
  };
  it('should render the different groups', async () => {
    const mockGroups: CatalogFilterGroup[] = [
      { name: 'Test Group 1', items: [] },
      { name: 'Test Group 2', items: [] },
    ];
    const { findByText } = render(
      wrapInTestApp(
        <CatalogFilter {...defaultFilterProps} groups={mockGroups} />,
      ),
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

    const { findByText } = render(
      wrapInTestApp(
        <CatalogFilter {...defaultFilterProps} groups={mockGroups} />,
      ),
    );

    const [group] = mockGroups;
    for (const item of group.items) {
      expect(await findByText(item.label)).toBeInTheDocument();
    }
  });

  it('should render the count in each item', async () => {
    const mockGroups: CatalogFilterGroup[] = [
      {
        name: 'Test Group 1',
        items: [
          {
            id: EntityGroup.ALL,
            label: 'First Label',
            count: 3,
          },
          {
            id: EntityGroup.STARRED,
            label: 'Second Label',
            count: 1,
          },
        ],
      },
    ];

    render(
      wrapInTestApp(
        <CatalogFilter {...defaultFilterProps} groups={mockGroups} />,
      ),
    );

    for (const key of Object.keys(defaultFilterProps.entitiesByFilter)) {
      await waitFor(() =>
        screen.getAllByText(
          new RegExp(
            `(${
              defaultFilterProps.entitiesByFilter[key as EntityGroup].length
            })`,
          ),
        ),
      );
    }
  });

  it('should fire the callback when an item is clicked', async () => {
    const mockGroups: CatalogFilterGroup[] = [
      {
        name: 'Test Group 1',
        items: [
          {
            id: EntityGroup.ALL,
            label: 'First Label',
            count: 100,
          },
          {
            id: EntityGroup.STARRED,
            label: 'Second Label',
            count: 400,
          },
        ],
      },
    ];

    const onSelectedChangeHandler = jest.fn();

    const { findByText } = render(
      wrapInTestApp(
        <CatalogFilter
          {...defaultFilterProps}
          groups={mockGroups}
          onFilterChange={onSelectedChangeHandler}
        />,
      ),
    );

    const item = mockGroups[0].items[0];

    const element = await findByText(item.label);

    fireEvent.click(element);

    expect(onSelectedChangeHandler).toHaveBeenCalledWith(item.id);
  });

  it('should render a component when a function is passed to the count component', async () => {
    const mockGroups: CatalogFilterGroup[] = [
      {
        name: 'Test Group 1',
        items: [
          {
            id: EntityGroup.ALL,
            label: 'First Label',
            count: () => <b>BACKSTAGE!</b>,
          },
          {
            id: EntityGroup.STARRED,
            label: 'Second Label',
            count: 400,
          },
        ],
      },
    ];
    const { findByText } = render(
      wrapInTestApp(
        <CatalogFilter {...defaultFilterProps} groups={mockGroups} />,
      ),
    );

    expect(await findByText('Test Group 1')).toBeInTheDocument();
  });
});
