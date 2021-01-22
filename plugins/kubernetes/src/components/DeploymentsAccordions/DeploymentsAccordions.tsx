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

import { DeploymentResources } from '../../types/types';
import React from 'react';
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
import { PodsTable } from '../Pods';
import { DeploymentDrawer } from './DeploymentDrawer';
import { HorizontalPodAutoscalerDrawer } from '../HorizontalPodAutoscalers';

type DeploymentsAccordionsProps = {
  deploymentResources: DeploymentResources;
  clusterPodNamesWithErrors: Set<string>;
  children?: React.ReactNode;
};

type DeploymentAccordionProps = {
  deployment: V1Deployment;
  ownedPods: V1Pod[];
  matchingHpa?: V1HorizontalPodAutoscaler;
  clusterPodNamesWithErrors: Set<string>;
  children?: React.ReactNode;
};

type DeploymentSummaryProps = {
  deployment: V1Deployment;
  numberOfCurrentPods: number;
  numberOfPodsWithErrors: number;
  hpa?: V1HorizontalPodAutoscaler;
  children?: React.ReactNode;
};

const DeploymentSummary = ({
  deployment,
  numberOfCurrentPods,
  numberOfPodsWithErrors,
  hpa,
}: DeploymentSummaryProps) => {
  return (
    <Grid container direction="row" justify="flex-start" alignItems="center">
      <Grid xs={3} item>
        <DeploymentDrawer deployment={deployment} />
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
    </Grid>
  );
};

const DeploymentAccordion = ({
  deployment,
  ownedPods,
  matchingHpa,
  clusterPodNamesWithErrors,
}: DeploymentAccordionProps) => {
  const podsWithErrors = ownedPods.filter(p =>
    clusterPodNamesWithErrors.has(p.metadata?.name ?? ''),
  );

  return (
    <Accordion TransitionProps={{ unmountOnExit: true }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <DeploymentSummary
          deployment={deployment}
          numberOfCurrentPods={ownedPods.length}
          numberOfPodsWithErrors={podsWithErrors.length}
          hpa={matchingHpa}
        />
      </AccordionSummary>
      <AccordionDetails>
        <PodsTable pods={ownedPods} />
      </AccordionDetails>
    </Accordion>
  );
};

export const DeploymentsAccordions = ({
  deploymentResources,
  clusterPodNamesWithErrors,
}: DeploymentsAccordionsProps) => {
  const isOwnedBy = (
    ownerReferences: V1OwnerReference[],
    obj: V1Pod | V1ReplicaSet | V1Deployment,
  ): boolean => {
    return ownerReferences?.some(or => or.name === obj.metadata?.name);
  };

  return (
    <Grid
      container
      direction="column"
      justify="flex-start"
      alignItems="flex-start"
    >
      {deploymentResources.deployments.map((deployment, i) => (
        <Grid container item key={i} xs>
          {deploymentResources.replicaSets
            // Filter out replica sets with no replicas
            .filter(rs => rs.status && rs.status.replicas > 0)
            // Find the replica sets this deployment owns
            .filter(rs =>
              isOwnedBy(rs.metadata?.ownerReferences ?? [], deployment),
            )
            .map((rs, j) => {
              // Find the pods this replica set owns and render them in the table
              const ownedPods = deploymentResources.pods.filter(pod =>
                isOwnedBy(pod.metadata?.ownerReferences ?? [], rs),
              );

              const matchingHpa = deploymentResources.horizontalPodAutoscalers.find(
                (hpa: V1HorizontalPodAutoscaler) => {
                  return (
                    (hpa.spec?.scaleTargetRef?.kind ?? '').toLowerCase() ===
                      'deployment' &&
                    (hpa.spec?.scaleTargetRef?.name ?? '') ===
                      (deployment.metadata?.name ?? 'unknown-deployment')
                  );
                },
              );

              return (
                <Grid item key={j} xs>
                  <DeploymentAccordion
                    deployment={deployment}
                    ownedPods={ownedPods}
                    matchingHpa={matchingHpa}
                    clusterPodNamesWithErrors={clusterPodNamesWithErrors}
                  />
                </Grid>
              );
            })}
        </Grid>
      ))}
    </Grid>
  );
};
