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

import React, { FC } from 'react';
import {
  configApiRef,
  Progress,
  Table,
  TableColumn,
  useApi,
} from '@backstage/core';
import Alert from '@material-ui/lab/Alert';
import { useAsync } from 'react-use';

type NewRelicApplication = {
  id: number;
  application_summary: NewRelicApplicationSummary;
  name: string;
  language: string;
  health_status: string;
  reporting: boolean;
  settings: NewRelicApplicationSettings;
  links?: NewRelicApplicationLinks;
};

type NewRelicApplicationSummary = {
  apdex_score: number;
  error_rate: number;
  host_count: number;
  instance_count: number;
  response_time: number;
  throughput: number;
};

type NewRelicApplicationSettings = {
  app_apdex_threshold: number;
  end_user_apdex_threshold: number;
  enable_real_user_monitoring: boolean;
  use_server_side_config: boolean;
};

type NewRelicApplicationLinks = {
  application_instances: Array<any>;
  servers: Array<any>;
  application_hosts: Array<any>;
};

type NewRelicApplications = {
  applications: NewRelicApplication[];
};

export const NewRelicAPMTable: FC<NewRelicApplications> = ({
  applications,
}) => {
  const columns: TableColumn[] = [
    { title: 'Application', field: 'name' },
    { title: 'Response Time', field: 'responseTime' },
    { title: 'Throughput', field: 'throughput' },
    { title: 'Error Rate', field: 'errorRate' },
    { title: 'Instance Count', field: 'instanceCount' },
    { title: 'Apdex', field: 'apdexScore' },
  ];
  const data = applications.map((app: NewRelicApplication) => {
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
      options={{ search: false, paging: false }}
      columns={columns}
      data={data}
    />
  );
};

const NewRelicFetchComponent: FC<{}> = () => {
  const configApi = useApi(configApiRef);
  const apiBaseUrl = configApi.getString('newrelic.api.baseUrl');
  const apiKey = configApi.getString('newrelic.api.key');

  const { value, loading, error } = useAsync(async (): Promise<
    NewRelicApplication[]
  > => {
    const response = await fetch(`${apiBaseUrl}/applications.json`, {
      headers: {
        'X-Api-Key': apiKey,
      },
    });
    const data: NewRelicApplications = await response.json();
    return data.applications.filter((application: NewRelicApplication) => {
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
