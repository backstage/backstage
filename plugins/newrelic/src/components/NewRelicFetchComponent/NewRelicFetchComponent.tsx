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
import { newRelicApiRef, NewRelicApplications } from '../../api';

import {
  Table,
  TableColumn,
  useAsyncDefaults,
} from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';

export const NewRelicAPMTable = ({ applications }: NewRelicApplications) => {
  const columns: TableColumn[] = [
    { title: 'Application', field: 'name' },
    { title: 'Response Time', field: 'responseTime' },
    { title: 'Throughput', field: 'throughput' },
    { title: 'Error Rate', field: 'errorRate' },
    { title: 'Instance Count', field: 'instanceCount' },
    { title: 'Apdex', field: 'apdexScore' },
  ];
  const data = applications.map(app => {
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
      responseTime: `${responseTime} ms`,
      throughput: `${throughput} rpm`,
      errorRate: `${errorRate}%`,
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

  const asyncState = useAsyncDefaults(async () => {
    const data = await api.getApplications();
    return data.applications.filter(application => {
      return application.hasOwnProperty('application_summary');
    });
  }, []);

  if (asyncState.fallback) {
    return asyncState.fallback;
  }

  return <NewRelicAPMTable applications={asyncState.value} />;
};

export default NewRelicFetchComponent;
