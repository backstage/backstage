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

import { PackageDependency } from '@backstage/plugin-devtools-common';
import {
  Card,
  CardBody,
  CardHeader,
  CellText,
  ColumnConfig,
  SearchField,
  Table,
  Text,
  useTable,
} from '@backstage/ui';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(1),
      borderRadius: theme.shape.borderRadius,
      boxShadow: theme.shadows[1],
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    searchField: {
      width: theme.spacing(36),
      maxWidth: theme.spacing(36),
    },
  }),
);

export const InfoDependenciesTable = ({
  infoDependencies,
}: {
  infoDependencies: PackageDependency[] | undefined;
}) => {
  const classes = useStyles();
  const columns: ColumnConfig<PackageDependency>[] = [
    {
      id: 'name',
      label: 'Name',
      width: '70%',
      isSortable: true,
      isRowHeader: true,
      cell: item => <CellText title={item.name} />,
    },
    {
      id: 'versions',
      label: 'Versions',
      isSortable: true,
      isRowHeader: true,
      cell: item => <CellText title={item.versions} />,
    },
  ];

  const { tableProps, search } = useTable({
    mode: 'complete',
    data: infoDependencies || [],
    initialSort: { column: 'name', direction: 'ascending' },
    paginationOptions: {
      pageSize: 10,
      pageSizeOptions: [10, 25, 50, 100],
    },
    searchFn: (items, query) => {
      const lowerQuery = query.toLowerCase();
      return items.filter(
        item =>
          item.name.toLowerCase().includes(lowerQuery) ||
          item.versions.toLowerCase().includes(lowerQuery),
      );
    },
    sortFn: (items, { column, direction }) => {
      if (column !== 'name' && column !== 'versions') {
        return items;
      }
      return [...items].sort((a, b) => {
        const aVal = String(a[column]);
        const bVal = String(b[column]);
        const cmp = aVal.localeCompare(bVal);
        return direction === 'descending' ? -cmp : cmp;
      });
    },
  });

  return (
    <Card className={classes.container}>
      <CardHeader className={classes.header}>
        <Text variant="title-small" weight="bold" as="h2">
          Package Dependencies
        </Text>
        <SearchField
          className={classes.searchField}
          aria-label="Search"
          placeholder="Search..."
          {...search}
        />
      </CardHeader>
      <CardBody>
        <Table
          columnConfig={columns}
          {...tableProps}
          emptyState={
            search.value ? (
              <Text>No results match "{search.value}"</Text>
            ) : (
              <Text>No records to display.</Text>
            )
          }
        />
      </CardBody>
    </Card>
  );
};
