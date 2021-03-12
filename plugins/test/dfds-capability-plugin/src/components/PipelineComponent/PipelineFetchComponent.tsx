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
import { Table, TableColumn, Progress } from '@backstage/core';
import Alert from '@material-ui/lab/Alert';
import { useAsync } from 'react-use';

type DenseTableProps = {
  dataSource: any[];
};

export const DenseTable: FC<DenseTableProps> = props => {
  const columns: TableColumn[] = [
    { title: 'Name', field: 'name' },
    { title: 'Run Success', field: 'runSuccess' },
    { title: 'Deep Link To Azure DevOps', field: 'deepLinkToAzureDevOps' },
    { title: 'Comments', field: 'comments' },
  ];

  const pipelineData = props.dataSource.map(entry => {
    return {
      name: `${entry.name}`,
      runSuccess: `${entry.success}`,
      deepLinkToAzureDevOps: (
        <a href={entry.link} target="_blank" style={{ color: '#2E77D0' }}>
          {entry.link}
        </a>
      ),
      comments: `${entry.comments}`,
    };
  });

  return (
    <Table
      title="Pipeline"
      options={{ paging: true, search: false, pageSize: 10 }}
      columns={columns}
      data={pipelineData}
    />
  );
};

const PipelineFetchComponent: FC<{}> = () => {
  const { value, loading, error } = useAsync(async (): Promise<any> => {
    const response = await fetch(
      'https://private-aa6799-zaradardfds.apiary-mock.com/pipelines/1234',
    );
    const data = await response.json();
    return data;
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return <DenseTable dataSource={value || []} />;
};

export default PipelineFetchComponent;
