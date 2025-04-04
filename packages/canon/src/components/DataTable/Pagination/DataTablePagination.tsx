/*
 * Copyright 2024 The Backstage Authors
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
import * as React from 'react';
import { Text } from '../../Text';
import { DataTablePaginationProps } from './types';
import { IconButton } from '../../IconButton';
import clsx from 'clsx';
import { Select } from '../../Select';

/** @public */
const DataTablePagination = React.forwardRef<
  HTMLDivElement,
  DataTablePaginationProps
>(({ className, ...props }, ref) => {
  const {
    pageIndex,
    pageSize,
    onClickPrevious,
    onClickNext,
    canPrevious,
    canNext,
    totalRows,
    setPageSize,
  } = props;
  return (
    <div
      ref={ref}
      className={clsx('canon-TablePagination', className)}
      {...props}
    >
      <div className="canon-TablePagination--left">
        <Select
          name="pageSize"
          size="small"
          placeholder="Show 10 results"
          options={[
            { label: 'Show 10 results', value: '10' },
            { label: 'Show 20 results', value: '20' },
            { label: 'Show 30 results', value: '30' },
            { label: 'Show 40 results', value: '40' },
            { label: 'Show 50 results', value: '50' },
          ]}
          value={pageSize?.toString()}
          onValueChange={value => {
            setPageSize?.(Number(value));
          }}
        />
      </div>
      <div className="canon-TablePagination--right">
        <Text variant="body">{`${(pageIndex ?? 0) * (pageSize ?? 10) + 1} - ${
          ((pageIndex ?? 0) + 1) * (pageSize ?? 10)
        } of ${totalRows}`}</Text>
        <IconButton
          variant="secondary"
          size="small"
          onClick={onClickPrevious}
          disabled={!canPrevious}
          icon="chevron-left"
        />
        <IconButton
          variant="secondary"
          size="small"
          onClick={onClickNext}
          disabled={!canNext}
          icon="chevron-right"
        />
      </div>
    </div>
  );
});
DataTablePagination.displayName = 'DataTablePagination';

export { DataTablePagination };
