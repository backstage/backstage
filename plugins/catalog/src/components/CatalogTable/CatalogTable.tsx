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
} from '@backstage/catalog-model';
import { useState } from 'react';
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
  useEntityFilter,
  useEntityStream,
  useStarredEntities,
} from '@backstage/plugin-catalog-react';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Edit from '@material-ui/icons/Edit';
import OpenInNew from '@material-ui/icons/OpenInNew';
import Star from '@material-ui/icons/Star';
import StarBorder from '@material-ui/icons/StarBorder';
import { capitalize } from 'lodash';
import React, { ReactNode, useCallback, useMemo, useRef } from 'react';
import useDebounce from 'react-use/lib/useDebounce';
import { columnFactories } from './columns';
import { CatalogTableRow } from './types';

const DEFAULT_PAGE_SIZE = 20;

// From material table. https://github.com/mbrn/material-table/blob/master/src/utils/index.js
export const selectFromObject = (o: object, s: string | undefined) => {
  if (!s) {
    return null;
  }
  let a;
  let _s;
  let _o = o;
  if (!Array.isArray(s)) {
    _s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    _s = _s.replace(/^\./, ''); // strip a leading dot
    a = _s.split('.');
  } else {
    a = s;
  }
  for (let i = 0, n = a.length; i < n; ++i) {
    const x = a[i] as any;
    if (_o && x in _o) {
      _o = (_o as any)[x];
    } else {
      return null;
    }
  }
  return _o as unknown;
};

// Pulled from material table, https://github.com/mbrn/material-table/blob/master/src/utils/data-manager.js#L548.
const _sort = (a: any, b: any, type: string) => {
  if (type === 'numeric') {
    return a - b;
  }
  if (a !== b) {
    // to find nulls
    if (!a) return -1;
    if (!b) return 1;
  }
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
};
const getFieldValue = (
  rowData: Record<string, any>,
  columnDef: TableColumn<CatalogTableRow>,
  lookup = true,
) => {
  let value =
    typeof rowData[columnDef.field!] !== 'undefined'
      ? rowData[columnDef.field!]
      : selectFromObject(rowData, columnDef.field);
  if (columnDef.lookup && lookup) {
    value = (columnDef.lookup as any)[value];
  }

  return value;
};

/**
 * Props for {@link CatalogTable}.
 *
 * @public
 */
export interface CatalogTableProps {
  columns?: TableColumn<CatalogTableRow>[];
  actions?: TableProps<CatalogTableRow>['actions'];
  tableOptions?: TableProps<CatalogTableRow>['options'];
  emptyContent?: ReactNode;
  subtitle?: string;
}

const YellowStar = withStyles({
  root: {
    color: '#f3ba37',
  },
})(Star);

export interface MTable {
  onQueryChange: (query: { page: number }) => void;
}

