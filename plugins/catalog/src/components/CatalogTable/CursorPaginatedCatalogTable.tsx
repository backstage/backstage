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

import React from 'react';

import { Table, TableProps } from '@backstage/core-components';
import { CatalogTableRow } from './types';
import { CatalogTableToolbar } from './CatalogTableToolbar';

type PaginatedCatalogTableProps = {
  prev?(): void;
  next?(): void;
} & TableProps<CatalogTableRow>;

/**
 * @internal
 */

export function CursorPaginatedCatalogTable(props: PaginatedCatalogTableProps) {
  const { columns, data, next, prev, options, ...restProps } = props;

  return (
    <Table
      columns={columns}
      data={data}
      options={{
        paginationPosition: 'both',
        ...options,
        // These settings are configured to force server side pagination
        pageSizeOptions: [],
        showFirstLastPageButtons: false,
        pageSize: Number.MAX_SAFE_INTEGER,
        emptyRowsWhenPaging: false,
      }}
      onPageChange={page => {
        if (page > 0) {
          next?.();
        } else {
          prev?.();
        }
      }}
      components={{
        Toolbar: CatalogTableToolbar,
      }}
      /* this will enable the prev button accordingly */
      page={prev ? 1 : 0}
      /* this will enable the next button accordingly */
      totalCount={next ? Number.MAX_VALUE : Number.MAX_SAFE_INTEGER}
      localization={{ pagination: { labelDisplayedRows: '' } }}
      {...restProps}
    />
  );
}
