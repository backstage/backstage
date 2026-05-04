/*
 * Copyright 2026 The Backstage Authors
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

import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import { screen } from '@testing-library/react';
import type { ReactElement } from 'react';
import { NextCatalogPage } from './NextCatalogPage';
import type { CatalogColumnHeader } from '@backstage/plugin-catalog-react/alpha';

const columns: Array<{
  header: CatalogColumnHeader;
  cell: () => ReactElement;
}> = [
  {
    header: { id: 'name', label: 'Name', orderField: 'metadata.name' },
    cell: () => <span>cell-name</span>,
  },
  {
    header: { id: 'kind', label: 'Kind' },
    cell: () => <span>cell-kind</span>,
  },
];

describe('NextCatalogPage', () => {
  it('renders a column header for each provided column', async () => {
    const catalogApi = catalogApiMock.mock({
      queryEntities: jest.fn().mockResolvedValue({
        items: [],
        pageInfo: {},
        totalItems: 0,
      }),
    });

    await renderInTestApp(
      <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
        <NextCatalogPage filters={null} columns={columns} pagination />
      </TestApiProvider>,
    );

    expect(
      await screen.findByRole('columnheader', { name: 'Name' }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole('columnheader', { name: 'Kind' }),
    ).toBeInTheDocument();
  });
});
