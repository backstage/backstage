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

import React, { useContext } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Grid from '@mui/material/Unstable_Grid2';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { V1Pod, V1DaemonSet } from '@kubernetes/client-node';
import { PodsTable } from '../Pods';
import { DaemonSetDrawer } from './DaemonSetsDrawer';
import { getOwnedResources } from '../../utils/owner';
import {
  GroupedResponsesContext,
  PodNamesWithErrorsContext,
} from '../../hooks';
import { StatusError, StatusOK } from '@backstage/core-components';
import { READY_COLUMNS, RESOURCE_COLUMNS } from '../Pods/PodsTable';

type DaemonSetsAccordionsProps = {
  children?: React.ReactNode;
};

type DaemonSetAccordionProps = {
  daemonset: V1DaemonSet;
  ownedPods: V1Pod[];
  children?: React.ReactNode;
};

type DaemonSetSummaryProps = {
  daemonset: V1DaemonSet;
  numberOfCurrentPods: number;
  numberOfPodsWithErrors: number;
  children?: React.ReactNode;
};

const DaemonSetSummary = ({
  daemonset,
  numberOfCurrentPods,
  numberOfPodsWithErrors,
}: DaemonSetSummaryProps) => {
  return (
    <Grid
      container
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={0}
    >
      <Grid xs={4}>
        <DaemonSetDrawer daemonset={daemonset} />
      </Grid>
      <Grid
        container
        xs={4}
        direction="column"
        justifyContent="flex-start"
        alignItems="flex-end"
        spacing={0}
      >
        <Grid>
          <StatusOK>{numberOfCurrentPods} pods</StatusOK>
        </Grid>
        <Grid>
          {numberOfPodsWithErrors > 0 ? (
            <StatusError>
              {numberOfPodsWithErrors} pod
              {numberOfPodsWithErrors > 1 ? 's' : ''} with errors
            </StatusError>
          ) : (
            <StatusOK>No pods with errors</StatusOK>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

const DaemonSetAccordion = ({
  daemonset,
  ownedPods,
}: DaemonSetAccordionProps) => {
  const podNamesWithErrors = useContext(PodNamesWithErrorsContext);

  const podsWithErrors = ownedPods.filter(p =>
    podNamesWithErrors.has(p.metadata?.name ?? ''),
  );

  return (
    <Accordion
      slotProps={{ transition: { unmountOnExit: true } }}
      variant="outlined"
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <DaemonSetSummary
          daemonset={daemonset}
          numberOfCurrentPods={ownedPods.length}
          numberOfPodsWithErrors={podsWithErrors.length}
        />
      </AccordionSummary>
      <AccordionDetails>
        <PodsTable
          pods={ownedPods}
          extraColumns={[READY_COLUMNS, RESOURCE_COLUMNS]}
        />
      </AccordionDetails>
    </Accordion>
  );
};

export const DaemonSetsAccordions = ({}: DaemonSetsAccordionsProps) => {
  const groupedResponses = useContext(GroupedResponsesContext);

  return (
    <Grid
      container
      direction="column"
      justifyContent="flex-start"
      alignItems="flex-start"
    >
      {groupedResponses.daemonSets.map((daemonset, i) => (
        <Grid container key={i} xs={12}>
          <Grid xs={12}>
            <DaemonSetAccordion
              ownedPods={getOwnedResources(daemonset, groupedResponses.pods)}
              daemonset={daemonset}
            />
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
};
