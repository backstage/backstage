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
import { Service } from '../../types';
import { StatusChip } from './StatusChip';

import { Table, TableColumn } from '@backstage/core-components';
import { ServiceActionsMenu } from '../Service/ServiceActionsMenu';
import { ServiceLink } from '../Service/ServiceLink';

const useStyles = makeStyles(theme => ({
  empty: {
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
  },
}));

export const ServicesTable = ({
  services,
  tableState,
  isLoading,
  onChangePage,
  onChangeRowsPerPage,
  compact,
}: {
  services: Service[];
  tableState: TableState;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  onChangePage: (page: number) => void;
  onChangeRowsPerPage: (pageSize: number) => void;
  compact?: boolean;
}) => {
  const classes = useStyles();

  // const xsColumnStyle = {
  //   width: '5%',
  //   maxWidth: '5%',
  // };
  const smColumnStyle = {
    width: '10%',
    maxWidth: '10%',
  };
  // const mdColumnStyle = {
  //   width: '15%',
  //   maxWidth: '15%',
  // };
  // const lgColumnStyle = {
  //   width: '20%',
  //   maxWidth: '20%',
  // };
  const xlColumnStyle = {
    width: '30%',
    maxWidth: '30%',
  };

  const idColumn: TableColumn = {
    title: 'ID',
    field: 'id',
    highlight: true,
    cellStyle: smColumnStyle,
    headerStyle: smColumnStyle,
    render: rowData => <ServiceLink service={rowData as Service} />,
  };
  const nameColumn: TableColumn = {
    title: 'Name',
    field: 'name',
    cellStyle: !compact ? xlColumnStyle : undefined,
    headerStyle: !compact ? xlColumnStyle : undefined,
    render: rowData => <Typography>{(rowData as Service).name}</Typography>,
  };
  const statusColumn: TableColumn = {
    title: 'Status',
    field: 'status',
    cellStyle: smColumnStyle,
    headerStyle: smColumnStyle,
    render: rowData => <StatusChip service={rowData as Service} />,
  };
  const uptimeColumn: TableColumn = {
    title: 'Uptime in the last 90 days',
    field: 'uptimePercentage',
    cellStyle: smColumnStyle,
    headerStyle: smColumnStyle,
    render: rowData => (
      <Typography>
        {(rowData as Service).uptime.uptimePercentage.p90}
      </Typography>
    ),
  };
  const actionsColumn: TableColumn = {
    title: '',
    field: '',
    cellStyle: smColumnStyle,
    headerStyle: smColumnStyle,
    render: rowData => <ServiceActionsMenu service={rowData as Service} />,
  };

  const columns: TableColumn[] = compact
    ? [nameColumn, statusColumn, uptimeColumn, actionsColumn]
    : [idColumn, nameColumn, statusColumn, uptimeColumn, actionsColumn];
  let tableStyle: React.CSSProperties = {};
  if (compact) {
    tableStyle = {
      width: '100%',
      maxWidth: '100%',
      minWidth: '0',
      height: 'calc(100% - 10px)',
      boxShadow: 'none !important',
      borderRadius: 'none !important',
    };
  } else {
    tableStyle = {
      width: '100%',
      maxWidth: '100%',
    };
  }

  return (
    <Table
      style={tableStyle}
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
          No services
        </Typography>
      }
      title={
        <Typography variant="button" color="textSecondary">
          SERVICES
        </Typography>
      }
      page={tableState.page}
      onPageChange={onChangePage}
      onRowsPerPageChange={onChangeRowsPerPage}
      // localization={{ header: { actions: undefined } }}
      columns={columns}
      data={services}
      isLoading={isLoading}
    />
  );
};
