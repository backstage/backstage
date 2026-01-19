/*
 * Copyright 2023 The Backstage Authors
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

import { ReactNode, useCallback } from 'react';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

import { Table, ColumnConfig, Cell } from '@backstage/ui';
import { CatalogTableRow } from './types';
import { useEntityList } from '@backstage/plugin-catalog-react';
import { CatalogTableToolbar } from './CatalogTableToolbar';

/**
 * @internal
 */
export function OffsetPaginatedCatalogTable(props: {
  columns: ColumnConfig<CatalogTableRow>[];
  data: CatalogTableRow[];
  isLoading?: boolean;
  title?: string;
  subtitle?: string;
  emptyContent?: ReactNode;
  actions: Array<
    (row: CatalogTableRow) => {
      icon: () => React.ReactElement;
      tooltip: string;
      disabled?: boolean;
      onClick?: () => void;
      cellStyle?: React.CSSProperties;
    }
  >;
}) {
  const { columns, data, isLoading, title, subtitle, emptyContent, actions } =
    props;
  const { setLimit, setOffset, limit, totalItems, offset } = useEntityList();

  // Create actions column
  const actionsColumn: ColumnConfig<CatalogTableRow> = {
    id: 'actions',
    label: 'Actions',
    cell: (row: CatalogTableRow) => (
      <Cell>
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          {actions.map((action, index) => {
            const actionConfig = action(row);
            const IconElement = actionConfig.icon();

            return (
              <IconButton
                key={index}
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  e.preventDefault();
                  actionConfig.onClick?.();
                }}
                disabled={actionConfig.disabled}
                title={actionConfig.tooltip}
                size="small"
                style={actionConfig.cellStyle as React.CSSProperties}
              >
                {IconElement}
              </IconButton>
            );
          })}
        </div>
      </Cell>
    ),
  };

  const allColumns = [...columns, actionsColumn];

  const handleNextPage = useCallback(() => {
    const newOffset = (offset || 0) + limit;
    setOffset!(newOffset);
  }, [offset, limit, setOffset]);

  const handlePreviousPage = useCallback(() => {
    const newOffset = Math.max(0, (offset || 0) - limit);
    setOffset!(newOffset);
  }, [offset, limit, setOffset]);

  const handlePageSizeChange = useCallback(
    (newPageSize: number) => {
      setLimit!(newPageSize);
      setOffset!(0); // Reset to first page when changing page size
    },
    [setLimit, setOffset],
  );

  const hasNextPage = totalItems ? (offset || 0) + limit < totalItems : false;
  const hasPreviousPage = (offset || 0) > 0;

  return (
    <div>
      <CatalogTableToolbar title={title} />
      {subtitle && (
        <Typography
          color="textSecondary"
          variant="body1"
          style={{ marginBottom: '16px', paddingLeft: '20px' }}
        >
          {subtitle}
        </Typography>
      )}
      <Table
        columnConfig={allColumns}
        data={data}
        loading={isLoading}
        emptyState={emptyContent}
        pagination={{
          type: 'page',
          pageSize: limit,
          offset: offset || 0,
          totalCount: totalItems || 0,
          hasNextPage,
          hasPreviousPage,
          onNextPage: handleNextPage,
          onPreviousPage: handlePreviousPage,
          onPageSizeChange: handlePageSizeChange,
          pageSizeOptions: [5, 10, 20, 50, 100],
        }}
      />
    </div>
  );
}
