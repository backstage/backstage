/*
 * Copyright 2022 The Backstage Authors
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

import React, {
  ReactNode,
  ChangeEvent,
  MouseEvent,
  useCallback,
  useMemo,
} from 'react';
import { TablePagination } from '@material-ui/core';
import { useSearch } from '../../context';

const encodePageCursor = (pageCursor: number): string => {
  return Buffer.from(pageCursor.toString(), 'utf-8').toString('base64');
};

const decodePageCursor = (pageCursor?: string): number => {
  if (!pageCursor) return 0;
  return Number(Buffer.from(pageCursor, 'base64').toString('utf-8'));
};

/**
 * A page limit option, this value must not be greater than 100.
 * @public
 */
export type SearchPaginationLimitOption<
  Current extends number = 101,
  Accumulator extends number[] = [],
> = Accumulator['length'] extends Current
  ? Accumulator[number]
  : SearchPaginationLimitOption<
      Current,
      [...Accumulator, Accumulator['length']]
    >;

/**
 * A page limit text, this function is called with a "\{ from, to, page, count \}" object.
 * @public
 */
export type SearchPaginationLimitText = (params: {
  from: number;
  to: number;
  page: number;
  count: number;
}) => ReactNode;

/**
 * Props for {@link SearchPaginationBase}.
 * @public
 */
export type SearchPaginationBaseProps = {
  /**
   * The component class name.
   */
  className?: string;
  /**
   * The total number of results.
   * For an unknown number of items, provide -1.
   * Defaults to -1.
   */
  total?: number;
  /**
   * The cursor for the current page.
   */
  cursor?: string;
  /**
   * Callback fired when the current page cursor is changed.
   */
  onCursorChange?: (pageCursor: string) => void;
  /**
   * The limit of results per page.
   * Set -1 to display all the results.
   */
  limit?: number;
  /**
   * Customize the results per page label.
   * Defaults to "Results per page:".
   */
  limitLabel?: ReactNode;
  /**
   * Customize the results per page text.
   * Defaults to "(\{ from, to, count \}) =\> count \> 0 ? `of $\{count\}` : `$\{from\}-$\{to\}`".
   */
  limitText?: SearchPaginationLimitText;
  /**
   * Options for setting how many results show per page.
   * If less than two options are available, no select field will be displayed.
   * Use -1 for the value with a custom label to show all the results.
   * Defaults to [10, 25, 50, 100].
   */
  limitOptions?: SearchPaginationLimitOption[];
  /**
   * Callback fired when the number of results per page is changed.
   */
  onLimitChange?: (value: number) => void;
};

/**
 * A component with controls for search results pagination.
 * @param props - See {@link SearchPaginationBaseProps}.
 * @public
 */
export const SearchPaginationBase = (props: SearchPaginationBaseProps) => {
  const {
    total: count = -1,
    cursor: pageCursor,
    onCursorChange: onPageCursorChange,
    limit: rowsPerPage = 25,
    limitLabel: labelRowsPerPage = 'Results per page:',
    limitText: labelDisplayedRows = ({ from, to }) =>
      count > 0 ? `of ${count}` : `${from}-${to}`,
    limitOptions: rowsPerPageOptions,
    onLimitChange: onPageLimitChange,
    ...rest
  } = props;

  const page = useMemo(() => decodePageCursor(pageCursor), [pageCursor]);

  const handlePageChange = useCallback(
    (_: MouseEvent<HTMLButtonElement> | null, newValue: number) => {
      onPageCursorChange?.(encodePageCursor(newValue));
    },
    [onPageCursorChange],
  );

  const handleRowsPerPageChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      const newValue = e.target.value;
      onPageLimitChange?.(parseInt(newValue, 10));
    },
    [onPageLimitChange],
  );

  return (
    <TablePagination
      {...rest}
      component="div"
      count={count}
      page={page}
      onPageChange={handlePageChange}
      rowsPerPage={rowsPerPage}
      labelRowsPerPage={labelRowsPerPage}
      labelDisplayedRows={labelDisplayedRows}
      rowsPerPageOptions={rowsPerPageOptions}
      onRowsPerPageChange={handleRowsPerPageChange}
    />
  );
};

/**
 * Props for {@link SearchPagination}.
 * @public
 */
export type SearchPaginationProps = Omit<
  SearchPaginationBaseProps,
  'pageLimit' | 'onPageLimitChange' | 'pageCursor' | 'onPageCursorChange'
>;

/**
 * A component for setting the search context page limit and cursor.
 * @param props - See {@link SearchPaginationProps}.
 * @public
 */
export const SearchPagination = (props: SearchPaginationProps) => {
  const { pageLimit, setPageLimit, pageCursor, setPageCursor } = useSearch();

  return (
    <SearchPaginationBase
      {...props}
      limit={pageLimit}
      onLimitChange={setPageLimit}
      cursor={pageCursor}
      onCursorChange={setPageCursor}
    />
  );
};
