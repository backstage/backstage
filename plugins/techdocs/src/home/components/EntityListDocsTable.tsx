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
import { useCopyToClipboard } from 'react-use';
import { capitalize } from 'lodash';
import {
  CodeSnippet,
  TableColumn,
  TableProps,
  WarningPanel,
} from '@backstage/core-components';
import {
  useEntityListProvider,
  useStarredEntities,
} from '@backstage/plugin-catalog-react';
import { DocsTable } from './DocsTable';
import * as actionFactories from './actions';
import * as columnFactories from './columns';
import { DocsTableRow } from './types';

export const EntityListDocsTable = ({
  columns,
  actions,
}: {
  columns?: TableColumn<DocsTableRow>[];
  actions?: TableProps<DocsTableRow>['actions'];
}) => {
  const { loading, error, entities, filters } = useEntityListProvider();
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
    />
  );
};

EntityListDocsTable.columns = columnFactories;
EntityListDocsTable.actions = actionFactories;
