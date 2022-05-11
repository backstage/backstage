/*
 * Copyright 2022 The Backstage Authors
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
import React from 'react';
import { CatalogGridItem } from './types';
import { Action } from '@material-table/core/types';
import { IconButton } from '@material-ui/core';

export type CatalogGridAction<T extends CatalogGridItem> =
  | Action<T>
  | ((rowData: T) => Action<T>)
  | {
      action: (rowData: T) => Action<T>;
      position: string;
    };

export function unpackTableAction<T extends CatalogGridItem>(
  action: CatalogGridAction<T>,
  row: CatalogGridItem,
): Action<CatalogGridItem> | null {
  if (!action) return null;
  if (typeof action === 'function')
    return (action as (rowData: CatalogGridItem) => Action<CatalogGridItem>)(
      row,
    );
  if (action.hasOwnProperty('action')) {
    return (
      action as unknown as {
        action: (rowData: CatalogGridItem) => Action<CatalogGridItem>;
      }
    ).action(row);
  }
  return action as unknown as Action<CatalogGridItem>;
}

export interface GridActionsProps<T extends CatalogGridItem> {
  actions: CatalogGridAction<T>[] | undefined;
  row: CatalogGridItem;
}

export function GridActions<T extends CatalogGridItem>({
  actions,
  row,
}: GridActionsProps<T>) {
  const displayedActions = actions;
  if (!displayedActions) return null;
  return (
    <>
      {displayedActions.map((action, i) => {
        const actionProps = unpackTableAction(action, row);
        if (!actionProps) return null;
        return (
          <IconButton
            key={actionProps.tooltip || `card-action-${i}`}
            onClick={e => actionProps.onClick(e, row)}
            title={actionProps.tooltip}
            disabled={actionProps.disabled}
          >
            <actionProps.icon />
          </IconButton>
        );
      })}
    </>
  );
}
