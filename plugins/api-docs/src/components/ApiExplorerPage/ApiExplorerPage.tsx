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

import {
  Content,
  ContentHeader,
  CreateButton,
  PageWithHeader,
  SupportButton,
  TableColumn,
} from '@backstage/core-components';
import { configApiRef, useApi, useRouteRef } from '@backstage/core-plugin-api';
import {
  CatalogTable,
  CatalogTableRow,
  FilteredEntityLayout,
  EntityListContainer,
  FilterContainer,
} from '@backstage/plugin-catalog';
import {
  EntityKindPicker,
  EntityLifecyclePicker,
  EntityListProvider,
  EntityOwnerPicker,
  EntityTagPicker,
  EntityTypePicker,
  UserListFilterKind,
  UserListPicker,
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

type ApiExplorerPageProps = {
  initiallySelectedFilter?: UserListFilterKind;
  columns?: TableColumn<CatalogTableRow>[];
};

export const ApiExplorerPage = ({
  initiallySelectedFilter = 'all',
  columns,
}: ApiExplorerPageProps) => {
  const configApi = useApi(configApiRef);
  const generatedSubtitle = `${
    configApi.getOptionalString('organization.name') ?? 'Backstage'
  } API Explorer`;
  const createComponentLink = useRouteRef(createComponentRouteRef);

  return (
    <PageWithHeader
      themeId="apis"
      title="APIs"
      subtitle={generatedSubtitle}
      pageTitleOverride="APIs"
    >
      <Content>
        <ContentHeader title="">
          <CreateButton
            title="Register Existing API"
            to={createComponentLink && createComponentLink()}
          />
          <SupportButton>All your APIs</SupportButton>
        </ContentHeader>
        <EntityListProvider>
          <FilteredEntityLayout>
            <FilterContainer>
              <EntityKindPicker initialFilter="api" hidden />
              <EntityTypePicker />
              <UserListPicker initialFilter={initiallySelectedFilter} />
              <EntityOwnerPicker />
              <EntityLifecyclePicker />
              <EntityTagPicker />
            </FilterContainer>
            <EntityListContainer>
              <CatalogTable columns={columns || defaultColumns} />
            </EntityListContainer>
          </FilteredEntityLayout>
        </EntityListProvider>
      </Content>
    </PageWithHeader>
  );
};
