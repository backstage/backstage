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

import React from 'react';
import { Grid, Paper, Typography, makeStyles } from '@material-ui/core';
import { InfoCard, LinkButton } from '@backstage/core-components';
import classNames from 'classnames';
import LaunchIcon from '@material-ui/icons/Launch';
import { Job, Workflow } from '../../../..';
import { useApp } from '@backstage/core-plugin-api';

const useStyles = makeStyles(theme => {
  return {
    item: {
      cursor: 'pointer',
      padding: 10,
      borderBottom: `solid 1px ${theme.palette.border}`,
    },
    cardContent: {
      padding: 0,
    },
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
      '&.selected': {
        paddingLeft: 14,
        '&:after': {
          boxShadow: `inset 8px 0px 0px ${theme.palette.error.main}`,
        },
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
      '&.selected': {
        paddingLeft: 14,
        '&:after': {
          boxShadow: `inset 8px 0px 0px ${theme.palette.info.main}`,
        },
      },
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
      '&.selected': {
        paddingLeft: 14,
        '&:after': {
          boxShadow: `inset 8px 0px 0px ${theme.palette.success.main}`,
        },
      },
    },
  };
});

const pickClassName = (
  classes: ReturnType<typeof useStyles>,
  job: Job = {} as Job,
) => {
  if (job.status === Job.StatusEnum.Failed) {
    return classes.failed;
  }
  if ([Job.StatusEnum.Running, Job.StatusEnum.Queued].includes(job.status)) {
    return classes.running;
  }
  if (job.status === Job.StatusEnum.Success) {
    return classes.success;
  }

  return classes.neutral;
};

type JobsListProps = {
  workflow?: Workflow;
  jobs?: Job[];
  selectedJob?: Job;
  loading: boolean;
  onJobSelect: (job: Job) => void;
};

export const JobsList = ({
  workflow,
  jobs,
  loading,
  selectedJob,
  onJobSelect,
}: JobsListProps) => {
  const classes = useStyles();
  const { Progress } = useApp().getComponents();

  return (
    <InfoCard title="Jobs" cardClassName={classes.cardContent}>
      <Grid container spacing={0}>
        {loading && (
          <Grid item md={12}>
            <Progress />
          </Grid>
        )}
        {jobs &&
          jobs.map(job => (
            <Grid key={job.id} item md={12}>
              <Paper
                onClick={() => onJobSelect(job)}
                className={classNames(
                  classes.item,
                  pickClassName(classes, job),
                  job.id === selectedJob?.id ? 'selected' : '',
                )}
                elevation={0}
                square
              >
                <Typography variant="button">
                  #{job?.job_number} - {job.name}
                </Typography>
                {workflow && job.job_number && (
                  <LinkButton
                    to={`https://app.circleci.com/pipelines/${job.project_slug}/${workflow.pipeline_number}/workflows/${workflow.id}/jobs/${job.job_number}`}
                  >
                    <LaunchIcon />
                  </LinkButton>
                )}
              </Paper>
            </Grid>
          ))}
      </Grid>
    </InfoCard>
  );
};
