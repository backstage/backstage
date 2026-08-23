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

import { fireEvent, render, screen } from '@testing-library/react';
import { TablePagination } from '.';
import type { TablePaginationProps } from '.';

function renderPagination(props: Partial<TablePaginationProps> = {}) {
  const defaultProps: TablePaginationProps = {
    pageSize: 10,
    offset: 0,
    totalCount: 25,
    hasNextPage: true,
    hasPreviousPage: false,
    onNextPage: jest.fn(),
    onPreviousPage: jest.fn(),
    onPageSizeChange: jest.fn(),
  };
  const merged = { ...defaultProps, ...props };
  return { ...render(<TablePagination {...merged} />), props: merged };
}

describe('TablePagination', () => {
  it('renders the range label and wires up the navigation buttons', () => {
    const { props } = renderPagination();

    expect(screen.getByText('1 - 10 of 25')).toBeInTheDocument();

    const previousButton = screen.getByRole('button', {
      name: 'Previous table page',
    });
    const nextButton = screen.getByRole('button', { name: 'Next table page' });

    expect(previousButton).toBeDisabled();
    expect(nextButton).toBeEnabled();
    expect(previousButton).toHaveAccessibleDescription('1 - 10 of 25');
    expect(nextButton).toHaveAccessibleDescription('1 - 10 of 25');

    fireEvent.click(nextButton);
    expect(props.onNextPage).toHaveBeenCalledTimes(1);
    expect(props.onPreviousPage).not.toHaveBeenCalled();
  });

  it('handles label boundary values', () => {
    // Last, partial page.
    const { unmount } = renderPagination({
      offset: 20,
      hasNextPage: false,
      hasPreviousPage: true,
    });
    expect(screen.getByText('21 - 25 of 25')).toBeInTheDocument();
    unmount();

    // No offset (cursor pagination) falls back to a total count label.
    const second = renderPagination({ offset: undefined, totalCount: 42 });
    expect(screen.getByText('42 items')).toBeInTheDocument();
    second.unmount();

    // No label for an empty or unknown total.
    const third = renderPagination({ totalCount: 0 });
    expect(screen.queryByText(/of 0/)).toBeNull();
    third.unmount();

    renderPagination({ totalCount: undefined });
    expect(screen.queryByText(/items|of/)).toBeNull();
  });

  it('supports a custom getLabel', () => {
    renderPagination({
      getLabel: ({ offset, pageSize, totalCount }) =>
        `page starting at ${offset} showing ${pageSize} of ${totalCount}`,
    });
    expect(
      screen.getByText('page starting at 0 showing 10 of 25'),
    ).toBeInTheDocument();
  });

  it('keeps the page size select in sync when the pageSize prop changes after mount', () => {
    const onPageSizeChange = jest.fn();
    const { rerender } = render(
      <TablePagination
        pageSize={10}
        offset={0}
        totalCount={25}
        hasNextPage
        hasPreviousPage={false}
        onNextPage={jest.fn()}
        onPreviousPage={jest.fn()}
        onPageSizeChange={onPageSizeChange}
      />,
    );

    const select = screen.getByRole('button', {
      name: /Select table page size/,
    });
    expect(select).toHaveTextContent('Show 10 results');

    rerender(
      <TablePagination
        pageSize={20}
        offset={0}
        totalCount={25}
        hasNextPage
        hasPreviousPage={false}
        onNextPage={jest.fn()}
        onPreviousPage={jest.fn()}
        onPageSizeChange={onPageSizeChange}
      />,
    );
    expect(select).toHaveTextContent('Show 20 results');

    // Selecting an option reports the numeric page size.
    fireEvent.click(select);
    fireEvent.click(screen.getByRole('option', { name: 'Show 5 results' }));
    expect(onPageSizeChange).toHaveBeenCalledWith(5);
  });

  it('falls back to the first option when pageSize is not in pageSizeOptions', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      renderPagination({ pageSize: 7, pageSizeOptions: [10, 25, 50] });

      expect(warn).toHaveBeenCalledWith(
        expect.stringContaining('pageSize 7 is not in pageSizeOptions'),
      );
      expect(
        screen.getByRole('button', { name: /Select table page size/ }),
      ).toHaveTextContent('Show 10 results');
      expect(screen.getByText('1 - 10 of 25')).toBeInTheDocument();
    } finally {
      warn.mockRestore();
    }
  });

  it('renders navigation without crashing when pageSizeOptions is empty', () => {
    renderPagination({ pageSizeOptions: [] });

    expect(
      screen.getByRole('button', { name: 'Next table page' }),
    ).toBeEnabled();
    expect(screen.getByText('1 - 10 of 25')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Select table page size/ }),
    ).toBeNull();
  });

  it('can hide the page size select and the label', () => {
    renderPagination({
      showPageSizeOptions: false,
      showPaginationLabel: false,
    });

    expect(
      screen.queryByRole('button', { name: /Select table page size/ }),
    ).toBeNull();
    expect(screen.queryByText('1 - 10 of 25')).toBeNull();
    expect(
      screen.getByRole('button', { name: 'Next table page' }),
    ).not.toHaveAccessibleDescription();
  });
});
