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
import type { TablePaginationProps } from './types';
import { useStyles } from '../../hooks/useStyles';
import { TablePaginationDefinition } from './definition';
import styles from './TablePagination.module.css';
import { RiArrowLeftSLine, RiArrowRightSLine } from '@remixicon/react';

/**
 * Pagination controls for Table components.
 * A simple, presentational component that accepts pre-calculated values and callbacks.
 *
 * @public
 */
export function TablePagination(props: TablePaginationProps) {
  const { classNames, cleanedProps } = useStyles(TablePaginationDefinition, {
    showPageSizeOptions: true,
    ...props,
  });
  const {
    className,
    fromCount,
    toCount,
    totalCount,
    pageSize,
    onNextPage,
    onPreviousPage,
    onPageSizeChange,
    isNextDisabled,
    isPrevDisabled,
    isLoading,
    showPageSizeOptions,
    ...rest
  } = cleanedProps;

  const rangeText =
    totalCount !== undefined
      ? `${fromCount} - ${toCount} of ${totalCount}`
      : `${fromCount} - ${toCount}`;

  return (
    <div
      className={clsx(classNames.root, styles[classNames.root], className)}
      {...rest}
    >
      <div className={clsx(classNames.left, styles[classNames.left])}>
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
            selectedKey={pageSize.toString()}
            onSelectionChange={value => {
              const newPageSize = Number(value);
              onPageSizeChange(newPageSize);
            }}
            className={clsx(classNames.select, styles[classNames.select])}
          />
        )}
      </div>
      <div className={clsx(classNames.right, styles[classNames.right])}>
        <Text as="p" variant="body-medium">
          {rangeText}
        </Text>
        <ButtonIcon
          variant="secondary"
          size="small"
          onClick={onPreviousPage}
          isDisabled={isPrevDisabled || isLoading}
          icon={<RiArrowLeftSLine />}
          aria-label="Previous"
        />
        <ButtonIcon
          variant="secondary"
          size="small"
          onClick={onNextPage}
          isDisabled={isNextDisabled || isLoading}
          icon={<RiArrowRightSLine />}
          aria-label="Next"
        />
      </div>
    </div>
  );
}
