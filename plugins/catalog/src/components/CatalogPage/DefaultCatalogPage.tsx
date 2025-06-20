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
  PageWithHeader,
  TableColumn,
  TableProps,
} from '@backstage/core-components';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import {
  CatalogFilterLayout,
  DefaultFilters,
  EntityListPagination,
  EntityListProvider,
  EntityOwnerPickerProps,
  UserListFilterKind,
} from '@backstage/plugin-catalog-react';
import { ReactNode } from 'react';
import { CatalogTable, CatalogTableRow } from '../CatalogTable';
import { catalogTranslationRef } from '../../alpha/translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { CatalogTableColumnsFunc } from '../CatalogTable/types';
import { DefaultCatalogContentHeader } from './DefaultCatalogContentHeader';

/** @internal */
export type BaseCatalogPageProps = {
  filters: ReactNode;
  content?: ReactNode;
  pagination?: EntityListPagination;
  contentHeader?: ReactNode;
};

/** @internal */
export function BaseCatalogPage(props: BaseCatalogPageProps) {
  const {
    filters,
    content = <CatalogTable />,
    pagination,
    contentHeader = <DefaultCatalogContentHeader />,
  } = props;
  const orgName =
    useApi(configApiRef).getOptionalString('organization.name') ?? 'Backstage';
  const { t } = useTranslationRef(catalogTranslationRef);

  return (
    <PageWithHeader title={t('indexPage.title', { orgName })} themeId="home">
      <Content>
        {contentHeader}
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
  filters?: ReactNode;
  initiallySelectedNamespaces?: string[];
  pagination?: EntityListPagination;
  contentHeader?: ReactNode;
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
    filters,
    initiallySelectedNamespaces,
    contentHeader,
  } = props;

  return (
    <BaseCatalogPage
      filters={
        filters ?? (
          <DefaultFilters
            initialKind={initialKind}
            initiallySelectedFilter={initiallySelectedFilter}
            ownerPickerMode={ownerPickerMode}
            initiallySelectedNamespaces={initiallySelectedNamespaces}
          />
        )
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
      contentHeader={contentHeader}
    />
  );
}
