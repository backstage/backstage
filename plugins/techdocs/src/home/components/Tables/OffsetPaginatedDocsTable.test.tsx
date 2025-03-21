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
import { fireEvent, screen } from '@testing-library/react';
import { DocsTableRow } from './types';
import { renderInTestApp } from '@backstage/test-utils';
import {
  DefaultEntityFilters,
  EntityListContextProps,
} from '@backstage/plugin-catalog-react';
import { MockEntityListContextProvider } from '@backstage/plugin-catalog-react/testUtils';
import { OffsetPaginatedDocsTable } from './OffsetPaginatedDocsTable';

describe('OffsetPaginatedDocsTable', () => {
  const data = new Array(100).fill(0).map((_, index) => {
    const name = `tectdocs-${index}`;
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
      wrapInContext(
        <OffsetPaginatedDocsTable data={data} columns={columns} />,
        {
          setOffset: jest.fn(),
          limit: Number.MAX_SAFE_INTEGER,
          offset: 0,
          totalItems: data.length,
        },
      ),
    );

    for (const item of data) {
      expect(screen.queryByText(item.entity.metadata.name)).toBeInTheDocument();
    }
  });

  it('should display and invoke the next and previous buttons', async () => {
    const offsetFn = jest.fn();

    await renderInTestApp(
      wrapInContext(
        <OffsetPaginatedDocsTable data={data} columns={columns} />,
        { setOffset: offsetFn, limit: 10, totalItems: data.length, offset: 0 },
      ),
    );

    expect(offsetFn).toHaveBeenNthCalledWith(1, 0);
    const nextButton = screen.queryAllByRole('button', {
      name: 'Next Page',
    })[0];
    expect(nextButton).toBeEnabled();

    fireEvent.click(nextButton);
    expect(offsetFn).toHaveBeenNthCalledWith(2, 10);

    const prevButton = screen.queryAllByRole('button', {
      name: 'Previous Page',
    })[0];
    expect(prevButton).toBeEnabled();

    fireEvent.click(prevButton);
    expect(offsetFn).toHaveBeenNthCalledWith(3, 0);
  });
});
