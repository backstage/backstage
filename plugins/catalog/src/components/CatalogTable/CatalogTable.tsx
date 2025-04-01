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
  ANNOTATION_EDIT_URL,
  ANNOTATION_VIEW_URL,
  Entity,
  RELATION_OWNED_BY,
  RELATION_PART_OF,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import {
  CodeSnippet,
  Table,
  TableColumn,
  TableProps,
  WarningPanel,
} from '@backstage/core-components';
import {
  getEntityRelations,
  humanizeEntityRef,
  useEntityList,
  useStarredEntities,
} from '@backstage/plugin-catalog-react';
import Typography from '@material-ui/core/Typography';
import { visuallyHidden } from '@mui/utils';
import Edit from '@material-ui/icons/Edit';
import OpenInNew from '@material-ui/icons/OpenInNew';
import { capitalize } from 'lodash';
import pluralize from 'pluralize';
import React, { ReactNode, useMemo } from 'react';
import { columnFactories } from './columns';
import { CatalogTableColumnsFunc, CatalogTableRow } from './types';
import { OffsetPaginatedCatalogTable } from './OffsetPaginatedCatalogTable';
import { CursorPaginatedCatalogTable } from './CursorPaginatedCatalogTable';
import { defaultCatalogTableColumnsFunc } from './defaultCatalogTableColumnsFunc';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { catalogTranslationRef } from '../../alpha/translation';
import { FavoriteToggleIcon } from '@backstage/core-components';

/**
 * Props for {@link CatalogTable}.
 *
 * @public
 */
export interface CatalogTableProps {
  columns?: TableColumn<CatalogTableRow>[] | CatalogTableColumnsFunc;
  actions?: TableProps<CatalogTableRow>['actions'];
  tableOptions?: TableProps<CatalogTableRow>['options'];
  emptyContent?: ReactNode;
  /**
   * A static title to use for the table. If not provided, a title will be
   * generated based on the current Kind and Type filters and total number of items.
   */
  title?: string;
  subtitle?: string;
}

const refCompare = (a: Entity, b: Entity) => {
  const toRef = (entity: Entity) =>
    entity.metadata.title ||
    humanizeEntityRef(entity, {
      defaultKind: 'Component',
    });

  return toRef(a).localeCompare(toRef(b));
};

/**
 * CatalogTable is a wrapper around the Table component that is pre-configured
 * to display catalog entities.
 *
 * @remarks
 *
 * See {@link https://backstage.io/docs/features/software-catalog/catalog-customization}
 *
 * @public
 */
