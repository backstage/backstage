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
import useCopyToClipboard from 'react-use/esm/useCopyToClipboard';

import { configApiRef, useApi, useRouteRef } from '@backstage/core-plugin-api';
import { Entity } from '@backstage/catalog-model';
import { rootDocsRouteRef } from '../../../routes';
import {
  EmptyState,
  LinkButton,
  Table,
  TableColumn,
  TableOptions,
  TableProps,
} from '@backstage/core-components';
import { actionFactories } from './actions';
import { columnFactories, defaultColumns } from './columns';
import { DocsTableRow } from './types';
import { entitiesToDocsMapper } from './helpers';

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
  options?: TableOptions<DocsTableRow>;
};

/**
 * Component which renders a table documents
 *
 * @public
 */
export const DocsTable = (props: DocsTableProps) => {
  const { entities, title, loading, columns, actions, options } = props;
  const [, copyToClipboard] = useCopyToClipboard();
  const getRouteToReaderPageFor = useRouteRef(rootDocsRouteRef);
  const config = useApi(configApiRef);
  if (!entities) return null;

  const documents = entitiesToDocsMapper(
    entities,
    getRouteToReaderPageFor,
    config,
  );

  const defaultActions: TableProps<DocsTableRow>['actions'] = [
    actionFactories.createCopyDocsUrlAction(copyToClipboard),
  ];

  const pageSize = 20;
  const paging = documents && documents.length > pageSize;

  return (
    <>
      {loading || (documents && documents.length > 0) ? (
        <Table<DocsTableRow>
          isLoading={loading}
          options={{
            paging,
            pageSize,
            search: true,
            actionsColumnIndex: -1,
            ...options,
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
            <LinkButton
              color="primary"
              to="https://backstage.io/docs/features/techdocs/getting-started"
              variant="contained"
            >
              DOCS
            </LinkButton>
          }
        />
      )}
    </>
  );
};

DocsTable.columns = columnFactories;
DocsTable.actions = actionFactories;
