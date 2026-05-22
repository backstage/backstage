/*
 * Copyright 2026 The Backstage Authors
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
  EntityListProvider,
  EntityOrderFilter,
  entityRouteParams,
  entityRouteRef,
  useEntityList,
} from '@backstage/plugin-catalog-react';
import { NextCatalogSearchBar } from './NextCatalogSearchBar';
import type { CatalogColumnHeader } from '@backstage/plugin-catalog-react/alpha';
import {
  Box,
  Card,
  Cell,
  Column,
  Flex,
  Header,
  Table,
  Text,
} from '@backstage/ui';
import type { ColumnConfig, SortDescriptor } from '@backstage/ui';
import { stringifyEntityRef } from '@backstage/catalog-model';
import type { Entity } from '@backstage/catalog-model';
import { configApiRef, useApi, useRouteRef } from '@backstage/core-plugin-api';
import { useMemo, useState } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { catalogTranslationRef } from '../..';
import { buildFilterFn } from '../../alpha/filter/FilterWrapper';
import {
  Content,
  CreateButton,
  SupportButton,
} from '@backstage/core-components';
import { usePermission } from '@backstage/plugin-permission-react';
import { catalogEntityCreatePermission } from '@backstage/plugin-catalog-common/alpha';
import { createComponentRouteRef } from '../../routes';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import capitalize from 'lodash/capitalize';
import pluralize from 'pluralize';

/**
 * BUI's `Table<T>` requires `T extends { id: string | number }`.
 * Catalog entities don't carry a top-level `id`, so we wrap them in this
 * row shape internally. Adopters never see `EntityRow` — the public column
 * `cell` is `(entity: Entity) => ReactElement` and the wrapping is unwound
 * by the column-config adapter below.
 */
interface EntityRow {
  id: string;
  entity: Entity;
}

/**
 * Props for {@link NextCatalogPage}.
 *
 * @alpha
 */
export type NextCatalogPageProps = {
  filters: ReactNode;
  columns: Array<{
    header: CatalogColumnHeader;
    cell: (entity: Entity) => ReactElement;
    filterFunction?: (entity: Entity) => boolean;
    filterExpression?: string;
  }>;
  pageSizeOptions?: number[];
};

function buildColumnConfig(
  columns: NextCatalogPageProps['columns'],
  entities: Entity[],
): ColumnConfig<EntityRow>[] {
  const resolved = columns.map(
    ({ header, cell, filterFunction, filterExpression }) => {
      const filter = buildFilterFn(filterFunction, filterExpression);
      const hasFilter = Boolean(filterFunction || filterExpression);
      const hiddenByFilter =
        hasFilter && entities.length > 0 && !entities.some(e => filter(e));
      const isHidden = header.hidden || hiddenByFilter;
      return { header, cell, filter, isHidden };
    },
  );

  const firstVisibleIndex = resolved.findIndex(c => !c.isHidden);

  return resolved.map(({ header, cell, filter, isHidden }, index) => ({
    id: header.id,
    label: header.label,
    header: header.header
      ? () => (
          <Column
            id={header.id}
            isRowHeader={index === firstVisibleIndex}
            allowsSorting={Boolean(header.orderField)}
            width={header.width}
          >
            {header.header!()}
          </Column>
        )
      : undefined,
    width: header.width,
    isSortable: Boolean(header.orderField),
    isRowHeader: index === firstVisibleIndex,
    isHidden,
    cell: row => (filter(row.entity) ? cell(row.entity) : <Cell />),
  }));
}

