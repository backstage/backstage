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
  WarningPanel,
} from '@backstage/core-components';
import { storageApiRef, useApi } from '@backstage/core-plugin-api';
import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import IconButton from '@material-ui/core/IconButton';
import Switch from '@material-ui/core/Switch';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser';
import Alert from '@material-ui/lab/Alert';
import React, { useEffect, useState } from 'react';
import useAsync from 'react-use/lib/useAsync';
import { apacheAirflowApiRef } from '../../api';
import { Dag } from '../../api/types';
import { ScheduleIntervalLabel } from '../ScheduleIntervalLabel';
import { LatestDagRunsStatus } from '../LatestDagRunsStatus';

type DagTableRow = Dag & {
  id: string;
  dagUrl: string;
};

type DenseTableProps = {
  dags: Dag[];
  rowClick: Function;
};

export const DenseTable = ({ dags, rowClick }: DenseTableProps) => {
  const storage = useApi(storageApiRef);
  const hiddenColumnsKey = 'dag-table-hidden-columns';
  const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);

  useEffect(() => {
    const hiddenState = storage.snapshot(hiddenColumnsKey);
    if (hiddenState.presence === 'present') {
      setHiddenColumns(hiddenState.value as string[]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns: TableColumn[] = [
    {
      title: 'Paused',
      field: 'is_paused',
      render: (row: Partial<DagTableRow>) => (
        <Tooltip title="Pause/Unpause DAG">
          <Switch checked={!row.is_paused} />
        </Tooltip>
      ),
      width: '5%',
      hidden: hiddenColumns.some(field => field === 'is_paused'),
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
      width: '50%',
      disableClick: true,
      hidden: hiddenColumns.some(field => field === 'id'),
    },
    {
      title: 'Runs',
      field: 'runs',
      render: (row: Partial<DagTableRow>) => (
        <LatestDagRunsStatus dagId={row.dag_id || ''} />
      ),
      width: '10%',
      disableClick: true,
      hidden: hiddenColumns.some(field => field === 'runs'),
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
      disableClick: true,
      hidden: hiddenColumns.some(field => field === 'owners'),
    },
    {
      title: 'Active',
      field: 'active',
      render: (row: Partial<DagTableRow>) => (
        <Box display="flex" alignItems="center">
          {row.is_active ? <StatusOK /> : <StatusError />}
          <Typography variant="body2">
            {row.is_active ? 'Active' : 'Inactive'}
          </Typography>
        </Box>
      ),
      width: '10%',
      disableClick: true,
      hidden: hiddenColumns.some(field => field === 'active'),
    },
    {
      title: 'Schedule',
      field: 'schedule',
      render: (row: Partial<DagTableRow>) => (
        <ScheduleIntervalLabel interval={row.schedule_interval} />
      ),
      width: '10%',
      disableClick: true,
      hidden: hiddenColumns.some(field => field === 'schedule'),
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
      disableClick: true,
      hidden: hiddenColumns.some(field => field === 'dagUrl'),
    },
  ];

  return (
    <Table
      title="DAGs"
      options={{ pageSize: 5, columnsButton: true }}
      columns={columns}
      data={dags}
      onRowClick={(_event, rowData) => rowClick(rowData)}
      onChangeColumnHidden={(column, hidden) => {
        if (column.field) {
          let newHiddenColumns: string[];
          if (hidden) {
            newHiddenColumns = hiddenColumns.concat(column.field);
          } else {
            newHiddenColumns = hiddenColumns.filter(v => v !== column.field);
          }
          setHiddenColumns(newHiddenColumns);
          storage.set(hiddenColumnsKey, newHiddenColumns);
        }
      }}
    />
  );
};

type DagTableComponentProps = {
  dagIds?: string[];
};

export const DagTableComponent = (props: DagTableComponentProps) => {
  const { dagIds } = props;
  const [dagsData, setDagsData] = useState<DagTableRow[]>([]);
  const apiClient = useApi(apacheAirflowApiRef);

  const updatePaused = async (rowData: Dag): Promise<Dag> => {
    const newDag = await apiClient.updateDag(
      rowData.dag_id,
      !rowData.is_paused,
    );

    const newDags = dagsData.map(el => {
      if (el.dag_id === newDag.dag_id) {
        return { ...el, is_paused: newDag.is_paused };
      }
      return el;
    });

    setDagsData(newDags);
    return newDag;
  };

  const { value, loading, error } = useAsync(async (): Promise<
    DagTableRow[]
  > => {
    let dags: Dag[] = [];
    if (dagIds) {
      dags = (await apiClient.getDags(dagIds)).dags;
    } else {
      dags = await apiClient.listDags();
    }
    return dags.map(el => ({
      ...el,
      id: el.dag_id, // table records require `id` attribute
      dagUrl: `${apiClient.baseUrl}dag_details?dag_id=${el.dag_id}`, // construct path to DAG using `baseUrl`
    }));
  }, []);

  useEffect(() => {
    if (value) {
      setDagsData(value);
    }
  }, [value]);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  const dagsNotFound =
    dagIds && value
      ? dagIds.filter(id => !value.find(d => d.dag_id === id))
      : [];
  return (
    <>
      {dagsNotFound.length ? (
        <WarningPanel title={`${dagsNotFound.length} DAGs were not found`}>
          {dagsNotFound.map(dagId => (
            <Typography key={dagId}>{dagId}</Typography>
          ))}
        </WarningPanel>
      ) : (
        ''
      )}
      <DenseTable dags={dagsData} rowClick={updatePaused} />
    </>
  );
};
