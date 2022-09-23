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
import humanizeDuration from 'humanize-duration';
import { DateTime as dt, Interval } from 'luxon';
import React from 'react';
import { ilertApiRef, TableState } from '../../api';
import { Alert, AlertStatus } from '../../types';
import { AlertActionsMenu } from '../Alert/AlertActionsMenu';
import { AlertLink } from '../Alert/AlertLink';
import { AlertSourceLink } from '../AlertSource/AlertSourceLink';
import { StatusChip } from './StatusChip';
import { TableTitle } from './TableTitle';

import { Table, TableColumn } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';

const useStyles = makeStyles(theme => ({
  empty: {
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
  },
}));

export const AlertsTable = ({
  alerts,
  alertsCount,
  tableState,
  states,
  isLoading,
  onAlertChanged,
  setIsLoading,
  onAlertStatesChange,
  onChangePage,
  onChangeRowsPerPage,
  compact,
}: {
  alerts: Alert[];
  alertsCount: number;
  tableState: TableState;
  states: AlertStatus[];
  isLoading: boolean;
  onAlertChanged: (alert: Alert) => void;
  setIsLoading: (isLoading: boolean) => void;
  onAlertStatesChange: (states: AlertStatus[]) => void;
  onChangePage: (page: number) => void;
  onChangeRowsPerPage: (pageSize: number) => void;
  compact?: boolean;
}) => {
  const ilertApi = useApi(ilertApiRef);
  const classes = useStyles();

  const xsColumnStyle = {
    width: '5%',
    maxWidth: '5%',
  };
  const smColumnStyle = {
    width: '10%',
    maxWidth: '10%',
  };
  const mdColumnStyle = {
    width: '15%',
    maxWidth: '15%',
  };
  const lgColumnStyle = {
    width: '20%',
    maxWidth: '20%',
  };
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
    render: rowData => <AlertLink alert={rowData as Alert} />,
  };
  const summaryColumn: TableColumn = {
    title: 'Summary',
    field: 'summary',
    cellStyle: !compact ? xlColumnStyle : undefined,
    headerStyle: !compact ? xlColumnStyle : undefined,
    render: rowData => <Typography>{(rowData as Alert).summary}</Typography>,
  };
  const sourceColumn: TableColumn = {
    title: 'Source',
    field: 'source',
    cellStyle: mdColumnStyle,
    headerStyle: mdColumnStyle,
    render: rowData => (
      <AlertSourceLink alertSource={(rowData as Alert).alertSource} />
    ),
  };
  const durationColumn: TableColumn = {
    title: 'Duration',
    field: 'reportTime',
    type: 'datetime',
    cellStyle: smColumnStyle,
    headerStyle: smColumnStyle,
    render: rowData => (
      <Typography noWrap>
        {(rowData as Alert).status !== 'RESOLVED'
          ? humanizeDuration(
              Interval.fromDateTimes(
                dt.fromISO((rowData as Alert).reportTime),
                dt.now(),
              )
                .toDuration()
                .valueOf(),
              { units: ['h', 'm', 's'], largest: 2, round: true },
            )
          : humanizeDuration(
              Interval.fromDateTimes(
                dt.fromISO((rowData as Alert).reportTime),
                dt.fromISO((rowData as Alert).resolvedOn),
              )
                .toDuration()
                .valueOf(),
              { units: ['h', 'm', 's'], largest: 2, round: true },
            )}
      </Typography>
    ),
  };
  const assignedToColumn: TableColumn = {
    title: 'Assigned to',
    field: 'assignedTo',
    cellStyle: !compact ? mdColumnStyle : lgColumnStyle,
    headerStyle: !compact ? mdColumnStyle : lgColumnStyle,
    render: rowData => (
      <Typography noWrap>
        {ilertApi.getUserInitials((rowData as Alert).assignedTo)}
      </Typography>
    ),
  };
  const priorityColumn: TableColumn = {
    title: 'Priority',
    field: 'priority',
    cellStyle: smColumnStyle,
    headerStyle: smColumnStyle,
    render: rowData => (
      <Typography noWrap>
        {(rowData as Alert).priority === 'HIGH' ? 'High' : 'Low'}
      </Typography>
    ),
  };
  const statusColumn: TableColumn = {
    title: 'Status',
    field: 'status',
    cellStyle: xsColumnStyle,
    headerStyle: xsColumnStyle,
    render: rowData => <StatusChip alert={rowData as Alert} />,
  };
  const actionsColumn: TableColumn = {
    title: '',
    field: '',
    cellStyle: xsColumnStyle,
    headerStyle: xsColumnStyle,
    render: rowData => (
      <AlertActionsMenu
        alert={rowData as Alert}
        onAlertChanged={onAlertChanged}
        setIsLoading={setIsLoading}
      />
    ),
  };

  const columns: TableColumn[] = compact
    ? [
        summaryColumn,
        durationColumn,
        assignedToColumn,
        statusColumn,
        actionsColumn,
      ]
    : [
        idColumn,
        summaryColumn,
        sourceColumn,
        durationColumn,
        assignedToColumn,
        priorityColumn,
        statusColumn,
        actionsColumn,
      ];
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
          No alerts right now
        </Typography>
      }
      title={
        !compact ? (
          <TableTitle
            alertStates={states}
            onAlertStatesChange={onAlertStatesChange}
          />
        ) : (
          <Typography variant="button" color="textSecondary">
            INCIDENTS
          </Typography>
        )
      }
      page={tableState.page}
      totalCount={alertsCount}
      onPageChange={onChangePage}
      onRowsPerPageChange={onChangeRowsPerPage}
      // localization={{ header: { actions: undefined } }}
      columns={columns}
      data={alerts}
      isLoading={isLoading}
    />
  );
};
