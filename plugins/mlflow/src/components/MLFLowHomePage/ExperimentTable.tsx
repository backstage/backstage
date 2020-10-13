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
import React from 'react';
import { Table, TableColumn, Link } from '@backstage/core';
import { Experiment } from '../../MLFlowClient/MLFlowTypes';

type ExperimentTableProps = { experiments: Experiment[] };
const ExperimentTable = ({ experiments }: ExperimentTableProps) => {
  const columns: TableColumn[] = [
    { title: 'Name', field: 'name' },
    { title: 'Created', field: 'creation_time' },
    { title: 'Lifecycle', field: 'lifecycle_stage' },
  ];

  const tableData = experiments.map(exp => {
    const { name, ...expInfo } = exp;
    return {
      name: (
        <Link to={`/mlflow/experiment/${exp.experiment_id}`}>{exp.name}</Link>
      ),
      ...expInfo,
    };
  });
  return (
    <Table
      title="All MLFlow Experiments"
      subtitle="These will link to individual experiment pages. And will have tons of filters."
      options={{ search: false, paging: false }}
      columns={columns}
      data={tableData}
    />
  );
};
export default ExperimentTable;
