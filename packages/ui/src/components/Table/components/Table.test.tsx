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

import { TestRouter } from '../../../testUtils/TestRouter';
import { fireEvent, render, screen } from '@testing-library/react';
import type { PropsWithChildren } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { BUIProvider } from '../../../provider/BUIProvider';
import { Cell } from './Cell';
import { Table } from './Table';
import { useTable } from '../hooks/useTable';
import type { ColumnConfig } from '../types';

const routerFuture = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
} as const;

function LocationStatus() {
  return <span role="status">{useLocation().pathname}</span>;
}

function RouterFixture({ children }: PropsWithChildren) {
  return (
    <TestRouter
      basename="/app"
      initialEntries={['/app/catalog/entity/docs']}
      future={routerFuture}
    >
      <BUIProvider>
        <Routes>
          <Route path="catalog/entity/docs/*" element={children} />
        </Routes>
        <LocationStatus />
      </BUIProvider>
    </TestRouter>
  );
}

const paginationItems = Array.from({ length: 25 }, (_, id) => ({
  id,
  name: `Item ${id}`,
}));
const paginationColumns: ColumnConfig<(typeof paginationItems)[number]>[] = [
  {
    id: 'name',
    label: 'Name',
    isRowHeader: true,
    cell: item => <Cell>{item.name}</Cell>,
  },
];

function PaginationFixture() {
  const { tableProps } = useTable({
    mode: 'complete',
    data: paginationItems,
    paginationOptions: { pageSize: 10 },
  });

  return <Table columnConfig={paginationColumns} {...tableProps} />;
}

describe('Table pagination', () => {
  it('shows first and last controls by default', () => {
    render(<PaginationFixture />);

    const firstPage = screen.getByRole('button', { name: 'First table page' });
    const lastPage = screen.getByRole('button', { name: 'Last table page' });
    expect(firstPage).toBeDisabled();
    expect(lastPage).toBeEnabled();

    fireEvent.click(lastPage);
    expect(screen.getByText('21 - 25 of 25')).toBeInTheDocument();
    expect(firstPage).toBeEnabled();
    expect(lastPage).toBeDisabled();

    fireEvent.click(firstPage);
    expect(screen.getByText('1 - 10 of 25')).toBeInTheDocument();
  });
});

describe('Table rowConfig navigation', () => {
  it('passes a relative getHref result to Row as an ordinary internal action', () => {
    const onClick = jest.fn();
    render(
      <RouterFixture>
        <Table
          columnConfig={[
            {
              id: 'name',
              label: 'Name',
              isRowHeader: true,
              cell: item => <Cell>{item.name}</Cell>,
            },
          ]}
          data={[{ id: 'child', name: 'Child' }]}
          pagination={{ type: 'none' }}
          rowConfig={{
            getHref: item => item.id,
            onClick,
          }}
        />
      </RouterFixture>,
    );

    const row = screen.getByRole('row', { name: 'Child' });
    expect(row).toHaveAttribute('data-href', '/app/catalog/entity/docs/child');
    fireEvent.click(row);
    expect(screen.getByRole('status')).toHaveTextContent(
      '/catalog/entity/docs/child',
    );
    expect(onClick).toHaveBeenCalledWith({ id: 'child', name: 'Child' });
  });
});
