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
  type TableColumn,
} from '@backstage/core-components';
import { useApi, useApiHolder, useRouteRef } from '@backstage/core-plugin-api';
import {
  CatalogFilterLayout,
  type EntityPresentationApi,
  entityPresentationApiRef,
  entityPresentationSnapshot,
} from '@backstage/plugin-catalog-react';
import useAsync from 'react-use/esm/useAsync';
import { useState } from 'react';
import {
  scaffolderApiRef,
  ScaffolderTask,
} from '@backstage/plugin-scaffolder-react';
import { OwnerListPicker } from './OwnerListPicker';
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

function getTemplateTitle(
  task: ScaffolderTask,
  entityPresentationApi?: EntityPresentationApi,
): string {
  const templateInfo = task.spec?.templateInfo;
  if (templateInfo?.entity) {
    return entityPresentationSnapshot(
      {
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        kind: 'Template',
        metadata: templateInfo.entity.metadata,
      },
      { defaultKind: 'template' },
      entityPresentationApi,
    ).primaryTitle;
  }
  if (templateInfo?.entityRef) {
    return entityPresentationSnapshot(
      templateInfo.entityRef,
      { defaultKind: 'template' },
      entityPresentationApi,
    ).primaryTitle;
  }
  return '';
}

function getOwnerTitle(
  task: ScaffolderTask,
  entityPresentationApi?: EntityPresentationApi,
): string {
  const user = task.spec?.user;
  if (user?.entity) {
    return entityPresentationSnapshot(
      user.entity,
      { defaultKind: 'user' },
      entityPresentationApi,
    ).primaryTitle;
  }
  if (user?.ref) {
    return entityPresentationSnapshot(
      user.ref,
      { defaultKind: 'user' },
      entityPresentationApi,
    ).primaryTitle;
  }
  return '';
}

function createPresentationColumnHelpers(
  getTitle: (task: ScaffolderTask) => string,
): Pick<TableColumn<ScaffolderTask>, 'customSort' | 'customFilterAndSearch'> {
  return {
    customSort: (row1, row2) =>
      getTitle(row1)
        .toLocaleLowerCase()
        .localeCompare(getTitle(row2).toLocaleLowerCase()),
    customFilterAndSearch: (filter, row) =>
      getTitle(row)
        .toLocaleLowerCase()
        .includes(String(filter).toLocaleLowerCase()),
  };
}

export interface MyTaskPageProps {
  initiallySelectedFilter?: 'owned' | 'all';
  contextMenu?: {
    editor?: boolean;
    actions?: boolean;
    create?: boolean;
    templatingExtensions?: boolean;
  };
}

export const ListTaskPageContent = (props: MyTaskPageProps) => {
  const { initiallySelectedFilter = 'owned' } = props;
  const { t } = useTranslationRef(scaffolderTranslationRef);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(0);

  const scaffolderApi = useApi(scaffolderApiRef);
  const apiHolder = useApiHolder();
  const entityPresentationApi = apiHolder.get(entityPresentationApiRef);
  const rootLink = useRouteRef(rootRouteRef);

  const [ownerFilter, setOwnerFilter] = useState(initiallySelectedFilter);
  const { value, loading, error } = useAsync(() => {
    if (scaffolderApi.listTasks) {
      return scaffolderApi.listTasks?.({
        filterByOwnership: ownerFilter,
        limit,
        offset: page * limit,
      });
    }

    // eslint-disable-next-line no-console
    console.warn(
      'listTasks is not implemented in the scaffolderApi, please make sure to implement this method.',
    );

    return Promise.resolve({ tasks: [], totalTasks: 0 });
  }, [scaffolderApi, ownerFilter, limit, page]);

  if (loading) {
    return <Progress />;
  }

  if (error) {
    return (
      <CatalogFilterLayout>
        <CatalogFilterLayout.Filters>
          <OwnerListPicker
            filter={ownerFilter}
            onSelectOwner={id => setOwnerFilter(id)}
          />
        </CatalogFilterLayout.Filters>
        <CatalogFilterLayout.Content>
          <ErrorPanel error={error} />
          <EmptyState
            missing="info"
            title={t('listTaskPage.content.emptyState.title')}
            description={t('listTaskPage.content.emptyState.description')}
          />
        </CatalogFilterLayout.Content>
      </CatalogFilterLayout>
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
          onRowsPerPageChange={pageSize => {
            setPage(0);
            setLimit(pageSize);
          }}
          onPageChange={newPage => setPage(newPage)}
          options={{ pageSize: limit, emptyRowsWhenPaging: false }}
          data={value?.tasks ?? []}
          page={page}
          totalCount={value?.totalTasks ?? 0}
          title={t('listTaskPage.content.tableTitle')}
          columns={[
            {
              title: t('listTaskPage.content.tableCell.taskID'),
              field: 'id',
              render: row => (
                <Link to={`${rootLink()}/tasks/${row.id}`}>{row.id}</Link>
              ),
            },
            {
              title: t('listTaskPage.content.tableCell.template'),
              field: 'spec.templateInfo.entity.metadata.title',
              ...createPresentationColumnHelpers(row =>
                getTemplateTitle(row, entityPresentationApi),
              ),
              render: row => (
                <TemplateTitleColumn
                  entityRef={row.spec.templateInfo?.entityRef}
                />
              ),
            },
            {
              title: t('listTaskPage.content.tableCell.created'),
              field: 'createdAt',
              render: row => <CreatedAtColumn createdAt={row.createdAt} />,
            },
            {
              title: t('listTaskPage.content.tableCell.owner'),
              field: 'createdBy',
              ...createPresentationColumnHelpers(row =>
                getOwnerTitle(row, entityPresentationApi),
              ),
              render: row => (
                <OwnerEntityColumn entityRef={row.spec?.user?.ref} />
              ),
            },
            {
              title: t('listTaskPage.content.tableCell.status'),
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
