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
import { flyteApiRef } from './../../api';
import { FlyteProject, FlyteDomain } from './../../api/types';
import { useApi } from '@backstage/core-plugin-api';

type DenseTableProps = {
  projects: FlyteProject[];
};

export const DenseTable = ({ projects }: DenseTableProps) => {
  const columns: TableColumn[] = [
    { title: 'ID', field: 'id' },
    { title: 'Domains', field: 'domains' },
    { title: 'NAME', field: 'name' },
    { title: 'Description', field: 'description' },
  ];

  const data = projects.map(project => {
    const domains = project.domains.map(d => d.id).join();
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
      options={{ search: true, paging: false }}
      columns={columns}
      data={data}
    />
  );
};

export const FlyteProjectFetchComponent = () => {
  const api = useApi(flyteApiRef);
  const { value, loading, error } = useAsync(async () => api.listProjects());

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return <DenseTable projects={value!} />;
};