/** @public */
export const CatalogTable = (props: CatalogTableProps) => {
  const { columns, actions, tableOptions, subtitle, emptyContent } = props;
  const { isStarredEntity, toggleStarredEntity } = useStarredEntities();
  const { error, loading, hasMoreData, getEntities, count } = useEntityStream();

  const { filters } = useEntityFilter();

  const [hasLoadedFilters, setHasLoadedFilters] = useState(false);

  const ref = useRef<MTable>();

  const defaultColumns: TableColumn<CatalogTableRow>[] = useMemo(() => {
    return [
      columnFactories.createTitleColumn({ hidden: true }),
      columnFactories.createNameColumn({ defaultKind: filters.kind?.value }),
      ...createEntitySpecificColumns(),
      columnFactories.createMetadataDescriptionColumn(),
      columnFactories.createTagsColumn(),
    ];

    function createEntitySpecificColumns(): TableColumn<CatalogTableRow>[] {
      const baseColumns = [
        columnFactories.createSystemColumn(),
        columnFactories.createOwnerColumn(),
        columnFactories.createSpecTypeColumn(),
        columnFactories.createSpecLifecycleColumn(),
        columnFactories.createNamespaceColumn(),
      ];
      switch (filters.kind?.value) {
        case 'user':
          return [];
        case 'domain':
        case 'system':
          return [columnFactories.createOwnerColumn()];
        case 'group':
        case 'template':
          return [columnFactories.createSpecTypeColumn()];
        case 'location':
          return [
            columnFactories.createSpecTypeColumn(),
            columnFactories.createSpecTargetsColumn(),
          ];
        default:
          return baseColumns;
      }
    }
  }, [filters.kind?.value]);

  // Trigger a reload of loadData function to get the correct rows.
  useDebounce(
    () => {
      /**
       * TODO (@sennyeya): This is currently triggering when the favorite button is pressed,
       *  can't think of an easy solution here as we may need to retrigger render logic when
       *  you unfavorite an entity on the last page with the entity filter active. We could subscribe
       *  to the list of favorited entities?
       */

      setHasLoadedFilters(true);
      ref?.current?.onQueryChange({ page: 0 });
    },
    10,
    [filters],
  );

  /**
   * Convert a given entity to its MaterialTable row equivalent.
   * @param entity Entity to convert.
   * @returns A table row.
   */
  const toRow = (entity: Entity) => {
    const partOfSystemRelations = getEntityRelations(entity, RELATION_PART_OF, {
      kind: 'system',
    });
    const ownedByRelations = getEntityRelations(entity, RELATION_OWNED_BY);

    return {
      entity,
      resolved: {
        name: humanizeEntityRef(entity, {
          defaultKind: 'Component',
        }),
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
  };

  /**
   * Sort the entities in a given direction by a given orderBy column.
   * @param entities List of returned entities.
   * @param orderBy Column to order by, from MaterialTable.
   * @param orderDirection Which way to sort said column.
   */
  const sort = useCallback((orderBy: any, orderDirection: 'asc' | 'desc') => {
    type Row = ReturnType<typeof toRow>;
    return (a: Row, b: Row) => {
      if (orderBy.customSort) {
        if (orderDirection === 'desc') {
          return orderBy.customSort(b, a, 'row', 'desc');
        }
        return orderBy.customSort(a, b, 'row');
      }
      if (orderDirection === 'desc') {
        return _sort(
          getFieldValue(b, orderBy),
          getFieldValue(a, orderBy),
          orderBy.type,
        );
      }
      return _sort(
        getFieldValue(a, orderBy),
        getFieldValue(b, orderBy),
        orderBy.type,
      );
    };
  }, []);

  const getFieldFromColumn = (columnField: string) => {
    if (columnField.startsWith('resolved.')) return undefined;
    // Remove the `entity.` part of the string.
    return columnField.replace(/^entity./, '');
  };

  const loadData = useCallback(
    async query => {
      /**
       * Query is passed in as undefined on first load, if so just return nothing.
       */
      if (!query || !hasLoadedFilters)
        return {
          data: [],
          totalCount: 0,
          page: 0,
        };
      const { page, pageSize, search, orderBy, orderDirection } = query;
      const entities = [];
      let shouldLoadMore = false;
      const shouldOrderClientSide =
        orderBy && !getFieldFromColumn(orderBy.field);

      let _count = 0;
      const tableColumns = columns || defaultColumns;
      do {
        const from = page * pageSize;
        /**
         * We grab an additional item here to prevent issues where there are 20 items in the catalog
         *  but we think there may be more so we go to the next page and there were actually only 20 items.
         * The +1 forces a full search if we're on the last page.
         */
        const to = shouldOrderClientSide
          ? Number.MAX_SAFE_INTEGER
          : (page + 1) * pageSize + 1;
        const response = await getEntities({
          search: {
            term: search,
            fields: tableColumns
              .map(e => e.field && getFieldFromColumn(e.field))
              .filter((e): boolean => !!e) as string[],
          },
          sortBy:
            orderBy && !shouldOrderClientSide
              ? {
                  field: orderBy.field,
                  order: orderDirection,
                }
              : undefined,
          to,
          from,
        });

        if (response) {
          // Do search filtering here.
          _count = response.count;
          entities.push(...response.data.map(toRow));
          shouldLoadMore = shouldOrderClientSide
            ? response.hasMoreData
            : entities.length < pageSize && response.hasMoreData;
        }
      } while (shouldLoadMore);

      if (orderBy) {
        entities.sort(sort(orderBy, orderDirection));
      }

      return {
        data: entities,
        page,
        totalCount: shouldLoadMore
          ? Math.ceil((_count + 1) / pageSize) * pageSize
          : _count,
      };
    },
    [getEntities, columns, defaultColumns, hasLoadedFilters, sort],
  );

  const showTypeColumn = filters.type === undefined;
  // TODO(timbonicus): remove the title from the CatalogTable once using EntitySearchBar
  const titlePreamble = capitalize(filters.user?.value ?? 'all');

  if (error) {
    return (
      <div>
        <WarningPanel
          severity="error"
          title="Could not fetch catalog entities."
        >
          <CodeSnippet language="text" text={error.toString()} />
        </WarningPanel>
      </div>
    );
  }

  const defaultActions: TableProps<CatalogTableRow>['actions'] = [
    ({ entity }) => {
      const url = entity.metadata.annotations?.[ANNOTATION_VIEW_URL];
      const title = 'View';

      return {
        icon: () => (
          <>
            <Typography variant="srOnly">{title}</Typography>
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
      const title = 'Edit';

      return {
        icon: () => (
          <>
            <Typography variant="srOnly">{title}</Typography>
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
      const title = isStarred ? 'Remove from favorites' : 'Add to favorites';

      return {
        cellStyle: { paddingLeft: '1em' },
        icon: () => (
          <>
            <Typography variant="srOnly">{title}</Typography>
            {isStarred ? <YellowStar /> : <StarBorder />}
          </>
        ),
        tooltip: title,
        onClick: () => toggleStarredEntity(entity),
      };
    },
  ];

  const typeColumn = (columns || defaultColumns).find(c => c.title === 'Type');
  if (typeColumn) {
    typeColumn.hidden = !showTypeColumn;
  }
  const showPagination = hasMoreData || count > DEFAULT_PAGE_SIZE;

  return (
    <Table<CatalogTableRow>
      columns={columns || defaultColumns}
      options={{
        paging: showPagination,
        pageSize: DEFAULT_PAGE_SIZE,
        actionsColumnIndex: -1,
        loadingType: 'linear',
        padding: 'dense',
        pageSizeOptions: [DEFAULT_PAGE_SIZE, 50, 100],
        ...tableOptions,
      }}
      isLoading={loading}
      title={`${titlePreamble} (${hasMoreData ? `about ` : ''}${count})`}
      data={loadData}
      actions={actions || defaultActions}
      subtitle={subtitle}
      emptyContent={emptyContent}
      tableRef={ref}
    />
  );
};

CatalogTable.columns = columnFactories;
