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

import { forwardRef } from 'react';
import { Text } from '../../Text';
import { DataTablePaginationProps } from './types';
import { ButtonIcon } from '../../ButtonIcon';
import clsx from 'clsx';
import { Select } from '../../Select';
import { useDataTable } from '../Root/DataTableRoot';
import { Icon } from '../../Icon';

/** @public */
const DataTablePagination = forwardRef(
  (
    props: DataTablePaginationProps,
    ref: React.ForwardedRef<HTMLDivElement>,
  ) => {
    const { className, ...rest } = props;
    const { table } = useDataTable();
    const pageIndex = table?.getState().pagination.pageIndex;
    const pageSize = table?.getState().pagination.pageSize;
    const rowCount = table?.getRowCount();
    const fromCount = (pageIndex ?? 0) * (pageSize ?? 10) + 1;
    const toCount = Math.min(
      ((pageIndex ?? 0) + 1) * (pageSize ?? 10),
      rowCount,
    );

    return (
      <div
        ref={ref}
        style={{ minWidth: table?.getTotalSize() }}
        className={clsx('bui-DataTablePagination', className)}
        {...rest}
      >
        <div className="bui-DataTablePagination--left">
          {!table.options.manualPagination && (
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
                table?.setPageSize(Number(value));
              }}
              className="bui-DataTablePagination--select"
            />
          )}
        </div>
        <div className="bui-DataTablePagination--right">
          <Text variant="body-medium">{`${fromCount} - ${toCount} of ${rowCount}`}</Text>
          <ButtonIcon
            variant="secondary"
            size="small"
            onClick={() => table?.previousPage()}
            isDisabled={!table?.getCanPreviousPage()}
            icon={<Icon name="chevron-left" />}
          />
          <ButtonIcon
            variant="secondary"
            size="small"
            onClick={() => table?.nextPage()}
            isDisabled={!table?.getCanNextPage()}
            icon={<Icon name="chevron-right" />}
          />
        </div>
      </div>
    );
  },
);

DataTablePagination.displayName = 'DataTablePagination';

export { DataTablePagination };
