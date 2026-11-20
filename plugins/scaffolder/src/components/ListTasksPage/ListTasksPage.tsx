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
  Link,
  Page,
  Progress,
  Table,
} from '@backstage/core-components';
import { useApi, useRouteRef } from '@backstage/core-plugin-api';
import { CatalogFilterLayout } from '@backstage/plugin-catalog-react';
import useAsync from 'react-use/esm/useAsync';
import { useState } from 'react';
import {
  ScaffolderApi,
  scaffolderApiRef,
  ScaffolderTask,
} from '@backstage/plugin-scaffolder-react';
import {
  emptyTaskListFilters,
  TaskListFilterValues,
  TaskListFilters,
} from './TaskListFilters';
import {
  CreatedAtColumn,
  OwnerEntityColumn,
  TaskStatusColumn,
  TemplateTitleColumn,
} from './columns';
import {
  actionsRouteRef,
  editRouteRef,
  rootRouteRef,
  templatingExtensionsRouteRef,
} from '../../routes';
import { ScaffolderPageContextMenu } from '@backstage/plugin-scaffolder-react/alpha';
import { useNavigate } from 'react-router-dom';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { scaffolderTranslationRef } from '../../translation';

export interface MyTaskPageProps {
  initiallySelectedFilter?: 'owned' | 'all';
  contextMenu?: {
    editor?: boolean;
    actions?: boolean;
    create?: boolean;
    templatingExtensions?: boolean;
  };
}

type TaskOrder = NonNullable<
  Parameters<ScaffolderApi['listTasks']>[0]['order']
>;

// Table column index to the task field that the backend can order by
const orderFields: Record<number, TaskOrder[number]['field'] | undefined> = {
  1: 'template_ref',
  2: 'created_at',
  3: 'created_by',
  4: 'status',
};

const startOfDay = (date: string) => new Date(`${date}T00:00:00`);
const endOfDay = (date: string) => new Date(`${date}T23:59:59.999`);

