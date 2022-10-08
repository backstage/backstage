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
 * A page limit text, this function is called with a "\{ from, to, page \}" object.
 * @public
 */
export type SearchPaginationLimitText = (params: {
  from: number;
  to: number;
  page: number;
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
   * The cursor for the current page.
   */
  pageCursor?: string;
  /**
   * Callback fired when the current page cursor is changed.
   */
  onPageCursorChange?: (pageCursor: string) => void;
  /**
   * The limit of results per page.
   * Set -1 to display all the results.
   */
  pageLimit?: number;
  /**
   * Customize the results per page label.
   */
  pageLimitLabel?: ReactNode;
  /**
   * Customize the results per page text.
   */
  pageLimitText?: SearchPaginationLimitText;
  /**
   * Options for setting how many results show per page.
   * If less than two options are available, no select field will be displayed.
   * Use -1 for the value with a custom label to show all the results.
   */
  pageLimitOptions?: SearchPaginationLimitOption[];
  /**
   * Callback fired when the number of results per page is changed.
   */
  onPageLimitChange?: (value: number) => void;
};

/**
 * A component with controls for search results pagination.
 * @param props - See {@link SearchPaginationBaseProps}.
 * @public
 */
export const SearchPaginationBase = (props: SearchPaginationBaseProps) => {
  const {
    pageCursor,
    onPageCursorChange,
    pageLimit: rowsPerPage = 25,
    pageLimitLabel: labelRowsPerPage = 'Results per page:',
    pageLimitText: labelDisplayedRows,
    pageLimitOptions: rowsPerPageOptions,
    onPageLimitChange,
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
      count={-1}
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
      pageLimit={pageLimit}
      onPageLimitChange={setPageLimit}
      pageCursor={pageCursor}
      onPageCursorChange={setPageCursor}
    />
  );
};
