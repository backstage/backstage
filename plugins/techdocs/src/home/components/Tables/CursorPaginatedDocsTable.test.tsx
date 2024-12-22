/*
 * Copyright 2024 The Backstage Authors
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

import React, { ReactNode } from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { CursorPaginatedDocsTable } from './CursorPaginatedDocsTable';
import { DocsTableRow } from './types';
import { renderInTestApp } from '@backstage/test-utils';
import {
  DefaultEntityFilters,
  EntityKindFilter,
  EntityListContextProps,
} from '@backstage/plugin-catalog-react';
import { MockEntityListContextProvider } from '@backstage/plugin-catalog-react/testUtils';

describe('CursorPaginatedDocsTable', () => {
  const data = new Array(100).fill(0).map((_, index) => {
    const name = `techdocs-${index}`;
    return {
      entity: {
        apiVersion: '1',
        kind: 'TestKind',
        metadata: {
          name,
        },
      },
      resolved: {
        docsUrl: 'https://example.com',
        ownedByRelationsTitle: 'owned',
        ownedByRelations: [],
      },
    } as DocsTableRow;
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

  it('should display all the items', async () => {
    await renderInTestApp(
      wrapInContext(<CursorPaginatedDocsTable data={data} columns={columns} />),
    );

    for (const item of data) {
      expect(screen.queryByText(item.entity.metadata.name)).toBeInTheDocument();
    }
  });

  it('should display and invoke the next button', async () => {
    const { rerender } = await renderInTestApp(
      wrapInContext(
        <CursorPaginatedDocsTable
          data={data}
          columns={columns}
          next={undefined}
        />,
      ),
    );

    expect(
      screen.queryAllByRole('button', { name: 'Next Page' })[0],
    ).toBeDisabled();

    const fn = jest.fn();

    rerender(
      wrapInContext(
        <CursorPaginatedDocsTable data={data} columns={columns} next={fn} />,
      ),
    );

    const nextButton = screen.queryAllByRole('button', {
      name: 'Next Page',
    })[0];
    expect(nextButton).toBeEnabled();

    fireEvent.click(nextButton);
    expect(fn).toHaveBeenCalled();
  });

  it('should display and invoke the prev button', async () => {
    const { rerender } = await renderInTestApp(
      wrapInContext(
        <CursorPaginatedDocsTable
          data={data}
          columns={columns}
          prev={undefined}
        />,
      ),
    );

    expect(
      screen.queryAllByRole('button', { name: 'Next Page' })[0],
    ).toBeDisabled();

    const fn = jest.fn();

    rerender(
      wrapInContext(
        <CursorPaginatedDocsTable data={data} columns={columns} prev={fn} />,
      ),
    );

    const prevButton = screen.queryAllByRole('button', {
      name: 'Previous Page',
    })[0];
    expect(prevButton).toBeEnabled();

    fireEvent.click(prevButton);
    expect(fn).toHaveBeenCalled();
  });

  it('should display entity names when loading has finished and no error occurred', async () => {
    await renderInTestApp(
      <MockEntityListContextProvider
        value={{
          entities: data.map(e => e.entity),
          totalItems: data.length,
          filters: {
            kind: new EntityKindFilter('techdocs', 'TechDocs'),
          },
        }}
      >
        <CursorPaginatedDocsTable
          data={data}
          columns={columns}
          next={undefined}
          title="My title"
        />
      </MockEntityListContextProvider>,
    );

    expect(screen.getByText(/techdocs-0/)).toBeInTheDocument();
    expect(screen.getByText(/techdocs-50/)).toBeInTheDocument();
    expect(screen.getByText(/techdocs-99/)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/My title/)).toBeInTheDocument();
    });
  });
});
