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
import React, { useContext } from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Grid from '@material-ui/core/Grid';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { V1Job, V1Pod } from '@kubernetes/client-node';
import { PodsTable } from '../Pods';
import { JobDrawer } from './JobsDrawer';
import { getOwnedResources } from '../../utils/owner';
import { GroupedResponsesContext } from '../../hooks';
import {
  StatusError,
  StatusOK,
  StatusPending,
} from '@backstage/core-components';

/**
 *
 *
 * @public
 */
export type JobsAccordionsProps = {
  jobs: V1Job[];
  children?: React.ReactNode;
};

type JobAccordionProps = {
  job: V1Job;
  ownedPods: V1Pod[];
  children?: React.ReactNode;
};

type JobSummaryProps = {
  job: V1Job;
  children?: React.ReactNode;
};

const JobSummary = ({ job }: JobSummaryProps) => {
  return (
    <Grid
      container
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={0}
    >
      <Grid xs={6} item>
        <JobDrawer job={job} />
      </Grid>
      <Grid
        item
        container
        xs={6}
        direction="column"
        justifyContent="flex-start"
        alignItems="flex-end"
        spacing={0}
      >
        <Grid item>
          {job.status?.succeeded && <StatusOK>Succeeded</StatusOK>}
          {job.status?.active && <StatusPending>Running</StatusPending>}
          {job.status?.failed && <StatusError>Failed</StatusError>}
        </Grid>
        <Grid item>Start time: {job.status?.startTime?.toString()}</Grid>
        {job.status?.completionTime && (
          <Grid item>
            Completion time: {job.status.completionTime.toString()}
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

const JobAccordion = ({ job, ownedPods }: JobAccordionProps) => {
  return (
    <Accordion TransitionProps={{ unmountOnExit: true }} variant="outlined">
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <JobSummary job={job} />
      </AccordionSummary>
      <AccordionDetails>
        <PodsTable pods={ownedPods} />
      </AccordionDetails>
    </Accordion>
  );
};

/**
 *
 *
 * @public
 */
export const JobsAccordions = ({ jobs }: JobsAccordionsProps) => {
  const groupedResponses = useContext(GroupedResponsesContext);

  return (
    <Grid
      container
      direction="column"
      justifyContent="flex-start"
      alignItems="flex-start"
    >
      {jobs.map((job, i) => (
        <Grid container item key={i} xs>
          <Grid item xs>
            <JobAccordion
              ownedPods={getOwnedResources(job, groupedResponses.pods)}
              job={job}
            />
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
};
