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

import { Alert } from '@material-ui/lab';
import React from 'react';
import { Progress } from '@backstage/core-components';
import { useTasks } from '../../../hooks/useTasks';
import { Table, TableColumn } from '@backstage/core-components';
import { TaskInfo } from '@backstage/plugin-devtools-common';
import { IconButton, Tooltip, Typography } from '@material-ui/core';
import { devToolsApiRef } from '../../../api';
import { alertApiRef, useApi } from '@backstage/core-plugin-api';
import RefreshIcon from '@material-ui/icons/Refresh';

const TriggerButton = (props: { task: TaskInfo }) => {
  const { task } = props;
  const api = useApi(devToolsApiRef);
  const alertApi = useApi(alertApiRef);
  const handleClick = () => {
    api
      .triggerTask(task.scheduler, task.id)
      .catch(e => {
        alertApi.post({
          message: (e as Error).message,
          severity: 'error',
          display: 'transient',
        });
      })
      .then(_ => {
        alertApi.post({
          message: `Task ${task.id} was triggered`,
          severity: 'success',
          display: 'transient',
        });
      });
  };

  return (
    <Tooltip title="Trigger task">
      <IconButton aria-label="trigger" onClick={handleClick}>
        <RefreshIcon fontSize="inherit" />
      </IconButton>
    </Tooltip>
  );
};

const columns: TableColumn[] = [
  {
    title: 'Id',
    width: 'auto',
    field: 'id',
    defaultSort: 'asc',
  },
  {
    title: 'Scheduler',
    width: 'auto',
    field: 'scheduler',
  },
  {
    title: 'Scope',
    width: 'auto',
    field: 'scope',
  },
  {
    title: 'Settings',
    width: 'auto',
    render: data => {
      const task = data as TaskInfo;
      return (
        <>
          {Object.keys(task.settings).map(key => {
            return (
              <Typography variant="body2" key={key}>
                {key}: {task.settings[key]}
              </Typography>
            );
          })}
        </>
      );
    },
  },
  {
    title: '',
    width: '40px',
    render: data => <TriggerButton task={data as TaskInfo} />,
  },
];

/** @public */
export const TasksContent = () => {
  const { tasks, loading, error } = useTasks();

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  if (!tasks) {
    return <Alert severity="error">Unable to load task data</Alert>;
  }

  return (
    <Table
      title="Scheduled tasks"
      options={{
        paging: false,
        loadingType: 'linear',
        padding: 'dense',
      }}
      columns={columns}
      data={tasks || []}
    />
  );
};
