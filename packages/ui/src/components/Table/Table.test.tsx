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

import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { StrictMode, Suspense, useState, type ReactElement } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { BUIProvider } from '../../provider';
import {
  Cell,
  CellText,
  Row,
  Table,
  useTable,
  type ColumnConfig,
  type SortDescriptor,
  type TableProps,
} from '.';
import type { CursorParams, OffsetParams } from './hooks/types';

type Item = { id: number; name: string; owner: string };

const makeItems = (count: number): Item[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
    owner: i % 2 === 0 ? 'team-a' : 'team-b',
  }));

const columns: ColumnConfig<Item>[] = [
  {
    id: 'name',
    label: 'Name',
    isRowHeader: true,
    isSortable: true,
    cell: item => <CellText title={item.name} />,
  },
  {
    id: 'owner',
    label: 'Owner',
    cell: item => <CellText title={item.owner} />,
  },
];

function renderTable(ui: ReactElement) {
  return render(
    <MemoryRouter>
      <BUIProvider>{ui}</BUIProvider>
    </MemoryRouter>,
  );
}

const grid = () => screen.getByRole('grid', { name: 'Data table' });
const bodyRows = () => within(grid()).getAllByRole('row').slice(1);
const rowNames = () =>
  bodyRows().map(row => within(row).getAllByRole('rowheader')[0].textContent);
const liveRegion = () =>
  document.getElementById(grid().getAttribute('aria-describedby')!);
const nextButton = () =>
  screen.getByRole('button', { name: 'Next table page' });
const previousButton = () =>
  screen.getByRole('button', { name: 'Previous table page' });

