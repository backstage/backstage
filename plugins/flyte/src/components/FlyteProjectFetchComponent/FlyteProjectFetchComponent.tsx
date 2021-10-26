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
import React from 'react';
import { Table, TableColumn, Progress } from '@backstage/core-components';
import Alert from '@material-ui/lab/Alert';
import { useAsync } from 'react-use';
import { flyteidl } from '@flyteorg/flyteidl/gen/pb-js/flyteidl';
import axios, { AxiosRequestConfig } from 'axios';

type DenseTableProps = {
  projects: flyteidl.admin.Projects | null;
};

export const DenseTable = ({ projects }: DenseTableProps) => {
  const columns: TableColumn[] = [
    { title: 'ID', field: 'id' },
    { title: 'Domains', field: 'domains' },
    { title: 'NAME', field: 'name' },
    { title: 'Description', field: 'description' },
  ];

  const data = projects!.projects.map(project => {
    const domains = project
      .domains!.map(domain => {
        return domain.id;
      })
      .join();

    return {
      id: project.id,
      name: project.name,
      description: project.description,
      domains: domains,
    };
  });

  return (
    <Table
      title="Flyte Projects List"
      options={{ search: false, paging: false }}
      columns={columns}
      data={data}
    />
  );
};

export const FlyteProjectFetchComponent = () => {
  const { value, loading, error } =
    useAsync(async (): Promise<flyteidl.admin.Projects> => {
      const options: AxiosRequestConfig = {
        method: 'get',
        responseType: 'arraybuffer',
        headers: { Accept: 'application/octet-stream' },
        url: 'http://localhost:8088/api/v1/projects',
      };

      const response = await axios.request(options);
      const uint8 = new Uint8Array(response.data);
      return flyteidl.admin.Projects.decode(uint8);
    }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return <DenseTable projects={value || null} />;
};
