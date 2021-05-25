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
import React from 'react';
import { Table, TableColumn } from '@backstage/core';
import { Snippet } from '../../../api/types';

const exampleSnippet1 = {
  name: 'snippet1',
  code: 'code',
  tags: ['tag1', 'tag2'],
  modifiedTime: 123412324,
} as Snippet;

const exampleSnippet2 = {
  name: 'snippet2',
  code: 'code',
  tags: ['tag3'],
  modifiedTime: 1234214,
} as Snippet;

const snippetArray = [exampleSnippet1, exampleSnippet2] as Snippet[];

type DenseTableProps = {
  snippets: Snippet[];
};

export const DenseTable = ({ snippets }: DenseTableProps) => {
  const columns: TableColumn[] = [
    { title: 'Snippet name', field: 'name' },
    { title: 'Tags', field: 'tags' },
    { title: 'Modified Time', field: 'time' },
  ];

  const data = snippets.map(snippet => {
    return {
      name: snippet.name,
      code: snippet.code,
      tags: snippet.tags.map(tag => {
        return `${tag}, `;
      }),
      time: snippet.modifiedTime,
    };
  });

  return (
    <Table
      title="Snippets"
      options={{ search: true, paging: false }}
      columns={columns}
      data={data}
    />
  );
};

export const ListComponent = () => {
  // const { value, loading, error } = useAsync(async (): Promise<User[]> => {
  //   const response = await fetch('https://randomuser.me/api/?results=20');
  //   const data = await response.json();
  //   return data.results;
  // }, []);

  // if (loading) {
  //   return <Progress />;
  // } else if (error) {
  //   return <Alert severity="error">{error.message}</Alert>;
  // }

  return <DenseTable snippets={snippetArray || []} />;
};
