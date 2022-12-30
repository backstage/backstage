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

import React, { useEffect } from 'react';

import { Entity } from '@backstage/catalog-model';
import { readGithubIntegrationConfigs } from '@backstage/integration';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import { Link } from '@backstage/core-components';
import { useEntity } from '@backstage/plugin-catalog-react';
import {
  DrawerContentComponent,
  useDrawer,
} from '@backstage/plugin-interactive-drawers';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  CircularProgress,
  LinearProgress,
  ListItemText,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Theme,
  Typography,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExternalLinkIcon from '@material-ui/icons/Launch';
import { DateTime } from 'luxon';

import { Job, Jobs, Step } from '../../../api';
import { getProjectNameFromEntity } from '../../getProjectNameFromEntity';
import { WorkflowRunStatus } from '../../WorkflowRunStatus';
import { WorkflowRunLogs } from '../../WorkflowRunLogs';
import { useWorkflowRunJobs } from '../../WorkflowRunDetails/useWorkflowRunJobs';
import { useWorkflowRunsDetails } from '../../WorkflowRunDetails/useWorkflowRunsDetails';

const useStyles = makeStyles<Theme>(theme => ({
  root: {},
  title: {
    padding: theme.spacing(1, 0, 2, 0),
  },
  table: {
    padding: theme.spacing(0),
  },
  tableRow: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:nth-of-type(even)': {
      backgroundColor: 'initial',
    },
  },
  accordionDetails: {
    padding: 0,
  },
  button: {
    order: -1,
    marginRight: 0,
    marginLeft: '-20px',
  },
  externalLinkIcon: {
    fontSize: 'inherit',
    verticalAlign: 'bottom',
  },
}));

const getElapsedTime = (start: string | undefined, end: string | undefined) => {
  if (!start || !end) {
    return '';
  }
  const startDate = DateTime.fromISO(start);
  const endDate = end ? DateTime.fromISO(end) : DateTime.now();
  const diff = endDate.diff(startDate);
  const timeElapsed = diff.toFormat(`m 'minutes' s 'seconds'`);
  return timeElapsed;
};

const StepView = ({ step }: { step: Step }) => {
  return (
    <TableRow>
      <TableCell>
        <ListItemText
          primary={step.name}
          secondary={getElapsedTime(step.started_at, step.completed_at)}
        />
      </TableCell>
      <TableCell>
        <WorkflowRunStatus
          status={step.status.toLocaleUpperCase('en-US')}
          conclusion={step.conclusion?.toLocaleUpperCase('en-US')}
        />
      </TableCell>
    </TableRow>
  );
};

const JobListItem = ({
  job,
  className,
  entity,
}: {
  job: Job;
  className: string;
  entity: Entity;
}) => {
  const classes = useStyles();
  return (
    <Accordion TransitionProps={{ unmountOnExit: true }} className={className}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        IconButtonProps={{
          className: classes.button,
        }}
      >
        <Typography variant="button">
          {job.name} ({getElapsedTime(job.started_at, job.completed_at)})
        </Typography>
      </AccordionSummary>
      <AccordionDetails className={classes.accordionDetails}>
        <TableContainer>
          <Table>
            {job.steps?.map(step => (
              <StepView key={step.number} step={step} />
            ))}
          </Table>
        </TableContainer>
      </AccordionDetails>
      {job.status === 'queued' || job.status === 'in_progress' ? (
        <WorkflowRunLogs runId={job.id} inProgress entity={entity} />
      ) : (
        <WorkflowRunLogs runId={job.id} inProgress={false} entity={entity} />
      )}
    </Accordion>
  );
};

const JobsList = ({ jobs, entity }: { jobs?: Jobs; entity: Entity }) => {
  const classes = useStyles();
  return (
    <Box>
      {jobs &&
        jobs.total_count > 0 &&
        jobs.jobs.map(job => (
          <JobListItem
            key={job.id}
            job={job}
            className={
              job.status !== 'success' ? classes.failed : classes.success
            }
            entity={entity}
          />
        ))}
    </Box>
  );
};

export const WorkflowRunDrawer: DrawerContentComponent<{ id: string }> = ({
  params: { id },
}) => {
  const { entity } = useEntity();

  const config = useApi(configApiRef);
  const projectName = getProjectNameFromEntity(entity);

  // TODO: Get github hostname from metadata annotation
  const hostname = readGithubIntegrationConfigs(
    config.getOptionalConfigArray('integrations.github') ?? [],
  )[0].host;
  const [owner, repo] = (projectName && projectName.split('/')) || [];
  const details = useWorkflowRunsDetails({ hostname, owner, repo, id });
  const jobs = useWorkflowRunJobs({ hostname, owner, repo, id });

  const classes = useStyles();

  const { setTitle } = useDrawer();

  useEffect(() => {
    setTitle(`${details.value?.head_commit?.message ?? id}`);
  }, [setTitle, id, details.value?.head_commit?.message]);

  if (details.error && details.error.message) {
    return (
      <Typography variant="h6" color="error">
        Failed to load build, {details.error.message}
      </Typography>
    );
  } else if (details.loading) {
    return <LinearProgress />;
  }
  return (
    <div className={classes.root}>
      <TableContainer className={classes.table}>
        <Table size="small">
          <TableBody>
            <TableRow className={classes.tableRow}>
              <TableCell>
                <Typography noWrap>Branch</Typography>
              </TableCell>
              <TableCell>{details.value?.head_branch}</TableCell>
            </TableRow>
            <TableRow className={classes.tableRow}>
              <TableCell>
                <Typography noWrap>Message</Typography>
              </TableCell>
              <TableCell>{details.value?.head_commit?.message}</TableCell>
            </TableRow>
            <TableRow className={classes.tableRow}>
              <TableCell>
                <Typography noWrap>Commit ID</Typography>
              </TableCell>
              <TableCell>{details.value?.head_commit?.id}</TableCell>
            </TableRow>
            <TableRow className={classes.tableRow}>
              <TableCell>
                <Typography noWrap>Workflow</Typography>
              </TableCell>
              <TableCell>{details.value?.name}</TableCell>
            </TableRow>
            <TableRow className={classes.tableRow}>
              <TableCell>
                <Typography noWrap>Status</Typography>
              </TableCell>
              <TableCell>
                <WorkflowRunStatus
                  status={details.value?.status || undefined}
                  conclusion={details.value?.conclusion || undefined}
                />
              </TableCell>
            </TableRow>
            <TableRow className={classes.tableRow}>
              <TableCell>
                <Typography noWrap>Author</Typography>
              </TableCell>
              <TableCell>{`${details.value?.head_commit?.author?.name} (${details.value?.head_commit?.author?.email})`}</TableCell>
            </TableRow>
            <TableRow className={classes.tableRow}>
              <TableCell>
                <Typography noWrap>Links</Typography>
              </TableCell>
              <TableCell>
                {details.value?.html_url && (
                  <Link to={details.value.html_url}>
                    Workflow runs on GitHub{' '}
                    <ExternalLinkIcon className={classes.externalLinkIcon} />
                  </Link>
                )}
              </TableCell>
            </TableRow>
            <TableRow className={classes.tableRow}>
              <TableCell colSpan={2}>
                <Typography noWrap>Jobs</Typography>
                {jobs.loading ? (
                  <CircularProgress />
                ) : (
                  <JobsList jobs={jobs.value} entity={entity} />
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
