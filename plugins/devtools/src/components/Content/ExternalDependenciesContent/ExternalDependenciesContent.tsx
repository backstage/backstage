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

import { useMemo } from 'react';
import {
  Progress,
  StatusError,
  StatusOK,
  StatusWarning,
} from '@backstage/core-components';
import { ExternalDependency } from '@backstage/plugin-devtools-common';
import {
  Alert,
  Box,
  Cell,
  CellText,
  Flex,
  Table,
  Text,
  useTable,
  type ColumnConfig,
  type TableItem,
} from '@backstage/ui';
import { useExternalDependencies } from '../../../hooks';

type ExternalDependencyRow = ExternalDependency & TableItem;

export const getExternalDependencyStatus = (
  result: Partial<ExternalDependency> | undefined,
): React.ReactNode => {
  switch (result?.status) {
    case 'Healthy':
      return (
        <Text as="span">
          <StatusOK /> {result.status}
        </Text>
      );
    case 'Unhealthy':
      return (
        <Text as="span">
          <StatusError /> {result.status}
        </Text>
      );
    default:
      return (
        <Text as="span">
          <StatusWarning /> Unknown
        </Text>
      );
  }
};

const columnConfig: ColumnConfig<ExternalDependencyRow>[] = [
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
      <Cell>
        <Flex direction="column" gap="1">
          {getExternalDependencyStatus(item)}
          {item.error && <Text>{item.error}</Text>}
        </Flex>
      </Cell>
    ),
  },
];

/** @public */
export const ExternalDependenciesContent = () => {
  const { externalDependencies, loading, error } = useExternalDependencies();

  const data = useMemo<ExternalDependencyRow[]>(
    () =>
      (externalDependencies ?? []).map((dep, index) => ({
        ...dep,
        id: dep.name || String(index),
      })),
    [externalDependencies],
  );

  const { tableProps } = useTable({
    mode: 'complete',
    data,
    paginationOptions: {
      pageSize: 20,
      pageSizeOptions: [20, 50, 100],
    },
  });

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert status="danger" description={error.message} />;
  }

  if (!externalDependencies || externalDependencies.length === 0) {
    return (
      <Box p="4">
        <Text>No external dependencies found</Text>
      </Box>
    );
  }

  return <Table columnConfig={columnConfig} {...tableProps} />;
};
