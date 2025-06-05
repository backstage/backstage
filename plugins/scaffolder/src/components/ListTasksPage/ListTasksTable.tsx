/*
 * Copyright 2025 The Backstage Authors
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
import { Link, Table } from '@backstage/core-components';
import { useRouteRef } from '@backstage/core-plugin-api';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { ScaffolderTask } from '@backstage/plugin-scaffolder-react';
import { Dispatch, SetStateAction } from 'react';
import { rootRouteRef } from '../../routes';
import { scaffolderTranslationRef } from '../../translation';
import {
  CreatedAtColumn,
  OwnerEntityColumn,
  TaskStatusColumn,
  TemplateTitleColumn,
} from './columns';

/** @public */
export interface ListTasksTableProps {
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  limit: number;
  setLimit: Dispatch<SetStateAction<number>>;
  tasks?: ScaffolderTask[];
  totalTasks?: number;
}

/** @public */
export function ListTasksTable({
  page,
  setPage,
  limit,
  setLimit,
  tasks,
  totalTasks,
}: Readonly<ListTasksTableProps>) {
  const { t } = useTranslationRef(scaffolderTranslationRef);
  const rootLink = useRouteRef(rootRouteRef);

  return (
    <Table<ScaffolderTask>
      onRowsPerPageChange={pageSize => {
        setPage(0);
        setLimit(pageSize);
      }}
      onPageChange={newPage => setPage(newPage)}
      options={{ pageSize: limit, emptyRowsWhenPaging: false }}
      data={tasks ?? []}
      page={page}
      totalCount={totalTasks ?? 0}
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
          render: row => (
            <TemplateTitleColumn entityRef={row.spec.templateInfo?.entityRef} />
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
          render: row => <OwnerEntityColumn entityRef={row.spec?.user?.ref} />,
        },
        {
          title: t('listTaskPage.content.tableCell.status'),
          field: 'status',
          render: row => <TaskStatusColumn status={row.status} />,
        },
      ]}
    />
  );
}

export default ListTasksTable;