function NextCatalogTable(props: {
  columns: NextCatalogPageProps['columns'];
  pageSizeOptions: number[];
}) {
  const { entities, loading, error, updateFilters } = useEntityList();
  const entityRoute = useRouteRef(entityRouteRef);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor | null>(
    null,
  );

  const { setLimit, setOffset, limit, totalItems, offset } = useEntityList();

  const headersById = useMemo(
    () => new Map(props.columns.map(c => [c.header.id, c.header])),
    [props.columns],
  );

  const columnConfig = useMemo(
    () => buildColumnConfig(props.columns, entities ?? []),
    [props.columns, entities],
  );

  const rowConfig = useMemo(
    () => ({
      getHref: (row: EntityRow) => entityRoute(entityRouteParams(row.entity)),
    }),
    [entityRoute],
  );
  const rows = useMemo<EntityRow[]>(
    () =>
      (entities ?? []).map(entity => ({
        id: stringifyEntityRef(entity),
        entity,
      })),
    [entities],
  );

  const searchFields = useMemo(() => {
    const seen = new Set<string>();
    const entityList = entities ?? [];
    for (const { header, filterFunction, filterExpression } of props.columns) {
      if ((filterFunction || filterExpression) && entityList.length > 0) {
        const filter = buildFilterFn(filterFunction, filterExpression);
        if (!entityList.some(e => filter(e))) continue;
      }
      for (const f of header.searchFields ?? []) {
        seen.add(f);
      }
    }
    return [...seen];
  }, [props.columns, entities]);

  const onSortChange = (descriptor: SortDescriptor) => {
    setSortDescriptor(descriptor);
    const header = headersById.get(String(descriptor.column));
    if (!header?.orderField) {
      return;
    }
    updateFilters({
      order: new EntityOrderFilter([
        [
          header.orderField,
          descriptor.direction === 'descending' ? 'desc' : 'asc',
        ],
      ]),
    });
  };

  const handleNextPage = () => setOffset?.((offset ?? 0) + (limit ?? 0));

  const handlePreviousPage = () =>
    setOffset?.(Math.max(0, (offset ?? 0) - (limit ?? 0)));

  return (
    <Card>
      <Flex direction="row" justify="between" mb="4" mx="2">
        <TableTitle />
        <NextCatalogSearchBar searchFields={searchFields} />
      </Flex>
      <Table<EntityRow>
        columnConfig={columnConfig}
        data={rows}
        isPending={loading}
        error={error}
        pagination={{
          type: 'page',
          pageSize: limit,
          onNextPage: handleNextPage,
          onPreviousPage: handlePreviousPage,
          hasNextPage: totalItems
            ? (offset ?? 0) + (limit ?? 0) < totalItems
            : false,
          hasPreviousPage: (offset ?? 0) > 0,
          onPageSizeChange: setLimit,
          pageSizeOptions: props.pageSizeOptions,
        }}
        sort={{ descriptor: sortDescriptor, onSortChange }}
        rowConfig={rowConfig}
      />
    </Card>
  );
}

/**
 * The next-generation catalog page that renders entity columns supplied via
 * props.
 *
 * @alpha
 */
export function NextCatalogPage(props: NextCatalogPageProps) {
  const { filters, columns } = props;
  const orgName =
    useApi(configApiRef).getOptionalString('organization.name') ?? 'Backstage';
  const { t } = useTranslationRef(catalogTranslationRef);
  const createComponentLink = useRouteRef(createComponentRouteRef);
  const { allowed } = usePermission({
    permission: catalogEntityCreatePermission,
  });

  return (
    <>
      <Header
        title={t('indexPage.title', { orgName })}
        customActions={
          <>
            {allowed && (
              <CreateButton
                title={t('indexPage.createButtonTitle')}
                to={createComponentLink && createComponentLink()}
              />
            )}
            <SupportButton>{t('indexPage.supportButtonContent')}</SupportButton>
          </>
        }
      />
      <Content>
        <EntityListProvider pagination={{ mode: 'offset' }}>
          <CatalogFilterLayout>
            <CatalogFilterLayout.Filters>{filters}</CatalogFilterLayout.Filters>
            <CatalogFilterLayout.Content>
              <NextCatalogTable
                columns={columns}
                pageSizeOptions={props.pageSizeOptions ?? [20, 50, 100]}
              />
            </CatalogFilterLayout.Content>
          </CatalogFilterLayout>
        </EntityListProvider>
      </Content>
    </>
  );
}

function TableTitle() {
  const { t } = useTranslationRef(catalogTranslationRef);
  const { filters, totalItems, loading } = useEntityList();

  const currentKind = filters.kind?.label || '';
  const currentType = filters.type?.value || '';
  const currentCount = typeof totalItems === 'number' ? `(${totalItems})` : '';
  const titlePreamble = capitalize(
    filters.user?.value ?? t('catalogTable.allFilters'),
  );
  const titleText = [
    titlePreamble,
    currentType,
    pluralize(currentKind),
    currentCount,
  ]
    .filter(s => s)
    .join(' ');

  return (
    <Box pt="4">
      <Text variant="title-small">{loading ? '' : titleText}</Text>
    </Box>
  );
}
