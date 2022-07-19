/*
 * Copyright 2020 The Backstage Authors
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

import { Entity } from '@backstage/catalog-model';
import { makeStyles } from '@material-ui/core';
import React, { ReactNode } from 'react';
import { columnFactories } from './columns';
import { componentEntityColumns, systemEntityColumns } from './presets';
import {
  InfoCardVariants,
  Table,
  TableColumn,
} from '@backstage/core-components';

/**
 * Props for {@link EntityTable}.
 *
 * @public
 */
export interface EntityTableProps<T extends Entity> {
  title: string;
  variant?: InfoCardVariants;
  entities: T[];
  emptyContent?: ReactNode;
  columns: TableColumn<T>[];
}

const useStyles = makeStyles(theme => ({
  empty: {
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
  },
}));

/**
 * A general entity table component, that can be used for composing more
 * specific entity tables.
 *
 * @public
 */
export const EntityTable = <T extends Entity>(props: EntityTableProps<T>) => {
  const {
    entities,
    title,
    emptyContent,
    variant = 'gridItem',
    columns,
  } = props;

  const classes = useStyles();
  const tableStyle: React.CSSProperties = {
    minWidth: '0',
    width: '100%',
  };

  if (variant === 'gridItem') {
    tableStyle.height = 'calc(100% - 10px)';
  }

  return (
    <Table<T>
      columns={columns}
      title={title}
      style={tableStyle}
      emptyContent={
        emptyContent && <div className={classes.empty}>{emptyContent}</div>
      }
      options={{
        // TODO: Toolbar padding if off compared to other cards, should be: padding: 16px 24px;
        search: false,
        paging: false,
        actionsColumnIndex: -1,
        padding: 'dense',
        draggable: false,
      }}
      data={entities}
    />
  );
};

EntityTable.columns = columnFactories;

EntityTable.systemEntityColumns = systemEntityColumns;

EntityTable.componentEntityColumns = componentEntityColumns;
