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
import { capitalize } from 'lodash';
import {
  CodeSnippet,
  TableColumn,
  TableOptions,
  TableProps,
  WarningPanel,
} from '@backstage/core-components';
import {
  useEntityList,
  useStarredEntities,
} from '@backstage/plugin-catalog-react';
import { DocsTable } from './DocsTable';
import { actionFactories } from './actions';
import { columnFactories } from './columns';
import { DocsTableRow } from './types';

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
 * Component which renders a table with entities from catalog.
 *
 * @public
 */
export const EntityListDocsTable = (props: EntityListDocsTableProps) => {
  const { columns, actions, options } = props;
  const { loading, error, entities, filters } = useEntityList();
  const { isStarredEntity, toggleStarredEntity } = useStarredEntities();
  const [, copyToClipboard] = useCopyToClipboard();

  const title = capitalize(filters.user?.value ?? 'all');

  const defaultActions = [
    actionFactories.createCopyDocsUrlAction(copyToClipboard),
    actionFactories.createStarEntityAction(
      isStarredEntity,
      toggleStarredEntity,
    ),
  ];

  if (error) {
    return (
      <WarningPanel
        severity="error"
        title="Could not load available documentation."
      >
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

EntityListDocsTable.columns = columnFactories;
EntityListDocsTable.actions = actionFactories;
