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
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import RetryIcon from '@material-ui/icons/Replay';
import { Chip, Divider, IconButton, Tooltip } from '@material-ui/core';
import {
  useDrawerButton,
  useInteractiveRouteRef,
} from '@backstage/plugin-interactive-drawers';
import { Link } from '@backstage/core-components';

import { WorkflowRun } from '../../useWorkflowRuns';
import { WorkflowRunStatus } from '../../WorkflowRunStatus';
import { buildRouteRef } from '../../../routes';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(1),
      marginBottom: theme.spacing(2),
      flexGrow: 1,
    },
    paper: {
      backgroundColor: 'initial',
      padding: theme.spacing(2),
      margin: 'auto',
      maxWidth: 500,
    },
    text: {
      display: 'inline-block',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      width: '100%',
    },
  }),
);

/**
 * @internal
 */
export interface RunProps {
  run: WorkflowRun;
  path: string;
}

export default function Run({ run }: RunProps) {
  const classes = useStyles();

  const routeLink = useInteractiveRouteRef(buildRouteRef);
  const linkToBuild = routeLink({ id: run.id! });

  const { DrawerButton } = useDrawerButton(linkToBuild);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Grid container alignItems="flex-start" spacing={2}>
          <Grid item xs={8}>
            <WorkflowRunStatus
              status={run.status}
              conclusion={run.conclusion}
            />
            <Divider />
            <Tooltip title={`Workflow: ${run.workflowName}`}>
              <Typography className={classes.text} variant="body2" gutterBottom>
                Workflow: {run.workflowName}
              </Typography>
            </Tooltip>
            <Divider />
            <Link
              className={classes.text}
              component={RouterLink}
              to={linkToBuild}
            >
              {run.message}
            </Link>
            <Divider />
            <Tooltip title={`ID: ${run.id}`}>
              <Typography variant="body2" color="textSecondary">
                ID: {run.id}
              </Typography>
            </Tooltip>
          </Grid>
          <Grid item xs={4} sm container alignItems="stretch">
            <Grid
              item
              xs
              container
              alignItems="flex-end"
              direction="column"
              spacing={2}
            >
              <Grid item xs container alignItems="flex-start">
                <Grid item xs={6}>
                  <Tooltip title="Rerun workflow">
                    <IconButton onClick={run.onReRunClick}>
                      <RetryIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
                <Grid item xs={6}>
                  <Tooltip title="Show run">
                    <DrawerButton />
                  </Tooltip>
                </Grid>
              </Grid>
              <Grid item xs>
                <Tooltip title={`Hash: ${run.source?.commit.hash ?? ''}`}>
                  <Typography
                    className={classes.text}
                    variant="body2"
                    gutterBottom
                  >
                    <Chip label={run.source?.commit.hash?.slice(0, 8)} />
                  </Typography>
                </Tooltip>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}
