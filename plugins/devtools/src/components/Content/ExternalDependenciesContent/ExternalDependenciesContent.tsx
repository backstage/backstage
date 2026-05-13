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

import { useCallback, useMemo } from 'react';
import {
  Progress,
  StatusError,
  StatusOK,
  StatusWarning,
} from '@backstage/core-components';
import { ExternalDependency } from '@backstage/plugin-devtools-common';
import {
  Box,
  CellText,
  ColumnConfig,
  Flex,
  SearchField,
  SortDescriptor,
  Table,
  Text,
  useTable,
} from '@backstage/ui';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Alert from '@material-ui/lab/Alert';
import { useExternalDependencies } from '../../../hooks';
import styles from './ExternalDependenciesContent.module.css';

export const getExternalDependencyStatus = (
  result: Partial<ExternalDependency> | undefined,
) => {
  switch (result?.status) {
    case 'Healthy':
      return (
        <Typography component="span">
          <StatusOK /> {result.status}
        </Typography>
      );
    case 'Unhealthy':
      return (
        <Typography component="span">
          <StatusError /> {`${result.status}`}
        </Typography>
      );
    case undefined:
    default:
      return (
        <Typography component="span">
          <StatusWarning /> Unknown
        </Typography>
      );
  }
};

interface ExternalDependencyWithId extends ExternalDependency {
  id: string;
}

/** @public */
export const ExternalDependenciesContent = () => {
  const { externalDependencies, loading, error } = useExternalDependencies();

  const dependenciesWithId = useMemo(
    () =>
      (externalDependencies ?? []).map(item => ({
        ...item,
        id: item.name,
      })),
    [externalDependencies],
  );

  const columns = useMemo<ColumnConfig<ExternalDependencyWithId>[]>(
    () => [
      {
        id: 'name',
        label: 'Name',
        width: '25%',
        isSortable: true,
        isRowHeader: true,
        cell: item => <CellText title={item.name} />,
      },
      {
        id: 'target',
        label: 'Target',
        width: '25%',
        isSortable: true,
        cell: item => <CellText title={item.target ?? ''} />,
      },
      {
        id: 'type',
        label: 'Type',
        width: '20%',
        isSortable: true,
        cell: item => <CellText title={item.type ?? ''} />,
      },
      {
        id: 'status',
        label: 'Status',
        cell: item => (
          <Flex direction="column">
            {getExternalDependencyStatus(item)}
            {item.error && <Text>{item.error}</Text>}
          </Flex>
        ),
      },
    ],
    [],
  );

  const searchFn = useCallback(
    (items: ExternalDependencyWithId[], query: string) => {
      const lowerQuery = query.toLowerCase();
      return items.filter(
        item =>
          item.name.toLowerCase().includes(lowerQuery) ||
          (item.target ?? '').toLowerCase().includes(lowerQuery) ||
          (item.type ?? '').toLowerCase().includes(lowerQuery) ||
          (item.status ?? '').toLowerCase().includes(lowerQuery),
      );
    },
    [],
  );

  const sortFn = useCallback(
    (
      items: ExternalDependencyWithId[],
      { column, direction }: SortDescriptor,
    ) => {
      if (column !== 'name' && column !== 'target' && column !== 'type') {
        return items;
      }
      return [...items].sort((a, b) => {
        const aVal = String(a[column] ?? '');
        const bVal = String(b[column] ?? '');
        const cmp = aVal.localeCompare(bVal);
        return direction === 'descending' ? -cmp : cmp;
      });
    },
    [],
  );

  const { tableProps, search } = useTable({
    mode: 'complete',
    data: dependenciesWithId,
    initialSort: { column: 'name', direction: 'ascending' },
    paginationOptions: {
      pageSize: 20,
      pageSizeOptions: [20, 50, 100],
    },
    searchFn,
    sortFn,
  });

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  if (!externalDependencies || externalDependencies.length === 0) {
    return (
      <Box>
        <Paper>
          <Typography>No external dependencies found</Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Flex
      direction="column"
      gap="2"
      p="4"
      bg="neutral"
      className={styles.container}
    >
      <Flex justify="between" align="center">
        <Text variant="title-small" weight="bold" as="h2">
          Status
        </Text>
        <Box maxWidth="288px" width="100%">
          <SearchField
            aria-label="Search"
            placeholder="Search..."
            {...search}
          />
        </Box>
      </Flex>
      <Table
        columnConfig={columns}
        {...tableProps}
        emptyState={
          search.value ? (
            <Text>No results match "{search.value}"</Text>
          ) : (
            <Text>No external dependencies found.</Text>
          )
        }
      />
    </Flex>
  );
};
