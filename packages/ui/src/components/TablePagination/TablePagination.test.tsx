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

import { act, fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { BUIProvider } from '../../provider';
import { TablePagination } from './TablePagination';
import type { TablePaginationProps } from './types';

const baseProps: TablePaginationProps = {
  pageSize: 10,
  offset: 0,
  totalCount: 25,
  hasNextPage: true,
  hasPreviousPage: false,
  onNextPage: () => {},
  onPreviousPage: () => {},
};

function renderPagination(props: Partial<TablePaginationProps> = {}) {
  return render(
    <BUIProvider>
      <TablePagination {...baseProps} {...props} />
    </BUIProvider>,
  );
}

const nextButton = () =>
  screen.getByRole('button', { name: 'Next table page' });
const previousButton = () =>
  screen.getByRole('button', { name: 'Previous table page' });
const pageSizeSelect = () =>
  screen.getByRole('button', { name: /Select table page size/ });

describe('TablePagination', () => {
  it('renders the range label, wires navigation callbacks and disables unavailable directions', () => {
    const onNextPage = jest.fn();
    const onPreviousPage = jest.fn();
    const { rerender } = renderPagination({ onNextPage, onPreviousPage });

    expect(screen.getByText('1 - 10 of 25')).toBeInTheDocument();
    expect(previousButton()).toBeDisabled();
    expect(nextButton()).toBeEnabled();
    expect(nextButton()).toHaveAccessibleDescription('1 - 10 of 25');

    fireEvent.click(nextButton());
    expect(onNextPage).toHaveBeenCalledTimes(1);
    fireEvent.click(previousButton());
    expect(onPreviousPage).not.toHaveBeenCalled();

    rerender(
      <BUIProvider>
        <TablePagination
          {...baseProps}
          onNextPage={onNextPage}
          onPreviousPage={onPreviousPage}
          offset={20}
          hasNextPage={false}
          hasPreviousPage
        />
      </BUIProvider>,
    );
    expect(screen.getByText('21 - 25 of 25')).toBeInTheDocument();
    expect(nextButton()).toBeDisabled();
    fireEvent.click(previousButton());
    expect(onPreviousPage).toHaveBeenCalledTimes(1);
  });

  it('shows a count-only label without offset, hides the label for empty or unknown totals, and supports getLabel', () => {
    const { rerender } = renderPagination({ offset: undefined });
    expect(screen.getByText('25 items')).toBeInTheDocument();

    rerender(
      <BUIProvider>
        <TablePagination {...baseProps} totalCount={0} />
      </BUIProvider>,
    );
    expect(screen.queryByText(/of 0|items/)).not.toBeInTheDocument();
    expect(nextButton()).not.toHaveAttribute('aria-describedby');

    rerender(
      <BUIProvider>
        <TablePagination {...baseProps} totalCount={undefined} />
      </BUIProvider>,
    );
    expect(screen.queryByText(/of|items/)).not.toBeInTheDocument();

    const getLabel = jest.fn(() => 'Page 1');
    rerender(
      <BUIProvider>
        <TablePagination {...baseProps} getLabel={getLabel} />
      </BUIProvider>,
    );
    expect(getLabel).toHaveBeenCalledWith({
      pageSize: 10,
      offset: 0,
      totalCount: 25,
    });
    expect(screen.getByText('Page 1')).toBeInTheDocument();

    rerender(
      <BUIProvider>
        <TablePagination {...baseProps} showPaginationLabel={false} />
      </BUIProvider>,
    );
    expect(screen.queryByText('1 - 10 of 25')).not.toBeInTheDocument();
  });

  it('keeps the page size select in sync with the pageSize prop and reports user changes', () => {
    const onPageSizeChange = jest.fn();
    function Harness() {
      const [pageSize, setPageSize] = useState(10);
      return (
        <BUIProvider>
          <button onClick={() => setPageSize(20)}>set 20</button>
          <TablePagination
            {...baseProps}
            pageSize={pageSize}
            onPageSizeChange={size => {
              onPageSizeChange(size);
              setPageSize(size);
            }}
          />
        </BUIProvider>
      );
    }
    render(<Harness />);
    expect(pageSizeSelect()).toHaveTextContent('Show 10 results');

    fireEvent.click(pageSizeSelect());
    fireEvent.click(screen.getByRole('option', { name: 'Show 5 results' }));
    expect(onPageSizeChange).toHaveBeenCalledWith(5);
    expect(pageSizeSelect()).toHaveTextContent('Show 5 results');
    expect(screen.getByText('1 - 5 of 25')).toBeInTheDocument();

    // A prop-driven change (e.g. reload or reset) is reflected too.
    fireEvent.click(screen.getByText('set 20'));
    expect(pageSizeSelect()).toHaveTextContent('Show 20 results');
    expect(screen.getByText('1 - 20 of 25')).toBeInTheDocument();
  });

  it('accepts numeric and labelled page size options, hides the select on request, and falls back for invalid sizes', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const { rerender } = renderPagination({
      pageSizeOptions: [
        { label: 'Ten', value: 10 },
        { label: 'Fifty', value: 50 },
      ],
    });
    expect(pageSizeSelect()).toHaveTextContent('Ten');

    rerender(
      <BUIProvider>
        <TablePagination
          {...baseProps}
          pageSize={7}
          pageSizeOptions={[10, 50]}
        />
      </BUIProvider>,
    );
    expect(pageSizeSelect()).toHaveTextContent('Show 10 results');
    expect(screen.getByText('1 - 10 of 25')).toBeInTheDocument();
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('pageSize 7 is not in pageSizeOptions'),
    );

    rerender(
      <BUIProvider>
        <TablePagination {...baseProps} showPageSizeOptions={false} />
      </BUIProvider>,
    );
    expect(
      screen.queryByRole('button', { name: /Select table page size/ }),
    ).not.toBeInTheDocument();
    warn.mockRestore();
  });

  it('keeps keyboard focus within the controls when the focused button becomes disabled', () => {
    function Harness() {
      const [offset, setOffset] = useState(0);
      const hasNextPage = offset < 20;
      return (
        <BUIProvider>
          <TablePagination
            {...baseProps}
            offset={offset}
            hasNextPage={hasNextPage}
            hasPreviousPage={offset > 0}
            onNextPage={() => setOffset(o => o + 10)}
            onPreviousPage={() => setOffset(o => o - 10)}
          />
        </BUIProvider>
      );
    }
    render(<Harness />);

    act(() => nextButton().focus());
    fireEvent.click(nextButton());
    expect(nextButton()).toHaveFocus();
    fireEvent.click(nextButton());
    // Reached the last page: "Next" is disabled, focus moves to "Previous".
    expect(nextButton()).toBeDisabled();
    expect(previousButton()).toHaveFocus();

    fireEvent.click(previousButton());
    fireEvent.click(previousButton());
    expect(previousButton()).toBeDisabled();
    expect(nextButton()).toHaveFocus();
  });
});
