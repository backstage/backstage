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
import { puppetDbApiRef, PuppetDbReport } from '../../../api';
import useAsync from 'react-use/lib/useAsync';
import React from 'react';
import {
  Link,
  ResponseErrorPanel,
  Table,
  StatusPending,
  StatusRunning,
  StatusOK,
  StatusAborted,
  StatusError,
  TableColumn,
} from '@backstage/core-components';
import { useApi, useRouteRef } from '@backstage/core-plugin-api';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Link as RouterLink } from 'react-router-dom';
import { buildRouteRef } from '../../../routes';

type ReportsTableProps = {
  certName: string;
};

const useStyles = makeStyles(theme => ({
  empty: {
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
  },
}));

export const ReportsTable = (props: ReportsTableProps) => {
  const { certName } = props;
  const puppetDbApi = useApi(puppetDbApiRef);
  const routeLink = useRouteRef(buildRouteRef);
  const classes = useStyles();

  const { value, loading, error } = useAsync(async () => {
    return puppetDbApi.getPuppetDbNodeReports(certName);
  }, [puppetDbApi, certName]);

  if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  const columns: TableColumn<PuppetDbReport>[] = [
    {
      title: 'Configuration Version',
      field: 'configuration_version',
      render: rowData => (
        <Link component={RouterLink} to={routeLink({ hash: rowData.hash! })}>
          <Typography noWrap>{rowData.configuration_version}</Typography>
        </Link>
      ),
    },
    {
      title: 'Start Time',
      field: 'start_time',
      align: 'center',
      render: rowData => (
        <Typography>
          {new Date(Date.parse(rowData.start_time)).toLocaleString()}
        </Typography>
      ),
    },
    {
      title: 'End Time',
      field: 'end_time',
      align: 'center',
      render: rowData => (
        <Typography>
          {new Date(Date.parse(rowData.end_time)).toLocaleString()}
        </Typography>
      ),
    },
    {
      title: 'Run Duration',
      align: 'center',
      render: rowData => {
        const start_date = new Date(Date.parse(rowData.start_time));
        const end_date = new Date(Date.parse(rowData.end_time));
        const duration = new Date(end_date.getTime() - start_date.getTime());
        return (
          <Typography noWrap>
            {duration.getUTCHours().toString().padStart(2, '0')}:
            {duration.getUTCMinutes().toString().padStart(2, '0')}:
            {duration.getUTCSeconds().toString().padStart(2, '0')}.
            {duration.getUTCMilliseconds().toString().padStart(4, '0')}
          </Typography>
        );
      },
    },
    {
      title: 'Environment',
      field: 'environment',
    },
    {
      title: 'Mode',
      field: 'noop',
      align: 'center',
      render: rowData =>
        rowData.noop ? (
          <Typography>NOOP</Typography>
        ) : (
          <Typography>NO-NOOP</Typography>
        ),
    },
    {
      title: 'Status',
      field: 'status',
      align: 'center',
      render: rowData => {
        if (rowData.noop) {
          return (
            <>
              <StatusAborted />
              {rowData.status.charAt(0).toLocaleUpperCase() +
                rowData.status.slice(1)}
            </>
          );
        }

        switch (rowData.status) {
          case 'failed':
            return (
              <>
                <StatusError />
                {rowData.status.charAt(0).toLocaleUpperCase() +
                  rowData.status.slice(1)}
              </>
            );
          case 'changed':
            return (
              <>
                <StatusRunning />
                {rowData.status.charAt(0).toLocaleUpperCase() +
                  rowData.status.slice(1)}
              </>
            );
          case 'unchanged':
            return (
              <>
                <StatusPending />
                {rowData.status.charAt(0).toLocaleUpperCase() +
                  rowData.status.slice(1)}
              </>
            );
          default:
            return (
              <>
                <StatusOK />
                {rowData.status.charAt(0).toLocaleUpperCase() +
                  rowData.status.slice(1)}
              </>
            );
        }
      },
    },
  ];

  return (
    <Table
      options={{
        sorting: true,
        actionsColumnIndex: -1,
        loadingType: 'linear',
        padding: 'dense',
        showEmptyDataSourceMessage: !loading,
        showTitle: true,
        toolbar: true,
        pageSize: 10,
        pageSizeOptions: [10],
      }}
      emptyContent={
        <Typography color="textSecondary" className={classes.empty}>
          No reports
        </Typography>
      }
      title={`Latest PuppetDB reports from node ${certName}`}
      columns={columns}
      data={value || []}
      isLoading={loading}
    />
  );

  /*
  return (



    <TableContainer className={classes.table}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Start Time</TableCell>
            <TableCell>End Time</TableCell>
            <TableCell>Duration</TableCell>
            <TableCell>Environment</TableCell>
            <TableCell>Configuration Version</TableCell>
            <TableCell>Puppet Version</TableCell>
            <TableCell>NoOp</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {value?.map((report) => {
            const start_date = new Date(Date.parse(report.start_time));
            const end_date = new Date(Date.parse(report.end_time));
            const duration = new Date(end_date.getTime() - start_date.getTime());

            return (<TableRow>
              <TableCell>{start_date.toLocaleString()}</TableCell>
              <TableCell>{end_date.toLocaleString()}</TableCell>
              <TableCell>
                {duration.getUTCHours().toString().padStart(2, '0')}:
                {duration.getUTCMinutes().toString().padStart(2, '0')}:
                {duration.getUTCSeconds().toString().padStart(2, '0')}.
                {duration.getUTCMilliseconds().toString().padStart(4, '0')}
              </TableCell>
              <TableCell>{report.environment}</TableCell>
              <TableCell>{report.configuration_version}</TableCell>
              <TableCell>{report.puppet_version}</TableCell>
              <TableCell>{report.noop ? 'Yes' : 'No'}</TableCell>
              <TableCell>{report.status}</TableCell>
            </TableRow>
          )}
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );*/
};
