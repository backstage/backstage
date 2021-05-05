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

export const DenseTable: FC<DenseTableProps> = ({ dataSource }) => {
  const columns: TableColumn[] = [
    { title: 'ID', field: 'id' },
    { title: 'Cost', field: 'cost' },
    { title: 'Comments', field: 'comments' },
    { title: 'Total Cost', field: 'totalCost' },
  ];

  const costsData = dataSource.map(entry => {
    const getValues = (en: [], value: string) => {
      return en.map((e: any) => e[value]);
    };
    const data = entry.expense_breakdown;

    return {
      id: `${getValues(data, 'id')}`,
      cost: `${getValues(data, 'cost')}`,
      comments: `${getValues(data, 'comments')}`,
      totalCost: `${entry.total_cost_of_ownership}`,
    };
  });

  return (
    <Table
      title="Expense"
      options={{ search: false, paging: true, pageSize: 10 }}
      columns={columns}
      data={costsData}
    />
  );
};

const ExpenseFetchComponent: FC<{}> = () => {
  const { value, loading, error } = useAsync(async (): Promise<any> => {
    const response = await fetch(
      'https://private-aa6799-zaradardfds.apiary-mock.com/expense/1234',
    );
    const data = await response.json();

    return data;
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return <DenseTable dataSource={[value] || []} />;
};

export default ExpenseFetchComponent;
