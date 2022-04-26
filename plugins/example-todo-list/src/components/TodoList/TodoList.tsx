/*
 * Copyright 2022 The Backstage Authors
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
import useAsync from 'react-use/lib/useAsync';
import {
  discoveryApiRef,
  fetchApiRef,
  useApi,
} from '@backstage/core-plugin-api';
import { Button } from '@material-ui/core';

export type Todo = {
  title: string;
  id: string;
  author?: string;
  timestamp: number;
};

type TodosTableProps = {
  todos: Todo[];
  onEdit(todo: Todo): any;
};

export const TodoList = ({ onEdit }: { onEdit(todo: Todo): any }) => {
  const discoveryApi = useApi(discoveryApiRef);
  const { fetch } = useApi(fetchApiRef);

  const { value, loading, error } = useAsync(async (): Promise<Todo[]> => {
    const response = await fetch(
      `${await discoveryApi.getBaseUrl('todolist')}/todos`,
    );
    return response.json();
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return <TodosTable todos={value || []} onEdit={onEdit} />;
};

export function TodosTable({ todos, onEdit }: TodosTableProps) {
  const columns: TableColumn<Todo>[] = [
    { title: 'Title', field: 'title' },
    { title: 'Author', field: 'author' },
    {
      title: 'Last edit',
      field: 'timestamp',
      render: e => new Date(e.timestamp).toLocaleString(),
    },
    {
      title: 'Action',
      render: todo => {
        return (
          <Button variant="contained" onClick={() => onEdit(todo)}>
            Edit
          </Button>
        );
      },
    },
  ];

  return (
    <Table
      title="Todos"
      options={{ search: false, paging: false }}
      columns={columns}
      data={todos}
    />
  );
}
