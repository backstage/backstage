/*
 * Copyright 2022 The Backstage Authors
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
  StatusError,
  StatusOK,
  StatusWarning,
} from '@backstage/core-components';
import { ExternalDependency } from '@backstage/plugin-devtools-common';
/** import Typography from '@material-ui/core/Typography';*/
import {
  Table,
  useTable,
  CellText,
  SearchField,
  Flex,
  Text,
  type ColumnConfig,
} from '@backstage/ui';
import { useExternalDependencies } from '../../../hooks';

type ExternalDependencyRow = ExternalDependency & { id: string };

const getStatusIcon = (result: Partial<ExternalDependency> | undefined) => {
  switch (result?.status) {
    case 'Healthy':
      return <StatusOK />;
    case 'Unhealthy':
      return <StatusError />;
    case undefined:
    default:
      return <StatusWarning />;
  }
};

export const getExternalDependencyStatus = (
  result: Partial<ExternalDependency> | undefined,
): string => {
  switch (result?.status) {
    case 'Healthy':
    case 'Unhealthy':
      return result.status;
    case undefined:
    default:
      return 'Unknown';
  }
};

const columns: ColumnConfig<ExternalDependencyRow>[] = [
  {
    id: 'name',
    label: 'Name',
    isRowHeader: true,
    cell: item => <CellText title={item.name} />,
  },
  {
    id: 'target',
    label: 'Target',
    cell: item => <CellText title={item.target} />,
  },
  {
    id: 'type',
    label: 'Type',
    cell: item => <CellText title={item.type} />,
  },
  {
    id: 'status',
    label: 'Status',
    cell: item => (
      <CellText
        title={getExternalDependencyStatus(item)}
        description={item.error}
        leadingIcon={getStatusIcon(item)}
      />
    ),
  },
];

/** @public */
export const ExternalDependenciesContent = () => {
  const { externalDependencies, loading, error } = useExternalDependencies();
  const { tableProps, search } = useTable({
    mode: 'complete',
    data: (externalDependencies ?? []).map(dep => ({ ...dep, id: dep.name })),
    paginationOptions: { pageSize: 20, pageSizeOptions: [20, 50, 100] },
    searchFn: (data, query) => {
      const q = query.toLowerCase();
      return data.filter(
        item =>
          item.name.toLowerCase().includes(q) ||
          item.target.toLowerCase().includes(q) ||
          item.type.toLowerCase().includes(q) ||
          item.status.toLowerCase().includes(q),
      );
    },
  });

  return (
    <>
      <Flex justify="between" align="center" style={{ marginBottom: 8 }}>
        <Text variant="title-small" as="h3">
          Status
        </Text>
        <SearchField
          aria-label="Search"
          placeholder="Filter"
          style={{ maxWidth: 280 }}
          {...search}
        />
      </Flex>
      <Table
        columnConfig={columns}
        {...tableProps}
        isPending={loading}
        error={error}
        /** emptyState={<Typography>No external dependencies found</Typography>}*/
        emptyState={<Text>No external dependencies found</Text>}
      />
    </>
  );
};
