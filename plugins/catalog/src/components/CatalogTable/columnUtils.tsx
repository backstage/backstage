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

import { ReactNode } from 'react';
import { TableColumn, TableProps } from '@backstage/core-components';
import { ColumnConfig, ButtonIcon } from '@backstage/ui';
import { CatalogTableRow } from './types';

/**
 * Converts old Material Table column definition to new UI Table ColumnConfig
 * @internal
 */
export function convertColumnToConfig(
  column: TableColumn<CatalogTableRow>,
): ColumnConfig<CatalogTableRow> {
  // Generate an id from the field or title
  const id =
    typeof column.field === 'string'
      ? column.field
      : String(column.title || 'column');

  // Get label from title
  const label =
    typeof column.title === 'string'
      ? column.title
      : (column.title as ReactNode);

  // Convert render function to cell function
  const cell = column.render
    ? (item: CatalogTableRow) => {
        const renderResult = column.render!(item, 'row');
        return renderResult;
      }
    : (item: CatalogTableRow) => {
        // If no render function, try to get value from field
        if (typeof column.field === 'string') {
          const value = column.field.split('.').reduce((obj: any, key) => {
            return obj?.[key];
          }, item);
          return String(value || '');
        }
        return '';
      };

  return {
    id,
    label: String(label),
    cell,
    isSortable: column.sorting !== false && column.customSort !== undefined,
    isHidden: column.hidden,
    isRowHeader: column.highlight,
  };
}

/**
 * Creates an actions column from the old actions array
 * @internal
 */
export function createActionsColumn(
  actions: TableProps<CatalogTableRow>['actions'],
): ColumnConfig<CatalogTableRow> | null {
  if (!actions || actions.length === 0) {
    return null;
  }

  return {
    id: 'actions',
    label: 'Actions',
    cell: (row: CatalogTableRow) => {
      const actionComponents = actions.map((action, index) => {
        if (typeof action === 'function') {
          const actionConfig = action(row);
          const Icon = actionConfig.icon;

          // Extract cellStyle if it exists (it's a non-standard property)
          const cellStyle = (actionConfig as any).cellStyle as
            | React.CSSProperties
            | undefined;

          return (
            <ButtonIcon
              key={index}
              onPress={() => {
                if (actionConfig.onClick) {
                  // Material Table actions expect (event, data) but we don't have event here
                  actionConfig.onClick(null as any, row);
                }
              }}
              isDisabled={actionConfig.disabled}
              aria-label={actionConfig.tooltip}
              icon={<Icon />}
              variant="tertiary"
              style={cellStyle}
            />
          );
        }
        return null;
      });

      return (
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          {actionComponents}
        </div>
      );
    },
  };
}
