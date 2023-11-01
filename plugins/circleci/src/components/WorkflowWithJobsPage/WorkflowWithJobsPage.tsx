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

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import LaunchIcon from '@material-ui/icons/Launch';
import {
  Breadcrumbs,
  LinkButton,
  InfoCard,
  Progress,
  Link,
} from '@backstage/core-components';
import { useWorkflow } from '../../hooks/useWorkflow';
import { Job, Workflow } from '../..';
import { useWorkflowJobs } from '../../hooks/useWorkflowJobs';
import { BuildWithSteps } from './lib/BuildWithSteps';
import { JobsList } from './lib/JobsList';

const WorkflowName = ({ workflow }: { workflow?: Workflow }) => (
  <Box display="flex" alignItems="center">
    #{workflow?.pipeline_number} - {workflow?.name}
    <LinkButton
      to={`https://app.circleci.com/pipelines/${workflow?.project_slug}/${workflow?.pipeline_number}/workflows/${workflow?.id}`}
    >
      <LaunchIcon />
    </LinkButton>
  </Box>
);

const useStyles = makeStyles(theme => ({
  neutral: {},
  failed: {
    position: 'relative',
    '&:after': {
      pointerEvents: 'none',
      content: '""',
      position: 'absolute',
      top: 0,
      right: 0,
      left: 0,
      bottom: 0,
      boxShadow: `inset 4px 0px 0px ${theme.palette.error.main}`,
    },
  },
  running: {
    position: 'relative',
    '&:after': {
      pointerEvents: 'none',
      content: '""',
      position: 'absolute',
      top: 0,
      right: 0,
      left: 0,
      bottom: 0,
      boxShadow: `inset 4px 0px 0px ${theme.palette.info.main}`,
    },
  },
  cardContent: {
    backgroundColor: theme.palette.background.default,
  },
  success: {
    position: 'relative',
    '&:after': {
      pointerEvents: 'none',
      content: '""',
      position: 'absolute',
      top: 0,
      right: 0,
      left: 0,
      bottom: 0,
      boxShadow: `inset 4px 0px 0px ${theme.palette.success.main}`,
    },
  },
}));

const pickClassName = (
  classes: ReturnType<typeof useStyles>,
  workflow: Workflow = {} as Workflow,
) => {
  if (['running', 'queued'].includes(workflow.status!)) return classes.running;
  if (workflow.status === 'success') return classes.success;

  return classes.neutral;
};

export const WorkflowWithJobsPage = () => {
  const { workflowId = '' } = useParams();
  const classes = useStyles();
  const { loading, workflow } = useWorkflow(workflowId);
  const { loading: jobsLoading, jobs } = useWorkflowJobs(workflowId);
  const [job, setJob] = useState<Job>();

  return (
    <>
      <Box mb={3}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link to="..">All pipelines</Link>
          <Typography>Workflow details</Typography>
        </Breadcrumbs>
      </Box>
      <Grid container spacing={3} direction="column">
        <Grid item>
          <InfoCard
            className={pickClassName(classes, workflow)}
            title={<WorkflowName workflow={workflow} />}
            cardClassName={classes.cardContent}
          >
            {loading ? (
              <Progress />
            ) : (
              <Grid container>
                <Grid item md={3}>
                  <JobsList
                    workflow={workflow}
                    jobs={jobs}
                    loading={jobsLoading}
                    selectedJob={job}
                    onJobSelect={setJob}
                  />
                </Grid>
                <Grid item md={8}>
                  {job?.job_number && (
                    <BuildWithSteps jobNumber={job.job_number} />
                  )}
                </Grid>
              </Grid>
            )}
          </InfoCard>
        </Grid>
      </Grid>
    </>
  );
};
