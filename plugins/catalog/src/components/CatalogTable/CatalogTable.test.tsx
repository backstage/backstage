/*
 * Copyright 2020 The Backstage Authors
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

import {
  ANNOTATION_EDIT_URL,
  ANNOTATION_VIEW_URL,
  Entity,
} from '@backstage/catalog-model';
import { ApiProvider } from '@backstage/core-app-api';
import {
  EntityKindFilter,
  entityRouteRef,
  MockStarredEntitiesApi,
  starredEntitiesApiRef,
  UserListFilter,
} from '@backstage/plugin-catalog-react';
import { MockEntityListContextProvider } from '@backstage/plugin-catalog-react/testUtils';
import { renderInTestApp, TestApiRegistry } from '@backstage/test-utils';
import { act, fireEvent, screen } from '@testing-library/react';
import { CatalogTable } from './CatalogTable';
import { CatalogTableColumnsFunc } from './types';

// Mock the count hooks
jest.mock('@backstage/plugin-catalog-react', () => ({
  ...jest.requireActual('@backstage/plugin-catalog-react'),
  useStarredEntitiesCount: jest.fn(),
  useOwnedEntitiesCount: jest.fn(),
  useAllEntitiesCount: jest.fn(),
}));

const { useStarredEntitiesCount, useOwnedEntitiesCount, useAllEntitiesCount } =
  jest.requireMock('@backstage/plugin-catalog-react');

const entities: Entity[] = [
  {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: { name: 'component1' },
  },
  {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: { name: 'component2' },
  },
  {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: { name: 'component3' },
  },
];

describe('CatalogTable component', () => {
  const mockApis = TestApiRegistry.from([
    starredEntitiesApiRef,
    new MockStarredEntitiesApi(),
  ]);

  beforeEach(() => {
    window.open = jest.fn();

    // Set default return values for count hooks
    useStarredEntitiesCount.mockReturnValue({ count: 0, loading: false });
    useOwnedEntitiesCount.mockReturnValue({ count: 0, loading: false });
    useAllEntitiesCount.mockReturnValue({
      count: entities.length,
      loading: false,
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render error message', async () => {
    await renderInTestApp(
      <ApiProvider apis={mockApis}>
        <MockEntityListContextProvider value={{ error: new Error('error') }}>
          <CatalogTable />
        </MockEntityListContextProvider>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );
    await expect(
      screen.findByText(/Could not fetch catalog entities./),
    ).resolves.toBeInTheDocument();
  });

  it('should a custom title and subtitle when passed in', async () => {
    await renderInTestApp(
      <ApiProvider apis={mockApis}>
        <MockEntityListContextProvider>
          <CatalogTable title="My Title" subtitle="My Subtitle" />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );

    expect(screen.queryByText('My Title')).toBeInTheDocument();
    expect(screen.queryByText('My Subtitle')).toBeInTheDocument();
  });

  it('should display entity names when loading has finished and no error occurred', async () => {
    // Mock the owned count hook to return 3
    useOwnedEntitiesCount.mockReturnValue({ count: 3, loading: false });

    await renderInTestApp(
      <ApiProvider apis={mockApis}>
        <MockEntityListContextProvider
          value={{
            entities,
            filters: {
              user: new UserListFilter(
                'owned',
                () => false,
                () => false,
              ),
              kind: {
                value: 'component',
                label: 'Component',
                getCatalogFilters: () => ({ kind: 'component' }),
                toQueryValue: () => 'component',
              },
            },
          }}
        >
          <CatalogTable />
        </MockEntityListContextProvider>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );
    expect(screen.getByText(/Owned Components \(3\)/)).toBeInTheDocument();
    expect(screen.getByText(/component1/)).toBeInTheDocument();
    expect(screen.getByText(/component2/)).toBeInTheDocument();
    expect(screen.getByText(/component3/)).toBeInTheDocument();
  });

  it('should use specified edit URL if in annotation', async () => {
    const entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        name: 'component1',
        annotations: { [ANNOTATION_EDIT_URL]: 'https://other.place' },
      },
    };

    await renderInTestApp(
      <ApiProvider apis={mockApis}>
        <MockEntityListContextProvider value={{ entities: [entity] }}>
          <CatalogTable />
        </MockEntityListContextProvider>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    const editButton = screen.getByTitle('Edit');

    await act(async () => {
      fireEvent.click(editButton);
    });

    expect(window.open).toHaveBeenCalledWith('https://other.place', '_blank');
  });

  it('should use specified view URL if in annotation', async () => {
    const entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        name: 'component1',
        annotations: { [ANNOTATION_VIEW_URL]: 'https://other.place' },
      },
    };

    await renderInTestApp(
      <ApiProvider apis={mockApis}>
        <MockEntityListContextProvider value={{ entities: [entity] }}>
          <CatalogTable />
        </MockEntityListContextProvider>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    const viewButton = screen.getByTitle('View');

    await act(async () => {
      fireEvent.click(viewButton);
    });

    expect(window.open).toHaveBeenCalledWith('https://other.place', '_blank');
  });

  it.each([
    {
      kind: 'api',
      expectedColumns: [
        'Name',
        'System',
        'Owner',
        'Type',
        'Lifecycle',
        'Namespace',
        'Description',
        'Tags',
        'Actions',
      ],
    },
    {
      kind: 'component',
      expectedColumns: [
        'Name',
        'System',
        'Owner',
        'Type',
        'Lifecycle',
        'Namespace',
        'Description',
        'Tags',
        'Actions',
      ],
    },
    {
      kind: 'domain',
      expectedColumns: ['Name', 'Owner', 'Description', 'Tags', 'Actions'],
    },
    {
      kind: 'group',
      expectedColumns: ['Name', 'Type', 'Description', 'Tags', 'Actions'],
    },
    {
      kind: 'location',
      expectedColumns: ['Name', 'Type', 'Targets', 'Actions'],
    },
    {
      kind: 'resource',
      expectedColumns: [
        'Name',
        'System',
        'Owner',
        'Type',
        'Lifecycle',
        'Namespace',
        'Description',
        'Tags',
        'Actions',
      ],
    },
    {
      kind: 'system',
      expectedColumns: ['Name', 'Owner', 'Description', 'Tags', 'Actions'],
    },
    {
      kind: 'template',
      expectedColumns: ['Name', 'Type', 'Description', 'Tags', 'Actions'],
    },
    {
      kind: 'user',
      expectedColumns: ['Name', 'Description', 'Tags', 'Actions'],
    },
    {
      kind: 'custom',
      expectedColumns: [
        'Name',
        'System',
        'Owner',
        'Type',
        'Lifecycle',
        'Namespace',
        'Description',
        'Tags',
        'Actions',
      ],
    },
    {
      kind: null,
      expectedColumns: [
        'Name',
        'System',
        'Owner',
        'Type',
        'Lifecycle',
        'Namespace',
        'Description',
        'Tags',
        'Actions',
      ],
    },
  ])(
    'should render correct columns with kind filter $kind',
    async ({ kind, expectedColumns }) => {
      await renderInTestApp(
        <ApiProvider apis={mockApis}>
          <MockEntityListContextProvider
            value={{
              entities,
              filters: {
                kind: kind
                  ? new EntityKindFilter(kind.toLocaleLowerCase('en-US'), kind)
                  : undefined,
              },
            }}
          >
            <CatalogTable />
          </MockEntityListContextProvider>
        </ApiProvider>,
        {
          mountedRoutes: {
            '/catalog/:namespace/:kind/:name': entityRouteRef,
          },
        },
      );

      const columnHeader = screen
        .getAllByRole('button')
        .filter(c => c.tagName === 'SPAN');
      const columnHeaderLabels = columnHeader.map(c => c.textContent);
      expect(columnHeaderLabels).toEqual(expectedColumns);
    },
    20_000,
  );

  it('should render the subtitle when it is specified', async () => {
    const entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        name: 'component1',
        annotations: { [ANNOTATION_EDIT_URL]: 'https://other.place' },
      },
    };

    await renderInTestApp(
      <ApiProvider apis={mockApis}>
        <MockEntityListContextProvider value={{ entities: [entity] }}>
          <CatalogTable subtitle="Should be rendered" />
        </MockEntityListContextProvider>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    expect(screen.getByText('Should be rendered')).toBeInTheDocument();
  });

  it('should render the label column with customized title and value as specified', async () => {
    const columns = [
      CatalogTable.columns.createNameColumn({ defaultKind: 'API' }),
      CatalogTable.columns.createLabelColumn('category', { title: 'Category' }),
    ];
    const entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'API',
      metadata: {
        name: 'APIWithLabel',
        labels: { category: 'generic' },
      },
    };
    const expectedColumns = ['Name', 'Category', 'Actions'];

    await renderInTestApp(
      <ApiProvider apis={mockApis}>
        <MockEntityListContextProvider value={{ entities: [entity] }}>
          <CatalogTable columns={columns} />
        </MockEntityListContextProvider>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    const columnHeader = screen
      .getAllByRole('button')
      .filter(c => c.tagName === 'SPAN');
    const columnHeaderLabels = columnHeader.map(c => c.textContent);
    expect(columnHeaderLabels).toEqual(expectedColumns);

    const labelCellValue = screen.getByText('generic');
    expect(labelCellValue).toBeInTheDocument();
  });

  it('should render the label column with customized title and value as specified using function', async () => {
    const columns: CatalogTableColumnsFunc = ({
      filters,
      entities: entities1,
    }) => {
      return filters.kind?.value === 'api' && entities1.length
        ? [
            CatalogTable.columns.createNameColumn({ defaultKind: 'API' }),
            CatalogTable.columns.createLabelColumn('category', {
              title: 'Category',
            }),
          ]
        : [];
    };

    const entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'API',
      metadata: {
        name: 'APIWithLabel',
        labels: { category: 'generic' },
      },
    };
    const expectedColumns = ['Name', 'Category', 'Actions'];

    await renderInTestApp(
      <ApiProvider apis={mockApis}>
        <MockEntityListContextProvider
          value={{
            entities: [entity],
            filters: {
              kind: {
                value: 'api',
                label: 'API',
                getCatalogFilters: () => ({ kind: 'api' }),
                toQueryValue: () => 'api',
              },
            },
          }}
        >
          <CatalogTable columns={columns} />
        </MockEntityListContextProvider>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    const columnHeader = screen
      .getAllByRole('button')
      .filter(c => c.tagName === 'SPAN');
    const columnHeaderLabels = columnHeader.map(c => c.textContent);
    expect(columnHeaderLabels).toEqual(expectedColumns);

    const labelCellValue = screen.getByText('generic');
    expect(labelCellValue).toBeInTheDocument();
  });

  it('should display count based on filtered entities length, not totalItems', async () => {
    // This test verifies that when totalItems differs from entities.length
    // (e.g., due to client-side filtering like starred entities),
    // the count in the title reflects the actual filtered count
    const filteredEntities = [entities[0]]; // Only 1 entity visible after filtering

    // Mock the starred count hook to return 1
    useStarredEntitiesCount.mockReturnValue({ count: 1, loading: false });

    await renderInTestApp(
      <ApiProvider apis={mockApis}>
        <MockEntityListContextProvider
          value={{
            entities: filteredEntities,
            totalItems: 3, // Backend reports 3 total, but only 1 is shown after filtering
            filters: {
              user: new UserListFilter(
                'starred',
                () => false,
                () => false,
              ),
              kind: {
                value: 'component',
                label: 'Component',
                getCatalogFilters: () => ({ kind: 'component' }),
                toQueryValue: () => 'component',
              },
            },
          }}
        >
          <CatalogTable />
        </MockEntityListContextProvider>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    // Should show (1) based on filtered entities, not (3) from totalItems
    expect(screen.getByText(/Starred Components \(1\)/)).toBeInTheDocument();
    expect(screen.queryByText(/\(3\)/)).not.toBeInTheDocument();
  });
});
