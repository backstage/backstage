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
import { Component } from '../../data/component';
import { InfoCard, Progress, Table, TableColumn } from '@backstage/core';
import { Typography, Link } from '@material-ui/core';

const columns: TableColumn[] = [
  {
    title: 'Name',
    field: 'name',
    highlight: true,
    render: (componentData: any) => (
      <Link href={`/catalog/${componentData.name}`}>{componentData.name}</Link>
    ),
  },
  {
    title: 'Kind',
    field: 'kind',
  },
  {
    title: 'Description',
    field: 'description',
  },
];

type CatalogTableProps = {
  components: Component[];
  loading: boolean;
  error?: any;
};
const CatalogTable: FC<CatalogTableProps> = ({
  components,
  loading,
  error,
}) => {
  if (loading) {
    return <Progress />;
  }
  if (error) {
    return (
      <InfoCard>
        <Typography variant="subtitle1" paragraph>
          Error encountered while fetching components.
        </Typography>
      </InfoCard>
    );
  }
  return (
    <Table
      columns={columns}
      options={{ paging: false }}
      title={`Owned (${(components && components.length) || 0})`}
      data={components}
    />
  );
};
export default CatalogTable;
