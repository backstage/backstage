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
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  V1Deployment,
  V1Pod,
  V2HorizontalPodAutoscaler,
} from '@kubernetes/client-node';
import { PodsTable } from '../Pods';
import { DeploymentDrawer } from './DeploymentDrawer';
import { HorizontalPodAutoscalerDrawer } from '../HorizontalPodAutoscalers';
import {
  getOwnedPodsThroughReplicaSets,
  getMatchingHpa,
} from '../../utils/owner';
import {
  GroupedResponsesContext,
  PodNamesWithErrorsContext,
} from '../../hooks';
import { StatusError, StatusOK } from '@backstage/core-components';
import { READY_COLUMNS, RESOURCE_COLUMNS } from '../Pods/PodsTable';

type DeploymentsAccordionsProps = {
  children?: React.ReactNode;
};

type DeploymentAccordionProps = {
  deployment: V1Deployment;
  ownedPods: V1Pod[];
  matchingHpa?: V2HorizontalPodAutoscaler;
  children?: React.ReactNode;
};

type DeploymentSummaryProps = {
  deployment: V1Deployment;
  numberOfCurrentPods: number;
  numberOfPodsWithErrors: number;
  hpa?: V2HorizontalPodAutoscaler;
  children?: React.ReactNode;
};

const DeploymentSummary = ({
  deployment,
  numberOfCurrentPods,
  numberOfPodsWithErrors,
  hpa,
}: DeploymentSummaryProps) => {
  const specCpuUtil = hpa?.spec?.metrics?.find(
    metric => metric.type === 'Resource' && metric.resource?.name === 'cpu',
  )?.resource?.target.averageUtilization;

  const cpuUtil = hpa?.status?.currentMetrics?.find(
    metric => metric.type === 'Resource' && metric.resource?.name === 'cpu',
  )?.resource?.current.averageUtilization;

  return (
    <Grid
      container
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={2}
      xs={12}
    >
      <Grid xs={4}>
        <DeploymentDrawer deployment={deployment} />
      </Grid>
      {hpa && (
        <Grid xs={4}>
          <HorizontalPodAutoscalerDrawer hpa={hpa}>
            <Grid
              container
              direction="column"
              justifyContent="flex-start"
              alignItems="flex-start"
              spacing={0}
            >
              <Grid>
                <Typography variant="subtitle2">
                  min replicas {hpa.spec?.minReplicas ?? '?'} / max replicas{' '}
                  {hpa.spec?.maxReplicas ?? '?'}
                </Typography>
              </Grid>
              <Grid>
                <Typography variant="subtitle2">
                  current CPU usage: {cpuUtil ?? '?'}%
                </Typography>
              </Grid>
              <Grid>
                <Typography variant="subtitle2">
                  target CPU usage: {specCpuUtil ?? '?'}%
                </Typography>
              </Grid>
            </Grid>
          </HorizontalPodAutoscalerDrawer>
        </Grid>
      )}
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

const DeploymentAccordion = ({
  deployment,
  ownedPods,
  matchingHpa,
}: DeploymentAccordionProps) => {
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
        <DeploymentSummary
          deployment={deployment}
          numberOfCurrentPods={ownedPods.length}
          numberOfPodsWithErrors={podsWithErrors.length}
          hpa={matchingHpa}
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

export const DeploymentsAccordions = ({}: DeploymentsAccordionsProps) => {
  const groupedResponses = useContext(GroupedResponsesContext);

  return (
    <Grid
      container
      direction="column"
      justifyContent="flex-start"
      alignItems="flex-start"
      xs={12}
      rowSpacing={2}
    >
      {groupedResponses.deployments.map((deployment, i) => (
        <Grid container key={i} xs={12}>
          <Grid xs={12}>
            <DeploymentAccordion
              matchingHpa={getMatchingHpa(
                {
                  name: deployment.metadata?.name,
                  namespace: deployment.metadata?.namespace,
                  kind: 'deployment',
                },
                groupedResponses.horizontalPodAutoscalers,
              )}
              ownedPods={getOwnedPodsThroughReplicaSets(
                deployment,
                groupedResponses.replicaSets,
                groupedResponses.pods,
              )}
              deployment={deployment}
            />
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
};
