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

import useCopyToClipboard from 'react-use/esm/useCopyToClipboard';

import { configApiRef, useApi, useRouteRef } from '@backstage/core-plugin-api';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
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
import { techdocsTranslationRef } from '../../../translation';
import { actionFactories } from './actions';
import { columnFactories, defaultColumns } from './columns';
import { DocsTableRow, ColumnFactories, ActionFactories } from './types';
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
 * @public
 */
export interface DocsTableType {
  (props: DocsTableProps): JSX.Element | null;
  columns: ColumnFactories;
  actions: ActionFactories;
}

/**
 * Component which renders a table documents
 *
 * @public
 */
const DocsTableComponent = (props: DocsTableProps): JSX.Element | null => {
  const { entities, title, loading, columns, actions, options } = props;
  const [, copyToClipboard] = useCopyToClipboard();
  const getRouteToReaderPageFor = useRouteRef(rootDocsRouteRef);
  const config = useApi(configApiRef);
  const { t } = useTranslationRef(techdocsTranslationRef);
  if (!entities) return null;

  const documents = entitiesToDocsMapper(
    entities,
    getRouteToReaderPageFor,
    config,
  );

  const defaultActions: TableProps<DocsTableRow>['actions'] = [
    actionFactories.createCopyDocsUrlAction(copyToClipboard, t),
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
              : `${t('table.title.all')} (${documents.length})`
          }
          localization={{
            header: {
              actions: t('table.header.actions'),
            },
            toolbar: {
              searchPlaceholder: t('table.toolbar.searchPlaceholder'),
            },
            pagination: {
              labelRowsSelect: t('table.pagination.labelRowsSelect'),
            },
            body: {
              emptyDataSourceMessage: t('table.body.emptyDataSourceMessage'),
            },
          }}
        />
      ) : (
        <EmptyState
          missing="data"
          title={t('table.emptyState.title')}
          description={t('table.emptyState.description')}
          action={
            <LinkButton
              color="primary"
              to="https://backstage.io/docs/features/techdocs/getting-started"
              variant="contained"
            >
              {t('table.emptyState.docsButton')}
            </LinkButton>
          }
        />
      )}
    </>
  );
};

/**
 * @public
 */
export const DocsTable = DocsTableComponent as DocsTableType;

DocsTable.columns = columnFactories;
DocsTable.actions = actionFactories;
