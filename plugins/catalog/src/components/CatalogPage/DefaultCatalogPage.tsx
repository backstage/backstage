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
  EntityNamespacePicker,
  EntityOwnerPickerProps,
} from '@backstage/plugin-catalog-react';
import React, { ReactNode } from 'react';
import { createComponentRouteRef } from '../../routes';
import { CatalogTable, CatalogTableRow } from '../CatalogTable';
import { catalogTranslationRef } from '../../translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

import { CatalogTableColumnsFunc } from '../CatalogTable/types';

/** @internal */
export type BaseCatalogPageProps = {
  filters: ReactNode;
  content?: ReactNode;
  pagination?: boolean | { limit?: number };
};

/** @internal */
export function BaseCatalogPage(props: BaseCatalogPageProps) {
  const { filters, content = <CatalogTable />, pagination } = props;
  const orgName =
    useApi(configApiRef).getOptionalString('organization.name') ?? 'Backstage';
  const createComponentLink = useRouteRef(createComponentRouteRef);
  const { t } = useTranslationRef(catalogTranslationRef);

  return (
    <PageWithHeader title={t('indexPage.title', { orgName })} themeId="home">
      <Content>
        <ContentHeader title="">
          <CreateButton
            title={t('indexPage.createButtonTitle')}
            to={createComponentLink && createComponentLink()}
          />
          <SupportButton>All your software catalog entities</SupportButton>
        </ContentHeader>
        <EntityListProvider pagination={pagination}>
          <CatalogFilterLayout>
            <CatalogFilterLayout.Filters>{filters}</CatalogFilterLayout.Filters>
            <CatalogFilterLayout.Content>{content}</CatalogFilterLayout.Content>
          </CatalogFilterLayout>
        </EntityListProvider>
      </Content>
    </PageWithHeader>
  );
}

/**
 * Props for root catalog pages.
 *
 * @public
 */
export interface DefaultCatalogPageProps {
  initiallySelectedFilter?: UserListFilterKind;
  columns?: TableColumn<CatalogTableRow>[] | CatalogTableColumnsFunc;
  actions?: TableProps<CatalogTableRow>['actions'];
  initialKind?: string;
  tableOptions?: TableProps<CatalogTableRow>['options'];
  emptyContent?: ReactNode;
  ownerPickerMode?: EntityOwnerPickerProps['mode'];
  pagination?: boolean | { limit?: number };
}

export function DefaultCatalogPage(props: DefaultCatalogPageProps) {
  const {
    columns,
    actions,
    initiallySelectedFilter = 'owned',
    initialKind = 'component',
    tableOptions = {},
    emptyContent,
    pagination,
    ownerPickerMode,
  } = props;

  return (
    <BaseCatalogPage
      filters={
        <>
          <EntityKindPicker initialFilter={initialKind} />
          <EntityTypePicker />
          <UserListPicker initialFilter={initiallySelectedFilter} />
          <EntityOwnerPicker mode={ownerPickerMode} />
          <EntityLifecyclePicker />
          <EntityTagPicker />
          <EntityProcessingStatusPicker />
          <EntityNamespacePicker />
        </>
      }
      content={
        <CatalogTable
          columns={columns}
          actions={actions}
          tableOptions={tableOptions}
          emptyContent={emptyContent}
        />
      }
      pagination={pagination}
    />
  );
}
