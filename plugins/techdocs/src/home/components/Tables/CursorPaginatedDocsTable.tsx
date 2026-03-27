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

import { Table, TableProps } from '@backstage/core-components';
import { DocsTableRow } from './types';

type PaginatedDocsTableProps = {
  prev?(): void;
  next?(): void;
} & TableProps<DocsTableRow>;

/**
 * Cursor-paginated docs table — renders a core Table with disabled internal
 * pagination and adds custom Previous/Next Page buttons whose enabled state
 * is driven by the `prev` and `next` callback props (cursor availability).
 *
 * @internal
 */
export function CursorPaginatedDocsTable(props: PaginatedDocsTableProps) {
  const { actions, columns, data, next, prev, title, isLoading, options } =
    props;

  return (
    <div>
      <Table
        title={isLoading ? '' : title}
        columns={columns}
        data={data}
        options={{
          paging: false,
          pageSize: Number.MAX_SAFE_INTEGER,
          ...options,
        }}
        actions={actions}
        isLoading={isLoading}
      />
      {/* Custom cursor-based pagination controls */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
        }}
      >
        <button
          type="button"
          aria-label="Previous Page"
          disabled={!prev}
          onClick={() => prev?.()}
          style={{ padding: '0.25rem 0.75rem' }}
        >
          Previous
        </button>
        <button
          type="button"
          aria-label="Next Page"
          disabled={!next}
          onClick={() => next?.()}
          style={{ padding: '0.25rem 0.75rem' }}
        >
          Next
        </button>
      </div>
    </div>
  );
}
