/*
 * Copyright 2024 The Backstage Authors
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
import React, { forwardRef, useImperativeHandle } from 'react';
import {
  Button,
  CircularProgress,
  Grid,
  LinearProgress,
  Typography,
  makeStyles,
} from '@material-ui/core';
import {
  TableColumn,
  Table,
  StatusOK,
  StatusAborted,
  StatusRunning,
  StatusWarning,
  StatusError,
} from '@backstage/core-components';
import {
  GCP_CLOUDWORKSTATIONS_CONFIG_ANNOTATION,
  useWorkstations,
} from './useWorkstations';
import DeveloperBoardIcon from '@material-ui/icons/DeveloperBoard';
import LaunchIcon from '@material-ui/icons/Launch';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import { Workstation, WorkstationState } from '../api/types';
import { MissingAnnotationEmptyState } from '@backstage/plugin-catalog-react';

const columns: TableColumn[] = [
  {
    field: 'uid',
    hidden: true,
  },
  {
    title: 'name',
    field: 'name',
    highlight: true,
  },
  {
    title: 'status',
    field: 'status',
    highlight: true,
  },
  {
    title: 'actions',
    field: 'action',
  },
];

const useStyles = makeStyles(theme => ({
  value: {
    overflow: 'hidden',
    lineHeight: '24px',
    wordBreak: 'break-word',
  },
  label: {
    color: theme.palette.text.secondary,
    textTransform: 'uppercase',
    fontSize: '10px',
    fontWeight: 'bold',
    letterSpacing: 0.5,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    marginBottom: 2,
  },
}));

const Label = ({ children }: { children: React.ReactNode }) => {
  const classes = useStyles();
  return (
    <Typography variant="h2" className={classes.label}>
      {children}
    </Typography>
  );
};

const Value = ({ children }: { children: React.ReactNode }) => {
  const classes = useStyles();
  return (
    <Typography variant="caption" className={classes.value}>
      {children}
    </Typography>
  );
};

const WorkstationsContent = forwardRef(function Component(
  _,
  ref: React.ForwardedRef<{ refreshWorkstationsData: () => void }>,
) {
  const {
    workstationConfig,
    workstationsData,
    createWorkstation,
    startWorkstation,
    stopWorkstation,
    refreshWorkstationsData,
  } = useWorkstations();

  useImperativeHandle(
    ref,
    () => ({
      refreshWorkstationsData,
    }),
    [refreshWorkstationsData],
  );

  const config = workstationConfig as string;

  const getActionButton = (workstation: Workstation) => {
    const workstationName = workstation.name.split('/').pop() as string;
    const buttons: Record<Partial<WorkstationState>, React.ReactNode> = {
      [WorkstationState.STATE_STARTING]: (
        <Grid container direction="row">
          <Grid item>
            <Button
              size="small"
              disabled
              variant="outlined"
              endIcon={<LaunchIcon />}
            >
              Launch
            </Button>
          </Grid>
          <Grid item>
            <Button
              size="small"
              disabled
              variant="outlined"
              endIcon={<StopIcon />}
            >
              Stop
            </Button>
          </Grid>
        </Grid>
      ),
      [WorkstationState.STATE_RUNNING]: (
        <Grid container direction="row">
          <Grid item>
            <Button
              size="small"
              onClick={() => {
                window.open(
                  `https://80-${workstation.host}`,
                  '_blank',
                  'popup,width=800,height=600',
                );
              }}
              variant="outlined"
              endIcon={<LaunchIcon />}
            >
              Launch
            </Button>
          </Grid>
          <Grid item>
            <Button
              size="small"
              onClick={() => {
                stopWorkstation(config, workstationName);
              }}
              variant="outlined"
              endIcon={<StopIcon />}
            >
              Stop
            </Button>
          </Grid>
        </Grid>
      ),
      [WorkstationState.STATE_STOPPED]: (
        <Button
          size="small"
          onClick={() => {
            startWorkstation(config, workstationName);
          }}
          variant="outlined"
          endIcon={<PlayArrowIcon />}
        >
          Start
        </Button>
      ),
      [WorkstationState.STATE_STOPPING]: <></>,
      [WorkstationState.STATE_UNSPECIFIED]: <></>,
    };

    const actionButton = buttons[WorkstationState[workstation.state]];

    return actionButton;
  };

  const getStatusComponent = (workstation: Workstation) => {
    const statuses = {
      [WorkstationState.STATE_RUNNING]: <StatusRunning />,
      [WorkstationState.STATE_STARTING]: (
        <CircularProgress size="0.8rem" style={{ marginRight: '5px' }} />
      ),
      [WorkstationState.STATE_STOPPED]: <StatusAborted />,
      [WorkstationState.STATE_STOPPING]: <StatusWarning />,
      [WorkstationState.STATE_UNSPECIFIED]: <StatusError />,
    };
    return statuses[WorkstationState[workstation.state]];
  };

  const data =
    workstationsData?.workstations?.map((workstation: Workstation) => ({
      uid: workstation.uid,
      name: workstation.name.split('/').pop(),
      status: (
        <Grid alignItems="center" container direction="row">
          <Grid style={{ marginRight: -15 }} item>
            {getStatusComponent(workstation)}
          </Grid>
          <Grid item>
            <Value>{WorkstationState[workstation.state]}</Value>
          </Grid>
        </Grid>
      ),
      action: getActionButton(workstation),
    })) || [];

  if (!workstationConfig) {
    return (
      <MissingAnnotationEmptyState
        annotation={GCP_CLOUDWORKSTATIONS_CONFIG_ANNOTATION}
      />
    );
  }

  if (
    !workstationsData ||
    !workstationsData.configDetails ||
    workstationsData.configDetails.error
  ) {
    return (
      <Grid container direction="column">
        <LinearProgress />
      </Grid>
    );
  }

  return !workstationConfig ? (
    <MissingAnnotationEmptyState
      annotation={GCP_CLOUDWORKSTATIONS_CONFIG_ANNOTATION}
    />
  ) : (
    <>
      <Grid container direction="column">
        <Grid item>
          <Typography variant="h6">Workstation Config</Typography>
        </Grid>
        <Grid item>
          <Grid container direction="column">
            <Grid item>
              <Label>Name</Label>
              <Value>{workstationsData.configDetails.name}</Value>
            </Grid>
            <Grid item>
              <Label>Status</Label>
              <Grid alignItems="center" container direction="row">
                <Grid item>
                  <StatusOK />
                  <Value>Ready</Value>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Label>RUNTIME CONFIGURATION</Label>
              <Value>{workstationsData.configDetails.container.image}</Value>
            </Grid>
          </Grid>
          <Grid item>
            <Grid item>
              <Label>MACHINE TYPE</Label>
              <Value>
                {workstationsData.configDetails.host.gceInstance.machineType}
              </Value>
            </Grid>
            <Grid item>
              <Label>STORAGE</Label>
              {workstationsData.configDetails.persistentDirectories.map(
                (directory, index: number) => {
                  return (
                    <Value key={index}>
                      {directory.gcePd.diskType} {directory.gcePd.sizeGb} GB{' '}
                      {directory.gcePd.fsType}
                    </Value>
                  );
                },
              )}
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Button
            size="large"
            onClick={() => {
              createWorkstation(config);
            }}
            variant="outlined"
            endIcon={<DeveloperBoardIcon />}
          >
            Create Workstation
          </Button>
        </Grid>
        <Grid item>
          <Table
            title={
              <div>
                <Typography variant="h6">Workstations</Typography>
              </div>
            }
            options={{
              padding: 'dense',
              emptyRowsWhenPaging: false,
              loadingType: 'linear',
              pageSize: 5,
              pageSizeOptions: [5, 10],
              paging: true,
            }}
            data={data}
            columns={columns}
          />
        </Grid>
      </Grid>
    </>
  );
});

export { WorkstationsContent };
