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
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  Grid,
  Typography,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
  V1Pod,
  V1HorizontalPodAutoscaler,
  V1StatefulSet,
} from '@kubernetes/client-node';
import { PodsTable } from '../Pods';
import { StatefulSetDrawer } from './StatefulSetDrawer';
import { HorizontalPodAutoscalerDrawer } from '../HorizontalPodAutoscalers';
import { getMatchingHpa, getOwnedResources } from '../../utils/owner';
import {
  GroupedResponsesContext,
  PodNamesWithErrorsContext,
} from '../../hooks';
import { StatusError, StatusOK } from '@backstage/core-components';
import { READY_COLUMNS, RESOURCE_COLUMNS } from '../Pods/PodsTable';

type StatefulSetsAccordionsProps = {
  children?: React.ReactNode;
};

type StatefulSetAccordionProps = {
  statefulset: V1StatefulSet;
  ownedPods: V1Pod[];
  matchingHpa?: V1HorizontalPodAutoscaler;
  children?: React.ReactNode;
};

type StatefulSetSummaryProps = {
  statefulset: V1StatefulSet;
  numberOfCurrentPods: number;
  numberOfPodsWithErrors: number;
  hpa?: V1HorizontalPodAutoscaler;
  children?: React.ReactNode;
};

const StatefulSetSummary = ({
  statefulset,
  numberOfCurrentPods,
  numberOfPodsWithErrors,
  hpa,
}: StatefulSetSummaryProps) => {
  return (
    <Grid
      container
      direction="row"
      justifyContent="flex-start"
      alignItems="center"
    >
      <Grid xs={3} item>
        <StatefulSetDrawer statefulset={statefulset} />
      </Grid>
      <Grid item xs={1}>
        <Divider style={{ height: '5em' }} orientation="vertical" />
      </Grid>
      {hpa && (
        <Grid item xs={3}>
          <HorizontalPodAutoscalerDrawer hpa={hpa}>
            <Grid
              item
              container
              direction="column"
              justifyContent="flex-start"
              alignItems="flex-start"
              spacing={0}
            >
              <Grid item>
                <Typography variant="subtitle2">
                  min replicas {hpa.spec?.minReplicas ?? '?'} / max replicas{' '}
                  {hpa.spec?.maxReplicas ?? '?'}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="subtitle2">
                  current CPU usage:{' '}
                  {hpa.status?.currentCPUUtilizationPercentage ?? '?'}%
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="subtitle2">
                  target CPU usage:{' '}
                  {hpa.spec?.targetCPUUtilizationPercentage ?? '?'}%
                </Typography>
              </Grid>
            </Grid>
          </HorizontalPodAutoscalerDrawer>
        </Grid>
      )}
      <Grid
        item
        container
        xs={3}
        direction="column"
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        <Grid item>
          <StatusOK>{numberOfCurrentPods} pods</StatusOK>
        </Grid>
        <Grid item>
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

const StatefulSetAccordion = ({
  statefulset,
  ownedPods,
  matchingHpa,
}: StatefulSetAccordionProps) => {
  const podNamesWithErrors = useContext(PodNamesWithErrorsContext);

  const podsWithErrors = ownedPods.filter(p =>
    podNamesWithErrors.has(p.metadata?.name ?? ''),
  );

  return (
    <Accordion TransitionProps={{ unmountOnExit: true }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <StatefulSetSummary
          statefulset={statefulset}
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

export const StatefulSetsAccordions = ({}: StatefulSetsAccordionsProps) => {
  const groupedResponses = useContext(GroupedResponsesContext);

  return (
    <Grid
      container
      direction="column"
      justifyContent="flex-start"
      alignItems="flex-start"
    >
      {groupedResponses.statefulsets.map((statefulset, i) => (
        <Grid container item key={i} xs>
          <Grid item xs>
            <StatefulSetAccordion
              matchingHpa={getMatchingHpa(
                {
                  name: statefulset.metadata?.name,
                  namespace: statefulset.metadata?.namespace,
                  kind: 'statefulset',
                },
                groupedResponses.horizontalPodAutoscalers,
              )}
              ownedPods={getOwnedResources(statefulset, groupedResponses.pods)}
              statefulset={statefulset}
            />
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
};
