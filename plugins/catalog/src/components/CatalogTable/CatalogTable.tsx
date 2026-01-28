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
  WarningPanel,
  FavoriteToggleIcon,
} from '@backstage/core-components';
import {
  getEntityRelations,
  humanizeEntityRef,
  useEntityList,
  useStarredEntities,
} from '@backstage/plugin-catalog-react';
import type { ColumnConfig } from '@backstage/ui';
import { VisuallyHidden } from '@backstage/ui';
import { RiPencilLine, RiExternalLinkLine } from '@remixicon/react';
import { capitalize } from 'lodash';
import pluralize from 'pluralize';
import { ReactNode, useMemo } from 'react';
import { columnFactories } from './columns';
import { CatalogTableColumnsFunc, CatalogTableRow } from './types';
import { OffsetPaginatedCatalogTable } from './OffsetPaginatedCatalogTable';
import { CursorPaginatedCatalogTable } from './CursorPaginatedCatalogTable';
import { ClientSideCatalogTable } from './ClientSideCatalogTable';
import { defaultCatalogTableColumnsFunc } from './defaultCatalogTableColumnsFunc';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { catalogTranslationRef } from '../../alpha';

/**
 * Props for {@link CatalogTable}.
 *
 * @public
 */
export interface CatalogTableProps {
  columns?: ColumnConfig<CatalogTableRow>[] | CatalogTableColumnsFunc;
  actions?: Array<
    (row: CatalogTableRow) => {
      icon: () => React.ReactElement;
      tooltip: string;
      disabled?: boolean;
      onClick?: () => void;
      cellStyle?: React.CSSProperties;
    }
  >;
  tableOptions?: {
    pageSize?: number;
    pageSizeOptions?: number[];
    paging?: boolean;
  };
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

  const defaultActions = useMemo(
    () => [
      ({ entity }: CatalogTableRow) => {
        const url = entity.metadata.annotations?.[ANNOTATION_VIEW_URL];
        const title = t('catalogTable.viewActionTitle');

        return {
          icon: () => (
            <>
              <VisuallyHidden>{title}</VisuallyHidden>
              <RiExternalLinkLine size={18} />
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
      ({ entity }: CatalogTableRow) => {
        const url = entity.metadata.annotations?.[ANNOTATION_EDIT_URL];
        const title = t('catalogTable.editActionTitle');

        return {
          icon: () => (
            <>
              <VisuallyHidden>{title}</VisuallyHidden>
              <RiPencilLine size={18} />
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
      ({ entity }: CatalogTableRow) => {
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
    ],
    [t, isStarredEntity, toggleStarredEntity],
  );

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

  // Client-side pagination mode
  const rows = useMemo(
    () => entities.sort(refCompare).map(toEntityRow),
    [entities],
  );

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

  // Handle cursor and offset pagination modes
  if (paginationMode === 'cursor') {
    return (
      <CursorPaginatedCatalogTable
        columns={tableColumns}
        emptyContent={emptyContent}
        isLoading={loading}
        title={title}
        actions={actions}
        subtitle={subtitle}
        data={entities.map(toEntityRow)}
        next={pageInfo?.next}
        prev={pageInfo?.prev}
      />
    );
  }

  if (paginationMode === 'offset') {
    return (
      <OffsetPaginatedCatalogTable
        columns={tableColumns}
        emptyContent={emptyContent}
        isLoading={loading}
        title={title}
        actions={actions}
        subtitle={subtitle}
        data={entities.map(toEntityRow)}
      />
    );
  }

  return (
    <ClientSideCatalogTable
      columns={tableColumns}
      rows={rows}
      loading={loading}
      title={title}
      subtitle={subtitle}
      actions={actions}
      emptyContent={emptyContent}
      tableOptions={tableOptions}
    />
  );
};

CatalogTable.columns = columnFactories;
CatalogTable.defaultColumnsFunc = defaultCatalogTableColumnsFunc;

function toEntityRow(entity: Entity): CatalogTableRow {
  const partOfSystemRelations = getEntityRelations(entity, RELATION_PART_OF, {
    kind: 'system',
  });
  const ownedByRelations = getEntityRelations(entity, RELATION_OWNED_BY);

  return {
    id: stringifyEntityRef(entity),
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
