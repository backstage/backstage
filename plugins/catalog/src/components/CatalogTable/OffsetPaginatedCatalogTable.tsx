/*
 * Copyright 2023 The Backstage Authors
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

import { useState, useEffect } from 'react';

import {
  Table as MaterialTable,
  TableProps as MaterialTableProps,
} from '@backstage/core-components';
import { CatalogTableRow } from './types';
import { useEntityList } from '@backstage/plugin-catalog-react';
import { CatalogTableToolbar } from './CatalogTableToolbar';
import {
  Table,
  TableHeader,
  TableBody,
  Row,
  Cell,
  Column,
  TablePagination,
  useTable,
} from '@backstage/ui';
import {
  EntityRefLinkCell,
  EntityRefLinksCell,
  TagsCell,
  DescriptionCell,
} from './cells';
import { Cell as ReactAriaCell } from 'react-aria-components';

/**
 * Helper function to extract value from object using dot-notation path
 */
function extractValueByField(data: any, field: string): any | undefined {
  if (!field) return undefined;
  const path = field.split('.');
  let value = data[path[0]];

  for (let i = 1; i < path.length; ++i) {
    if (value === undefined || value === null) {
      return value;
    }
    value = value[path[i]];
  }

  return value;
}

/**
 * @internal
 */
export function OffsetPaginatedCatalogTable(
  props: MaterialTableProps<CatalogTableRow>,
) {
  const { columns, data: rawData, options, ...restProps } = props;
  const { setLimit, setOffset, limit, totalItems, offset } = useEntityList();

  const [page, setPage] = useState(
    offset && limit ? Math.floor(offset / limit) : 0,
  );

  // Ensure rawData is an array (it might be a query function)
  const tableData = Array.isArray(rawData) ? rawData : [];

  const { paginationProps } = useTable({
    // Don't pass data since it's already paginated server-side
    // Pass rowCount and use controlled pagination
    pagination: {
      offset: offset ?? 0,
      pageSize: limit ?? 10,
      rowCount: totalItems,
      onOffsetChange: (newOffset: number) => {
        setOffset!(newOffset);
        if (limit) {
          setPage(Math.floor(newOffset / limit));
        }
      },
      onPageSizeChange: (newPageSize: number) => {
        setLimit!(newPageSize);
        setOffset!(0);
        setPage(0);
      },
    },
  });

  // Sync page state with offset changes
  useEffect(() => {
    if (offset !== undefined && limit) {
      setPage(Math.floor(offset / limit));
    }
  }, [offset, limit]);

  const firstVisibleColumnIndex =
    columns?.findIndex(column => column.hidden !== true) ?? -1;
  const columnsWithRowHeader = columns?.map((column, index) => ({
    ...column,
    isRowHeader: index === firstVisibleColumnIndex,
  }));

  return (
    <>
      <MaterialTable
        columns={columns}
        data={tableData}
        options={{
          pageSizeOptions: [5, 10, 20, 50, 100],
          pageSize: limit,
          emptyRowsWhenPaging: false,
          ...options,
        }}
        components={{
          Toolbar: CatalogTableToolbar,
        }}
        page={page}
        onPageChange={setPage}
        onRowsPerPageChange={setLimit}
        totalCount={totalItems}
        {...restProps}
      />
      <Table>
        <TableHeader columns={columnsWithRowHeader}>
          {column => (
            <Column
              id={column.field || String(column.title)}
              isRowHeader={column.isRowHeader}
              hidden={column.hidden}
            >
              {column.title}
            </Column>
          )}
        </TableHeader>
        <TableBody items={tableData}>
          {item => {
            return (
              <Row id={item.resolved.entityRef} columns={columnsWithRowHeader}>
                {column => {
                  const cellId = column.field || String(column.title);
                  const cellValue = column.field
                    ? extractValueByField(item, column.field)
                    : null;

                  // Use column.render if available, otherwise determine cell type by field
                  if (column.render) {
                    const renderedContent = column.render(item, 'row');

                    // Check field to determine which cell component to use
                    if (column.field === 'resolved.entityRef') {
                      // Name column - EntityRefLink
                      return (
                        <EntityRefLinkCell
                          id={cellId}
                          hidden={column.hidden}
                          entityRef={item.entity}
                          defaultKind={
                            (column as any).defaultKind || 'Component'
                          }
                        />
                      );
                    } else if (
                      column.field === 'resolved.partOfSystemRelationTitle'
                    ) {
                      // System column - EntityRefLinks
                      return (
                        <EntityRefLinksCell
                          id={cellId}
                          hidden={column.hidden}
                          entityRefs={item.resolved.partOfSystemRelations || []}
                          defaultKind="system"
                        />
                      );
                    } else if (
                      column.field === 'resolved.ownedByRelationsTitle'
                    ) {
                      // Owner column - EntityRefLinks
                      return (
                        <EntityRefLinksCell
                          id={cellId}
                          hidden={column.hidden}
                          entityRefs={item.resolved.ownedByRelations || []}
                          defaultKind="group"
                        />
                      );
                    } else if (column.field === 'entity.metadata.tags') {
                      // Tags column
                      return (
                        <TagsCell
                          id={cellId}
                          hidden={column.hidden}
                          tags={item.entity.metadata.tags}
                        />
                      );
                    } else if (column.field === 'entity.metadata.description') {
                      // Description column
                      return (
                        <DescriptionCell
                          id={cellId}
                          hidden={column.hidden}
                          text={item.entity.metadata.description}
                        />
                      );
                    } else if (
                      column.field === 'entity.spec.targets' ||
                      column.field === 'entity.spec.target'
                    ) {
                      // Targets column - use DescriptionCell for comma-separated list
                      let targets: string[] = [];
                      if (
                        item.entity?.spec?.targets &&
                        Array.isArray(item.entity.spec.targets)
                      ) {
                        targets = item.entity.spec.targets as string[];
                      } else if (item.entity?.spec?.target) {
                        targets = [item.entity.spec.target as string];
                      }
                      return (
                        <DescriptionCell
                          id={cellId}
                          hidden={column.hidden}
                          text={targets.join(', ')}
                        />
                      );
                    }
                    // Fallback: render the content directly
                    return (
                      <ReactAriaCell
                        id={cellId}
                        className="bui-TableCell"
                        hidden={column.hidden}
                      >
                        <div className="bui-TableCellContentWrapper">
                          <div className="bui-TableCellContent">
                            {renderedContent}
                          </div>
                        </div>
                      </ReactAriaCell>
                    );
                  }

                  // No render function - use simple string value
                  const title =
                    cellValue !== undefined && cellValue !== null
                      ? String(cellValue)
                      : '';

                  return (
                    <Cell id={cellId} title={title} hidden={column.hidden} />
                  );
                }}
              </Row>
            );
          }}
        </TableBody>
      </Table>
      <TablePagination {...paginationProps} />
    </>
  );
}
