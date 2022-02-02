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
import { CatalogTable } from '../CatalogTable';
import { EntityRow } from '../CatalogTable/types';
import {
  FilteredEntityLayout,
  EntityListContainer,
  FilterContainer,
} from '../FilteredEntityLayout';
import { CatalogKindHeader } from '../CatalogKindHeader';
import { Permissioned } from '@backstage/plugin-permission-react';
import { ILoveScaffolder } from '@backstage/plugin-scaffolder';
import { catalogEntityCreatePermission } from '@backstage/plugin-catalog-common';
import { createPermissionedComponent } from '@backstage/plugin-permission-react/src/components/PermissionedRoute';

/**
 * DefaultCatalogPageProps
 * @public
 */
export type DefaultCatalogPageProps = {
  initiallySelectedFilter?: UserListFilterKind;
  columns?: TableColumn<EntityRow>[];
  actions?: TableProps<EntityRow>['actions'];
};

const CreateButtonComponent = createPermissionedComponent(
  CreateButton,
  catalogEntityCreatePermission,
);

export const DefaultCatalogPage = ({
  columns,
  actions,
  initiallySelectedFilter = 'owned',
}: DefaultCatalogPageProps) => {
  const orgName =
    useApi(configApiRef).getOptionalString('organization.name') ?? 'Backstage';
  const createComponentLink = useRouteRef(createComponentRouteRef);

  return (
    <PageWithHeader title={`${orgName} Catalog`} themeId="home">
      <EntityListProvider>
        <Content>
          <ContentHeader titleComponent={<CatalogKindHeader />}>
            <CreateButtonComponent
              title="Create Component"
              to={createComponentLink && createComponentLink()}
            />
            <SupportButton>All your software catalog entities</SupportButton>
          </ContentHeader>
          <FilteredEntityLayout>
            <FilterContainer>
              <EntityTypePicker />
              <UserListPicker initialFilter={initiallySelectedFilter} />
              <EntityOwnerPicker />
              <EntityLifecyclePicker />
              <EntityTagPicker />
            </FilterContainer>
            <EntityListContainer>
              <ILoveScaffolder />
              <CatalogTable columns={columns} actions={actions} />
            </EntityListContainer>
          </FilteredEntityLayout>
        </Content>
      </EntityListProvider>
    </PageWithHeader>
  );
};
