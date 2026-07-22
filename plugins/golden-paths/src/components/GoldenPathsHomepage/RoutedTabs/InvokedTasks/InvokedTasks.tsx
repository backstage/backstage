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
  EmptyState,
  ErrorPanel,
  Link,
  Progress,
  Table,
} from '@backstage/core-components';
import { useApi, useRouteRef } from '@backstage/core-plugin-api';
import { CatalogFilterLayout } from '@backstage/plugin-catalog-react';
import useAsync from 'react-use/esm/useAsync';
import { useState } from 'react';
import {
  goldenPathsApiRef,
  GoldenPathTask,
} from '@backstage/plugin-golden-paths-react';
import { OwnerListPicker } from './OwnerListPicker';
import {
  CreatedAtColumn,
  OwnerEntityColumn,
  TaskStatusColumn,
  GoldenPathTitleColumn,
} from './columns';
import { rootRouteRef } from '@backstage/plugin-golden-paths-react';

export interface InvokedTasksProps {
  initiallySelectedFilter?: 'owned' | 'all';
}

const InvokedTasksContent = (props: InvokedTasksProps) => {
  const { initiallySelectedFilter = 'owned' } = props;
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const goldenPathsApi = useApi(goldenPathsApiRef);
  const rootLink = useRouteRef(rootRouteRef);

  const [ownerFilter, setOwnerFilter] = useState(initiallySelectedFilter);
  const { value, loading, error } = useAsync(() => {
    return goldenPathsApi.listTasks({
      filterByOwnership: ownerFilter,
      limit,
      offset: page * limit,
    });
  }, [goldenPathsApi, ownerFilter, limit, page]);

  if (loading) {
    return <Progress />;
  }

  if (error) {
    return (
      <>
        <ErrorPanel error={error} />
        <EmptyState
          missing="info"
          title="No information to display"
          description="There are no tasks or there was an issue communicating with backend."
        />
      </>
    );
  }

  return (
    <CatalogFilterLayout>
      <CatalogFilterLayout.Filters>
        <OwnerListPicker
          filter={ownerFilter}
          onSelectOwner={id => setOwnerFilter(id)}
        />
      </CatalogFilterLayout.Filters>
      <CatalogFilterLayout.Content>
        <Table<GoldenPathTask>
          onRowsPerPageChange={pageSize => {
            setPage(0);
            setLimit(pageSize);
          }}
          onPageChange={newPage => setPage(newPage)}
          options={{
            pageSize: limit,
            emptyRowsWhenPaging: false,
            pageSizeOptions: [10, 20],
          }}
          data={value?.tasks ?? []}
          page={page}
          totalCount={value?.totalTasks ?? 0}
          title="Invoked Golden Paths"
          subtitle="All Golden Paths that have been started"
          columns={[
            {
              title: 'Task ID',
              field: 'id',
              render: row => (
                <Link to={`${rootLink()}/tasks/${row.id}`}>{row.id}</Link>
              ),
            },
            {
              title: 'Golden Path',
              field: 'spec.goldenPathInfo.entity.metadata.title',
              render: row => (
                <GoldenPathTitleColumn
                  entityRef={row.spec.goldenPathInfo?.entityRef}
                />
              ),
            },
            {
              title: 'Created',
              field: 'createdAt',
              render: row => <CreatedAtColumn createdAt={row.createdAt} />,
            },
            {
              title: 'Owner',
              field: 'createdBy',
              render: row => (
                <OwnerEntityColumn entityRef={row.spec?.user?.ref} />
              ),
            },
            {
              title: 'Status',
              field: 'status',
              render: row => <TaskStatusColumn status={row.status} />,
            },
          ]}
        />
      </CatalogFilterLayout.Content>
    </CatalogFilterLayout>
  );
};

export const InvokedTasks = (props: InvokedTasksProps) => (
  <InvokedTasksContent {...props} />
);
