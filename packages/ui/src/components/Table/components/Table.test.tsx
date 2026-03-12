/*
 * Copyright 2025 The Backstage Authors
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

import { render, screen } from '@testing-library/react';
import { Table } from './Table';
import { CellText } from './CellText';
import type { ColumnConfig } from '../types';

type TestItem = { id: number; name: string; type: string };

const testColumns: ColumnConfig<TestItem>[] = [
  {
    id: 'name',
    label: 'Name',
    isRowHeader: true,
    cell: item => <CellText title={item.name} />,
  },
  {
    id: 'type',
    label: 'Type',
    cell: item => <CellText title={item.type} />,
  },
];

describe('Table', () => {
  describe('loading state', () => {
    it('renders a table with header and skeleton rows when loading with no data', async () => {
      render(
        <Table
          columnConfig={testColumns}
          data={undefined}
          loading={true}
          pagination={{ type: 'none' }}
        />,
      );

      const table = screen.getByRole('grid');
      expect(table).toBeInTheDocument();

      // Header columns should be visible
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Type')).toBeInTheDocument();

      // Should render 5 skeleton rows (plus 1 header row = 6 total)
      const rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(6);

      // Table should indicate it's in a loading/stale state via data-stale
      // (react-aria-components' Table does not forward aria-busy to the DOM,
      // but the stale prop produces a data-stale attribute for CSS targeting)
      expect(table).toHaveAttribute('data-stale', 'true');

      // Each skeleton row should contain Skeleton placeholder elements
      // (5 rows * 2 columns = 10 skeleton divs)
      const skeletonElements = table.querySelectorAll('.bui-Skeleton');
      expect(skeletonElements).toHaveLength(10);

      // Skeleton elements should have varying widths for visual variety
      const widths = Array.from(skeletonElements).map(
        el => (el as HTMLElement).style.width,
      );
      expect(new Set(widths).size).toBeGreaterThan(1);

      // Should NOT render "Loading..." text - skeleton is purely visual
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    it('renders data rows normally when not loading', async () => {
      const data: TestItem[] = [
        { id: 1, name: 'Service A', type: 'service' },
        { id: 2, name: 'Library B', type: 'library' },
      ];

      render(
        <Table
          columnConfig={testColumns}
          data={data}
          pagination={{ type: 'none' }}
        />,
      );

      expect(screen.getByText('Service A')).toBeInTheDocument();
      expect(screen.getByText('Library B')).toBeInTheDocument();

      const table = screen.getByRole('grid');
      // When not loading, data-stale should be "false"
      expect(table).toHaveAttribute('data-stale', 'false');

      // Should not contain skeleton elements
      const skeletonElements = table.querySelectorAll('.bui-Skeleton');
      expect(skeletonElements).toHaveLength(0);
    });
  });
});
