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
import { V1Pod, V2HorizontalPodAutoscaler } from '@kubernetes/client-node';
import { PodsTable } from '../../Pods';
import { HorizontalPodAutoscalerDrawer } from '../../HorizontalPodAutoscalers';
import { RolloutDrawer } from './RolloutDrawer';
import PauseIcon from '@mui/icons-material/Pause';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { DateTime } from 'luxon';
import { StepsProgress } from './StepsProgress';
import {
  PodNamesWithErrorsContext,
  GroupedResponsesContext,
} from '../../../hooks';
import {
  getMatchingHpa,
  getOwnedPodsThroughReplicaSets,
} from '../../../utils/owner';
import { StatusError, StatusOK } from '@backstage/core-components';
import { READY_COLUMNS, RESOURCE_COLUMNS } from '../../Pods/PodsTable';

type RolloutAccordionsProps = {
  rollouts: any[];
  defaultExpanded?: boolean;
  children?: React.ReactNode;
};

type RolloutAccordionProps = {
  rollout: any;
  ownedPods: V1Pod[];
  defaultExpanded?: boolean;
  matchingHpa?: V2HorizontalPodAutoscaler;
  children?: React.ReactNode;
};

type RolloutSummaryProps = {
  rollout: any;
  numberOfCurrentPods: number;
  numberOfPodsWithErrors: number;
  hpa?: V2HorizontalPodAutoscaler;
  children?: React.ReactNode;
};

const AbortedTitle = (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
    }}
  >
    <ErrorOutlineIcon />
    <Typography variant="subtitle1">Aborted</Typography>
  </div>
);

const findAbortedMessage = (rollout: any): string | undefined =>
  rollout.status?.conditions?.find(
    (c: any) =>
      c.type === 'Progressing' &&
      c.status === 'False' &&
      c.reason === 'RolloutAborted',
  )?.message;

const RolloutSummary = ({
  rollout,
  numberOfCurrentPods,
  numberOfPodsWithErrors,
  hpa,
}: RolloutSummaryProps) => {
  const pauseTime: string | undefined = rollout.status?.pauseConditions?.find(
    (p: any) => p.reason === 'CanaryPauseStep',
  )?.startTime;
  const abortedMessage = findAbortedMessage(rollout);
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
      spacing={0}
    >
      <Grid xs={6}>
        <RolloutDrawer rollout={rollout} />
      </Grid>
      {hpa && (
        <Grid xs={3}>
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
        xs={3}
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
      {pauseTime && (
        <Grid xs={3}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <PauseIcon />
            <Typography variant="subtitle1">
              Paused ({DateTime.fromISO(pauseTime).toRelative({ locale: 'en' })}
              )
            </Typography>
          </div>
        </Grid>
      )}
      {abortedMessage && <Grid xs={3}>{AbortedTitle}</Grid>}
    </Grid>
  );
};

const RolloutAccordion = ({
  rollout,
  ownedPods,
  matchingHpa,
  defaultExpanded,
}: RolloutAccordionProps) => {
  const podNamesWithErrors = useContext(PodNamesWithErrorsContext);

  const podsWithErrors = ownedPods.filter(p =>
    podNamesWithErrors.has(p.metadata?.name ?? ''),
  );

  const currentStepIndex = rollout.status?.currentStepIndex ?? 0;
  const abortedMessage = findAbortedMessage(rollout);

  return (
    <Accordion
      defaultExpanded={defaultExpanded}
      slotProps={{ transition: { unmountOnExit: true } }}
      variant="outlined"
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <RolloutSummary
          rollout={rollout}
          numberOfCurrentPods={ownedPods.length}
          numberOfPodsWithErrors={podsWithErrors.length}
          hpa={matchingHpa}
        />
      </AccordionSummary>
      <AccordionDetails>
        <div style={{ width: '100%' }}>
          <div>
            <Typography variant="h6">Rollout status</Typography>
          </div>
          <div style={{ margin: '1rem' }}>
            {abortedMessage && (
              <>
                {AbortedTitle}
                <Typography variant="subtitle2">{abortedMessage}</Typography>
              </>
            )}
            <StepsProgress
              aborted={abortedMessage !== undefined}
              steps={rollout.spec?.strategy?.canary?.steps ?? []}
              currentStepIndex={currentStepIndex}
            />
          </div>
          <div>
            <PodsTable
              pods={ownedPods}
              extraColumns={[READY_COLUMNS, RESOURCE_COLUMNS]}
            />
          </div>
        </div>
      </AccordionDetails>
    </Accordion>
  );
};

export const RolloutAccordions = ({
  rollouts,
  defaultExpanded = false,
}: RolloutAccordionsProps) => {
  const groupedResponses = useContext(GroupedResponsesContext);

  return (
    <Grid
      container
      direction="column"
      justifyContent="flex-start"
      alignItems="flex-start"
      xs={12}
    >
      {rollouts.map((rollout, i) => (
        <Grid container key={i} xs={12}>
          <Grid xs={12}>
            <RolloutAccordion
              defaultExpanded={defaultExpanded}
              matchingHpa={getMatchingHpa(
                {
                  name: rollout.metadata?.name,
                  namespace: rollout.metadata?.namespace,
                  kind: 'rollout',
                },
                groupedResponses.horizontalPodAutoscalers,
              )}
              ownedPods={getOwnedPodsThroughReplicaSets(
                rollout,
                groupedResponses.replicaSets,
                groupedResponses.pods,
              )}
              rollout={rollout}
            />
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
};
