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
import Alert from '@material-ui/lab/Alert';
import { Table, TableColumn, Progress, useApi } from '@backstage/core';
import { catalogApiRef } from '@backstage/plugin-catalog';
import { Link } from '@material-ui/core';
import { useAsync } from 'react-use';
import { Entity } from '@backstage/catalog-model';
import { Link as RouterLink, generatePath } from 'react-router-dom';
import { viewGroupRouteRef } from '../../plugin';

const DenseTable = ({ groups }: { groups: Entity[] }) => {
  const columns: TableColumn[] = [
    { title: 'Name', field: 'name' },
    { title: 'Description', field: 'description' },
    { title: 'Type', field: 'type' },
  ];

  const data = groups.map(group => {
    const { name, description } = group.metadata;
    return {
      name: (
        <Link
          component={RouterLink}
          to={generatePath(viewGroupRouteRef.path, {
            groupName: name,
          })}
        >
          {name}
        </Link>
      ),
      description,
      type: group?.spec?.type,
    };
  });

  return (
    <Table title="Groups List" options={{}} columns={columns} data={data} />
  );
};

export const GroupsTable = () => {
  const catalogApi = useApi(catalogApiRef);
  const { loading, error, value: groups } = useAsync(async () => {
    const groups = await catalogApi.getEntities({
      filter: {
        kind: 'Group',
      },
    });
    return groups.items;
  }, [catalogApi]);

  if (loading) return <Progress />;
  else if (error) return <Alert severity="error">{error.message}</Alert>;

  return <DenseTable groups={groups || []} />;
};
