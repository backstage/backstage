/*
 * Copyright 2024 The Backstage Authors
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

import React, { useEffect } from 'react';

import { Table, TableProps } from '@backstage/core-components';
import { DocsTableRow } from './types';
import {
  EntityTextFilter,
  useEntityList,
} from '@backstage/plugin-catalog-react';

/**
 * @internal
 */
export function OffsetPaginatedDocsTable(props: TableProps<DocsTableRow>) {
  const { actions, columns, data, isLoading, options } = props;
  const { updateFilters, setLimit, setOffset, limit, totalItems, offset } =
    useEntityList();
  const [page, setPage] = React.useState(
    offset && limit ? Math.floor(offset / limit) : 0,
  );

  useEffect(() => {
    if (totalItems && page * limit >= totalItems) {
      setOffset!(Math.max(0, totalItems - limit));
    } else {
      setOffset!(Math.max(0, page * limit));
    }
  }, [setOffset, page, limit, totalItems]);

  return (
    <Table<DocsTableRow>
      columns={columns}
      data={data}
      options={{
        paginationPosition: 'both',
        pageSizeOptions: [5, 10, 20, 50, 100],
        pageSize: limit,
        emptyRowsWhenPaging: false,
        actionsColumnIndex: -1,
        ...options,
      }}
      actions={actions}
      onSearchChange={(searchText: string) =>
        updateFilters({
          text: searchText ? new EntityTextFilter(searchText) : undefined,
        })
      }
      page={page}
      onPageChange={newPage => {
        setPage(newPage);
      }}
      onRowsPerPageChange={pageSize => {
        setLimit(pageSize);
      }}
      totalCount={totalItems}
      localization={{ pagination: { labelDisplayedRows: '' } }}
      isLoading={isLoading}
    />
  );
}
