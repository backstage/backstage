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

import React, { ReactNode } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { CatalogTableRow } from './types';
import { renderInTestApp, wrapInTestApp } from '@backstage/test-utils';
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
        entityRef: 'component:default/component',
      },
    } as CatalogTableRow;
  });

  const columns = [
    {
      title: 'Title',
      field: 'entity.metadata.name',
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
          limit: 10,
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
          limit: 10,
          offset: 0,
          totalItems: data.length,
        },
      ),
    );

    for (const item of data) {
      expect(screen.queryByText(item.resolved.name)).toBeInTheDocument();
    }
  });

  it('should display and invoke the next and previous buttons', async () => {
    const offsetFn = jest.fn();

    const { rerender } = render(
      wrapInTestApp(
        wrapInContext(
          <OffsetPaginatedCatalogTable data={data} columns={columns} />,
          {
            setOffset: offsetFn,
            limit: 10,
            totalItems: data.length,
            offset: 0,
          },
        ),
      ),
    );

    expect(offsetFn).not.toHaveBeenCalled();
    const nextButton = screen.queryAllByRole('button', {
      name: 'Next Page',
    })[0];

    expect(nextButton).toBeEnabled();

    fireEvent.click(nextButton);

    expect(offsetFn).toHaveBeenNthCalledWith(1, 10);

    rerender(
      wrapInTestApp(
        wrapInContext(
          <OffsetPaginatedCatalogTable data={data} columns={columns} />,
          {
            setOffset: offsetFn,
            limit: 10,
            totalItems: data.length,
            offset: 10,
          },
        ),
      ),
    );

    const prevButton = screen.queryAllByRole('button', {
      name: 'Previous Page',
    })[0];
    expect(prevButton).toBeEnabled();

    fireEvent.click(prevButton);

    await waitFor(() => expect(offsetFn).toHaveBeenNthCalledWith(2, 0));
  });
});
