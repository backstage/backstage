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

import React, { FC, forwardRef } from 'react';
import MTable, {
  MTableCell,
  MTableHeader,
  MTableToolbar,
  MaterialTableProps,
  Options,
  Column,
} from 'material-table';
import { BackstageTheme } from '@backstage/theme';
import { makeStyles } from '@material-ui/core';

// Material-table is not using the standard icons available in in material-ui. https://github.com/mbrn/material-table/issues/51
import {
  AddBox,
  ArrowUpward,
  Check,
  ChevronLeft,
  ChevronRight,
  Clear,
  DeleteOutline,
  Edit,
  FilterList,
  FirstPage,
  LastPage,
  Remove,
  SaveAlt,
  Search,
  ViewColumn,
} from '@material-ui/icons';

const tableIcons = {
  Add: forwardRef((props, ref: React.Ref<SVGSVGElement>) => (
    <AddBox {...props} ref={ref} />
  )),
  Check: forwardRef((props, ref: React.Ref<SVGSVGElement>) => (
    <Check {...props} ref={ref} />
  )),
  Clear: forwardRef((props, ref: React.Ref<SVGSVGElement>) => (
    <Clear {...props} ref={ref} />
  )),
  Delete: forwardRef((props, ref: React.Ref<SVGSVGElement>) => (
    <DeleteOutline {...props} ref={ref} />
  )),
  DetailPanel: forwardRef((props, ref: React.Ref<SVGSVGElement>) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref: React.Ref<SVGSVGElement>) => (
    <Edit {...props} ref={ref} />
  )),
  Export: forwardRef((props, ref: React.Ref<SVGSVGElement>) => (
    <SaveAlt {...props} ref={ref} />
  )),
  Filter: forwardRef((props, ref: React.Ref<SVGSVGElement>) => (
    <FilterList {...props} ref={ref} />
  )),
  FirstPage: forwardRef((props, ref: React.Ref<SVGSVGElement>) => (
    <FirstPage {...props} ref={ref} />
  )),
  LastPage: forwardRef((props, ref: React.Ref<SVGSVGElement>) => (
    <LastPage {...props} ref={ref} />
  )),
  NextPage: forwardRef((props, ref: React.Ref<SVGSVGElement>) => (
    <ChevronRight {...props} ref={ref} />
  )),
  PreviousPage: forwardRef((props, ref: React.Ref<SVGSVGElement>) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref: React.Ref<SVGSVGElement>) => (
    <Clear {...props} ref={ref} />
  )),
  Search: forwardRef((props, ref: React.Ref<SVGSVGElement>) => (
    <Search {...props} ref={ref} />
  )),
  SortArrow: forwardRef((props, ref: React.Ref<SVGSVGElement>) => (
    <ArrowUpward {...props} ref={ref} />
  )),
  ThirdStateCheck: forwardRef((props, ref: React.Ref<SVGSVGElement>) => (
    <Remove {...props} ref={ref} />
  )),
  ViewColumn: forwardRef((props, ref: React.Ref<SVGSVGElement>) => (
    <ViewColumn {...props} ref={ref} />
  )),
};

const useCellStyles = makeStyles<BackstageTheme>((theme) => ({
  root: {
    color: theme.palette.grey[500],
    padding: theme.spacing(0, 2, 0, 2.5),
    height: '56px',
  },
}));

const useHeaderStyles = makeStyles<BackstageTheme>((theme) => ({
  header: {
    padding: theme.spacing(1, 2, 1, 2.5),
    borderTop: `1px solid ${theme.palette.grey.A100}`,
    borderBottom: `1px solid ${theme.palette.grey.A100}`,
    color: theme.palette.textSubtle,
    fontWeight: 'bold',
    position: 'static',
  },
}));

const useToolbarStyles = makeStyles<BackstageTheme>((theme) => ({
  root: {
    padding: theme.spacing(3, 0, 2.5, 2.5),
  },
  title: {
    '& > h6': {
      fontWeight: 'bold',
    },
  },
}));

const convertColumns = (columns: TableColumn[]): TableColumn[] => {
  return columns.map((column) => {
    const headerStyle: React.CSSProperties = {};
    const cellStyle: React.CSSProperties = {};

    if (column.highlight) {
      headerStyle.color = '#000000';
      cellStyle.fontWeight = 'bold';
    }

    return {
      ...column,
      headerStyle,
      cellStyle,
    };
  });
};

export interface TableColumn extends Column<{}> {
  highlight?: boolean;
  width?: string;
}

export interface TableProps extends MaterialTableProps<{}> {
  columns: TableColumn[];
}

const Table: FC<TableProps> = ({ columns, options, ...props }) => {
  const cellClasses = useCellStyles();
  const headerClasses = useHeaderStyles();
  const toolbarClasses = useToolbarStyles();

  const MTColumns = convertColumns(columns);

  const defaultOptions: Options = {
    headerStyle: {
      textTransform: 'uppercase',
    },
  };

  return (
    <MTable
      components={{
        Cell: (cellProps) => (
          <MTableCell className={cellClasses.root} {...cellProps} />
        ),
        Header: (headerProps) => (
          <MTableHeader classes={headerClasses} {...headerProps} />
        ),
        Toolbar: (toolbarProps) => (
          <MTableToolbar classes={toolbarClasses} {...toolbarProps} />
        ),
      }}
      options={{ ...defaultOptions, ...options }}
      columns={MTColumns}
      icons={tableIcons}
      {...props}
    />
  );
};

export default Table;
