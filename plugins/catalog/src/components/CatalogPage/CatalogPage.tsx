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

import React from 'react';
import {
  EntityListProvider,
  UserListFilterKind,
} from '@backstage/plugin-catalog-react';
import { CatalogTable } from '../CatalogTable';
import { configApiRef, useApi, useRouteRef } from '@backstage/core-plugin-api';

import { EntityRow } from '../CatalogTable/types';
import { TableColumn, TableProps, TablePage } from '@backstage/core-components';
import { CatalogFilter } from '../CatalogFilter';
import { createComponentRouteRef } from '../../routes';

export type CatalogPageProps = {
  initiallySelectedFilter?: UserListFilterKind;
  columns?: TableColumn<EntityRow>[];
  actions?: TableProps<EntityRow>['actions'];
};

export const CatalogPage = ({
  columns,
  actions,
  initiallySelectedFilter = 'owned',
}: CatalogPageProps) => {
  const orgName =
    useApi(configApiRef).getOptionalString('organization.name') ?? 'Backstage';
  const createComponentLink = useRouteRef(createComponentRouteRef);

  return (
    <EntityListProvider>
      <TablePage
        header="Components"
        supportMessage="All your software catalog entities"
        filter={
          <CatalogFilter initiallySelectedFilter={initiallySelectedFilter} />
        }
        title={`${orgName} Catalog`}
        subtitle={`Catalog of software components at ${orgName}`}
        themeId="home"
        pageTitleOverride="Home"
        headerLink={createComponentLink ? createComponentLink() : ''}
      >
        <CatalogTable columns={columns} actions={actions} />
      </TablePage>
    </EntityListProvider>
  );
};
