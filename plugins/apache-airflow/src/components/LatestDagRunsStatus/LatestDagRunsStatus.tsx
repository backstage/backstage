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
import React from 'react';
import { apacheAirflowApiRef } from '../../api';
import useAsync from 'react-use/lib/useAsync';
import { DagRun } from '../../api/types/Dags';
import { useApi } from '@backstage/core-plugin-api';
import {
  Box,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  makeStyles,
  Tooltip,
  Typography,
} from '@material-ui/core';
import {
  Link,
  StatusError,
  StatusOK,
  StatusPending,
  StatusRunning,
} from '@backstage/core-components';
import DirectionsRun from '@material-ui/icons/DirectionsRun';
import Check from '@material-ui/icons/Check';
import CalendarToday from '@material-ui/icons/CalendarToday';
import qs from 'qs';
import AccountTree from '@material-ui/icons/AccountTree';

interface LatestDagRunsStatusProps {
  dagId: string;
  limit?: number;
}

const useStyles = makeStyles(() => ({
  noMaxWidth: {
    maxWidth: 'none',
  },
}));

const DagRunTooltip = ({
  dagRun,
  graphUrl,
}: {
  dagRun: DagRun;
  graphUrl: string;
}) => {
  return (
    <List>
      <ListItem>
        <ListItemIcon aria-label="DAG Run ID">
          <DirectionsRun />
        </ListItemIcon>
        <Typography>{dagRun.dag_run_id}</Typography>
      </ListItem>
      <ListItem>
        <ListItemIcon aria-label="DAG Start Date">
          <CalendarToday />
        </ListItemIcon>
        <Typography>{new Date(dagRun.start_date).toLocaleString()}</Typography>
      </ListItem>
      <ListItem>
        <ListItemIcon aria-label="DAG End Date">
          <Check />
        </ListItemIcon>
        <Typography>
          {dagRun.end_date ? new Date(dagRun.end_date).toLocaleString() : '-'}
        </Typography>
      </ListItem>
      <ListItem>
        <Button
          startIcon={<AccountTree />}
          aria-label="Link To Detail"
          color="primary"
          variant="outlined"
        >
          <Link to={graphUrl} color="inherit">
            Graph
          </Link>
        </Button>
      </ListItem>
    </List>
  );
};

export const LatestDagRunsStatus = ({
  dagId,
  limit = 5,
}: LatestDagRunsStatusProps) => {
  const classes = useStyles();
  const apiClient = useApi(apacheAirflowApiRef);
  const { value, loading, error } = useAsync(
    async (): Promise<DagRun[]> => await apiClient.getDagRuns(dagId, { limit }),
    [dagId, limit],
  );

  if (loading) {
    return (
      <Box>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography>Can't get dag runs</Typography>;
  }

  const statusDots: JSX.Element[] | undefined = value?.map(dagRun => {
    function status() {
      switch (dagRun.state) {
        case 'success':
          return <StatusOK />;
        case 'failed':
          return <StatusError />;
        case 'running':
          return <StatusRunning />;
        case 'queued':
          return <StatusPending />;
        default:
          return <Typography>Unrecognized state</Typography>;
      }
    }

    const key = dagRun.dag_id + dagRun.dag_run_id;
    const dagRunParams = {
      dag_id: dagRun.dag_id,
      execution_date: dagRun.logical_date,
    };
    const graphUrl = `${apiClient.baseUrl}graph?${qs.stringify(dagRunParams)}`;
    return (
      <Tooltip
        title={<DagRunTooltip dagRun={dagRun} graphUrl={graphUrl} />}
        key={key}
        classes={{ tooltip: classes.noMaxWidth }}
        interactive
      >
        <Box width="fit-content" component="span">
          {status()}
        </Box>
      </Tooltip>
    );
  });

  return <Box>{statusDots}</Box>;
};
