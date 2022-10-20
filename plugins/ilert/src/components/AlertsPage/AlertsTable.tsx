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

  const idColumn: TableColumn<Alert> = {
    title: 'ID',
    field: 'id',
    highlight: true,
    cellStyle: smColumnStyle,
    headerStyle: smColumnStyle,
    render: rowData => <AlertLink alert={rowData} />,
  };
  const summaryColumn: TableColumn<Alert> = {
    title: 'Summary',
    field: 'summary',
    cellStyle: !compact ? xlColumnStyle : undefined,
    headerStyle: !compact ? xlColumnStyle : undefined,
    render: rowData => <Typography>{rowData.summary}</Typography>,
  };
  const sourceColumn: TableColumn<Alert> = {
    title: 'Source',
    field: 'source',
    cellStyle: mdColumnStyle,
    headerStyle: mdColumnStyle,
    render: rowData => <AlertSourceLink alertSource={rowData.alertSource} />,
  };
  const durationColumn: TableColumn<Alert> = {
    title: 'Duration',
    field: 'reportTime',
    type: 'datetime',
    cellStyle: smColumnStyle,
    headerStyle: smColumnStyle,
    render: rowData => (
      <Typography noWrap>
        {rowData.status !== 'RESOLVED'
          ? humanizeDuration(
              Interval.fromDateTimes(dt.fromISO(rowData.reportTime), dt.now())
                .toDuration()
                .valueOf(),
              { units: ['h', 'm', 's'], largest: 2, round: true },
            )
          : humanizeDuration(
              Interval.fromDateTimes(
                dt.fromISO(rowData.reportTime),
                dt.fromISO(rowData.resolvedOn),
              )
                .toDuration()
                .valueOf(),
              { units: ['h', 'm', 's'], largest: 2, round: true },
            )}
      </Typography>
    ),
  };
  const respondersColumn: TableColumn<Alert> = {
    title: 'Responders',
    field: 'responders',
    cellStyle: !compact ? mdColumnStyle : lgColumnStyle,
    headerStyle: !compact ? mdColumnStyle : lgColumnStyle,
    render: rowData => (
      <Typography>
        {rowData.responders.map((value, i, arr) => {
          return (
            ilertApi.getUserInitials(value.user) +
            (arr.length - 1 !== i ? ', ' : '')
          );
        })}
      </Typography>
    ),
  };
  const priorityColumn: TableColumn<Alert> = {
    title: 'Priority',
    field: 'priority',
    cellStyle: smColumnStyle,
    headerStyle: smColumnStyle,
    render: rowData => (
      <Typography noWrap>
        {rowData.priority === 'HIGH' ? 'High' : 'Low'}
      </Typography>
    ),
  };
  const statusColumn: TableColumn<Alert> = {
    title: 'Status',
    field: 'status',
    cellStyle: xsColumnStyle,
    headerStyle: xsColumnStyle,
    render: rowData => <StatusChip alert={rowData} />,
  };
  const actionsColumn: TableColumn<Alert> = {
    title: '',
    field: '',
    cellStyle: xsColumnStyle,
    headerStyle: xsColumnStyle,
    render: rowData => (
      <AlertActionsMenu
        alert={rowData}
        onAlertChanged={onAlertChanged}
        setIsLoading={setIsLoading}
      />
    ),
  };

  const columns: TableColumn<Alert>[] = compact
    ? [
        summaryColumn,
        durationColumn,
        respondersColumn,
        statusColumn,
        actionsColumn,
      ]
    : [
        idColumn,
        summaryColumn,
        sourceColumn,
        durationColumn,
        respondersColumn,
        priorityColumn,
        statusColumn,
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
            ALERTS
          </Typography>
        )
      }
      page={tableState.page}
      totalCount={alertsCount}
      onPageChange={onChangePage}
      onRowsPerPageChange={onChangeRowsPerPage}
      columns={columns}
      data={alerts}
      isLoading={isLoading}
    />
  );
};
