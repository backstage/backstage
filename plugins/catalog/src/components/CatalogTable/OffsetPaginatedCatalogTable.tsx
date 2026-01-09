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

import { ReactNode } from 'react';
import { useEntityList } from '@backstage/plugin-catalog-react';
import { TableColumn, TableProps } from '@backstage/core-components';
import { CatalogTableRow } from './types';
import { CatalogTableBase } from './CatalogTableBase';

interface OffsetPaginatedCatalogTableProps {
  columns: TableColumn<CatalogTableRow>[];
  data: CatalogTableRow[];
  title?: string;
  subtitle?: string;
  emptyContent?: ReactNode;
  isLoading?: boolean;
  actions?: TableProps<CatalogTableRow>['actions'];
}

/**
 * @internal
 */
export function OffsetPaginatedCatalogTable(
  props: OffsetPaginatedCatalogTableProps,
) {
  const { columns, data, title, subtitle, emptyContent, isLoading, actions } =
    props;
  const { setLimit, setOffset, limit, totalItems, offset } = useEntityList();

  return (
    <CatalogTableBase
      columns={columns}
      data={data}
      title={title}
      subtitle={subtitle}
      emptyContent={emptyContent}
      isLoading={isLoading}
      actions={actions}
      pagination={{
        mode: 'server',
        offset: offset ?? 0,
        limit: limit ?? 10,
        totalItems: totalItems ?? 0,
        onOffsetChange: (newOffset: number) => {
          setOffset!(newOffset);
        },
        onPageSizeChange: (newPageSize: number) => {
          setLimit!(newPageSize);
          setOffset!(0);
        },
      }}
    />
  );
}
