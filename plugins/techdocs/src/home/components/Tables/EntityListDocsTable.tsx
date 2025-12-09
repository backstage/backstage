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
import { capitalize } from 'lodash';
import {
  CodeSnippet,
  TableColumn,
  TableOptions,
  TableProps,
  WarningPanel,
} from '@backstage/core-components';
import { configApiRef, useApi, useRouteRef } from '@backstage/core-plugin-api';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import {
  useEntityList,
  useStarredEntities,
} from '@backstage/plugin-catalog-react';
import { techdocsTranslationRef } from '../../../translation';
import { DocsTable } from './DocsTable';
import { OffsetPaginatedDocsTable } from './OffsetPaginatedDocsTable';
import { CursorPaginatedDocsTable } from './CursorPaginatedDocsTable';
import { actionFactories } from './actions';
import { columnFactories, defaultColumns } from './columns';
import { DocsTableRow, ColumnFactories, ActionFactories } from './types';
import { rootDocsRouteRef } from '../../../routes';
import { entitiesToDocsMapper } from './helpers';

/**
 * Props for {@link EntityListDocsTable}.
 *
 * @public
 */
export type EntityListDocsTableProps = {
  columns?: TableColumn<DocsTableRow>[];
  actions?: TableProps<DocsTableRow>['actions'];
  options?: TableOptions<DocsTableRow>;
};

/**
 * @public
 */
export interface EntityListDocsTableType {
  (props: EntityListDocsTableProps): JSX.Element | null;
  columns: ColumnFactories;
  actions: ActionFactories;
}

/**
 * Component which renders a table with entities from catalog.
 *
 * @public
 */
const EntityListDocsTableComponent = (
  props: EntityListDocsTableProps,
): JSX.Element | null => {
  const { columns, actions, options } = props;
  const { loading, error, entities, filters, paginationMode, pageInfo } =
    useEntityList();
  const { isStarredEntity, toggleStarredEntity } = useStarredEntities();
  const [, copyToClipboard] = useCopyToClipboard();
  const getRouteToReaderPageFor = useRouteRef(rootDocsRouteRef);
  const config = useApi(configApiRef);
  const { t } = useTranslationRef(techdocsTranslationRef);

  const title = capitalize(filters.user?.value ?? 'all');

  const defaultActions = [
    actionFactories.createCopyDocsUrlAction(copyToClipboard, t),
    actionFactories.createStarEntityAction(
      isStarredEntity,
      toggleStarredEntity,
      t,
    ),
  ];

  const documents = entitiesToDocsMapper(
    entities,
    getRouteToReaderPageFor,
    config,
  );

  if (paginationMode === 'cursor') {
    return (
      <CursorPaginatedDocsTable
        columns={columns || defaultColumns}
        isLoading={loading}
        title={title}
        actions={actions || defaultActions}
        options={options}
        data={documents}
        next={pageInfo?.next}
        prev={pageInfo?.prev}
      />
    );
  } else if (paginationMode === 'offset') {
    return (
      <OffsetPaginatedDocsTable
        columns={columns || defaultColumns}
        isLoading={loading}
        title={title}
        actions={actions || defaultActions}
        options={options}
        data={documents}
      />
    );
  }

  if (error) {
    return (
      <WarningPanel severity="error" title={t('error.couldNotLoad')}>
        <CodeSnippet language="text" text={error.toString()} />
      </WarningPanel>
    );
  }

  return (
    <DocsTable
      title={title}
      entities={entities}
      loading={loading}
      actions={actions || defaultActions}
      columns={columns}
      options={options}
    />
  );
};

/**
 * @public
 */
export const EntityListDocsTable =
  EntityListDocsTableComponent as EntityListDocsTableType;

EntityListDocsTable.columns = columnFactories;
EntityListDocsTable.actions = actionFactories;
