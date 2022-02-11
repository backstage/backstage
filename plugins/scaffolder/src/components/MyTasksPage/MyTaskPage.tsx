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
  Header,
  Lifecycle,
  Link,
  Page,
  Progress,
} from '@backstage/core-components';
import { useApi, useRouteRef } from '@backstage/core-plugin-api';
import { Grid } from '@material-ui/core';
import React from 'react';
import { scaffolderApiRef } from '../../api';
import useAsync from 'react-use/lib/useAsync';
import MaterialTable, { Column } from '@material-table/core';
import { rootRouteRef } from '../../routes';
import { Duration, Interval, DateTime } from 'luxon';
import humanizeDuration from 'humanize-duration';
import {
  StatusError,
  StatusPending,
  StatusOK,
} from '@backstage/core-components';

const CreatedAtColumn = ({ createdAt }: { createdAt: string }) => {
  const createdAtTime = DateTime.fromISO(createdAt);
  const formatted = Interval.fromDateTimes(createdAtTime, DateTime.local())
    .toDuration()
    .valueOf();

  return <p>{humanizeDuration(formatted, { round: true })} ago</p>;
};

const TemplateTitle = ({ templateName }: { templateName?: string }) => {
  const scaffolder = useApi(scaffolderApiRef);
  const { value, loading, error } = useAsync(
    () =>
      scaffolder.getTemplateParameterSchema({
        kind: 'Template',
        namespace: 'default',
        name: templateName,
      }),
    [scaffolder, templateName],
  );

  if (loading) {
    return null;
  }

  return <p>{value?.title}</p>;
};

const Status = ({ status }) => {
  switch (status) {
    case 'processing':
      return <StatusPending>{status}</StatusPending>;
    case 'completed':
      return <StatusOK>{status}</StatusOK>;
    case 'error':
    default:
      return <StatusError>{status}</StatusError>;
  }
};
export const MyTaskPage = () => {
  const scaffolderApi = useApi(scaffolderApiRef);
  const { value, loading, error } = useAsync(
    () => scaffolderApi.listTasks(),
    [scaffolderApi],
  );

  const rootLink = useRouteRef(rootRouteRef);

  return (
    <Page themeId="home">
      <Header
        pageTitleOverride="My Tasks"
        title={
          <>
            All my tasks <Lifecycle shorthand />
          </>
        }
        subtitle="All tasks that have been started by me"
      />
      <Content>
        {loading ? (
          <Progress />
        ) : (
          <MaterialTable
            data={value!}
            title="My Tasks"
            columns={[
              {
                title: 'Task ID',
                field: 'id',
                render: row => (
                  <Link to={`${rootLink()}/tasks/${row.id}`}>{row.id}</Link>
                ),
              },
              {
                title: 'Name',
                render: row => (
                  <TemplateTitle templateName={row.spec.metadata?.name} />
                ),
              },
              {
                title: 'Created',
                field: 'createdAt',
                render: row => <CreatedAtColumn createdAt={row.createdAt} />,
              },
              {
                title: 'Status',
                field: 'status',
                render: row => <Status status={row.status} />,
              },
            ]}
          />
        )}
      </Content>
    </Page>
  );
};
