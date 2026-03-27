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
import {
  Alert,
  Box,
  Card,
  CardBody,
  Cell,
  CellText,
  Flex,
  Table,
  Text,
  useTable,
  type ColumnConfig,
} from '@backstage/ui';
import {
  ExternalDependency,
  ExternalDependencyStatus,
} from '@backstage/plugin-devtools-common';
import { useExternalDependencies } from '../../../hooks';

type ExternalDependencyRow = ExternalDependency & { id: string };

/** @public */
export const getExternalDependencyStatus = (
  result: Partial<ExternalDependency> | undefined,
) => {
  switch (result?.status) {
    case ExternalDependencyStatus.healthy:
      return (
        <Text as="span" color="success">
          <StatusOK /> {result.status}
        </Text>
      );
    case ExternalDependencyStatus.unhealthy:
      return (
        <Text as="span" color="danger">
          <StatusError /> {result.status}
        </Text>
      );
    case undefined:
    default:
      return (
        <Text as="span" color="warning">
          <StatusWarning /> Unknown
        </Text>
      );
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

  const data = useMemo(
    () =>
      externalDependencies?.map((dep, index) => ({
        ...dep,
        id: `${dep.name}-${dep.type}-${dep.target}-${index}`,
      })),
    [externalDependencies],
  );

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert status="danger" icon title={error.message} role="alert" />;
  }

  if (!data || data.length === 0) {
    return (
      <Box p="2">
        <Card>
          <CardBody>
            <Text>No external dependencies found</Text>
          </CardBody>
        </Card>
      </Box>
    );
  }

  return <ExternalDependenciesTable data={data} />;
};

function ExternalDependenciesTable({
  data,
}: {
  data: ExternalDependencyRow[];
}) {
  const { tableProps } = useTable({
    mode: 'complete',
    data,
    paginationOptions: {
      pageSize: 20,
      pageSizeOptions: [20, 50, 100],
    },
  });

  return <Table columnConfig={columns} {...tableProps} />;
}
