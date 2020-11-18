/*
 * Copyright 2020 Spotify AB
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
import classnames from 'classnames';
import { Table, TableColumn } from '@backstage/core';
import { Dialog, IconButton, Typography } from '@material-ui/core';
import { default as CloseButton } from '@material-ui/icons/Close';
import { CostGrowthIndicator } from '../CostGrowth';
import { costFormatter, formatPercent } from '../../utils/formatters';
import { useEntityDialogStyles as useStyles } from '../../utils/styles';
import { BarChartOptions, Entity } from '../../types';

function createRenderer(col: keyof RowData, classes: Record<string, string>) {
  return function render(rowData: {}): JSX.Element {
    const row = rowData as RowData;
    const rowStyles = classnames(classes.row, {
      [classes.rowTotal]: row.id === 'total',
      [classes.colFirst]: col === 'sku',
      [classes.colLast]: col === 'ratio',
    });

    switch (col) {
      case 'previous':
      case 'current':
        return (
          <Typography className={rowStyles}>
            {costFormatter.format(row[col])}
          </Typography>
        );
      case 'ratio':
        return (
          <CostGrowthIndicator
            className={rowStyles}
            ratio={row.ratio}
            formatter={amount => formatPercent(Math.abs(amount))}
          />
        );
      default:
        return <Typography className={rowStyles}>{row.sku}</Typography>;
    }
  };
}

// material-table does not support fixed rows. Override the sorting algorithm
// to force Total row to bottom by default or when a user sort toggles a column.
function createSorter(field?: keyof Omit<RowData, 'id'>) {
  return function rowSort(data1: {}, data2: {}): number {
    const a = data1 as RowData;
    const b = data2 as RowData;
    if (a.id === 'total') return 1;
    if (b.id === 'total') return 1;
    if (field === 'sku') return a.sku.localeCompare(b.sku);

    return field
      ? a[field] - b[field]
      : b.previous + b.current - (a.previous - a.current);
  };
}

const defaultEntity: Entity = {
  id: null,
  aggregation: [0, 0],
  change: { ratio: 0, amount: 0 },
  entities: [],
};

type RowData = {
  id: string;
  sku: string;
  previous: number;
  current: number;
  ratio: number;
};

type ProductEntityDialogOptions = Partial<
  Pick<BarChartOptions, 'previousName' | 'currentName'>
>;

type ProductEntityDialogProps = {
  open: boolean;
  entity?: Entity;
  options?: ProductEntityDialogOptions;
  onClose: () => void;
};

export const ProductEntityDialog = ({
  open,
  entity = defaultEntity,
  options = {},
  onClose,
}: ProductEntityDialogProps) => {
  const classes = useStyles();

  const data = Object.assign(
    {
      previousName: 'Previous',
      currentName: 'Current',
    },
    options,
  );

  const firstColClasses = classnames(classes.column, classes.colFirst);
  const lastColClasses = classnames(classes.column, classes.colLast);

  const columns: TableColumn[] = [
    {
      field: 'sku',
      title: <Typography className={firstColClasses}>SKU</Typography>,
      render: createRenderer('sku', classes),
      customSort: createSorter('sku'),
      width: '33.33%',
    },
    {
      field: 'previous',
      title: (
        <Typography className={classes.column}>{data.previousName}</Typography>
      ),
      align: 'right',
      render: createRenderer('previous', classes),
      customSort: createSorter('previous'),
    },
    {
      field: 'current',
      title: (
        <Typography className={classes.column}>{data.currentName}</Typography>
      ),
      align: 'right',
      render: createRenderer('current', classes),
      customSort: createSorter('current'),
    },
    {
      field: 'ratio',
      title: <Typography className={lastColClasses}>M/M</Typography>,
      align: 'right',
      render: createRenderer('ratio', classes),
      customSort: createSorter('ratio'),
    },
  ];

  const rowData: RowData[] = entity.entities
    .map(e => ({
      id: e.id || 'Unknown',
      sku: e.id || 'Unknown',
      previous: e.aggregation[0],
      current: e.aggregation[1],
      ratio: e.change.ratio,
    }))
    .concat({
      id: 'total',
      sku: 'Total',
      previous: entity.aggregation[0],
      current: entity.aggregation[1],
      ratio: entity.change.ratio,
    })
    .sort(createSorter());

  return (
    <Dialog open={open} onClose={onClose} scroll="body" fullWidth maxWidth="lg">
      <IconButton className={classes.closeButton} onClick={onClose}>
        <CloseButton />
      </IconButton>
      <Table
        columns={columns}
        data={rowData}
        title={entity.id || 'Unknown'}
        subtitle="Resource breakdown"
        options={{
          paging: false,
          search: false,
          hideFilterIcons: true,
        }}
      />
    </Dialog>
  );
};
