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
import { puppetDbApiRef } from '../../api';
import {
  ResponseErrorPanel,
  Table,
  TableColumn,
} from '@backstage/core-components';
import { PuppetDbReportEvent } from '../../api/types';
import useAsync from 'react-use/lib/useAsync';
import { useApi } from '@backstage/core-plugin-api';
import { makeStyles } from '@material-ui/core/styles';
import { StatusField } from '../StatusField';

type ReportEventsTableProps = {
  hash: string;
};

const useStyles = makeStyles(theme => ({
  empty: {
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
  },
}));

/**
 * Component for displaying PuppetDB report events.
 *
 * @public
 */
export const ReportDetailsEventsTable = (props: ReportEventsTableProps) => {
  const { hash } = props;
  const puppetDbApi = useApi(puppetDbApiRef);
  const classes = useStyles();
  const { value, loading, error } = useAsync(async () => {
    return puppetDbApi.getPuppetDbReportEvents(hash);
  }, [puppetDbApi, hash]);

  if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  const columns: TableColumn<PuppetDbReportEvent>[] = [
    {
      title: 'Run Start Time',
      field: 'run_start_time',
      align: 'center',
      width: '300px',
      render: rowData => (
        <Typography noWrap>
          {new Date(Date.parse(rowData.run_start_time)).toLocaleString()}
        </Typography>
      ),
    },
    {
      title: 'Run End Time',
      field: 'run_end_time',
      align: 'center',
      width: '300px',
      render: rowData => (
        <Typography noWrap>
          {new Date(Date.parse(rowData.run_end_time)).toLocaleString()}
        </Typography>
      ),
    },
    {
      title: 'Containing Class',
      field: 'containing_class',
      render: rowData => (
        <Typography noWrap title={rowData.file || ''}>
          {rowData.containing_class}
        </Typography>
      ),
    },
    {
      title: 'Resource',
      field: 'resource_title',
      render: rowData => (
        <Typography noWrap>
          {rowData.resource_type}[{rowData.resource_title}]
        </Typography>
      ),
    },
    {
      title: 'Property',
      field: 'property',
      render: rowData => <Typography noWrap>{rowData.property}</Typography>,
    },
    {
      title: 'Old Value',
      field: 'old_value',
      render: rowData => <Typography noWrap>{rowData.old_value}</Typography>,
    },
    {
      title: 'New Value',
      field: 'new_value',
      render: rowData => <Typography noWrap>{rowData.new_value}</Typography>,
    },
    {
      title: 'Status',
      field: 'status',
      render: rowData => <StatusField status={rowData.status} />,
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
          No events
        </Typography>
      }
      title="Latest events"
      columns={columns}
      data={value || []}
      isLoading={loading}
    />
  );
};
