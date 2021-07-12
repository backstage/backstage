/*
 * Copyright 2020 The Backstage Authors
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

import { TableColumn, TablePage } from '@backstage/core-components';
import { configApiRef, useApi, useRouteRef } from '@backstage/core-plugin-api';
import {
  CatalogFilter,
  CatalogTable,
  CatalogTableRow,
} from '@backstage/plugin-catalog';
import {
  EntityListProvider,
  UserListFilterKind,
} from '@backstage/plugin-catalog-react';
import React from 'react';
import { createComponentRouteRef } from '../../routes';

const defaultColumns: TableColumn<CatalogTableRow>[] = [
  CatalogTable.columns.createNameColumn({ defaultKind: 'API' }),
  CatalogTable.columns.createSystemColumn(),
  CatalogTable.columns.createOwnerColumn(),
  CatalogTable.columns.createSpecTypeColumn(),
  CatalogTable.columns.createSpecLifecycleColumn(),
  CatalogTable.columns.createMetadataDescriptionColumn(),
  CatalogTable.columns.createTagsColumn(),
];

interface IApiExplorerePageFilterProps {
  initiallySelectedFilter?: UserListFilterKind;
}

export type ApiExplorerPageProps = IApiExplorerePageFilterProps & {
  columns?: TableColumn<CatalogTableRow>[];
};

export const ApiExplorerPage = ({
  initiallySelectedFilter = 'all',
  columns,
}: ApiExplorerPageProps) => {
  const createComponentLink = useRouteRef(createComponentRouteRef);
  const configApi = useApi(configApiRef);
  const generatedSubtitle = `${
    configApi.getOptionalString('organization.name') ?? 'Backstage'
  } API Explorer`;

  return (
    <EntityListProvider>
      <TablePage
        title="APIs"
        subtitle={generatedSubtitle}
        pageTitleOverride="APIs"
        themeId="apis"
        contentTitle=""
        contentLink={createComponentLink ? createComponentLink() : ''}
        contentLinkText="Register Existing API"
        supportMessage="All your APIs"
        filter={
          <CatalogFilter
            initialFilter="api"
            initiallySelectedFilter={initiallySelectedFilter}
          />
        }
      >
        <CatalogTable columns={columns || defaultColumns} />
      </TablePage>
    </EntityListProvider>
  );
};
