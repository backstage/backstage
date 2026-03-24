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
import { MemoryRouter } from 'react-router-dom';
import { BUIProvider } from '../../provider';
import { Table, Cell, CellText, useTable } from '.';
import type { ColumnConfig } from './types';

interface TestItem {
  id: string;
  name: string;
}

const testData: TestItem[] = [
  { id: '1', name: 'Alpha' },
  { id: '2', name: 'Beta' },
];

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <MemoryRouter>
      <BUIProvider>{children}</BUIProvider>
    </MemoryRouter>
  );
}

function TestTable({ columns }: { columns: ColumnConfig<TestItem>[] }) {
  const { tableProps } = useTable({
    mode: 'complete',
    data: testData,
    columns,
  });

  return <Table {...tableProps} columnConfig={columns} />;
}

describe('Cell', () => {
  it('renders text children inside a table', async () => {
    const columns: ColumnConfig<TestItem>[] = [
      {
        id: 'name',
        label: 'Name',
        cell: item => <CellText title={item.name} />,
      },
    ];

    render(<TestTable columns={columns} />, { wrapper: Wrapper });

    expect(await screen.findByText('Alpha')).toBeDefined();
    expect(await screen.findByText('Beta')).toBeDefined();
  });

  it('renders SVG children when textValue is provided', async () => {
    const columns: ColumnConfig<TestItem>[] = [
      {
        id: 'name',
        label: 'Name',
        cell: item => <CellText title={item.name} />,
      },
      {
        id: 'chart',
        label: 'Chart',
        cell: () => (
          <Cell textValue="sparkline">
            <svg
              width={100}
              height={20}
              data-testid="spark-svg"
              aria-label="sparkline chart"
            >
              <rect x={0} y={0} width={100} height={20} fill="blue" />
            </svg>
          </Cell>
        ),
      },
    ];

    render(<TestTable columns={columns} />, { wrapper: Wrapper });

    const svgs = await screen.findAllByTestId('spark-svg');
    expect(svgs).toHaveLength(testData.length);
    expect(svgs[0].tagName).toBe('svg');
    expect(svgs[0].querySelector('rect')).not.toBeNull();
  });

  it('renders HTML element children inside Cell', async () => {
    const columns: ColumnConfig<TestItem>[] = [
      {
        id: 'name',
        label: 'Name',
        cell: item => <CellText title={item.name} />,
      },
      {
        id: 'status',
        label: 'Status',
        cell: item => (
          <Cell textValue={item.name}>
            <div data-testid={`status-${item.id}`}>
              <span>Active</span>
            </div>
          </Cell>
        ),
      },
    ];

    render(<TestTable columns={columns} />, { wrapper: Wrapper });

    const status1 = await screen.findByTestId('status-1');
    expect(status1).toBeDefined();
    expect(status1.textContent).toBe('Active');

    const status2 = await screen.findByTestId('status-2');
    expect(status2).toBeDefined();
  });
});
