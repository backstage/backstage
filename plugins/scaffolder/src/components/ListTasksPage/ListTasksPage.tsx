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
  Content,
  EmptyState,
  ErrorPanel,
  Header,
  Lifecycle,
  Link,
  Page,
  Progress,
} from '@backstage/core-components';
import { useApi, useRouteRef } from '@backstage/core-plugin-api';
import {
  CatalogFilterLayout,
  EntityRefLink,
} from '@backstage/plugin-catalog-react';
import useAsync from 'react-use/lib/useAsync';
import MaterialTable from '@material-table/core';
import React, { useState } from 'react';
import { scaffolderApiRef } from '../../api';
import { rootRouteRef } from '../../routes';
import { OwnerListPicker } from './OwnerListPicker';
import { TasksOwnerFilterKind } from '../../types';
import {
  CreatedAtColumn,
  OwnerEntityColumn,
  TaskStatusColumn,
  TemplateTitleColumn,
} from './columns';
import { parseEntityRef } from '@backstage/catalog-model';

export interface MyTaskPageProps {
  initiallySelectedFilter?: TasksOwnerFilterKind;
}

const ListTaskPageContent = (props: MyTaskPageProps) => {
  const { initiallySelectedFilter = 'owned' } = props;

  const scaffolderApi = useApi(scaffolderApiRef);
  const rootLink = useRouteRef(rootRouteRef);

  const [ownerFilter, setOwnerFilter] = useState(initiallySelectedFilter);
  const { value, loading, error } = useAsync(
    () => scaffolderApi.listTasks(ownerFilter),
    [scaffolderApi, ownerFilter],
  );

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
          description="There is no Tasks or there was an issue communicating with backend."
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
        <MaterialTable
          data={value!}
          title="Tasks"
          columns={[
            {
              title: 'Task ID',
              field: 'id',
              render: row => (
                <Link to={`${rootLink()}/tasks/${row.id}`}>{row.id}</Link>
              ),
            },
            {
              title: 'Template',
              render: row => (
                <TemplateTitleColumn
                  entityRef={row.spec.templateInfo?.entityRef}
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

export const ListTasksPage = (props: MyTaskPageProps) => {
  return (
    <Page themeId="home">
      <Header
        pageTitleOverride="Templates Tasks"
        title={
          <>
            List template tasks <Lifecycle shorthand alpha />
          </>
        }
        subtitle="All tasks that have been started"
      />
      <Content>
        <ListTaskPageContent {...props} />
      </Content>
    </Page>
  );
};
