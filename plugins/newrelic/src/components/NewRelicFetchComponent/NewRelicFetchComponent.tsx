/*
 * Copyright 2020 The Backstage Authors
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
import Alert from '@material-ui/lab/Alert';
import useAsync from 'react-use/esm/useAsync';
import { newRelicApiRef, NewRelicApplications } from '../../api';

import { Progress, Table, TableColumn } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';

const sortNumeric =
  <F extends string>(field: F) =>
  (a: { [key in F]: number }, b: { [key in F]: number }) => {
    return a[field] - b[field];
  };

type NewRelicTableData = {
  name: string;
  responseTime: number;
  throughput: number;
  errorRate: number;
  instanceCount: number;
  apdexScore: number;
};

export const NewRelicAPMTable = ({ applications }: NewRelicApplications) => {
  const columns: TableColumn<NewRelicTableData>[] = [
    { title: 'Application', field: 'name', searchable: true },
    {
      title: 'Response Time (ms)',
      field: 'responseTime',
      customSort: sortNumeric('responseTime'),
      searchable: false,
    },
    {
      title: 'Throughput (rpm)',
      field: 'throughput',
      customSort: sortNumeric('throughput'),
      searchable: false,
    },
    {
      title: 'Error Rate (%)',
      field: 'errorRate',
      customSort: sortNumeric('errorRate'),
      searchable: false,
    },
    {
      title: 'Instance Count',
      field: 'instanceCount',
      customSort: sortNumeric('instanceCount'),
      searchable: false,
    },
    {
      title: 'Apdex',
      field: 'apdexScore',
      customSort: sortNumeric('apdexScore'),
      searchable: false,
    },
  ];
  const data: Array<NewRelicTableData> = applications.map(app => {
    const { name, application_summary: applicationSummary } = app;
    const {
      response_time: responseTime,
      throughput,
      error_rate: errorRate,
      instance_count: instanceCount,
      apdex_score: apdexScore,
    } = applicationSummary;

    return {
      name,
      responseTime,
      throughput,
      errorRate,
      instanceCount,
      apdexScore,
    };
  });

  return (
    <Table
      title="Application Performance Monitoring"
      options={{ search: true, paging: true }}
      columns={columns}
      data={data}
    />
  );
};

const NewRelicFetchComponent = () => {
  const api = useApi(newRelicApiRef);

  const { value, loading, error } = useAsync(async () => {
    const data = await api.getApplications();
    return data.applications.filter(application => {
      return application.hasOwnProperty('application_summary');
    });
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return <NewRelicAPMTable applications={value || []} />;
};

export default NewRelicFetchComponent;
