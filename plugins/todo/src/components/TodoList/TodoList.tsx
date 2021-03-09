/*
 * Copyright 2021 Spotify AB
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

import { Progress, Table, TableColumn, useApi } from '@backstage/core';
import { useEntity } from '@backstage/plugin-catalog-react';
import Alert from '@material-ui/lab/Alert';
import React from 'react';
import { useAsync } from 'react-use';
import { todoApiRef } from '../../api';
import { TodoItem } from '../../api/types';

const columns: TableColumn<TodoItem>[] = [
  { title: 'Text', field: 'text' },
  { title: 'Author', field: 'author' },
  {
    title: 'View',
    field: 'viewUrl',
    render({ viewUrl }) {
      return (
        <a target="_blank" href={viewUrl}>
          {viewUrl}
        </a>
      );
    },
  },
  {
    title: 'Edit',
    field: 'editUrl',
    render({ editUrl }) {
      return (
        <a target="_blank" href={editUrl}>
          {editUrl}
        </a>
      );
    },
  },
];

export const TodoList = () => {
  const { entity } = useEntity();
  const todoApi = useApi(todoApiRef);

  const { value, loading, error } = useAsync(
    async () => todoApi.listTodos({ entity }),
    [todoApi, entity],
  );

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return (
    <Table
      title="TODOs"
      options={{ search: false }}
      page={3}
      columns={columns}
      data={value!.items}
    />
  );
};
