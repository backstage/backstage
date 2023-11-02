/*
 * Copyright 2020 The Backstage Authors
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

import React, { Fragment } from 'react';
import {
  Avatar,
  Typography,
  Box,
  IconButton,
  makeStyles,
  Tooltip,
  Grid,
  Button,
} from '@material-ui/core';
import RetryIcon from '@material-ui/icons/Replay';
import LaunchIcon from '@material-ui/icons/Launch';
import { Link as RouterLink } from 'react-router-dom';
import { durationHumanized, relativeTimeTo } from '../../../../util';
import { circleCIWorkflowRouteRef } from '../../../../route-refs';
import {
  StatusError,
  StatusWarning,
  StatusOK,
  StatusPending,
  StatusRunning,
  Link,
} from '@backstage/core-components';
import { useApp, useRouteRef } from '@backstage/core-plugin-api';
import {
  PipelineInfo,
  PipelineTriggerActor,
  PipelineVcs,
  Workflow,
} from '../../../../types';

export type CITablePipelineInfo = PipelineInfo & {
  rerun: (workflowId: string) => void;
};

const NO_WORKFLOW_ID = 'no-workflow';

// Workflow statuses: success, running, not_run, failed, error, failing, on_hold, canceled, unauthorized
const getStatusComponent = (status: string | undefined = '') => {
  switch (status.toLocaleLowerCase('en-US')) {
    case 'on_hold':
      return <StatusPending />;
    case 'running':
      return <StatusRunning />;
    case 'failed':
    case 'error':
      return <StatusError />;
    case 'success':
    case 'created':
      return <StatusOK />;
    case 'canceled':
    default:
      return <StatusWarning />;
  }
};

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
      verticalAlign: 'center',
    },
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  fetchMore: {
    backgroundColor: '#ededed',
    padding: '0 !important',
    '& div': {
      padding: '0 !important',
    },
    '& > *': {
      color: '#343434',
    },
  },
}));

type SourceInfoProps = {
  actor: PipelineTriggerActor;
  vcs?: PipelineVcs;
};

const SourceInfo = ({ actor, vcs }: SourceInfoProps) => {
  const classes = useStyles();

  return (
    <Box display="flex" alignItems="center" className={classes.root}>
      <Tooltip title={actor.login}>
        <Avatar
          alt={actor.login}
          src={actor.avatar_url}
          className={classes.small}
        />
      </Tooltip>
      <Box>
        <Typography variant="button">{vcs?.branch}</Typography>
        <Typography variant="body1">
          {vcs?.target_repository_url && (
            <Link to={`${vcs?.target_repository_url}/commit/${vcs?.revision}`}>
              <strong>{vcs?.revision.slice(0, 7)}</strong>{' '}
              {vcs?.commit?.subject}
            </Link>
          )}
        </Typography>
      </Box>
    </Box>
  );
};

const Loading = () => {
  const { Progress } = useApp().getComponents();
  return (
    <Grid item container>
      <Grid item xs={12}>
        <Progress />
      </Grid>
    </Grid>
  );
};

type CITableProps = {
  projectName: string;
  loading: boolean;
  hasMore: boolean;
  pipelines: PipelineInfo[];
  rerunWorkflow: (workflowId: string) => void;
  onFetchMore: () => void;
};

const PipelineInfoRow = ({
  pipeline,
  rerunWorkflow,
}: {
  pipeline: PipelineInfo;
  rerunWorkflow: (workflowId: string) => void;
  projectName: string;
}) => {
  const routeLink = useRouteRef(circleCIWorkflowRouteRef);

  const workflows: Workflow[] =
    pipeline.workflows.length === 0
      ? [
          {
            id: NO_WORKFLOW_ID,
            status: Workflow.StatusEnum.NotRun,
            name: 'No Workflow',
            created_at: pipeline.created_at,
            stopped_at: '',
            pipeline_id: '',
            project_slug: '',
            started_by: '',
            pipeline_number: 0,
            job_name: '',
            job_id: '',
            workflow_id: '',
            workspace_id: '',
            workflow_name: '',
          },
        ]
      : pipeline.workflows;
  return (
    <Grid key={pipeline.id} container item spacing={2}>
      {workflows.map((workflow, index) => (
        <Fragment key={`${pipeline.id}-${workflow.id}`}>
          <Grid item xs={12} md={1}>
            {index === 0 && (
              <Link
                to={`https://app.circleci.com/pipelines/${pipeline.project_slug}/${pipeline.number}`}
              >
                <Box display="flex" alignItems="center">
                  <LaunchIcon fontSize="small" color="disabled" />
                  <Box mr={1} />
                  {pipeline.number}
                </Box>
              </Link>
            )}
          </Grid>
          <Grid item xs={12} md={2}>
            {workflow.id !== NO_WORKFLOW_ID && (
              <Box display="flex" alignItems="center">
                {getStatusComponent(workflow.status)}
                <Box mr={1} />
                <Typography variant="button">{workflow.status}</Typography>
              </Box>
            )}
          </Grid>
          <Grid item xs={12} md={2}>
            {workflow.id !== NO_WORKFLOW_ID ? (
              <Link
                component={RouterLink}
                to={`${routeLink({
                  workflowId: workflow.id!,
                })}`}
              >
                {workflow.name}
              </Link>
            ) : (
              <Typography variant="body2">No Workflow</Typography>
            )}
          </Grid>
          <Grid item xs={12} md={4}>
            <SourceInfo actor={pipeline.trigger.actor} vcs={pipeline.vcs} />
          </Grid>
          <Grid item xs={12} md={2}>
            {workflow.created_at ? (
              <>
                <Typography variant="body2">
                  run {relativeTimeTo(workflow.created_at)}
                </Typography>
                <Typography variant="body2">
                  {workflow.stopped_at
                    ? `took ${durationHumanized(
                        workflow.created_at,
                        workflow.stopped_at,
                      )}`
                    : ''}
                </Typography>
              </>
            ) : null}
          </Grid>
          <Grid item xs={12} md={1}>
            {workflow.id !== NO_WORKFLOW_ID && (
              <Tooltip title="Rerun workflow">
                <IconButton onClick={() => rerunWorkflow(workflow.id)}>
                  <RetryIcon />
                </IconButton>
              </Tooltip>
            )}
          </Grid>
        </Fragment>
      ))}
    </Grid>
  );
};

export const CITable = ({
  loading,
  pipelines,
  projectName,
  rerunWorkflow,
  onFetchMore,
  hasMore,
}: CITableProps) => {
  const classes = useStyles();

  const FetchMore = () => (
    <Grid item container justifyContent="center" className={classes.fetchMore}>
      <Grid item md={12}>
        <Button fullWidth onClick={onFetchMore}>
          More
        </Button>
      </Grid>
    </Grid>
  );

  return (
    <Grid container spacing={2}>
      <Grid key="header" container item spacing={2}>
        <Grid item xs={12} md={1}>
          Pipeline
        </Grid>
        <Grid item xs={12} md={2}>
          Status
        </Grid>
        <Grid item xs={12} md={2}>
          Workflow
        </Grid>
        <Grid item xs={12} md={4}>
          Branch / Commit
        </Grid>
        <Grid item xs={12} md={2}>
          Start
        </Grid>
        <Grid item xs={12} md={1}>
          Actions
        </Grid>
      </Grid>
      {pipelines.map(pipeline => (
        <PipelineInfoRow
          key={pipeline.id}
          pipeline={pipeline}
          rerunWorkflow={rerunWorkflow}
          projectName={projectName}
        />
      ))}
      {loading && <Loading />}
      {!loading && hasMore && <FetchMore />}
    </Grid>
  );
};
