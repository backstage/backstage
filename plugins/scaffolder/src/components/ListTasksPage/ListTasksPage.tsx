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
  Table,
} from '@backstage/core-components';
import { useApi, useRouteRef } from '@backstage/core-plugin-api';
import { CatalogFilterLayout } from '@backstage/plugin-catalog-react';
import useAsync from 'react-use/lib/useAsync';
import React, { useState } from 'react';
import { scaffolderApiRef } from '../../api';
import { rootRouteRef } from '../../routes';
import { ScaffolderTask } from '../../types';
import { OwnerListPicker } from './OwnerListPicker';
import {
  CreatedAtColumn,
  OwnerEntityColumn,
  TaskStatusColumn,
  TemplateTitleColumn,
} from './columns';

export interface MyTaskPageProps {
  initiallySelectedFilter?: 'owned' | 'all';
}

const ListTaskPageContent = (props: MyTaskPageProps) => {
  const { initiallySelectedFilter = 'owned' } = props;

  const scaffolderApi = useApi(scaffolderApiRef);
  const rootLink = useRouteRef(rootRouteRef);

  const [ownerFilter, setOwnerFilter] = useState(initiallySelectedFilter);
  const { value, loading, error } = useAsync(() => {
    if (scaffolderApi.listTasks) {
      return scaffolderApi.listTasks?.({ filterByOwnership: ownerFilter });
    }

    // eslint-disable-next-line no-console
    console.warn(
      'listTasks is not implemented in the scaffolderApi, please make sure to implement this method.',
    );

    return Promise.resolve({ tasks: [] });
  }, [scaffolderApi, ownerFilter]);

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
        <Table<ScaffolderTask>
          data={value?.tasks ?? []}
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
