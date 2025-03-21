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

import {
  Content,
  ContentHeader,
  CreateButton,
  PageWithHeader,
  SupportButton,
  TableColumn,
  TableProps,
} from '@backstage/core-components';
import { configApiRef, useApi, useRouteRef } from '@backstage/core-plugin-api';
import { CatalogTable, CatalogTableRow } from '@backstage/plugin-catalog';
import {
  EntityKindPicker,
  EntityLifecyclePicker,
  EntityListProvider,
  EntityListPagination,
  EntityOwnerPicker,
  EntityTagPicker,
  EntityTypePicker,
  UserListFilterKind,
  UserListPicker,
  CatalogFilterLayout,
  EntityOwnerPickerProps,
} from '@backstage/plugin-catalog-react';
import React from 'react';
import { registerComponentRouteRef } from '../../routes';
import { usePermission } from '@backstage/plugin-permission-react';
import { catalogEntityCreatePermission } from '@backstage/plugin-catalog-common/alpha';

const defaultColumns: TableColumn<CatalogTableRow>[] = [
  CatalogTable.columns.createTitleColumn({ hidden: true }),
  CatalogTable.columns.createNameColumn({ defaultKind: 'API' }),
  CatalogTable.columns.createSystemColumn(),
  CatalogTable.columns.createOwnerColumn(),
  CatalogTable.columns.createSpecTypeColumn(),
  CatalogTable.columns.createSpecLifecycleColumn(),
  CatalogTable.columns.createMetadataDescriptionColumn(),
  CatalogTable.columns.createTagsColumn(),
];

/**
 * DefaultApiExplorerPageProps
 * @public
 */
export type DefaultApiExplorerPageProps = {
  initiallySelectedFilter?: UserListFilterKind;
  columns?: TableColumn<CatalogTableRow>[];
  actions?: TableProps<CatalogTableRow>['actions'];
  ownerPickerMode?: EntityOwnerPickerProps['mode'];
  pagination?: EntityListPagination;
};

/**
 * DefaultApiExplorerPage
 * @public
 */
export const DefaultApiExplorerPage = (props: DefaultApiExplorerPageProps) => {
  const {
    initiallySelectedFilter = 'all',
    columns,
    actions,
    ownerPickerMode,
    pagination,
  } = props;

  const configApi = useApi(configApiRef);
  const generatedSubtitle = `${
    configApi.getOptionalString('organization.name') ?? 'Backstage'
  } API Explorer`;
  const registerComponentLink = useRouteRef(registerComponentRouteRef);
  const { allowed } = usePermission({
    permission: catalogEntityCreatePermission,
  });

  return (
    <PageWithHeader
      themeId="apis"
      title="APIs"
      subtitle={generatedSubtitle}
      pageTitleOverride="APIs"
    >
      <Content>
        <ContentHeader title="">
          {allowed && (
            <CreateButton
              title="Register Existing API"
              to={registerComponentLink?.()}
            />
          )}
          <SupportButton>All your APIs</SupportButton>
        </ContentHeader>
        <EntityListProvider pagination={pagination}>
          <CatalogFilterLayout>
            <CatalogFilterLayout.Filters>
              <EntityKindPicker initialFilter="api" hidden />
              <EntityTypePicker />
              <UserListPicker initialFilter={initiallySelectedFilter} />
              <EntityOwnerPicker mode={ownerPickerMode} />
              <EntityLifecyclePicker />
              <EntityTagPicker />
            </CatalogFilterLayout.Filters>
            <CatalogFilterLayout.Content>
              <CatalogTable
                columns={columns || defaultColumns}
                actions={actions}
              />
            </CatalogFilterLayout.Content>
          </CatalogFilterLayout>
        </EntityListProvider>
      </Content>
    </PageWithHeader>
  );
};
