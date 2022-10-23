/*
 * Copyright 2021 The Backstage Authors
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
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { TableState } from '../../api';
import { StatusPage } from '../../types';
import { VisibilityChip } from './VisibilityChip';

import { Table, TableColumn } from '@backstage/core-components';
import { StatusPageActionsMenu } from '../StatusPage/StatusPageActionsMenu';
import { StatusPageLink } from '../StatusPage/StatusPageLink';
import { StatusPageURL } from '../StatusPage/StatusPageURL';
import { StatusChip } from './StatusChip';

const useStyles = makeStyles(theme => ({
  empty: {
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
  },
}));

export const StatusPagesTable = ({
  statusPages,
  tableState,
  isLoading,
  onChangePage,
  onChangeRowsPerPage,
  compact,
}: {
  statusPages: StatusPage[];
  tableState: TableState;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  onChangePage: (page: number) => void;
  onChangeRowsPerPage: (pageSize: number) => void;
  compact?: boolean;
}) => {
  const classes = useStyles();

  const smColumnStyle = {
    width: '10%',
    maxWidth: '10%',
  };
  const xlColumnStyle = {
    width: '30%',
    maxWidth: '30%',
  };

  const idColumn: TableColumn<StatusPage> = {
    title: 'ID',
    field: 'id',
    highlight: true,
    cellStyle: smColumnStyle,
    headerStyle: smColumnStyle,
    render: rowData => <StatusPageLink statusPage={rowData} />,
  };
  const nameColumn: TableColumn<StatusPage> = {
    title: 'Name',
    field: 'name',
    cellStyle: !compact ? xlColumnStyle : undefined,
    headerStyle: !compact ? xlColumnStyle : undefined,
    render: rowData => <Typography>{rowData.name}</Typography>,
  };
  const urlColumn: TableColumn<StatusPage> = {
    title: 'URL',
    field: 'url',
    cellStyle: smColumnStyle,
    headerStyle: smColumnStyle,
    render: rowData => <StatusPageURL statusPage={rowData} />,
  };
  const visibilityColumn: TableColumn<StatusPage> = {
    title: 'Visibility',
    field: 'visibility',
    cellStyle: smColumnStyle,
    headerStyle: smColumnStyle,
    render: rowData => <VisibilityChip statusPage={rowData} />,
  };
  const statusColumn: TableColumn<StatusPage> = {
    title: 'Status',
    field: 'status',
    cellStyle: smColumnStyle,
    headerStyle: smColumnStyle,
    render: rowData => <StatusChip statusPage={rowData} />,
  };
  const actionsColumn: TableColumn<StatusPage> = {
    title: '',
    field: '',
    cellStyle: smColumnStyle,
    headerStyle: smColumnStyle,
    render: rowData => <StatusPageActionsMenu statusPage={rowData} />,
  };

  const columns: TableColumn<StatusPage>[] = compact
    ? [nameColumn, statusColumn, urlColumn, actionsColumn]
    : [
        idColumn,
        nameColumn,
        statusColumn,
        urlColumn,
        visibilityColumn,
        actionsColumn,
      ];

  return (
    <Table
      options={{
        sorting: false,
        search: !compact,
        paging: !compact,
        actionsColumnIndex: -1,
        pageSize: tableState.pageSize,
        pageSizeOptions: !compact ? [10, 20, 50, 100] : [3, 10, 20, 50, 100],
        padding: 'dense',
        loadingType: 'overlay',
        showEmptyDataSourceMessage: !isLoading,
        showTitle: true,
        toolbar: true,
      }}
      emptyContent={
        <Typography color="textSecondary" className={classes.empty}>
          No status pages
        </Typography>
      }
      title={
        <Typography variant="button" color="textSecondary">
          STATUS PAGES
        </Typography>
      }
      page={tableState.page}
      onPageChange={onChangePage}
      onRowsPerPageChange={onChangeRowsPerPage}
      columns={columns}
      data={statusPages}
      isLoading={isLoading}
    />
  );
};
