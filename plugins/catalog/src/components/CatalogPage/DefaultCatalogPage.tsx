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
  CatalogFilterLayout,
  EntityKindPicker,
  EntityLifecyclePicker,
  EntityListProvider,
  EntityNamespacePicker,
  EntityOwnerPicker,
  EntityOwnerPickerProps,
  EntityProcessingStatusPicker,
  EntityTagPicker,
  EntityTypePicker,
  UserListFilterKind,
  UserListPicker,
} from '@backstage/plugin-catalog-react';
import { CatalogTable, CatalogTableRow } from '../CatalogTable';
import {
  Content,
  ContentHeader,
  CreateButton,
  PageWithHeader,
  SupportButton,
  TableColumn,
  TableProps,
} from '@backstage/core-components';
import React, { ReactNode } from 'react';
import { configApiRef, useApi, useRouteRef } from '@backstage/core-plugin-api';

import { createComponentRouteRef } from '../../routes';
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
  emptyContent?: ReactNode;
  ownerPickerMode?: EntityOwnerPickerProps['mode'];
  entityKindPickerAllowedKinds?: string[];
  entityKindPickerHidden?: boolean;
  entityTypePickerHidden?: boolean;
  initialType?: string;
  showTagCounts?: boolean;
  entityLifecyclePickerInitialFilter?: string[];
  userListFilters?: UserListFilterKind[];
}

export function DefaultCatalogPage(props: DefaultCatalogPageProps) {
  const {
    columns,
    actions,
    initiallySelectedFilter = 'owned',
    initialKind = 'component',
    tableOptions = {},
    emptyContent,
    ownerPickerMode,
    entityKindPickerAllowedKinds,
    entityKindPickerHidden,
    initialType,
    entityTypePickerHidden,
    showTagCounts,
    entityLifecyclePickerInitialFilter,
    userListFilters,
  } = props;
  const orgName =
    useApi(configApiRef).getOptionalString('organization.name') ?? 'Backstage';
  const createComponentLink = useRouteRef(createComponentRouteRef);

  const { createButtonTitle } = useCatalogPluginOptions();

  return (
    <PageWithHeader title={`${orgName} Catalog`} themeId="home">
      <Content>
        <ContentHeader title="">
          <CreateButton
            title={createButtonTitle}
            to={createComponentLink && createComponentLink()}
          />
          <SupportButton>All your software catalog entities</SupportButton>
        </ContentHeader>
        <EntityListProvider>
          <CatalogFilterLayout>
            <CatalogFilterLayout.Filters>
              <EntityKindPicker
                initialFilter={initialKind}
                allowedKinds={entityKindPickerAllowedKinds}
                hidden={entityKindPickerHidden}
              />
              <EntityTypePicker
                hidden={entityTypePickerHidden}
                initialFilter={initialType}
              />
              <UserListPicker
                initialFilter={initiallySelectedFilter}
                availableFilters={userListFilters}
              />
              <EntityOwnerPicker mode={ownerPickerMode} />
              <EntityLifecyclePicker
                initialFilter={entityLifecyclePickerInitialFilter}
              />
              <EntityTagPicker showCounts={showTagCounts} />
              <EntityProcessingStatusPicker />
              <EntityNamespacePicker />
            </CatalogFilterLayout.Filters>
            <CatalogFilterLayout.Content>
              <CatalogTable
                columns={columns}
                actions={actions}
                tableOptions={tableOptions}
                emptyContent={emptyContent}
              />
            </CatalogFilterLayout.Content>
          </CatalogFilterLayout>
        </EntityListProvider>
      </Content>
    </PageWithHeader>
  );
}