describe('Table', () => {
  it('renders columns and rows from columnConfig, hides hidden columns and shows the empty state', () => {
    const { rerender } = renderTable(
      <Table
        columnConfig={[
          ...columns,
          {
            id: 'hidden',
            label: 'Hidden',
            isHidden: true,
            cell: () => <Cell />,
          },
        ]}
        data={makeItems(2)}
        pagination={{ type: 'none' }}
        emptyState="Nothing here"
      />,
    );

    expect(
      within(grid())
        .getAllByRole('columnheader')
        .map(c => c.textContent),
    ).toEqual(['Name', 'Owner']);
    expect(rowNames()).toEqual(['Item 1', 'Item 2']);
    expect(
      screen.queryByRole('button', { name: 'Next table page' }),
    ).toBeNull();
    expect(liveRegion()).toHaveTextContent('');

    rerender(
      <MemoryRouter>
        <BUIProvider>
          <Table
            columnConfig={columns}
            data={[]}
            pagination={{ type: 'none' }}
            emptyState="Nothing here"
          />
        </BUIProvider>
      </MemoryRouter>,
    );
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });

  it('exposes loading, stale and error states to assistive technology', () => {
    const pagination = {
      type: 'page' as const,
      pageSize: 5,
      offset: 0,
      totalCount: 12,
      hasNextPage: true,
      hasPreviousPage: false,
      onNextPage: () => {},
      onPreviousPage: () => {},
    };
    const { rerender } = renderTable(
      <Table
        columnConfig={columns}
        data={undefined}
        isPending
        pagination={pagination}
      />,
    );

    // Initial load: skeleton rows, busy grid, live announcement.
    expect(grid()).toHaveAttribute('aria-busy', 'true');
    expect(grid()).toHaveAttribute('aria-describedby', liveRegion()?.id);
    expect(liveRegion()).toHaveTextContent('Loading table data.');
    expect(bodyRows().length).toBeGreaterThan(0);
    expect(
      within(grid()).queryByRole('rowheader', { name: /Item/ }),
    ).toBeNull();

    const withData = (extra: Partial<TableProps<Item>>) => (
      <MemoryRouter>
        <BUIProvider>
          <Table
            columnConfig={columns}
            data={makeItems(5)}
            pagination={pagination}
            {...extra}
          />
        </BUIProvider>
      </MemoryRouter>
    );

    rerender(withData({}));
    expect(grid()).not.toHaveAttribute('aria-busy');
    expect(rowNames()).toEqual([
      'Item 1',
      'Item 2',
      'Item 3',
      'Item 4',
      'Item 5',
    ]);
    expect(liveRegion()).toHaveTextContent(
      'Table page loaded. Showing 1 to 5 of 12',
    );

    // Stale: rows stay visible while the next page loads.
    rerender(withData({ isPending: true, isStale: true }));
    expect(grid()).toHaveAttribute('aria-busy', 'true');
    expect(grid()).toHaveAttribute('data-stale', 'true');
    expect(rowNames()).toHaveLength(5);
    expect(liveRegion()).toHaveTextContent('Loading table data.');

    // Deprecated `loading` alias still marks the table busy.
    rerender(withData({ loading: true, isStale: true }));
    expect(grid()).toHaveAttribute('aria-busy', 'true');

    rerender(withData({ pagination: { ...pagination, offset: undefined } }));
    expect(liveRegion()).toHaveTextContent('Table page loaded. 12 items');

    rerender(
      withData({
        data: [],
        pagination: { ...pagination, totalCount: 0, hasNextPage: false },
      }),
    );
    expect(liveRegion()).toHaveTextContent(
      'Table page loaded. No items to show.',
    );

    rerender(withData({ error: new Error('Something broke') }));
    expect(screen.queryByRole('grid')).toBeNull();
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Error: Something broke',
    );

    // Recovering from the error re-renders the table.
    rerender(withData({}));
    expect(rowNames()).toHaveLength(5);
  });

  it('reports sort changes from column headers and reflects the controlled descriptor', () => {
    function Harness() {
      const [descriptor, setDescriptor] = useState<SortDescriptor | null>(null);
      return (
        <Table
          columnConfig={columns}
          data={makeItems(2)}
          pagination={{ type: 'none' }}
          sort={{ descriptor, onSortChange: setDescriptor }}
        />
      );
    }
    renderTable(<Harness />);
    const nameHeader = () => screen.getByRole('columnheader', { name: /Name/ });

    expect(nameHeader()).toHaveAttribute('aria-sort', 'none');
    fireEvent.click(nameHeader());
    expect(nameHeader()).toHaveAttribute('aria-sort', 'ascending');
    fireEvent.click(nameHeader());
    expect(nameHeader()).toHaveAttribute('aria-sort', 'descending');
    // Non-sortable columns do not react.
    expect(
      screen.getByRole('columnheader', { name: 'Owner' }),
    ).not.toHaveAttribute('aria-sort');
  });

  it('keeps multiple selection consistent with item ids across numeric keys, disabled rows and page changes', () => {
    const onSelectionChange = jest.fn();
    function Harness() {
      const [selected, setSelected] = useState<Set<string | number> | 'all'>(
        new Set([1]),
      );
      const [page, setPage] = useState(0);
      const data = makeItems(6).slice(page * 3, page * 3 + 3);
      return (
        <>
          <button onClick={() => setPage(1)}>page 2</button>
          <Table
            columnConfig={columns}
            data={data}
            pagination={{ type: 'none' }}
            rowConfig={{ getIsDisabled: item => item.id === 3 }}
            selection={{
              mode: 'multiple',
              selected,
              onSelectionChange: keys => {
                onSelectionChange(keys);
                setSelected(keys);
              },
            }}
          />
        </>
      );
    }
    renderTable(<Harness />);

    // Numeric ids in `selected` match the rows.
    expect(bodyRows().map(r => r.getAttribute('aria-selected'))).toEqual([
      'true',
      'false',
      'false',
    ]);
    expect(
      within(grid()).getByRole('checkbox', { name: 'Select all' }),
    ).toBeInTheDocument();

    fireEvent.click(
      within(bodyRows()[1]).getByRole('checkbox', { name: /Select row/ }),
    );
    // Reported keys keep the original id type.
    expect([...(onSelectionChange.mock.calls[0][0] as Set<unknown>)]).toEqual([
      1, 2,
    ]);
    expect(bodyRows()[1]).toHaveAttribute('aria-selected', 'true');

    // Disabled rows cannot be selected.
    expect(
      within(bodyRows()[2]).getByRole('checkbox', { name: /Select row/ }),
    ).toBeDisabled();
    fireEvent.click(
      within(bodyRows()[2]).getByRole('checkbox', { name: /Select row/ }),
    );
    expect(bodyRows()[2]).toHaveAttribute('aria-selected', 'false');

    // Selection is preserved when the visible rows change.
    fireEvent.click(screen.getByText('page 2'));
    expect(rowNames()).toEqual(['Item 4', 'Item 5', 'Item 6']);
    expect(bodyRows().map(r => r.getAttribute('aria-selected'))).toEqual([
      'false',
      'false',
      'false',
    ]);
    fireEvent.click(
      within(bodyRows()[0]).getByRole('checkbox', { name: /Select row/ }),
    );
    expect([
      ...(onSelectionChange.mock.calls.at(-1)[0] as Set<unknown>),
    ]).toEqual([1, 2, 4]);
  });

  it('supports single selection with row clicks and string ids passed by the adopter', () => {
    const onSelectionChange = jest.fn();
    renderTable(
      <Table
        columnConfig={columns}
        data={makeItems(3)}
        pagination={{ type: 'none' }}
        selection={{
          mode: 'single',
          selected: new Set(['2']),
          onSelectionChange,
        }}
      />,
    );
    expect(bodyRows().map(r => r.getAttribute('aria-selected'))).toEqual([
      'false',
      'true',
      'false',
    ]);
    expect(within(grid()).queryByRole('checkbox')).toBeNull();

    fireEvent.click(within(bodyRows()[0]).getByRole('rowheader'));
    // Adopters using string keys keep receiving string keys.
    expect([...(onSelectionChange.mock.calls[0][0] as Set<unknown>)]).toEqual([
      '1',
    ]);
  });

  it('runs row actions and renders row links from rowConfig', () => {
    const onClick = jest.fn();
    renderTable(
      <Table
        columnConfig={columns}
        data={makeItems(2)}
        pagination={{ type: 'none' }}
        rowConfig={{
          onClick,
          getHref: item => (item.id === 1 ? '/items/1' : undefined),
        }}
      />,
    );
    expect(bodyRows()[0]).toHaveAttribute('data-href', '/items/1');
    fireEvent.click(within(bodyRows()[1]).getByRole('rowheader'));
    expect(onClick).toHaveBeenCalledWith(expect.objectContaining({ id: 2 }));
  });

  it('renders custom rows via a row render function and leaves their selection keys untouched', () => {
    const onSelectionChange = jest.fn();
    renderTable(
      <Table
        columnConfig={columns}
        data={makeItems(2)}
        pagination={{ type: 'none' }}
        selection={{
          mode: 'multiple',
          selected: new Set([2]),
          onSelectionChange,
        }}
        rowConfig={({ item, index }) => (
          <Row id={item.id} columns={columns}>
            {column => (
              <CellText
                title={`${index}:${item[column.id as 'name' | 'owner']}`}
              />
            )}
          </Row>
        )}
      />,
    );
    expect(rowNames()).toEqual(['0:Item 1', '1:Item 2']);
    expect(bodyRows().map(r => r.getAttribute('aria-selected'))).toEqual([
      'false',
      'true',
    ]);
    fireEvent.click(
      within(bodyRows()[0]).getByRole('checkbox', { name: /Select row/ }),
    );
    expect([...(onSelectionChange.mock.calls[0][0] as Set<unknown>)]).toEqual([
      2, 1,
    ]);
  });

  it('paginates and reloads end to end with useTable in complete mode', () => {
    function Harness() {
      const [count, setCount] = useState(12);
      const { tableProps, reload, search } = useTable<Item>({
        mode: 'complete',
        data: makeItems(count),
        paginationOptions: { pageSize: 5 },
        searchFn: (data, s) => data.filter(i => i.name.includes(s)),
      });
      return (
        <>
          <input
            aria-label="Search"
            value={search.value}
            onChange={e => search.onChange(e.target.value)}
          />
          <button onClick={() => setCount(7)}>shrink</button>
          <button onClick={() => reload()}>reload</button>
          <Table columnConfig={columns} {...tableProps} />
        </>
      );
    }
    renderTable(<Harness />);

    expect(rowNames()).toEqual([
      'Item 1',
      'Item 2',
      'Item 3',
      'Item 4',
      'Item 5',
    ]);
    expect(screen.getByText('1 - 5 of 12')).toBeInTheDocument();
    expect(previousButton()).toBeDisabled();

    fireEvent.click(nextButton());
    fireEvent.click(nextButton());
    expect(rowNames()).toEqual(['Item 11', 'Item 12']);
    expect(screen.getByText('11 - 12 of 12')).toBeInTheDocument();
    expect(nextButton()).toBeDisabled();
    expect(liveRegion()).toHaveTextContent(
      'Table page loaded. Showing 11 to 12 of 12',
    );

    // Data shrinking under the current page falls back to the last page.
    fireEvent.click(screen.getByText('shrink'));
    expect(rowNames()).toEqual(['Item 6', 'Item 7']);
    expect(screen.getByText('6 - 7 of 7')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Search'), {
      target: { value: '1' },
    });
    expect(rowNames()).toEqual(['Item 1']);
    expect(screen.getByText('1 - 1 of 1')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Search'), {
      target: { value: '' },
    });
    fireEvent.click(nextButton());
    fireEvent.click(screen.getByText('reload'));
    expect(rowNames()).toEqual([
      'Item 1',
      'Item 2',
      'Item 3',
      'Item 4',
      'Item 5',
    ]);

    fireEvent.click(
      screen.getByRole('button', { name: /Select table page size/ }),
    );
    fireEvent.click(screen.getByRole('option', { name: 'Show 10 results' }));
    expect(rowNames()).toHaveLength(7);
    expect(
      screen.getByRole('button', { name: /Select table page size/ }),
    ).toHaveTextContent('Show 10 results');
  });

  it('shows skeleton, stale rows and busy state while server pages load with useTable in offset mode', async () => {
    const all = makeItems(7);
    const pending: Array<() => void> = [];
    const getData = jest.fn(
      ({ offset, pageSize }: OffsetParams<unknown>) =>
        new Promise<{ data: Item[]; totalCount: number }>(resolve => {
          pending.push(() =>
            resolve({
              data: all.slice(offset, offset + pageSize),
              totalCount: all.length,
            }),
          );
        }),
    );
    function Harness() {
      const { tableProps } = useTable<Item>({
        mode: 'offset',
        getData,
        paginationOptions: { pageSize: 5 },
      });
      return <Table columnConfig={columns} {...tableProps} />;
    }
    renderTable(<Harness />);

    expect(grid()).toHaveAttribute('aria-busy', 'true');
    expect(liveRegion()).toHaveTextContent('Loading table data.');
    expect(
      within(grid()).queryByRole('rowheader', { name: /Item/ }),
    ).toBeNull();

    await act(async () => pending.shift()!());
    expect(grid()).not.toHaveAttribute('aria-busy');
    expect(rowNames()).toHaveLength(5);
    expect(liveRegion()).toHaveTextContent(
      'Table page loaded. Showing 1 to 5 of 7',
    );

    act(() => nextButton().focus());
    fireEvent.click(nextButton());
    // Old rows stay visible and the navigation buttons keep their state
    // (and focus) while the next page is loading.
    expect(grid()).toHaveAttribute('aria-busy', 'true');
    expect(grid()).toHaveAttribute('data-stale', 'true');
    expect(rowNames()).toEqual([
      'Item 1',
      'Item 2',
      'Item 3',
      'Item 4',
      'Item 5',
    ]);
    expect(nextButton()).toBeEnabled();
    expect(nextButton()).toHaveFocus();
    expect(liveRegion()).toHaveTextContent('Loading table data.');

    await act(async () => pending.shift()!());
    expect(rowNames()).toEqual(['Item 6', 'Item 7']);
    expect(nextButton()).toBeDisabled();
    expect(previousButton()).toHaveFocus();
    expect(liveRegion()).toHaveTextContent(
      'Table page loaded. Showing 6 to 7 of 7',
    );
    expect(screen.getByText('6 - 7 of 7')).toBeInTheDocument();
  });

  it('does not fetch during an abandoned first render and settles correctly after Suspense and StrictMode remounts', async () => {
    let suspend = true;
    let releaseSuspense!: () => void;
    const suspensePromise = new Promise<void>(resolve => {
      releaseSuspense = resolve;
    });
    function Suspender() {
      if (suspend) {
        throw suspensePromise;
      }
      return null;
    }

    const all = makeItems(12);
    const offsetSignals: AbortSignal[] = [];
    const offsetGetData = jest.fn(
      async ({ offset, pageSize, signal }: OffsetParams<unknown>) => {
        offsetSignals.push(signal);
        return { data: all.slice(offset, offset + pageSize), totalCount: 12 };
      },
    );
    const cursorGetData = jest.fn(
      async ({ cursor, pageSize }: CursorParams<unknown>) => {
        const start = cursor ? Number(cursor) : 0;
        return {
          data: all.slice(start, start + pageSize),
          nextCursor:
            start + pageSize < 12 ? String(start + pageSize) : undefined,
        };
      },
    );
    const completeGetData = jest.fn(async () => all.slice(0, 3));

    function OffsetHarness() {
      const { tableProps } = useTable<Item>({
        mode: 'offset',
        getData: offsetGetData,
        paginationOptions: { pageSize: 5, initialOffset: 5 },
      });
      return (
        <>
          <Suspender />
          <Table columnConfig={columns} {...tableProps} />
        </>
      );
    }
    function CursorHarness() {
      const { tableProps } = useTable<Item>({
        mode: 'cursor',
        getData: cursorGetData,
        paginationOptions: { pageSize: 5 },
      });
      return <Table columnConfig={columns} {...tableProps} />;
    }
    function CompleteHarness() {
      const { tableProps } = useTable<Item>({
        mode: 'complete',
        getData: completeGetData,
      });
      return <Table columnConfig={columns} {...tableProps} />;
    }

    render(
      <StrictMode>
        <MemoryRouter>
          <BUIProvider>
            <Suspense fallback={<div>fallback</div>}>
              <OffsetHarness />
            </Suspense>
            <CursorHarness />
            <CompleteHarness />
          </BUIProvider>
        </MemoryRouter>
      </StrictMode>,
    );

    // The suspended (uncommitted) render must not issue a request.
    expect(screen.getByText('fallback')).toBeInTheDocument();
    expect(offsetGetData).not.toHaveBeenCalled();

    suspend = false;
    await act(async () => releaseSuspense());
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    // StrictMode mounts effects twice: the abandoned mount's request is
    // aborted and the retained mount's request produces the visible page.
    expect(offsetGetData).toHaveBeenCalledTimes(2);
    expect(offsetSignals.map(s => s.aborted)).toEqual([true, false]);
    expect(cursorGetData).toHaveBeenCalledTimes(2);
    expect(completeGetData).toHaveBeenCalledTimes(2);

    const grids = screen.getAllByRole('grid', { name: 'Data table' });
    expect(grids).toHaveLength(3);
    const namesIn = (g: HTMLElement) =>
      within(g)
        .getAllByRole('row')
        .slice(1)
        .map(row => within(row).getAllByRole('rowheader')[0].textContent);
    expect(namesIn(grids[0])).toEqual([
      'Item 6',
      'Item 7',
      'Item 8',
      'Item 9',
      'Item 10',
    ]);
    expect(namesIn(grids[1])).toEqual([
      'Item 1',
      'Item 2',
      'Item 3',
      'Item 4',
      'Item 5',
    ]);
    expect(namesIn(grids[2])).toEqual(['Item 1', 'Item 2', 'Item 3']);
    for (const g of grids) {
      expect(g).not.toHaveAttribute('aria-busy');
    }
    expect(
      screen.getAllByRole('button', { name: 'Next table page' })[1],
    ).toBeEnabled();
  });
});
