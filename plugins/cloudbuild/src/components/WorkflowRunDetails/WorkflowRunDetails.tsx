/*
 * Copyright 2020 Spotify AB
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
import { Entity } from '@backstage/catalog-model';
import { Link } from '@backstage/core';
import {
  Breadcrumbs,
  LinearProgress,
  Link as MaterialLink,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Theme,
  Typography,
} from '@material-ui/core';
import ExternalLinkIcon from '@material-ui/icons/Launch';
import React from 'react';
import { useProjectName } from '../useProjectName';
import { WorkflowRunStatus } from '../WorkflowRunStatus';
import { useWorkflowRunsDetails } from './useWorkflowRunsDetails';

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

// const JobsList = ({ jobs, entity }: { jobs?: Jobs; entity: Entity }) => {
//   const classes = useStyles();
//   return (
//     <Box>
//       {jobs &&
//         jobs.total_count > 0 &&
//         jobs.jobs.map((job: Build) => (
//           <JobListItem
//             job={job}
//             className={
//               job.status !== 'success' ? classes.failed : classes.success
//             }
//             entity={entity}
//           />
//         ))}
//     </Box>
//   );
// };

// const getElapsedTime = (start: string, end: string) => {
//   const diff = moment(moment(end || moment()).diff(moment(start)));
//   const timeElapsed = diff.format('m [minutes] s [seconds]');
//   return timeElapsed;
// };

// const StepView = ({ step }: { step: Step }) => {
//   return (
//     <TableRow>
//       <TableCell>
//         <ListItemText
//           primary={step.name}
//           secondary={getElapsedTime(step.pullTiming.startTime, step.pullTiming.endTime)}
//         />
//       </TableCell>
//       <TableCell>
//         <WorkflowRunStatus status={step.status.toUpperCase()} />
//       </TableCell>
//     </TableRow>
//   );
// };

// const JobListItem = ({
//   job,
//   className,
//   entity,
// }: {
//   job: Build;
//   className: string;
//   entity: Entity;
// }) => {
//   const classes = useStyles();
//   return (
//     <Accordion TransitionProps={{ unmountOnExit: true }} className={className}>
//       <AccordionSummary
//         expandIcon={<ExpandMoreIcon />}
//         aria-controls={`panel-${name}-content`}
//         id={`panel-${name}-header`}
//         IconButtonProps={{
//           className: classes.button,
//         }}
//       >
//         <Typography variant="button">
//           {job.name} ({getElapsedTime(job.startTime, job.finishTime)})
//         </Typography>
//       </AccordionSummary>
//       <AccordionDetails className={classes.accordionDetails}>
//         <TableContainer>
//           <Table>
//             {job.steps.map((step: Step) => (
//               <StepView step={step} />
//             ))}
//           </Table>
//         </TableContainer>
//       </AccordionDetails>
//       {job.status === 'QUEUED' || job.status === 'WORKING' ? (
//         <WorkflowRunLogs runId={job.id} inProgress entity={entity} />
//       ) : (
//         <WorkflowRunLogs runId={job.id} inProgress={false} entity={entity} />
//       )}
//     </Accordion>
//   );
// };

export const WorkflowRunDetails = ({ entity }: { entity: Entity }) => {
  // const projectName = useProjectName(entity);
  const { value: projectName, loading, error } = useProjectName(entity);
  const [projectId] = (projectName ?? '/').split('/');

  // const [projectId] = projectName.value ? projectName.value : [];
  const details = useWorkflowRunsDetails(projectId);
  // const steps = useWorkflowRunJobs(projectId)

  const classes = useStyles();
  if (error) {
    return (
      <Typography variant="h6" color="error">
        Failed to load build, {error.message}
      </Typography>
    );
  } else if (loading) {
    return <LinearProgress />;
  }
  return (
    <div className={classes.root}>
      <Breadcrumbs aria-label="breadcrumb">
        <Link to="..">Workflow runs</Link>
        <Typography>Workflow run details</Typography>
      </Breadcrumbs>
      <TableContainer component={Paper} className={classes.table}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography noWrap>Branch</Typography>
              </TableCell>
              <TableCell>{details.value?.substitutions.BRANCH_NAME}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography noWrap>Message</Typography>
              </TableCell>
              <TableCell>{details.value?.substitutions.REPO_NAME}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography noWrap>Commit ID</Typography>
              </TableCell>
              <TableCell>{details.value?.substitutions.COMMIT_SHA}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography noWrap>Status</Typography>
              </TableCell>
              <TableCell>
                <WorkflowRunStatus status={details.value?.status} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography noWrap>Author</Typography>
              </TableCell>
              <TableCell>{`${details.value?.name}`}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography noWrap>Links</Typography>
              </TableCell>
              <TableCell>
                {details.value?.logUrl && (
                  <MaterialLink target="_blank" href={details.value.logUrl}>
                    Workflow runs on Google{' '}
                    <ExternalLinkIcon className={classes.externalLinkIcon} />
                  </MaterialLink>
                )}
              </TableCell>
            </TableRow>
            {/* <TableRow>
              <TableCell colSpan={2}>
                <Typography noWrap>Jobs</Typography>
                {loading ? (
                  <CircularProgress />
                ) : (
                  <JobsList jobs={steps.value} entity={entity} />
                )}
              </TableCell>
            </TableRow> */}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
