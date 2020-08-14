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
import { Link as RouterLink } from 'react-router-dom';
import { Link } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { Table, TableColumn } from '@backstage/core';
import { RollbarProject } from '../../api/types';

const projectUrl = (org: string, id: number) =>
  `https://rollbar.com/${org}/all/items/?projects=${id}`;

const columns: TableColumn[] = [
  {
    title: 'ID',
    field: 'id',
    type: 'numeric',
    align: 'left',
    width: '100px',
  },
  {
    title: 'Name',
    field: 'name',
    type: 'string',
    highlight: true,
    render: (row: Partial<RollbarProject>) => (
      <Link component={RouterLink} to={`/rollbar/${row.name}`}>
        {row.name}
      </Link>
    ),
  },
  {
    title: 'Status',
    field: 'status',
    type: 'string',
  },
  {
    title: 'Open',
    width: '10%',
    render: (row: any) => (
      <Link
        href={projectUrl(row.organization, row.id)}
        target="_blank"
        rel="noreferrer"
      >
        <OpenInNewIcon />
      </Link>
    ),
  },
];

type Props = {
  projects: RollbarProject[];
  loading: boolean;
  organization: string;
  error?: any;
};

export const RollbarProjectTable = ({
  projects,
  organization,
  loading,
  error,
}: Props) => {
  if (error) {
    return (
      <div>
        <Alert severity="error">
          Error encountered while fetching rollbar projects. {error.toString()}
        </Alert>
      </div>
    );
  }

  return (
    <Table
      isLoading={loading}
      columns={columns}
      options={{
        padding: 'dense',
        search: true,
        paging: true,
        pageSize: 10,
        showEmptyDataSourceMessage: !loading,
      }}
      title="Projects"
      data={projects.map(p => ({ organization, ...p }))}
    />
  );
};
