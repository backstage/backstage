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
import {
  CatalogFilterLayout,
  EntityLifecyclePicker,
  EntityListProvider,
  EntityProcessingStatusPicker,
  EntityOwnerPicker,
  EntityTagPicker,
  EntityTypePicker,
  UserListFilterKind,
  UserListPicker,
  EntityKindPicker,
} from '@backstage/plugin-catalog-react';
import React from 'react';
import { createComponentRouteRef } from '../../routes';
import { CatalogTable, CatalogTableRow } from '../CatalogTable';
import { CatalogKindHeader } from '../CatalogKindHeader';
import { useCatalogPluginOptions } from '../../options';

/**
 * Props for root catalog pages.
 *
 * @public
 */
export interface DefaultCatalogPageProps {
  initiallySelectedFilter?: UserListFilterKind;
  columns?: TableColumn<CatalogTableRow>[];
  actions?: TableProps<CatalogTableRow>['actions'];
  initialKind?: string;
  tableOptions?: TableProps<CatalogTableRow>['options'];
}

export function DefaultCatalogPage(props: DefaultCatalogPageProps) {
  const {
    columns,
    actions,
    initiallySelectedFilter = 'owned',
    initialKind = 'component',
    tableOptions = {},
  } = props;
  const orgName =
    useApi(configApiRef).getOptionalString('organization.name') ?? 'Backstage';
  const createComponentLink = useRouteRef(createComponentRouteRef);

  const { createButtonTitle } = useCatalogPluginOptions();

  return (
    <PageWithHeader title={`${orgName} Catalog`} themeId="home">
      <EntityListProvider>
        <Content>
          <ContentHeader
            titleComponent={<CatalogKindHeader initialFilter={initialKind} />}
          >
            <CreateButton
              title={createButtonTitle}
              to={createComponentLink && createComponentLink()}
            />
            <SupportButton>All your software catalog entities</SupportButton>
          </ContentHeader>
          <CatalogFilterLayout>
            <CatalogFilterLayout.Filters>
              <EntityKindPicker initialFilter={initialKind} />
              <EntityTypePicker />
              <UserListPicker initialFilter={initiallySelectedFilter} />
              <EntityOwnerPicker />
              <EntityLifecyclePicker />
              <EntityTagPicker />
              <EntityProcessingStatusPicker />
            </CatalogFilterLayout.Filters>
            <CatalogFilterLayout.Content>
              <CatalogTable
                columns={columns}
                actions={actions}
                tableOptions={tableOptions}
              />
            </CatalogFilterLayout.Content>
          </CatalogFilterLayout>
        </Content>
      </EntityListProvider>
    </PageWithHeader>
  );
}
