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
  ColumnConfig,
  Flex,
  Table,
  Text,
  useTable,
} from '@backstage/ui';
import { useMemo } from 'react';
import { useExternalDependencies } from '../../../hooks';

export const getExternalDependencyStatus = (
  result: Partial<ExternalDependency> | undefined,
) => {
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
          <StatusError /> {`${result.status}`}
        </Text>
      );
    case undefined:
    default:
      return (
        <Text as="span">
          <StatusWarning /> Unknown
        </Text>
      );
  }
};

type ExternalDependencyRow = ExternalDependency & { id: string };

/** @public */
export const ExternalDependenciesContent = () => {
  const { externalDependencies, loading, error } = useExternalDependencies();

  const rows = useMemo<ExternalDependencyRow[]>(
    () =>
      (externalDependencies ?? []).map(dependency => ({
        ...dependency,
        id: dependency.name,
      })),
    [externalDependencies],
  );

  const { tableProps } = useTable({
    mode: 'complete',
    data: rows,
    paginationOptions: {
      type: 'page',
      pageSize: 20,
      pageSizeOptions: [20, 50, 100],
    },
  });

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
        <Cell>
          <Flex direction="column" gap="0.5">
            <Text as="span">{getExternalDependencyStatus(item)}</Text>
            {item.error && <Text as="span">{item.error}</Text>}
          </Flex>
        </Cell>
      ),
    },
  ];

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert status="danger" description={error.message} />;
  }

  if (!externalDependencies || externalDependencies.length === 0) {
    return (
      <Box p="4">
        <Text as="p">No external dependencies found</Text>
      </Box>
    );
  }

  return (
    <Table
      columnConfig={columns}
      {...tableProps}
      emptyState={<Text as="p">No external dependencies found</Text>}
    />
  );
};
