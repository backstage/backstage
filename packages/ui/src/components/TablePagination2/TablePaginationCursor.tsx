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
import { Text, ButtonIcon, Select } from '../..';
import type { TablePaginationCursorProps } from './types';
import { useStyles } from '../../hooks/useStyles';
import { TablePaginationDefinition } from './definition';
import styles from './TablePagination.module.css';
import { RiArrowLeftSLine, RiArrowRightSLine } from '@remixicon/react';

/**
 * Pagination controls for Table components with cursor-based pagination.
 *
 * @public
 */
export function TablePaginationCursor(props: TablePaginationCursorProps) {
  const { classNames, cleanedProps } = useStyles(TablePaginationDefinition, {
    showPageSizeOptions: true,
    ...props,
  });
  const {
    className,
    nextCursor,
    prevCursor,
    totalCount,
    currentPage,
    limit,
    fetchNext,
    fetchPrev,
    setLimit,
    isLoading,
    onNextPage,
    onPreviousPage,
    onLimitChange,
    showPageSizeOptions,
    ...rest
  } = cleanedProps;

  const fromCount = (currentPage - 1) * limit + 1;
  const toCount =
    totalCount !== undefined
      ? Math.min(currentPage * limit, totalCount)
      : currentPage * limit;

  const nextPage = () => {
    if (nextCursor) {
      onNextPage?.();
      fetchNext();
    }
  };

  const previousPage = () => {
    if (prevCursor !== undefined) {
      onPreviousPage?.();
      fetchPrev();
    }
  };

  return (
    <div
      className={clsx(classNames.root, styles[classNames.root], className)}
      {...rest}
    >
      <div className={clsx(classNames.left, styles[classNames.left])}>
        {showPageSizeOptions && (
          <Select
            name="limit"
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
            selectedKey={limit?.toString()}
            onSelectionChange={value => {
              const newLimit = Number(value);
              setLimit?.(newLimit);
              onLimitChange?.(newLimit);
            }}
            className={clsx(classNames.select, styles[classNames.select])}
          />
        )}
      </div>
      <div className={clsx(classNames.right, styles[classNames.right])}>
        {totalCount !== undefined ? (
          <Text
            as="p"
            variant="body-medium"
          >{`${fromCount} - ${toCount} of ${totalCount}`}</Text>
        ) : (
          <Text
            as="p"
            variant="body-medium"
          >{`${fromCount} - ${toCount}`}</Text>
        )}
        <ButtonIcon
          variant="secondary"
          size="small"
          onClick={previousPage}
          isDisabled={!prevCursor || isLoading}
          icon={<RiArrowLeftSLine />}
          aria-label="Previous"
        />
        <ButtonIcon
          variant="secondary"
          size="small"
          onClick={nextPage}
          isDisabled={!nextCursor || isLoading}
          icon={<RiArrowRightSLine />}
          aria-label="Next"
        />
      </div>
    </div>
  );
}
