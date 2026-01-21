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

import { useId } from 'react-aria';
import { type Key, ResizableTableContainer } from 'react-aria-components';
import { TableRoot } from './TableRoot';
import { TableHeader } from './TableHeader';
import { TableBody } from './TableBody';
import { Row } from './Row';
import { Column } from './Column';
import { TablePagination } from '../../TablePagination';
import type {
  TableProps,
  TableItem,
  RowConfig,
  RowRenderFn,
  TablePaginationType,
} from '../types';
import { Fragment, useMemo } from 'react';
import { VisuallyHidden } from '../../VisuallyHidden';
import { Flex } from '../../Flex';

function isRowRenderFn<T extends TableItem>(
  rowConfig: RowConfig<T> | RowRenderFn<T> | undefined,
): rowConfig is RowRenderFn<T> {
  return typeof rowConfig === 'function';
}

function useDisabledRows<T extends TableItem>({
  data,
  rowConfig,
}: Pick<TableProps<T>, 'data' | 'rowConfig'>): Set<Key> | undefined {
  return useMemo(() => {
    if (!data || typeof rowConfig === 'function' || !rowConfig?.getIsDisabled) {
      return;
    }

    return data.reduce<Set<Key>>((set, item) => {
      const isDisabled = rowConfig.getIsDisabled?.(item);
      if (isDisabled) {
        set.add(String(item.id));
      }
      return set;
    }, new Set<Key>());
  }, [data, rowConfig]);
}

function useLiveRegionLabel(
  pagination: TablePaginationType,
  isStale: boolean,
  hasData: boolean,
): string {
  if (!hasData || pagination.type === 'none') {
    return '';
  }

  const { pageSize, offset, totalCount, getLabel } = pagination;

  if (isStale) {
    return 'Loading table data.';
  }

  let liveRegionLabel = 'Table page loaded. ';

  if (getLabel) {
    liveRegionLabel += getLabel({ pageSize, offset, totalCount });
  } else if (offset !== undefined) {
    const fromCount = offset + 1;
    const toCount = Math.min(offset + pageSize, totalCount ?? 0);
    liveRegionLabel += `Showing ${fromCount} to ${toCount} of ${totalCount}`;
  }
  return liveRegionLabel;
}

/** @public */
export function Table<T extends TableItem>({
  columnConfig,
  data,
  loading = false,
  isStale = false,
  error,
  pagination,
  sort,
  rowConfig,
  selection,
  emptyState,
  className,
  style,
}: TableProps<T>) {
  const liveRegionId = useId();

  const visibleColumns = useMemo(
    () => columnConfig.filter(col => !col.isHidden),
    [columnConfig],
  );
  const disabledRows = useDisabledRows({ data, rowConfig });

  const {
    mode: selectionMode,
    selected: selectedKeys,
    behavior: selectionBehavior,
    onSelectionChange,
  } = selection || {};

  if (loading && !data) {
    return (
      <div className={className} style={style}>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className={className} style={style}>
        Error: {error.message}
      </div>
    );
  }

  const liveRegionLabel = useLiveRegionLabel(
    pagination,
    isStale,
    data !== undefined,
  );

  return (
    <div className={className} style={style}>
      <VisuallyHidden aria-live="polite" id={liveRegionId}>
        {liveRegionLabel}
      </VisuallyHidden>

      <ResizableTableContainer>
        <TableRoot
          selectionMode={selectionMode}
          selectionBehavior={selectionBehavior}
          selectedKeys={selectedKeys}
          onSelectionChange={onSelectionChange}
          sortDescriptor={sort?.descriptor ?? undefined}
          onSortChange={sort?.onSortChange}
          disabledKeys={disabledRows}
          stale={isStale}
          aria-describedby={liveRegionId}
        >
          <TableHeader columns={visibleColumns}>
            {column =>
              column.header ? (
                <>{column.header()}</>
              ) : (
                <Column
                  id={column.id}
                  isRowHeader={column.isRowHeader}
                  allowsSorting={column.isSortable}
                  width={column.width}
                  defaultWidth={column.defaultWidth}
                  minWidth={column.minWidth}
                  maxWidth={column.maxWidth}
                >
                  {column.label}
                </Column>
              )
            }
          </TableHeader>
          <TableBody
            items={data}
            renderEmptyState={
              emptyState ? () => <Flex p="3">{emptyState}</Flex> : undefined
            }
          >
            {item => {
              const itemIndex = data?.indexOf(item) ?? -1;

              if (isRowRenderFn(rowConfig)) {
                return rowConfig({
                  item,
                  index: itemIndex,
                });
              }

              return (
                <Row
                  id={String(item.id)}
                  columns={visibleColumns}
                  href={rowConfig?.getHref?.(item)}
                  onAction={
                    rowConfig?.onClick
                      ? () => rowConfig?.onClick?.(item)
                      : undefined
                  }
                >
                  {column => (
                    <Fragment key={column.id}>{column.cell(item)}</Fragment>
                  )}
                </Row>
              );
            }}
          </TableBody>
        </TableRoot>
      </ResizableTableContainer>
      {pagination.type === 'page' && (
        <TablePagination
          pageSize={pagination.pageSize}
          pageSizeOptions={pagination.pageSizeOptions}
          offset={pagination.offset}
          totalCount={pagination.totalCount}
          hasNextPage={pagination.hasNextPage}
          hasPreviousPage={pagination.hasPreviousPage}
          onNextPage={pagination.onNextPage}
          onPreviousPage={pagination.onPreviousPage}
          onPageSizeChange={pagination.onPageSizeChange}
          showPageSizeOptions={pagination.showPageSizeOptions}
          getLabel={pagination.getLabel}
        />
      )}
    </div>
  );
}
