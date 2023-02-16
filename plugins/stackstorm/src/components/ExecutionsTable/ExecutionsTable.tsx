/*
 * Copyright 2023 The Backstage Authors
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
import React, { useEffect, useState } from 'react';
import { Link, Table, TableColumn } from '@backstage/core-components';
import { useApi, configApiRef, errorApiRef } from '@backstage/core-plugin-api';
import { Execution, stackstormApiRef } from '../../api';
import { Status } from './Status';
import { ExecutionPanel } from './ExecutionPanel';

type DenseTableProps = {
  executions: Execution[];
  loading: boolean;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
};

export const DenseTable = ({
  executions,
  loading,
  page,
  pageSize,
  onPageChange,
  onRowsPerPageChange,
}: DenseTableProps) => {
  const config = useApi(configApiRef);

  const columns: TableColumn<Execution>[] = [
    {
      title: 'Status',
      field: 'status',
      render: e => <Status status={e.status} />,
    },
    {
      title: 'Time',
      field: 'start_timestamp',
      render: e => `${new Date(e.start_timestamp).toUTCString()}`,
    },
    { title: 'Name', field: 'action.ref' },
    {
      title: 'Execution ID',
      field: 'id',
      render: e => (
        <Link
          to={`${config.getString('stackstorm.webUrl')}/?#/history/${e.id}`}
        >
          {e.id}
        </Link>
      ),
    },
  ];

  const count =
    pageSize > executions.length
      ? (page + 1) * pageSize + executions.length - pageSize
      : (page + 1) * pageSize + 1;

  return (
    <Table
      title="Executions"
      columns={columns}
      data={executions}
      page={page}
      totalCount={count}
      isLoading={loading}
      options={{
        paging: true,
        search: false,
        pageSize: pageSize,
        padding: 'dense',
        showFirstLastPageButtons: false,
      }}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
      detailPanel={rowData => {
        return <ExecutionPanel id={rowData.rowData.id} />;
      }}
    />
  );
};

export const ExecutionsTable = () => {
  const st2 = useApi(stackstormApiRef);
  const errorApi = useApi(errorApiRef);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState<Execution[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      await st2
        .getExecutions(rowsPerPage, page * rowsPerPage)
        .then(d => {
          setData(d);
        })
        .catch(err => {
          errorApi.post(err);
        });
      setLoading(false);
    };
    getData();
  }, [errorApi, page, rowsPerPage, st2]);

  return (
    <DenseTable
      page={page}
      pageSize={rowsPerPage}
      loading={loading}
      executions={data}
      onRowsPerPageChange={setRowsPerPage}
      onPageChange={setPage}
    />
  );
};