export const ListTaskPageContent = (props: MyTaskPageProps) => {
  const { initiallySelectedFilter = 'owned' } = props;
  const { t } = useTranslationRef(scaffolderTranslationRef);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(0);

  const scaffolderApi = useApi(scaffolderApiRef);
  const rootLink = useRouteRef(rootRouteRef);

  const [ownerFilter, setOwnerFilter] = useState(initiallySelectedFilter);
  const [filters, setFilters] =
    useState<TaskListFilterValues>(emptyTaskListFilters);
  const [order, setOrder] = useState<TaskOrder>();

  const { value, loading, error } = useAsync(() => {
    if (scaffolderApi.listTasks) {
      return scaffolderApi.listTasks?.({
        filterByOwnership: ownerFilter,
        createdBy: filters.createdBy.length ? filters.createdBy : undefined,
        templateRef: filters.templateRef.length
          ? filters.templateRef
          : undefined,
        status: filters.status.length ? filters.status : undefined,
        createdAfter: filters.createdAfter
          ? startOfDay(filters.createdAfter)
          : undefined,
        createdBefore: filters.createdBefore
          ? endOfDay(filters.createdBefore)
          : undefined,
        order,
        limit,
        offset: page * limit,
      });
    }

    // eslint-disable-next-line no-console
    console.warn(
      'listTasks is not implemented in the scaffolderApi, please make sure to implement this method.',
    );

    return Promise.resolve({ tasks: [], totalTasks: 0 });
  }, [scaffolderApi, ownerFilter, filters, order, limit, page]);

  return (
    <CatalogFilterLayout>
      <CatalogFilterLayout.Filters>
        <TaskListFilters
          ownerFilter={ownerFilter}
          onOwnerFilterChange={newOwnerFilter => {
            setPage(0);
            setOwnerFilter(newOwnerFilter);
          }}
          value={filters}
          onChange={newFilters => {
            setPage(0);
            setFilters(newFilters);
          }}
        />
      </CatalogFilterLayout.Filters>
      <CatalogFilterLayout.Content>
        {error && (
          <>
            <ErrorPanel error={error} />
            <EmptyState
              missing="info"
              title={t('listTaskPage.content.emptyState.title')}
              description={t('listTaskPage.content.emptyState.description')}
            />
          </>
        )}
        {!error && loading && <Progress />}
        {!error && !loading && (
          <Table<ScaffolderTask>
            onRowsPerPageChange={pageSize => {
              setPage(0);
              setLimit(pageSize);
            }}
            onPageChange={newPage => setPage(newPage)}
            onOrderChange={(orderBy, orderDirection) => {
              const field = orderFields[orderBy];
              setPage(0);
              setOrder(field ? [{ field, order: orderDirection }] : undefined);
            }}
            options={{
              pageSize: limit,
              pageSizeOptions: [5, 10, 20, 50, 100],
              emptyRowsWhenPaging: false,
            }}
            data={value?.tasks ?? []}
            page={page}
            totalCount={value?.totalTasks ?? 0}
            title={t('listTaskPage.content.tableTitle')}
            columns={[
              {
                title: t('listTaskPage.content.tableCell.taskID'),
                field: 'id',
                sorting: false,
                render: row => (
                  <Link to={`${rootLink()}/tasks/${row.id}`}>{row.id}</Link>
                ),
              },
              {
                title: t('listTaskPage.content.tableCell.template'),
                field: 'spec.templateInfo.entity.metadata.title',
                customSort: () => 0,
                render: row => (
                  <TemplateTitleColumn
                    entityRef={row.spec.templateInfo?.entityRef}
                  />
                ),
              },
              {
                title: t('listTaskPage.content.tableCell.created'),
                field: 'createdAt',
                customSort: () => 0,
                render: row => <CreatedAtColumn createdAt={row.createdAt} />,
              },
              {
                title: t('listTaskPage.content.tableCell.owner'),
                field: 'createdBy',
                customSort: () => 0,
                render: row => (
                  <OwnerEntityColumn entityRef={row.spec?.user?.ref} />
                ),
              },
              {
                title: t('listTaskPage.content.tableCell.status'),
                field: 'status',
                customSort: () => 0,
                render: row => <TaskStatusColumn status={row.status} />,
              },
            ]}
          />
        )}
      </CatalogFilterLayout.Content>
    </CatalogFilterLayout>
  );
};

export const ListTasksPage = (props: MyTaskPageProps) => {
  const navigate = useNavigate();
  const editorLink = useRouteRef(editRouteRef);
  const actionsLink = useRouteRef(actionsRouteRef);
  const createLink = useRouteRef(rootRouteRef);
  const { t } = useTranslationRef(scaffolderTranslationRef);
  const templatingExtensionsLink = useRouteRef(templatingExtensionsRouteRef);

  const scaffolderPageContextMenuProps = {
    onEditorClicked:
      props?.contextMenu?.editor !== false
        ? () => navigate(editorLink())
        : undefined,
    onActionsClicked:
      props?.contextMenu?.actions !== false
        ? () => navigate(actionsLink())
        : undefined,
    onTasksClicked: undefined,
    onCreateClicked:
      props?.contextMenu?.create !== false
        ? () => navigate(createLink())
        : undefined,
    onTemplatingExtensionsClicked:
      props?.contextMenu?.templatingExtensions !== false
        ? () => navigate(templatingExtensionsLink())
        : undefined,
  };
  return (
    <Page themeId="home">
      <Header
        pageTitleOverride={t('listTaskPage.pageTitle')}
        title={t('listTaskPage.title')}
        subtitle={t('listTaskPage.subtitle')}
      >
        <ScaffolderPageContextMenu {...scaffolderPageContextMenuProps} />
      </Header>
      <Content>
        <ListTaskPageContent {...props} />
      </Content>
    </Page>
  );
};
