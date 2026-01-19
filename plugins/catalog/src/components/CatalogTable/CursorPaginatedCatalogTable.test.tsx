/*
 * Copyright 2023 The Backstage Authors
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

import { ReactNode } from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { CursorPaginatedCatalogTable } from './CursorPaginatedCatalogTable';
import { CatalogTableRow } from './types';
import { renderInTestApp } from '@backstage/test-utils';
import {
  DefaultEntityFilters,
  EntityKindFilter,
  EntityListContextProps,
} from '@backstage/plugin-catalog-react';
import { MockEntityListContextProvider } from '@backstage/plugin-catalog-react/testUtils';

describe('CursorPaginatedCatalogTable', () => {
  const data = new Array(100).fill(0).map((_, index) => {
    const name = `component-${index}`;
    return {
      id: `component:default/${name}`,
      entity: {
        apiVersion: '1',
        kind: 'component',
        metadata: {
          name,
        },
      },
      resolved: {
        name,
        entityRef: `component:default/${name}`,
        partOfSystemRelations: [],
        ownedByRelations: [],
      },
    } as CatalogTableRow;
  });

  const columns = [
    {
      id: 'title',
      label: 'Title',
      cell: (row: CatalogTableRow) => row.entity.metadata.name,
    },
  ];

  const wrapInContext = (
    node: ReactNode,
    value?: Partial<EntityListContextProps<DefaultEntityFilters>>,
  ) => {
    return (
      <MockEntityListContextProvider value={value}>
        {node}
      </MockEntityListContextProvider>
    );
  };

  it('should display the title and subtitle when passed in', async () => {
    await renderInTestApp(
      wrapInContext(
        <CursorPaginatedCatalogTable
          data={data}
          columns={columns}
          title="My Title"
          subtitle="My Subtitle"
          actions={[]}
        />,
      ),
    );

    expect(screen.queryByText('My Title')).toBeInTheDocument();
    expect(screen.queryByText('My Subtitle')).toBeInTheDocument();
  });

  it('should display all the items', async () => {
    await renderInTestApp(
      wrapInContext(
        <CursorPaginatedCatalogTable
          data={data}
          columns={columns}
          actions={[]}
        />,
      ),
    );

    for (const item of data) {
      expect(screen.queryByText(item.resolved.name)).toBeInTheDocument();
    }
  });

  it('should display and invoke the next button', async () => {
    const { rerender } = await renderInTestApp(
      wrapInContext(
        <CursorPaginatedCatalogTable
          data={data}
          columns={columns}
          next={undefined}
          actions={[]}
        />,
      ),
    );

    // Wait for table to render
    await screen.findByRole('table');

    const fn = jest.fn();

    rerender(
      wrapInContext(
        <CursorPaginatedCatalogTable
          data={data}
          columns={columns}
          next={fn}
          actions={[]}
        />,
      ),
    );

    // React Aria pagination buttons may have different accessible names
    const nextButton =
      screen.queryByLabelText(/next/i) ||
      screen.queryByRole('button', { name: /next/i });
    expect(nextButton).toBeTruthy();
    expect(nextButton).not.toHaveAttribute('disabled');
    fireEvent.click(nextButton!);
    expect(fn).toHaveBeenCalled();
  });

  it('should display and invoke the prev button', async () => {
    const { rerender } = await renderInTestApp(
      wrapInContext(
        <CursorPaginatedCatalogTable
          data={data}
          columns={columns}
          prev={undefined}
          actions={[]}
        />,
      ),
    );

    // Wait for table to render
    await screen.findByRole('table');

    const fn = jest.fn();

    rerender(
      wrapInContext(
        <CursorPaginatedCatalogTable
          data={data}
          columns={columns}
          prev={fn}
          actions={[]}
        />,
      ),
    );

    // React Aria pagination buttons may have different accessible names
    const prevButton =
      screen.queryByLabelText(/previous/i) ||
      screen.queryByRole('button', { name: /previous/i });
    expect(prevButton).toBeTruthy();
    expect(prevButton).not.toHaveAttribute('disabled');
    fireEvent.click(prevButton!);
    expect(fn).toHaveBeenCalled();
  });

  it('should display entity names when loading has finished and no error occurred', async () => {
    await renderInTestApp(
      <MockEntityListContextProvider
        value={{
          entities: data.map(e => e.entity),
          totalItems: data.length,
          filters: {
            kind: new EntityKindFilter('component', 'Component'),
          },
        }}
      >
        <CursorPaginatedCatalogTable
          data={data}
          columns={columns}
          next={undefined}
          title="My title"
          actions={[]}
        />
      </MockEntityListContextProvider>,
    );

    expect(screen.getByText(/component-0/)).toBeInTheDocument();
    expect(screen.getByText(/component-50/)).toBeInTheDocument();
    expect(screen.getByText(/component-99/)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/My title/)).toBeInTheDocument();
    });
  });
});
