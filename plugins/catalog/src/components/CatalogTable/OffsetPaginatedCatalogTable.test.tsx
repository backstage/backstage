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
import { fireEvent, screen } from '@testing-library/react';
import { CatalogTableRow } from './types';
import { renderInTestApp } from '@backstage/test-utils';
import {
  DefaultEntityFilters,
  EntityListContextProps,
} from '@backstage/plugin-catalog-react';
import { MockEntityListContextProvider } from '@backstage/plugin-catalog-react/testUtils';
import { OffsetPaginatedCatalogTable } from './OffsetPaginatedCatalogTable';

describe('OffsetPaginatedCatalogTable', () => {
  const data = new Array(100).fill(0).map((_, index) => {
    const name = `component-${index}`;
    return {
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
      },
    } as CatalogTableRow;
  });

  const columns = [
    {
      title: 'Title',
      field: 'entity.metadata.name',
      searchable: true,
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
        <OffsetPaginatedCatalogTable
          data={data}
          columns={columns}
          title="My Title"
          subtitle="My Subtitle"
        />,
        {
          setOffset: jest.fn(),
          limit: Number.MAX_SAFE_INTEGER,
          offset: 0,
          totalItems: data.length,
        },
      ),
    );

    expect(screen.queryByText('My Title')).toBeInTheDocument();
    expect(screen.queryByText('My Subtitle')).toBeInTheDocument();
  });

  it('should display all the items', async () => {
    await renderInTestApp(
      wrapInContext(
        <OffsetPaginatedCatalogTable data={data} columns={columns} />,
        {
          setOffset: jest.fn(),
          limit: Number.MAX_SAFE_INTEGER,
          offset: 0,
          totalItems: data.length,
        },
      ),
    );

    // Wait for items to render
    await screen.findByText(data[0].resolved.name);

    for (const item of data) {
      expect(screen.getByText(item.resolved.name)).toBeInTheDocument();
    }
  });

  it('should display and invoke the next and previous buttons', async () => {
    let currentOffset = 0;
    const offsetFn = jest.fn((newOffset: number) => {
      currentOffset = newOffset;
    });

    const { rerender } = await renderInTestApp(
      wrapInContext(
        <OffsetPaginatedCatalogTable data={data} columns={columns} />,
        {
          setOffset: offsetFn,
          limit: 10,
          totalItems: data.length,
          offset: currentOffset,
        },
      ),
    );

    // Wait for pagination to render
    const nextButton = await screen.findByRole('button', {
      name: /next/i,
    });
    expect(nextButton).toBeEnabled();

    // Click next to go to page 2
    fireEvent.click(nextButton);
    expect(offsetFn).toHaveBeenCalledWith(10);

    // Re-render with updated offset to simulate state change
    await rerender(
      wrapInContext(
        <OffsetPaginatedCatalogTable data={data} columns={columns} />,
        { setOffset: offsetFn, limit: 10, totalItems: data.length, offset: 10 },
      ),
    );

    // Now previous button should be enabled (we're on page 2)
    const prevButton = await screen.findByRole('button', {
      name: /previous/i,
    });
    expect(prevButton).toBeEnabled();

    // Click previous to go back to page 1
    fireEvent.click(prevButton);
    expect(offsetFn).toHaveBeenCalledWith(0);
  });
});
