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

import { ApiEntity } from '@backstage/catalog-model';
import { Table, TableColumn } from '@backstage/core';
import React from 'react';
import { ApiTypeTitle } from '../ApiDefinitionCard';
import { EntityLink } from '../EntityLink';

const columns: TableColumn<ApiEntity>[] = [
  {
    title: 'Name',
    field: 'metadata.name',
    highlight: true,
    render: (entity: any) => (
      <EntityLink entity={entity}>{entity.metadata.name}</EntityLink>
    ),
  },
  {
    title: 'Owner',
    field: 'spec.owner',
  },
  {
    title: 'Lifecycle',
    field: 'spec.lifecycle',
  },
  {
    title: 'Type',
    field: 'spec.type',
    render: (entity: ApiEntity) => <ApiTypeTitle apiEntity={entity} />,
  },
  {
    title: 'Description',
    field: 'metadata.description',
    width: 'auto',
  },
];

type Props = {
  title: string;
  variant?: string;
  entities: (ApiEntity | undefined)[];
};

export const ApisTable = ({ entities, title, variant = 'gridItem' }: Props) => {
  const tableStyle: React.CSSProperties = {
    minWidth: '0',
    width: '100%',
  };

  if (variant === 'gridItem') {
    tableStyle.height = 'calc(100% - 10px)';
  }

  return (
    <Table<ApiEntity>
      columns={columns}
      title={title}
      style={tableStyle}
      options={{
        // TODO: Toolbar padding if off compared to other cards, should be: padding: 16px 24px;
        search: false,
        paging: false,
        actionsColumnIndex: -1,
        padding: 'dense',
      }}
      // TODO: For now we skip all APIs that we can't find without a warning!
      data={entities.filter(e => e !== undefined) as ApiEntity[]}
    />
  );
};
