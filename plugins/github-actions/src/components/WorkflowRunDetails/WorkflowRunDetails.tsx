import React from 'react';
import { useParams } from 'react-router-dom';
import { useWorkflowRunsDetails } from './useWorkflowRunsDetails';
import { useWorkflowRunJobs } from './useWorkflowRunJobs';
import { useProjectName } from '../useProjectName';
import {
  makeStyles,
  Box,
  TableRow,
  TableCell,
  ListItemText,
  ExpansionPanel,
  ExpansionPanelSummary,
  Typography,
  ExpansionPanelDetails,
  TableContainer,
  Table,
  Paper,
  TableBody,
  LinearProgress,
  Button,
  CircularProgress,
  Theme,
  Link,
} from '@material-ui/core';
import { Jobs, Job, Step } from '../../api';
import moment from 'moment';
import { WorkflowRunStatusIcon } from '../WorkflowRunStatusIcon';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExternalLinkIcon from '@material-ui/icons/Launch';

const JobsList = ({ jobs }: { jobs?: Jobs }) => {
  const classes = useStyles();
  return (
    <Box>
      {jobs &&
        jobs.total_count > 0 &&
        jobs.jobs.map((job: Job) => (
          <JobListItem
            job={job}
            className={
              job.status !== 'success' ? classes.failed : classes.success
            }
          />
        ))}
    </Box>
  );
};

const getElapsedTime = (start: string, end: string) => {
  const diff = moment(moment(end || moment()).diff(moment(start)));
  const timeElapsed = diff.format('m [minutes] s [seconds]');
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
        <WorkflowRunStatusIcon status={step.status.toUpperCase()} />
        {step.status}
      </TableCell>
    </TableRow>
  );
};

const JobListItem = ({ job, className }: { job: Job; className: string }) => {
  const classes = useStyles();
  return (
    <ExpansionPanel
      TransitionProps={{ unmountOnExit: true }}
      className={className}
    >
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`panel-${name}-content`}
        id={`panel-${name}-header`}
        IconButtonProps={{
          className: classes.button,
        }}
      >
        <Typography variant="button">
          {job.name} ({getElapsedTime(job.started_at, job.completed_at)})
        </Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.expansionPanelDetails}>
        <TableContainer>
          <Table>
            {job.steps.map((step: Step) => (
              <StepView step={step} />
            ))}
          </Table>
        </TableContainer>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

const useStyles = makeStyles<Theme>(theme => ({
  root: {
    maxWidth: 720,
    margin: theme.spacing(2),
  },
  title: {
    padding: theme.spacing(1, 0, 2, 0),
  },
  table: {
    padding: theme.spacing(1),
  },
  expansionPanelDetails: {
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

export const useEntity = () => {
  const params = useParams();
  const { kind, optionalNamespaceAndName } = params;
  const [name, namespace] = optionalNamespaceAndName.split(':').reverse();
  return { kind, name, namespace };
};

export const WorkflowRunDetails = () => {
  const { kind, name, namespace } = useEntity();
  const projectName = useProjectName({
    kind,
    name,
    namespace,
  });

  const [owner, repo] = projectName.value ? projectName.value.split('/') : [];
  const details = useWorkflowRunsDetails(repo, owner);
  const jobs = useWorkflowRunJobs(details.value?.jobs_url);

  const classes = useStyles();
  if (projectName.error || (details.error && projectName.value)) {
    return (
      <Typography variant="h6" color="error">
        Failed to load build, {(projectName.error || details.error).message}
      </Typography>
    );
  } else if (projectName.loading || details.loading) {
    return <LinearProgress />;
  } else
    return (
      <div className={classes.root}>
        <TableContainer component={Paper} className={classes.table}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Typography noWrap>Branch</Typography>
                </TableCell>
                <TableCell>{details.value?.head_branch}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography noWrap>Message</Typography>
                </TableCell>
                <TableCell>{details.value?.head_commit.message}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography noWrap>Commit ID</Typography>
                </TableCell>
                <TableCell>{details.value?.head_commit.id}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography noWrap>Status</Typography>
                </TableCell>
                <TableCell>
                  <WorkflowRunStatusIcon status={details.value?.status} />{' '}
                  {details.value?.status.toUpperCase()}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography noWrap>Author</Typography>
                </TableCell>
                <TableCell>{`${details.value?.head_commit.author.name} (${details.value?.head_commit.author.email})`}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography noWrap>Links</Typography>
                </TableCell>
                <TableCell>
                  {details.value?.html_url && (
                    <Link target="_blank" href={details.value.html_url}>
                      Workflow runs on GitHub{' '}
                      <ExternalLinkIcon className={classes.externalLinkIcon} />
                    </Link>
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2}>
                  <Typography noWrap>Jobs</Typography>
                  {jobs.loading ? (
                    <CircularProgress />
                  ) : (
                    <JobsList jobs={jobs.value} />
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
};
