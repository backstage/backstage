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
import { Table, TableColumn } from '@backstage/core';

type DenseTableProps = {
  dataSource: any[];
};

type LogsFetchComponentProps = {
  data?: any[];
};

export const DenseTable: FC<DenseTableProps> = ({ dataSource }) => {
  const columns: TableColumn[] = [{ title: 'Log Tail', field: 'logTail' }];

  const cloudData = dataSource.map(entry => {
    return {
      logTail: `${entry}`,
    };
  });

  return (
    <Table
      title="Log"
      options={{
        search: false,
        paging: true,
        padding: 'dense',
        pageSize: 20,
      }}
      columns={columns}
      data={cloudData}
    />
  );
};

const LogsFetchComponent = ({ data }: LogsFetchComponentProps) => {
  return <DenseTable dataSource={data || []} />;
};

export default LogsFetchComponent;
