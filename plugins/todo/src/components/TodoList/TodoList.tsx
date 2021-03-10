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

import {
  Progress,
  Table,
  TableColumn,
  useApi,
  OverflowTooltip,
  Link,
} from '@backstage/core';
import { useEntity } from '@backstage/plugin-catalog-react';
import Alert from '@material-ui/lab/Alert';
import React, { useState } from 'react';
import { useAsync } from 'react-use';
import { todoApiRef } from '../../api';
import { TodoItem } from '../../api/types';

const columns: TableColumn<TodoItem>[] = [
  {
    title: 'Text',
    width: '100%',
    highlight: true,
    render: ({ text }) => <OverflowTooltip text={text} />,
  },
  {
    title: 'File',
    width: '80%',
    render: ({ viewUrl, repoFilePath }) =>
      viewUrl ? (
        <Link to={viewUrl} target="_blank">
          <OverflowTooltip text={repoFilePath} />
        </Link>
      ) : (
        <OverflowTooltip text={repoFilePath} />
      ),
  },
  {
    title: 'Author',
    field: 'author',
    width: '20%',
    render: ({ author }) => <OverflowTooltip text={author} />,
  },
];

export const TodoList = () => {
  const { entity } = useEntity();
  const todoApi = useApi(todoApiRef);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const { value, loading, error } = useAsync(
    async () =>
      todoApi.listTodos({
        entity,
        offset: page * pageSize,
        limit: pageSize,
      }),
    [todoApi, entity, page, pageSize],
  );

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return (
    <Table
      title="TODOs"
      options={{
        search: false,
        pageSize,
        padding: 'dense',
      }}
      page={page}
      columns={columns}
      totalCount={value!.totalCount}
      onChangePage={setPage}
      onChangeRowsPerPage={setPageSize}
      data={value!.items}
    />
  );
};
