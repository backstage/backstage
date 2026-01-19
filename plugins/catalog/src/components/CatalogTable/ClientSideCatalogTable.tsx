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

import { ReactNode, useMemo } from 'react';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import { Entity } from '@backstage/catalog-model';
import { humanizeEntityRef } from '@backstage/plugin-catalog-react';
import { Table, useTable, ColumnConfig, Cell } from '@backstage/ui';
import { CatalogTableRow } from './types';

/**
 * @internal
 */
export function ClientSideCatalogTable(props: {
  columns: ColumnConfig<CatalogTableRow>[];
  rows: CatalogTableRow[];
  loading: boolean;
  title: string;
  subtitle?: string;
  actions: Array<
    (row: CatalogTableRow) => {
      icon: () => React.ReactElement;
      tooltip: string;
      disabled?: boolean;
      onClick?: () => void;
      cellStyle?: React.CSSProperties;
    }
  >;
  emptyContent?: ReactNode;
  tableOptions?: {
    pageSize?: number;
    pageSizeOptions?: number[];
    paging?: boolean;
  };
}) {
  const {
    columns,
    rows,
    loading,
    title,
    subtitle,
    actions,
    emptyContent,
    tableOptions,
  } = props;

  const pageSize = tableOptions?.pageSize || 20;
  const pageSizeOptions = tableOptions?.pageSizeOptions || [20, 50, 100];

  // Create actions column
  const actionsColumn: ColumnConfig<CatalogTableRow> = useMemo(
    () => ({
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
    }),
    [actions],
  );

  const allColumns = useMemo(
    () => [...columns, actionsColumn],
    [columns, actionsColumn],
  );

  const { tableProps } = useTable({
    mode: 'complete',
    getData: () => rows,
    paginationOptions: {
      pageSize,
      pageSizeOptions,
    },
    initialSort: { column: 'name', direction: 'ascending' },
    sortFn: (items, { column, direction }) => {
      return [...items].sort((a, b) => {
        let comparison = 0;

        if (column === 'name') {
          const aName =
            a.entity.metadata?.title ||
            humanizeEntityRef(a.entity, { defaultKind: 'Component' });
          const bName =
            b.entity.metadata?.title ||
            humanizeEntityRef(b.entity, { defaultKind: 'Component' });
          comparison = aName.localeCompare(bName);
        } else {
          // For other columns, try to get values from entity
          const getColumnValue = (
            row: CatalogTableRow,
            col: string,
          ): string => {
            if (col === 'type') return String(row.entity.spec?.type || '');
            if (col === 'lifecycle')
              return String(row.entity.spec?.lifecycle || '');
            if (col === 'owner')
              return row.resolved.ownedByRelationsTitle || '';
            if (col === 'system')
              return row.resolved.partOfSystemRelationTitle || '';
            if (col === 'namespace')
              return row.entity.metadata.namespace || 'default';
            if (col === 'description')
              return row.entity.metadata.description || '';
            return '';
          };

          const aVal = getColumnValue(a, column as string);
          const bVal = getColumnValue(b, column as string);
          comparison = aVal.localeCompare(bVal);
        }

        return direction === 'descending' ? -comparison : comparison;
      });
    },
  });

  return (
    <div>
      {title && (
        <Typography variant="h5" style={{ marginBottom: '8px' }}>
          {title}
        </Typography>
      )}
      {subtitle && (
        <Typography
          color="textSecondary"
          variant="body1"
          style={{ marginBottom: '16px' }}
        >
          {subtitle}
        </Typography>
      )}
      <Table
        columnConfig={allColumns}
        {...tableProps}
        loading={loading}
        emptyState={emptyContent}
      />
    </div>
  );
}
