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

afterEach(() => {
  jest.restoreAllMocks();
});

describe('TablePagination', () => {
  it('keeps the page size select in sync with the pageSize prop', () => {
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

    fireEvent.click(select);
    fireEvent.click(screen.getByRole('option', { name: 'Show 5 results' }));
    expect(onPageSizeChange).toHaveBeenCalledWith(5);
    expect(select).toHaveTextContent('Show 20 results');
  });

  it('renders pagination without a page size select when options are empty', () => {
    render(
      <TablePagination
        pageSize={10}
        pageSizeOptions={[]}
        offset={0}
        totalCount={25}
        hasNextPage
        hasPreviousPage={false}
        onNextPage={jest.fn()}
        onPreviousPage={jest.fn()}
        onPageSizeChange={jest.fn()}
      />,
    );

    expect(screen.getByText('1 - 10 of 25')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Next table page' }),
    ).toBeEnabled();
    expect(
      screen.queryByRole('button', { name: /Select table page size/ }),
    ).not.toBeInTheDocument();
  });

  it('falls back to the first option when pageSize is unavailable', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

    render(
      <TablePagination
        pageSize={7}
        pageSizeOptions={[10, 25, 50]}
        offset={0}
        totalCount={25}
        hasNextPage
        hasPreviousPage={false}
        onNextPage={jest.fn()}
        onPreviousPage={jest.fn()}
        onPageSizeChange={jest.fn()}
      />,
    );

    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('pageSize 7 is not in pageSizeOptions'),
    );
    expect(
      screen.getByRole('button', { name: /Select table page size/ }),
    ).toHaveTextContent('Show 10 results');
    expect(screen.getByText('1 - 10 of 25')).toBeInTheDocument();
  });
});
