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
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { V1CronJob, V1Job } from '@kubernetes/client-node';
import { JobsAccordions } from '../JobsAccordions';
import { CronJobDrawer } from './CronJobsDrawer';
import { getOwnedResources } from '../../utils/owner';
import { GroupedResponsesContext } from '../../hooks';
import { StatusError, StatusOK } from '@backstage/core-components';
import { humanizeCron } from '../../utils/crons';

/**
 *
 *
 * @public
 */
export type CronJobsAccordionsProps = {
  children?: React.ReactNode;
};

type CronJobAccordionProps = {
  cronJob: V1CronJob;
  ownedJobs: V1Job[];
  children?: React.ReactNode;
};

type CronJobSummaryProps = {
  cronJob: V1CronJob;
  children?: React.ReactNode;
};

const CronJobSummary = ({ cronJob }: CronJobSummaryProps) => {
  return (
    <Grid
      container
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={0}
    >
      <Grid xs={6} item>
        <CronJobDrawer cronJob={cronJob} />
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
          {cronJob.spec?.suspend ? (
            <StatusError>Suspended</StatusError>
          ) : (
            <StatusOK>Active</StatusOK>
          )}
        </Grid>
        <Grid item>
          <Typography variant="body1">
            Schedule:{' '}
            {cronJob.spec?.schedule
              ? `${cronJob.spec.schedule} (${humanizeCron(
                  cronJob.spec.schedule,
                )})`
              : 'N/A'}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

const CronJobAccordion = ({ cronJob, ownedJobs }: CronJobAccordionProps) => {
  return (
    <Accordion TransitionProps={{ unmountOnExit: true }} variant="outlined">
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <CronJobSummary cronJob={cronJob} />
      </AccordionSummary>
      <AccordionDetails>
        <JobsAccordions jobs={ownedJobs.reverse()} />
      </AccordionDetails>
    </Accordion>
  );
};

/**
 *
 *
 * @public
 */
export const CronJobsAccordions = ({}: CronJobsAccordionsProps) => {
  const groupedResponses = useContext(GroupedResponsesContext);

  return (
    <Grid
      container
      direction="column"
      justifyContent="flex-start"
      alignItems="flex-start"
    >
      {groupedResponses.cronJobs.map((cronJob, i) => (
        <Grid container item key={i} xs>
          <Grid item xs>
            <CronJobAccordion
              ownedJobs={getOwnedResources(cronJob, groupedResponses.jobs)}
              cronJob={cronJob}
            />
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
};
