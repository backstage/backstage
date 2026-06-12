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
import { ButtonLink, Container, Header } from '@backstage/ui';
import { RiAddLine } from '@remixicon/react';
import {
  CatalogFilterLayout,
  DefaultFilters,
  EntityListPagination,
  EntityListProvider,
  EntityOwnerPickerProps,
  UserListFilterKind,
} from '@backstage/plugin-catalog-react';
import { ReactNode } from 'react';
import { createComponentRouteRef } from '../../routes';
import { CatalogTable, CatalogTableRow } from '../CatalogTable';
import { catalogTranslationRef } from '../../alpha/translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { CatalogTableColumnsFunc } from '../CatalogTable/types';
import { catalogEntityCreatePermission } from '@backstage/plugin-catalog-common/alpha';
import { usePermission } from '@backstage/plugin-permission-react';
import { CatalogExportButton } from '../CatalogExportButton/CatalogExportButton';
import type { CatalogExportSettings } from '../CatalogExportButton';
import Box from '@material-ui/core/Box';
import styles from './DefaultCatalogPage.module.css';

/** @internal */
export type BaseCatalogPageProps = {
  filters: ReactNode;
  content?: ReactNode;
  pagination?: EntityListPagination;
  exportSettings?: CatalogExportSettings;
};

function CatalogPageContent(props: BaseCatalogPageProps) {
  const { filters, content = <CatalogTable /> } = props;

  return (
    <CatalogFilterLayout>
      <CatalogFilterLayout.Filters>{filters}</CatalogFilterLayout.Filters>
      <CatalogFilterLayout.Content>{content}</CatalogFilterLayout.Content>
    </CatalogFilterLayout>
  );
}

/** @internal */
export function BaseCatalogPage(props: BaseCatalogPageProps) {
  const { pagination, exportSettings } = props;
  const orgName =
    useApi(configApiRef).getOptionalString('organization.name') ?? 'Backstage';
  const createComponentLink = useRouteRef(createComponentRouteRef);
  const { t } = useTranslationRef(catalogTranslationRef);
  const { allowed } = usePermission({
    permission: catalogEntityCreatePermission,
  });
  const headerActions = (
    <>
      {allowed && (
        <CreateButton
          title={t('indexPage.createButtonTitle')}
          to={createComponentLink && createComponentLink()}
        />
      )}
      {exportSettings?.enabled && (
        <Box ml={2}>
          <CatalogExportButton settings={exportSettings} />
        </Box>
      )}
      <SupportButton>{t('indexPage.supportButtonContent')}</SupportButton>
    </>
  );

  return (
    <EntityListProvider pagination={pagination}>
      <PageWithHeader title={t('indexPage.title', { orgName })} themeId="home">
        <Content>
          <ContentHeader title="">{headerActions}</ContentHeader>
          <CatalogPageContent {...props} />
        </Content>
      </PageWithHeader>
    </EntityListProvider>
  );
}

/** @internal */
export function NfsBaseCatalogPage(props: BaseCatalogPageProps) {
  const { pagination, exportSettings } = props;
  const orgName =
    useApi(configApiRef).getOptionalString('organization.name') ?? 'Backstage';
  const createComponentLink = useRouteRef(createComponentRouteRef);
  const createComponentHref = createComponentLink?.();
  const { t } = useTranslationRef(catalogTranslationRef);
  const { allowed } = usePermission({
    permission: catalogEntityCreatePermission,
  });

  return (
    <EntityListProvider pagination={pagination}>
      <Header
        title={t('indexPage.title', { orgName })}
        customActions={
          <>
            {allowed && createComponentHref && (
              <ButtonLink
                variant="primary"
                href={createComponentHref}
                iconStart={<RiAddLine />}
              >
                {t('indexPage.createButtonTitle')}
              </ButtonLink>
            )}
            {exportSettings?.enabled && (
              <CatalogExportButton settings={exportSettings} iconOnly />
            )}
            <div className={styles.supportButton}>
              <SupportButton>
                {t('indexPage.supportButtonContent')}
              </SupportButton>
            </div>
          </>
        }
      />
      <Container>
        <CatalogPageContent {...props} />
      </Container>
    </EntityListProvider>
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
  exportSettings?: CatalogExportSettings;
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
    exportSettings,
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
      exportSettings={exportSettings}
    />
  );
}

/** @public */
export function NfsDefaultCatalogPage(props: DefaultCatalogPageProps) {
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
    exportSettings,
  } = props;

  return (
    <NfsBaseCatalogPage
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
      exportSettings={exportSettings}
    />
  );
}