export const CatalogTable = (props: CatalogTableProps) => {
  const {
    columns = defaultCatalogTableColumnsFunc,
    tableOptions,
    subtitle,
    emptyContent,
  } = props;
  const { isStarredEntity, toggleStarredEntity } = useStarredEntities();
  const entityListContext = useEntityList();

  const {
    loading,
    error,
    entities,
    filters,
    pageInfo,
    totalItems,
    paginationMode,
  } = entityListContext;

  const tableColumns = useMemo(
    () =>
      typeof columns === 'function' ? columns(entityListContext) : columns,
    [columns, entityListContext],
  );
  const { t } = useTranslationRef(catalogTranslationRef);

  if (error) {
    return (
      <div>
        <WarningPanel
          severity="error"
          title={t('catalogTable.warningPanelTitle')}
        >
          <CodeSnippet language="text" text={error.toString()} />
        </WarningPanel>
      </div>
    );
  }

  const defaultActions: TableProps<CatalogTableRow>['actions'] = [
    ({ entity }) => {
      const url = entity.metadata.annotations?.[ANNOTATION_VIEW_URL];
      const title = t('catalogTable.viewActionTitle');

      return {
        icon: () => (
          <>
            <Typography style={visuallyHidden}>{title}</Typography>
            <OpenInNew fontSize="small" />
          </>
        ),
        tooltip: title,
        disabled: !url,
        onClick: () => {
          if (!url) return;
          window.open(url, '_blank');
        },
      };
    },
    ({ entity }) => {
      const url = entity.metadata.annotations?.[ANNOTATION_EDIT_URL];
      const title = t('catalogTable.editActionTitle');

      return {
        icon: () => (
          <>
            <Typography style={visuallyHidden}>{title}</Typography>
            <Edit fontSize="small" />
          </>
        ),
        tooltip: title,
        disabled: !url,
        onClick: () => {
          if (!url) return;
          window.open(url, '_blank');
        },
      };
    },
    ({ entity }) => {
      const isStarred = isStarredEntity(entity);
      const title = isStarred
        ? t('catalogTable.unStarActionTitle')
        : t('catalogTable.starActionTitle');

      return {
        cellStyle: { paddingLeft: '1em' },
        icon: () => <FavoriteToggleIcon isFavorite={isStarred} />,
        tooltip: title,
        onClick: () => toggleStarredEntity(entity),
      };
    },
  ];

  const currentKind = filters.kind?.label || '';
  const currentType = filters.type?.value || '';
  const currentCount = typeof totalItems === 'number' ? `(${totalItems})` : '';
  // TODO(timbonicus): remove the title from the CatalogTable once using EntitySearchBar
  const titlePreamble = capitalize(filters.user?.value ?? 'all');
  const title =
    props.title ||
    [titlePreamble, currentType, pluralize(currentKind), currentCount]
      .filter(s => s)
      .join(' ');

  const actions = props.actions || defaultActions;
  const options = {
    actionsColumnIndex: -1,
    loadingType: 'linear' as const,
    showEmptyDataSourceMessage: !loading,
    padding: 'dense' as const,
    ...tableOptions,
  };

  if (paginationMode === 'cursor') {
    return (
      <CursorPaginatedCatalogTable
        columns={tableColumns}
        emptyContent={emptyContent}
        isLoading={loading}
        title={title}
        actions={actions}
        subtitle={subtitle}
        options={options}
        data={entities.map(toEntityRow)}
        next={pageInfo?.next}
        prev={pageInfo?.prev}
      />
    );
  } else if (paginationMode === 'offset') {
    return (
      <OffsetPaginatedCatalogTable
        columns={tableColumns}
        emptyContent={emptyContent}
        isLoading={loading}
        title={title}
        actions={actions}
        subtitle={subtitle}
        options={options}
        data={entities.map(toEntityRow)}
      />
    );
  }

  const rows = entities.sort(refCompare).map(toEntityRow);
  const pageSize = 20;
  const showPagination = rows.length > pageSize;

  return (
    <Table<CatalogTableRow>
      isLoading={loading}
      columns={tableColumns}
      options={{
        paging: showPagination,
        pageSize: pageSize,
        pageSizeOptions: [20, 50, 100],
        ...options,
      }}
      title={title}
      data={rows}
      actions={actions}
      subtitle={subtitle}
      emptyContent={emptyContent}
    />
  );
};

CatalogTable.columns = columnFactories;
CatalogTable.defaultColumnsFunc = defaultCatalogTableColumnsFunc;

function toEntityRow(entity: Entity) {
  const partOfSystemRelations = getEntityRelations(entity, RELATION_PART_OF, {
    kind: 'system',
  });
  const ownedByRelations = getEntityRelations(entity, RELATION_OWNED_BY);

  return {
    entity,
    resolved: {
      // This name is here for backwards compatibility mostly; the
      // presentation of refs in the table should in general be handled with
      // EntityRefLink / EntityName components
      name: humanizeEntityRef(entity, {
        defaultKind: 'Component',
      }),
      entityRef: stringifyEntityRef(entity),
      ownedByRelationsTitle: ownedByRelations
        .map(r => humanizeEntityRef(r, { defaultKind: 'group' }))
        .join(', '),
      ownedByRelations,
      partOfSystemRelationTitle: partOfSystemRelations
        .map(r =>
          humanizeEntityRef(r, {
            defaultKind: 'system',
          }),
        )
        .join(', '),
      partOfSystemRelations,
    },
  };
}
