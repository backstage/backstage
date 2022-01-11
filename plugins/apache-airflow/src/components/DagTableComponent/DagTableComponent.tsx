/*
 * Copyright 2021 The Backstage Authors
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
  Progress,
  StatusError,
  StatusOK,
  Table,
  TableColumn,
} from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import IconButton from '@material-ui/core/IconButton';
import Switch from '@material-ui/core/Switch';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser';
import Alert from '@material-ui/lab/Alert';
import React from 'react';
import useAsync from 'react-use/lib/useAsync';
import { apacheAirflowApiRef } from '../../api';
import { Dag } from '../../api/types';
import { ScheduleIntervalLabel } from '../ScheduleIntervalLabel';

type DagTableRow = Dag & {
  id: string;
  dagUrl: string;
};

const columns: TableColumn[] = [
  {
    title: 'Paused',
    field: 'is_paused',
    render: (row: Partial<DagTableRow>) => (
      <Tooltip title="Pause/Unpause DAG">
        <Switch checked={!row.is_paused} disabled />
      </Tooltip>
    ),
    width: '5%',
  },
  {
    title: 'DAG',
    field: 'id',
    render: (row: Partial<DagTableRow>) => (
      <div>
        <Typography variant="subtitle2" gutterBottom noWrap>
          {row.id}
        </Typography>
        <Box display="flex" alignItems="center">
          {row.tags?.map((tag, ix) => (
            <Chip label={tag.name} key={ix} size="small" />
          ))}
        </Box>
      </div>
    ),
    width: '60%',
  },
  {
    title: 'Owner',
    field: 'owners',
    render: (row: Partial<DagTableRow>) => (
      <Box display="flex" alignItems="center">
        {row.owners?.map((owner, ix) => (
          <Chip label={owner} key={ix} size="small" />
        ))}
      </Box>
    ),
    width: '10%',
  },
  {
    title: 'Active',
    render: (row: Partial<DagTableRow>) => (
      <Box display="flex" alignItems="center">
        {row.is_active ? <StatusOK /> : <StatusError />}
        <Typography variant="body2">
          {row.is_active ? 'Active' : 'Inactive'}
        </Typography>
      </Box>
    ),
    width: '10%',
  },
  {
    title: 'Schedule',
    render: (row: Partial<DagTableRow>) => (
      <ScheduleIntervalLabel interval={row.schedule_interval} />
    ),
    width: '10%',
  },
  {
    title: 'Link',
    field: 'dagUrl',
    render: (row: Partial<DagTableRow>) => (
      <a href={row.dagUrl}>
        <IconButton aria-label="details">
          <OpenInBrowserIcon />
        </IconButton>
      </a>
    ),
    width: '5%',
  },
];

type DenseTableProps = {
  dags: Dag[];
};

export const DenseTable = ({ dags }: DenseTableProps) => {
  return (
    <Table
      title="DAGs"
      options={{ pageSize: 5 }}
      columns={columns}
      data={dags}
    />
  );
};

export const DagTableComponent = () => {
  const apiClient = useApi(apacheAirflowApiRef);
  const { value, loading, error } = useAsync(async (): Promise<Dag[]> => {
    return await apiClient.listDags();
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  const data = value?.map(el => ({
    ...el,
    id: el.dag_id, // table records require `id` attribute
    dagUrl: `${apiClient.baseUrl}dag_details?dag_id=${el.dag_id}`, // construct path to DAG using `baseUrl`
  }));

  return <DenseTable dags={data || []} />;
};
