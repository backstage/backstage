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

import {
  EntityName,
  RELATION_OWNED_BY,
  RELATION_PART_OF,
  SystemEntity,
} from '@backstage/catalog-model';
import { Table, TableColumn } from '@backstage/core';
import { makeStyles } from '@material-ui/core';
import React from 'react';
import { getEntityRelations } from '../../utils';
import {
  EntityRefLink,
  EntityRefLinks,
  formatEntityRefTitle,
} from '../EntityRefLink';

type EntityRow = {
  entity: SystemEntity;
  resolved: {
    name: string;
    partOfDomainRelationTitle?: string;
    partOfDomainRelations: EntityName[];
    ownedByRelationsTitle?: string;
    ownedByRelations: EntityName[];
  };
};

const columns: TableColumn<EntityRow>[] = [
  {
    title: 'Name',
    field: 'resolved.name',
    highlight: true,
    render: ({ entity }) => (
      <EntityRefLink entityRef={entity} defaultKind="System" />
    ),
  },
  {
    title: 'Domain',
    field: 'resolved.partOfDomainRelationTitle',
    render: ({ resolved }) => (
      <EntityRefLinks
        entityRefs={resolved.partOfDomainRelations}
        defaultKind="domain"
      />
    ),
  },
  {
    title: 'Owner',
    field: 'resolved.ownedByRelationsTitle',
    render: ({ resolved }) => (
      <EntityRefLinks
        entityRefs={resolved.ownedByRelations}
        defaultKind="group"
      />
    ),
  },
  {
    title: 'Description',
    field: 'entity.metadata.description',
    width: 'auto',
  },
];

type Props = {
  title: string;
  variant?: string;
  entities: SystemEntity[];
  emptyComponent?: JSX.Element;
};

const useStyles = makeStyles(theme => ({
  empty: {
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
  },
}));

export const SystemsTable = ({
  entities,
  title,
  emptyComponent,
  variant = 'gridItem',
}: Props) => {
  const classes = useStyles();
  const tableStyle: React.CSSProperties = {
    minWidth: '0',
    width: '100%',
  };

  if (variant === 'gridItem') {
    tableStyle.height = 'calc(100% - 10px)';
  }

  const rows = entities.map(entity => {
    const partOfDomainRelations = getEntityRelations(entity, RELATION_PART_OF, {
      kind: 'domain',
    });
    const ownedByRelations = getEntityRelations(entity, RELATION_OWNED_BY);

    return {
      entity,
      resolved: {
        name: formatEntityRefTitle(entity, {
          defaultKind: 'System',
        }),
        ownedByRelationsTitle: ownedByRelations
          .map(r => formatEntityRefTitle(r, { defaultKind: 'group' }))
          .join(', '),
        ownedByRelations,
        partOfDomainRelationTitle: partOfDomainRelations
          .map(r =>
            formatEntityRefTitle(r, {
              defaultKind: 'domain',
            }),
          )
          .join(', '),
        partOfDomainRelations,
      },
    };
  });

  return (
    <Table<EntityRow>
      columns={columns}
      title={title}
      style={tableStyle}
      emptyComponent={
        emptyComponent && <div className={classes.empty}>{emptyComponent}</div>
      }
      options={{
        // TODO: Toolbar padding if off compared to other cards, should be: padding: 16px 24px;
        search: false,
        paging: false,
        actionsColumnIndex: -1,
        padding: 'dense',
      }}
      data={rows}
    />
  );
};
