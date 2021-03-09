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

import React from 'react';
import { GroupedResponses } from '../../../types/types';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  Grid,
  Typography,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { V1OwnerReference } from '@kubernetes/client-node/dist/gen/model/v1OwnerReference';
import {
  V1Deployment,
  V1Pod,
  V1ReplicaSet,
  V1HorizontalPodAutoscaler,
} from '@kubernetes/client-node';
import { StatusError, StatusOK } from '@backstage/core';
import { PodsTable } from '../../Pods';
import { HorizontalPodAutoscalerDrawer } from '../../HorizontalPodAutoscalers';
import { RolloutDrawer } from './RolloutDrawer';
import PauseIcon from '@material-ui/icons/Pause';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import formatDistance from 'date-fns/formatDistance';
import {StepsProgress} from "./StepsProgress";

type RolloutAccordionsProps = {
  rollouts: any[];
  groupedResponses: GroupedResponses;
  clusterPodNamesWithErrors: Set<string>;
  children?: React.ReactNode;
};

type RolloutAccordionProps = {
  rollout: any;
  ownedPods: V1Pod[];
  matchingHpa?: V1HorizontalPodAutoscaler;
  clusterPodNamesWithErrors: Set<string>;
  children?: React.ReactNode;
};

type RolloutSummaryProps = {
  rollout: any;
  numberOfCurrentPods: number;
  numberOfPodsWithErrors: number;
  hpa?: V1HorizontalPodAutoscaler;
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

  return (
    <Grid container direction="row" justify="flex-start" alignItems="center">
      <Grid xs={3} item>
        <RolloutDrawer rollout={rollout} />
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
              justify="flex-start"
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
        justify="flex-start"
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
      {pauseTime && (
        <Grid item xs={3}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <PauseIcon />
            <Typography variant="subtitle1">
              Paused (
              {formatDistance(Date.parse(pauseTime), new Date(), {
                addSuffix: true,
              })}
              )
            </Typography>
          </div>
        </Grid>
      )}
      {abortedMessage && (
        <Grid item xs={3}>
          {AbortedTitle}
        </Grid>
      )}
    </Grid>
  );
};

const RolloutAccordion = ({
  rollout,
  ownedPods,
  matchingHpa,
  clusterPodNamesWithErrors,
}: RolloutAccordionProps) => {
  const podsWithErrors = ownedPods.filter(p =>
    clusterPodNamesWithErrors.has(p.metadata?.name ?? ''),
  );

  const currentStepIndex = rollout.status?.currentStepIndex ?? 0;
  const abortedMessage = findAbortedMessage(rollout);

  return (
    <Accordion TransitionProps={{ unmountOnExit: true }}>
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
            <Typography variant={'h6'}>Rollout status</Typography>
          </div>
          <div style={{ margin: '1rem' }}>
            {abortedMessage && (
              <>
                {AbortedTitle}
                <Typography variant={'subtitle2'}>{abortedMessage}</Typography>
              </>
            )}
            <StepsProgress
              aborted={abortedMessage !== undefined}
              steps={rollout.spec?.strategy?.canary?.steps ?? []}
              currentStepIndex={currentStepIndex}
            />
          </div>
          <div>
            <PodsTable pods={ownedPods} />
          </div>
        </div>
      </AccordionDetails>
    </Accordion>
  );
};

export const RolloutAccordions = ({
  rollouts,
  groupedResponses,
  clusterPodNamesWithErrors,
}: RolloutAccordionsProps) => {
  const isOwnedBy = (
    ownerReferences: V1OwnerReference[],
    obj: V1Pod | V1ReplicaSet | V1Deployment,
    targetKind: string,
  ): boolean => {
    return ownerReferences?.some(
      or =>
        or.name === obj.metadata?.name && or.kind.toLowerCase() === targetKind,
    );
  };

  const getOwnedPods = (rollout: any) =>
    groupedResponses.replicaSets
      // Filter out replica sets with no replicas
      .filter(rs => rs.status && rs.status.replicas > 0)
      // Find the replica sets this deployment owns
      .filter(rs =>
        isOwnedBy(rs.metadata?.ownerReferences ?? [], rollout, 'rollout'),
      )
      .reduce((accum, rs) => {
        const pods = groupedResponses.pods.filter(pod =>
          isOwnedBy(pod.metadata?.ownerReferences ?? [], rs, 'replicaset'),
        );
        return accum.concat(pods);
      }, [] as V1Pod[]);

  const getMatchingHpa = (rollout: any) =>
    groupedResponses.horizontalPodAutoscalers.find(
      (hpa: V1HorizontalPodAutoscaler) => {
        return (
          (hpa.spec?.scaleTargetRef?.kind ?? '').toLowerCase() === 'rollout' &&
          (hpa.spec?.scaleTargetRef?.name ?? '') ===
            (rollout.metadata?.name ?? 'unknown-rollout')
        );
      },
    );

  return (
    <Grid
      container
      direction="column"
      justify="flex-start"
      alignItems="flex-start"
    >
      {rollouts.map((rollout, i) => (
        <Grid container item key={i} xs>
          <Grid item xs>
            <RolloutAccordion
              rollout={rollout}
              ownedPods={getOwnedPods(rollout)}
              matchingHpa={getMatchingHpa(rollout)}
              clusterPodNamesWithErrors={clusterPodNamesWithErrors}
            />
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
};
