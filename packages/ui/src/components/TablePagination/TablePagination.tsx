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

import clsx from 'clsx';
import { Text, ButtonIcon, Select, Icon } from '../..';
import type { TablePaginationProps } from './types';

/**
 * Pagination controls for Table components with page navigation and size selection.
 *
 * @public
 */
export function TablePagination(props: TablePaginationProps) {
  const {
    className,
    pageIndex,
    pageSize,
    rowCount,
    onNextPage,
    onPreviousPage,
    onPageSizeChange,
    setPageIndex,
    setPageSize,
    showPageSizeOptions = true,
    ...rest
  } = props;

  const fromCount = (pageIndex ?? 0) * (pageSize ?? 10) + 1;
  const toCount = Math.min(
    ((pageIndex ?? 0) + 1) * (pageSize ?? 10),
    rowCount ?? 0,
  );

  const nextPage = () => {
    const currentPageIndex = pageIndex ?? 0;
    const currentPageSize = pageSize ?? 10;
    const totalRows = rowCount ?? 0;

    // Check if there are more pages to navigate to
    const maxPageIndex = Math.ceil(totalRows / currentPageSize) - 1;

    if (currentPageIndex < maxPageIndex) {
      onNextPage?.(); // Analytics tracking
      setPageIndex?.(currentPageIndex + 1); // Navigate to next page
    }
  };

  const previousPage = () => {
    const currentPageIndex = pageIndex ?? 0;

    // Check if we can go to previous page
    if (currentPageIndex > 0) {
      onPreviousPage?.(); // Analytics tracking
      setPageIndex?.(currentPageIndex - 1); // Navigate to previous page
    }
  };

  return (
    <div className={clsx('bui-DataTablePagination', className)} {...rest}>
      <div className="bui-DataTablePagination--left">
        {showPageSizeOptions && (
          <Select
            name="pageSize"
            size="small"
            placeholder="Show 10 results"
            options={[
              { label: 'Show 5 results', value: '5' },
              { label: 'Show 10 results', value: '10' },
              { label: 'Show 20 results', value: '20' },
              { label: 'Show 30 results', value: '30' },
              { label: 'Show 40 results', value: '40' },
              { label: 'Show 50 results', value: '50' },
            ]}
            selectedKey={pageSize?.toString()}
            onSelectionChange={value => {
              const newPageSize = Number(value);
              setPageSize?.(newPageSize);
              onPageSizeChange?.(newPageSize);
            }}
            className="bui-DataTablePagination--select"
          />
        )}
      </div>
      <div className="bui-DataTablePagination--right">
        <Text
          as="p"
          variant="body-medium"
        >{`${fromCount} - ${toCount} of ${rowCount}`}</Text>
        <ButtonIcon
          variant="secondary"
          size="small"
          onClick={previousPage}
          isDisabled={pageIndex === 0}
          icon={<Icon name="chevron-left" />}
          aria-label="Previous"
        />
        <ButtonIcon
          variant="secondary"
          size="small"
          onClick={nextPage}
          isDisabled={
            pageIndex !== undefined &&
            pageSize !== undefined &&
            rowCount !== undefined &&
            pageIndex >= Math.ceil(rowCount / pageSize) - 1
          }
          icon={<Icon name="chevron-right" />}
          aria-label="Next"
        />
      </div>
    </div>
  );
}
