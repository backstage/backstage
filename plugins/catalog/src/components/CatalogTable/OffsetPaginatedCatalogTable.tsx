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

import React, { useCallback } from 'react';

import { Table, TableProps } from '@backstage/core-components';
import { CatalogTableRow } from './types';
import { useEntityList } from '@backstage/plugin-catalog-react';
import { CatalogTableToolbar } from './CatalogTableToolbar';
import TablePagination from '@material-ui/core/TablePagination';
/**
 * @internal
 */
export function OffsetPaginatedCatalogTable(
  props: TableProps<CatalogTableRow>,
) {
  const { columns, data, options, ...restProps } = props;
  const { setLimit, setOffset, limit, totalItems, offset } = useEntityList();

  const page = offset && limit ? Math.floor(offset / limit) : 0;

  const Pagination = useCallback(
    (propsPagination: {}) => {
      return (
        <TablePagination
          {...propsPagination}
          page={page}
          rowsPerPage={limit}
          count={totalItems || 0}
          onPageChange={(_e, newPage) => {
            if (totalItems && newPage * limit >= totalItems) {
              setOffset?.(Math.max(0, totalItems - limit));
            } else {
              setOffset?.(Math.max(0, newPage * limit));
            }
          }}
          onRowsPerPageChange={e => {
            setLimit(parseInt(e.target.value, 10));
          }}
        />
      );
    },
    [page, totalItems, limit, setLimit, setOffset],
  );

  return (
    <Table
      columns={columns}
      data={data}
      options={{
        paginationPosition: 'both',
        paginationAlignment: 'flex-end',
        paginationType: 'normal',
        paging: true,
        pageSizeOptions: [5, 10, 20, 50, 100],
        emptyRowsWhenPaging: false,
        ...options,
        pageSize: Number.MAX_SAFE_INTEGER,
      }}
      components={{
        Pagination,
        Toolbar: CatalogTableToolbar,
      }}
      {...restProps}
    />
  );
}
