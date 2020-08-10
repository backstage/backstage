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

import { BackstageTheme } from '@backstage/theme';
import { makeStyles, Typography, useTheme } from '@material-ui/core';
// Material-table is not using the standard icons available in in material-ui. https://github.com/mbrn/material-table/issues/51
import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import MTable, {
  Column,
  MaterialTableProps,
  MTableHeader,
  MTableToolbar,
  Options,
} from 'material-table';
import React, { forwardRef } from 'react';

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

const useHeaderStyles = makeStyles<BackstageTheme>(theme => ({
  header: {
    padding: theme.spacing(1, 2, 1, 2.5),
    borderTop: `1px solid ${theme.palette.grey.A100}`,
    borderBottom: `1px solid ${theme.palette.grey.A100}`,
    color: theme.palette.textSubtle,
    fontWeight: theme.typography.fontWeightBold,
    position: 'static',
    wordBreak: 'normal',
  },
}));

const useToolbarStyles = makeStyles<BackstageTheme>(theme => ({
  root: {
    padding: theme.spacing(3, 0, 2.5, 2.5),
  },
  title: {
    '& > h6': {
      fontWeight: 'bold',
    },
  },
  searchField: {
    paddingRight: theme.spacing(2),
  },
}));

function convertColumns<T extends object>(
  columns: TableColumn<T>[],
  theme: BackstageTheme,
): TableColumn<T>[] {
  return columns.map(column => {
    const headerStyle: React.CSSProperties = {};
    const cellStyle: React.CSSProperties = {};

    if (column.highlight) {
      headerStyle.color = theme.palette.textContrast;
      cellStyle.fontWeight = theme.typography.fontWeightBold;
    }

    return {
      ...column,
      headerStyle,
      cellStyle,
    };
  });
}

export interface TableColumn<T extends object = {}> extends Column<T> {
  highlight?: boolean;
  width?: string;
}

export interface TableProps<T extends object = {}>
  extends MaterialTableProps<T> {
  columns: TableColumn<T>[];
  subtitle?: string;
}

export function Table<T extends object = {}>({
  columns,
  options,
  title,
  subtitle,
  ...props
}: TableProps<T>) {
  const headerClasses = useHeaderStyles();
  const toolbarClasses = useToolbarStyles();
  const theme = useTheme<BackstageTheme>();

  const MTColumns = convertColumns(columns, theme);

  const defaultOptions: Options<T> = {
    headerStyle: {
      textTransform: 'uppercase',
    },
  };

  return (
    <MTable<T>
      components={{
        Header: headerProps => (
          <MTableHeader classes={headerClasses} {...headerProps} />
        ),
        Toolbar: toolbarProps => (
          <MTableToolbar classes={toolbarClasses} {...toolbarProps} />
        ),
      }}
      options={{ ...defaultOptions, ...options }}
      columns={MTColumns}
      icons={tableIcons}
      title={
        <>
          <Typography variant="h5">{title}</Typography>
          {subtitle && (
            <Typography color="textSecondary" variant="body1">
              {subtitle}
            </Typography>
          )}
        </>
      }
      {...props}
    />
  );
}
