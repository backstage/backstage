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
import {
  type Key,
  type Selection,
  ResizableTableContainer,
  Virtualizer,
} from 'react-aria-components';
import { TableLayout } from 'react-stately';
import { useDefinition } from '../../../hooks/useDefinition';
import { TableWrapperDefinition } from '../definition';
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
  TableSelection,
} from '../types';
import { useCallback, useMemo } from 'react';
import { VisuallyHidden } from '../../VisuallyHidden';
import { Flex } from '../../Flex';
import { TableBodySkeleton } from './TableBodySkeleton';

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

/**
 * Rows rendered from `columnConfig` are keyed by `String(item.id)`. Adopters
 * with numeric ids naturally pass numeric keys in `selection.selected`, so
 * incoming keys are normalized to strings. When the adopter's selection uses
 * numeric keys, reported keys are mapped back to the matching item's `id` so
 * the round trip stays consistent; otherwise keys are reported unchanged.
 */
function useNormalizedSelection<T extends TableItem>({
  data,
  selectedKeys,
  onSelectionChange,
  enabled,
}: {
  data: T[] | undefined;
  selectedKeys: TableSelection['selected'];
  onSelectionChange: TableSelection['onSelectionChange'];
  enabled: boolean;
}) {
  const normalizedSelectedKeys = useMemo(() => {
    if (!enabled || !selectedKeys || selectedKeys === 'all') {
      return selectedKeys;
    }
    return new Set<Key>(Array.from(selectedKeys, key => String(key)));
  }, [enabled, selectedKeys]);

  const handleSelectionChange = useCallback(
    (keys: Selection) => {
      if (!onSelectionChange) {
        return;
      }
      if (!enabled || keys === 'all') {
        onSelectionChange(keys);
        return;
      }
      const originalKeys = new Map<string, Key>();
      let usesNumericKeys = false;
      if (selectedKeys && selectedKeys !== 'all') {
        for (const key of selectedKeys) {
          originalKeys.set(String(key), key);
          usesNumericKeys ||= typeof key === 'number';
        }
      }
      if (usesNumericKeys) {
        for (const item of data ?? []) {
          if (!originalKeys.has(String(item.id))) {
            originalKeys.set(String(item.id), item.id);
          }
        }
      }
      onSelectionChange(
        new Set<Key>(
          Array.from(keys, key => originalKeys.get(String(key)) ?? key),
        ),
      );
    },
    [enabled, onSelectionChange, selectedKeys, data],
  );

  return {
    selectedKeys: normalizedSelectedKeys,
    onSelectionChange: onSelectionChange ? handleSelectionChange : undefined,
  };
}

function getLiveRegionLabel(
  pagination: TablePaginationType,
  isStale: boolean,
  isLoading: boolean,
  hasData: boolean,
): string {
  if (isLoading) {
    return 'Loading table data.';
  }

  if (!hasData || pagination.type === 'none') {
    return '';
  }

  const { pageSize, offset, totalCount, getLabel } = pagination;

  if (isStale) {
    return 'Loading table data.';
  }

  if (getLabel) {
    return `Table page loaded. ${getLabel({ pageSize, offset, totalCount })}`;
  }
  if (totalCount === 0) {
    return 'Table page loaded. No items to show.';
  }
  if (offset !== undefined) {
    const fromCount = offset + 1;
    const toCount = Math.min(offset + pageSize, totalCount ?? 0);
    return `Table page loaded. Showing ${fromCount} to ${toCount} of ${totalCount}`;
  }
  if (totalCount !== undefined) {
    return `Table page loaded. ${totalCount} items`;
  }
  return 'Table page loaded.';
}

/**
 * A full-featured data table with built-in pagination, sorting, row selection, loading and error states, and optional virtualization.
 * Pair with `useTable` to manage data fetching and state, or pass `data`, `columnConfig`, and `pagination` directly for manual control.
 *
 * @public
 */
export function Table<T extends TableItem>({
  columnConfig,
  data,
  isPending = false,
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
  virtualized,
}: TableProps<T>) {
  const pending = isPending || loading;
  const {
    ownProps: { classes },
  } = useDefinition(TableWrapperDefinition, { className });
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

  const isInitialLoading = pending && !data;

  const normalizedSelection = useNormalizedSelection({
    data,
    selectedKeys,
    onSelectionChange,
    enabled: !isRowRenderFn(rowConfig),
  });

  if (error) {
    return (
      <div className={classes.root} style={style} role="alert">
        Error: {error.message}
      </div>
    );
  }

  const liveRegionLabel = getLiveRegionLabel(
    pagination,
    isStale,
    isInitialLoading,
    data !== undefined,
  );

  const manualColumnSizing = columnConfig.some(
    col =>
      col.width != null ||
      col.minWidth != null ||
      col.maxWidth != null ||
      col.defaultWidth != null,
  );

  const wrapResizable = manualColumnSizing
    ? (elem: React.ReactNode) => (
        <ResizableTableContainer className={classes.resizableContainer}>
          {elem}
        </ResizableTableContainer>
      )
    : (elem: React.ReactNode) => <>{elem}</>;

  const layoutOptions =
    typeof virtualized === 'object' ? virtualized : undefined;

  const wrapVirtualized = (elem: React.ReactNode) =>
    virtualized ? (
      <Virtualizer layout={TableLayout} layoutOptions={layoutOptions}>
        {elem}
      </Virtualizer>
    ) : (
      elem
    );

  const wrapScrollContainer = (elem: React.ReactNode) => (
    <div className={classes.scrollContainer}>{elem}</div>
  );

  return (
    <div className={classes.root} style={style}>
      <VisuallyHidden aria-live="polite" id={liveRegionId}>
        {liveRegionLabel}
      </VisuallyHidden>
      {wrapResizable(
        wrapScrollContainer(
          wrapVirtualized(
            <TableRoot
              {...(isInitialLoading
                ? {}
                : {
                    selectionMode,
                    selectionBehavior,
                    selectedKeys: normalizedSelection.selectedKeys,
                    onSelectionChange: normalizedSelection.onSelectionChange,
                  })}
              sortDescriptor={sort?.descriptor ?? undefined}
              onSortChange={sort?.onSortChange}
              disabledKeys={disabledRows}
              stale={isStale}
              isPending={isInitialLoading}
              aria-describedby={liveRegionId}
            >
              <TableHeader columns={visibleColumns}>
                {column =>
                  column.header ? (
                    column.header()
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
              {isInitialLoading ? (
                <TableBodySkeleton columns={visibleColumns} />
              ) : (
                <TableBody
                  items={data}
                  dependencies={[visibleColumns]}
                  renderEmptyState={
                    emptyState
                      ? () => <Flex p="3">{emptyState}</Flex>
                      : undefined
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
                        {column => column.cell(item)}
                      </Row>
                    );
                  }}
                </TableBody>
              )}
            </TableRoot>,
          ),
        ),
      )}
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
          showPaginationLabel={pagination.showPaginationLabel}
        />
      )}
    </div>
  );
}
