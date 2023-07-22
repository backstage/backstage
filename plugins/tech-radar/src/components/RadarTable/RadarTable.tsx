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
import {
  EmptyState,
  LinkButton,
  Table,
  TableColumn,
  TableOptions,
  TableProps,
} from '@backstage/core-components';
import { columnFactories } from './columns';
import { RadarEntryTableRow } from './types';
import { Entry } from '../../utils/types';
/**
 * Props for {@link DocsTable}.
 *
 * @public
 */
export type RadarEntryTableProps = {
  entries: Entry[] | undefined;
  title?: string | undefined;
  loading?: boolean | undefined;
  columns?: TableColumn<RadarEntryTableRow>[];
  actions?: TableProps<RadarEntryTableRow>['actions'];
  options?: TableOptions<RadarEntryTableRow>;
};

/**
 * Component which renders a table of radar entries.
 *
 * @public
 */
const RadarEntryTable = ({
  loading,
  entries,
  options,
  columns,
  title,
}: RadarEntryTableProps) => {
  const defaultColumns: TableColumn<RadarEntryTableRow>[] = [
    columnFactories.createTitleColumn(),
    columnFactories.createQuadrantColumn(),
    columnFactories.createRingColumn(),
    columnFactories.createMovedColumn(),
  ];
  if (!entries) return null;

  const rows = entries;

  return (
    <>
      {loading || (rows && rows.length > 0) ? (
        <Table<RadarEntryTableRow>
          isLoading={loading}
          options={{
            paging: true,
            pageSize: 20,
            search: true,
            actionsColumnIndex: -1,
            ...options,
          }}
          data={rows}
          columns={columns || defaultColumns}
          title={title ? `${title} (${rows.length})` : `All (${rows.length})`}
        />
      ) : (
        <EmptyState
          missing="data"
          title="No elements to show"
          description="Create your own tech radar. Check out the documentation to get started."
          action={
            <LinkButton
              color="primary"
              to="https://github.com/backstage/backstage/tree/master/plugins/tech-radar"
              variant="contained"
            >
              DOCS
            </LinkButton>
          }
        />
      )}
    </>
  );
};
RadarEntryTable.columns = columnFactories;

export default RadarEntryTable;
