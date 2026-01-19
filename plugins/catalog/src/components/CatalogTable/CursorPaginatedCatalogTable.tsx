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

import { ReactNode } from 'react';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

import { Table, ColumnConfig, Cell } from '@backstage/ui';
import { CatalogTableRow } from './types';
import { CatalogTableToolbar } from './CatalogTableToolbar';

type PaginatedCatalogTableProps = {
  columns: ColumnConfig<CatalogTableRow>[];
  data: CatalogTableRow[];
  prev?(): void;
  next?(): void;
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
};

/**
 * @internal
 */
export function CursorPaginatedCatalogTable(props: PaginatedCatalogTableProps) {
  const {
    columns,
    data,
    next,
    prev,
    isLoading,
    title,
    subtitle,
    emptyContent,
    actions,
  } = props;

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
          pageSize: data.length,
          hasNextPage: !!next,
          hasPreviousPage: !!prev,
          onNextPage: () => next?.(),
          onPreviousPage: () => prev?.(),
          showPageSizeOptions: false,
        }}
      />
    </div>
  );
}
