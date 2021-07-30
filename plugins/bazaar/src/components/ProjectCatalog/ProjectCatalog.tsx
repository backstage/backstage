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

import { Chip, Link, Typography, makeStyles } from '@material-ui/core';
import React from 'react';
import { Table, TableColumn, TableFilter } from '@backstage/core-components';
import { StatusTag } from '../StatusTag/StatusTag';
import { Link as RouterLink } from 'react-router-dom';
import { Entity } from '@backstage/catalog-model';
import { JsonObject } from '@backstage/config';

export default {
  title: 'Data Display/Table',
  component: Table,
};

type Props = {
  entities: Entity[];
};

const useStyles = makeStyles({
  tableCol: {
    whiteSpace: 'nowrap',
  },
});

export const ProjectCatalog = ({ entities }: Props) => {
  const classes = useStyles();

  const columns: TableColumn[] = [
    {
      title: 'Name',
      render: (row: Partial<Entity>) => (
        <Link
          className={classes.tableCol}
          component={RouterLink}
          to={`/catalog/default/component/${row?.metadata?.name}`}
        >
          {row?.metadata?.name}
        </Link>
      ),
      highlight: true,
      width: '10%',
    },

    {
      title: 'Owner',
      render: (row: Partial<Entity>) => (
        <Link
          className={classes.tableCol}
          href={`http://github.com/${row?.spec?.owner as string | '/'}`}
        >
          {row?.spec?.owner}
        </Link>
      ),
      field: 'spec.owner',
      width: '10%',
    },

    {
      title: 'Status',
      render: (row: Partial<Entity>) => (
        <StatusTag
          status={(row?.metadata?.bazaar as JsonObject).status as string}
          styles=""
        />
      ),
      field: 'metadata.bazaar.status',
      width: '10%',
    },

    {
      title: 'Tags',
      render: (row: Partial<Entity>) =>
        row?.metadata?.tags?.map(tag => (
          <Chip label={tag} key={tag} size="small" variant="outlined" />
        )),
      field: 'metadata.tags',
      width: '20%',
    },

    {
      title: 'Description',
      field: 'metadata.description',
      render: (row: Partial<Entity>) => (
        <Typography variant="body2">
          {(row?.metadata?.description as string).slice(0, 200)}
        </Typography>
      ),
      width: '40%',
    },

    {
      title: 'Date',
      field: 'metadata.bazaar.last_modified',
      type: 'date',
      width: '10%',
    },
  ];

  const filters: TableFilter[] = [
    {
      column: 'Owner',
      type: 'multiple-select',
    },
    {
      column: 'Status',
      type: 'multiple-select',
    },
    {
      column: 'Tags',
      type: 'multiple-select',
    },
  ];

  return (
    <Table
      options={{ paging: false }}
      data={entities || []}
      columns={columns}
      filters={filters}
      initialState={{ filtersOpen: true }}
    />
  );
};
