/*
 * Copyright 2021 The Backstage Authors
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
import useCopyToClipboard from 'react-use/lib/useCopyToClipboard';

import { useRouteRef, useApi, configApiRef } from '@backstage/core-plugin-api';
import { Entity, RELATION_OWNED_BY } from '@backstage/catalog-model';
import {
  humanizeEntityRef,
  getEntityRelations,
} from '@backstage/plugin-catalog-react';
import { rootDocsRouteRef } from '../../../routes';
import {
  Button,
  EmptyState,
  Table,
  TableColumn,
  TableProps,
} from '@backstage/core-components';
import { actionFactories } from './actions';
import { columnFactories } from './columns';
import { toLowerMaybe } from '../../../helpers';
import { DocsTableRow } from './types';

/**
 * Props for {@link DocsTable}.
 *
 * @public
 */
export type DocsTableProps = {
  entities: Entity[] | undefined;
  title?: string | undefined;
  loading?: boolean | undefined;
  columns?: TableColumn<DocsTableRow>[];
  actions?: TableProps<DocsTableRow>['actions'];
};

/**
 * Component which renders a table documents
 *
 * @public
 */
export const DocsTable = (props: DocsTableProps) => {
  const { entities, title, loading, columns, actions } = props;
  const [, copyToClipboard] = useCopyToClipboard();
  const getRouteToReaderPageFor = useRouteRef(rootDocsRouteRef);
  const config = useApi(configApiRef);
  if (!entities) return null;

  const documents = entities.map(entity => {
    const ownedByRelations = getEntityRelations(entity, RELATION_OWNED_BY);
    return {
      entity,
      resolved: {
        docsUrl: getRouteToReaderPageFor({
          namespace: toLowerMaybe(
            entity.metadata.namespace ?? 'default',
            config,
          ),
          kind: toLowerMaybe(entity.kind, config),
          name: toLowerMaybe(entity.metadata.name, config),
        }),
        ownedByRelations,
        ownedByRelationsTitle: ownedByRelations
          .map(r => humanizeEntityRef(r, { defaultKind: 'group' }))
          .join(', '),
      },
    };
  });

  const defaultColumns: TableColumn<DocsTableRow>[] = [
    columnFactories.createNameColumn(),
    columnFactories.createOwnerColumn(),
    columnFactories.createTypeColumn(),
  ];

  const defaultActions: TableProps<DocsTableRow>['actions'] = [
    actionFactories.createCopyDocsUrlAction(copyToClipboard),
  ];

  return (
    <>
      {loading || (documents && documents.length > 0) ? (
        <Table<DocsTableRow>
          isLoading={loading}
          options={{
            paging: true,
            pageSize: 20,
            search: true,
            actionsColumnIndex: -1,
          }}
          data={documents}
          columns={columns || defaultColumns}
          actions={actions || defaultActions}
          title={
            title
              ? `${title} (${documents.length})`
              : `All (${documents.length})`
          }
        />
      ) : (
        <EmptyState
          missing="data"
          title="No documents to show"
          description="Create your own document. Check out our Getting Started Information"
          action={
            <Button
              color="primary"
              to="https://backstage.io/docs/features/techdocs/getting-started"
              variant="contained"
            >
              DOCS
            </Button>
          }
        />
      )}
    </>
  );
};

DocsTable.columns = columnFactories;
DocsTable.actions = actionFactories;
