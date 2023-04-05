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
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { puppetDbApiRef, PuppetDbReportLog } from '../../api';
import {
  ResponseErrorPanel,
  Table,
  TableColumn,
} from '@backstage/core-components';
import useAsync from 'react-use/lib/useAsync';
import { useApi } from '@backstage/core-plugin-api';
import { makeStyles } from '@material-ui/core/styles';
import { BackstageTheme } from '@backstage/theme';

type ReportLogsTableProps = {
  hash: string;
};

const useStyles = makeStyles<BackstageTheme>(theme => ({
  empty: {
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
  },
  level_error: {
    color: theme.palette.error.light,
  },
  level_warning: {
    color: theme.palette.warning.light,
  },
  level_notice: {
    color: theme.palette.info.light,
  },
}));

/**
 * Component for displaying PuppetDB report logs.
 *
 * @public
 */
export const ReportDetailsLogsTable = (props: ReportLogsTableProps) => {
  const { hash } = props;
  const puppetDbApi = useApi(puppetDbApiRef);
  const classes = useStyles();
  const { value, loading, error } = useAsync(async () => {
    return puppetDbApi.getPuppetDbReportLogs(hash);
  }, [puppetDbApi, hash]);

  if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  const columns: TableColumn<PuppetDbReportLog>[] = [
    {
      title: 'Level',
      field: 'level',
      align: 'center',
      width: '100px',
      render: rowData => (
        <Typography
          noWrap
          className={
            (rowData.level === 'warning' && classes.level_warning) ||
            (rowData.level === 'error' && classes.level_error) ||
            classes.level_notice
          }
        >
          {rowData.level.toLocaleUpperCase('en-US')}
        </Typography>
      ),
    },
    {
      title: 'Timestamp',
      field: 'time',
      align: 'center',
      width: '300px',
      render: rowData => (
        <Typography noWrap>
          {new Date(Date.parse(rowData.time)).toLocaleString()}
        </Typography>
      ),
    },
    {
      title: 'Source',
      field: 'source',
      render: rowData => <Typography noWrap>{rowData.source}</Typography>,
    },
    {
      title: 'Message',
      field: 'message',
      render: rowData => <Typography noWrap>{rowData.message}</Typography>,
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
          No logs
        </Typography>
      }
      title="Latest logs"
      columns={columns}
      data={value || []}
      isLoading={loading}
    />
  );
};
