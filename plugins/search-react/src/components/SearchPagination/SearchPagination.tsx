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

import { ReactNode, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  ShadcnButton as Button,
  ShadcnSelect,
  SelectTrigger,
  SelectContent,
  ShadcnSelectItem as SelectItem,
  SelectValue,
  cn,
} from '@backstage/core-components';
import { useSearch } from '../../context';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { searchReactTranslationRef } from '../../translation';

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
   * Whether a next page exists
   */
  hasNextPage?: boolean;
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
/** Default rows-per-page options matching previous MUI TablePagination defaults. */
const DEFAULT_ROWS_PER_PAGE_OPTIONS: number[] = [10, 25, 50, 100];

export const SearchPaginationBase = (props: SearchPaginationBaseProps) => {
  const { t } = useTranslationRef(searchReactTranslationRef);
  const {
    total: count = -1,
    cursor: pageCursor,
    hasNextPage,
    onCursorChange: onPageCursorChange,
    limit: rowsPerPage = 25,
    limitLabel: labelRowsPerPage = t('searchPagination.limitLabel'),
    limitText: labelDisplayedRows = ({ from, to }) =>
      count > 0
        ? t('searchPagination.limitText', { num: `${count}` })
        : `${from}-${to}`,
    limitOptions: rowsPerPageOptions,
    onLimitChange: onPageLimitChange,
    ...rest
  } = props;

  const page = useMemo(() => decodePageCursor(pageCursor), [pageCursor]);

  /** Resolve options with the default set if none were provided. */
  const resolvedOptions = rowsPerPageOptions ?? DEFAULT_ROWS_PER_PAGE_OPTIONS;

  const handlePageChange = useCallback(
    (newValue: number) => {
      onPageCursorChange?.(encodePageCursor(newValue));
    },
    [onPageCursorChange],
  );

  return (
    <div
      className={cn(
        'flex items-center justify-between px-2 py-4',
        rest.className,
      )}
    >
      {/* Rows-per-page selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          {labelRowsPerPage}
        </span>
        {resolvedOptions.length >= 2 && (
          <ShadcnSelect
            value={String(rowsPerPage)}
            onValueChange={(v: string) => onPageLimitChange?.(parseInt(v, 10))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {resolvedOptions.map(size => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </ShadcnSelect>
        )}
      </div>

      {/* Range display and page navigation buttons */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          {labelDisplayedRows({
            from: page * rowsPerPage + 1,
            to: Math.min(
              (page + 1) * rowsPerPage,
              count > 0 ? count : (page + 1) * rowsPerPage,
            ),
            page,
            count,
          })}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 0}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(page + 1)}
          disabled={
            hasNextPage !== undefined
              ? !hasNextPage
              : count > 0 && (page + 1) * rowsPerPage >= count
          }
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

/**
 * Props for {@link SearchPagination}.
 * @public
 */
export type SearchPaginationProps = Omit<
  SearchPaginationBaseProps,
  | 'pageLimit'
  | 'onLimitChange'
  | 'pageCursor'
  | 'onPageCursorChange'
  | 'hasNextPage'
>;

/**
 * A component for setting the search context page limit and cursor.
 * @param props - See {@link SearchPaginationProps}.
 * @public
 */
export const SearchPagination = (props: SearchPaginationProps) => {
  const { pageLimit, setPageLimit, pageCursor, setPageCursor, fetchNextPage } =
    useSearch();

  const handlePageLimitChange = useCallback(
    (newPageLimit: number) => {
      setPageLimit(newPageLimit);
      setPageCursor(undefined);
    },
    [setPageLimit, setPageCursor],
  );

  return (
    <SearchPaginationBase
      {...props}
      hasNextPage={!!fetchNextPage}
      limit={pageLimit}
      onLimitChange={handlePageLimitChange}
      cursor={pageCursor}
      onCursorChange={setPageCursor}
    />
  );
};
