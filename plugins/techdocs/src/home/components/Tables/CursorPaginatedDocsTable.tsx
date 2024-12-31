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

import React, { useCallback } from 'react';

import { Table, TableProps } from '@backstage/core-components';
import { DocsTableRow } from './types';
import { MTablePagination } from '@material-table/core';

type PaginatedDocsTableProps = {
  prev?(): void;
  next?(): void;
} & TableProps<DocsTableRow>;

/**
 * @internal
 */

export function CursorPaginatedDocsTable(props: PaginatedDocsTableProps) {
  const { columns, data, next, prev, options, ...restProps } = props;

  const Pagination = useCallback(
    (propsPagination: {}) => {
      return (
        <MTablePagination
          {...propsPagination}
          page={prev ? 1 : 0}
          count={next ? Number.MAX_VALUE : 0}
          showFirstLastPageButtons={false}
          localization={{ labelDisplayedRows: '' }}
          onPageChange={(_e: MouseEvent, page: number) => {
            if (page > 0) {
              next?.();
            } else {
              prev?.();
            }
          }}
        />
      );
    },
    [prev, next],
  );

  return (
    <Table
      columns={columns}
      data={data}
      options={{
        paginationAlignment: 'flex-end',
        paginationPosition: 'both',
        emptyRowsWhenPaging: false,
        ...options,
        // The following props are configured to force server side pagination
        pageSizeOptions: [],
        pageSize: Number.MAX_SAFE_INTEGER,
        showFirstLastPageButtons: false,
        paging: true,
      }}
      components={{
        Pagination,
      }}
      {...restProps}
    />
  );
}
