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

import React from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {
  ClientPodStatus,
  ClusterObjects,
  groupResponses,
} from '@backstage/plugin-kubernetes-common';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { DeploymentsAccordions } from '../DeploymentsAccordions';
import { StatefulSetsAccordions } from '../StatefulSetsAccordions';
import { IngressesAccordions } from '../IngressesAccordions';
import { ServicesAccordions } from '../ServicesAccordions';
import { CronJobsAccordions } from '../CronJobsAccordions';
import { CustomResources } from '../CustomResources';
import { DaemonSetsAccordions } from '../DaemonSetsAccordions';
import {
  ClusterContext,
  GroupedResponsesContext,
  PodNamesWithErrorsContext,
} from '../../hooks';

import { StatusError, StatusOK } from '@backstage/core-components';
import { PodMetricsContext } from '../../hooks/usePodMetrics';

type ClusterSummaryProps = {
  clusterName: string;
  totalNumberOfPods: number;
  numberOfPodsWithErrors: number;
  children?: React.ReactNode;
};

const ClusterSummary = ({
  clusterName,
  totalNumberOfPods,
  numberOfPodsWithErrors,
}: ClusterSummaryProps) => {
  return (
    <Grid
      container
      direction="row"
      justifyContent="space-between"
      alignItems="flex-start"
      spacing={0}
    >
      <Grid
        xs={6}
        item
        container
        direction="column"
        justifyContent="flex-start"
        alignItems="flex-start"
        spacing={0}
      >
        <Grid item xs>
          <Typography variant="body1">{clusterName}</Typography>
          <Typography color="textSecondary" variant="subtitle1">
            Cluster
          </Typography>
        </Grid>
      </Grid>
      <Grid
        item
        container
        xs={3}
        direction="column"
        justifyContent="flex-start"
        alignItems="flex-end"
        spacing={0}
      >
        <Grid item>
          <StatusOK>{totalNumberOfPods} pods</StatusOK>
        </Grid>
        <Grid item>
          {numberOfPodsWithErrors > 0 ? (
            <StatusError>{numberOfPodsWithErrors} pods with errors</StatusError>
          ) : (
            <StatusOK>No pods with errors</StatusOK>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

/**
 * Props for Cluster
 *
 * @public
 */
export type ClusterProps = {
  clusterObjects: ClusterObjects;
  podsWithErrors: Set<string>;
  children?: React.ReactNode;
};

/**
 * Component for rendering Kubernetes resources in a cluster
 *
 * @public
 */
export const Cluster = ({ clusterObjects, podsWithErrors }: ClusterProps) => {
  const groupedResponses = groupResponses(clusterObjects.resources);

  const podMetricsMap = new Map<string, ClientPodStatus[]>();
  podMetricsMap.set(clusterObjects.cluster.name, clusterObjects.podMetrics);
  return (
    <ClusterContext.Provider value={clusterObjects.cluster}>
      <GroupedResponsesContext.Provider value={groupedResponses}>
        <PodMetricsContext.Provider value={podMetricsMap}>
          <PodNamesWithErrorsContext.Provider value={podsWithErrors}>
            <Accordion TransitionProps={{ unmountOnExit: true }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <ClusterSummary
                  clusterName={
                    clusterObjects.cluster.title || clusterObjects.cluster.name
                  }
                  totalNumberOfPods={groupedResponses.pods.length}
                  numberOfPodsWithErrors={podsWithErrors.size}
                />
              </AccordionSummary>
              <AccordionDetails>
                <Grid container direction="column">
                  {groupedResponses.customResources.length > 0 ? (
                    <Grid item>
                      <CustomResources />
                    </Grid>
                  ) : undefined}
                  {groupedResponses.deployments.length > 0 ? (
                    <Grid item>
                      <DeploymentsAccordions />
                    </Grid>
                  ) : undefined}
                  {groupedResponses.daemonSets.length > 0 ? (
                    <Grid item>
                      <DaemonSetsAccordions />
                    </Grid>
                  ) : undefined}
                  {groupedResponses.statefulsets.length > 0 ? (
                    <Grid item>
                      <StatefulSetsAccordions />
                    </Grid>
                  ) : undefined}
                  {groupedResponses.ingresses.length > 0 ? (
                    <Grid item>
                      <IngressesAccordions />
                    </Grid>
                  ) : undefined}
                  {groupedResponses.services.length > 0 ? (
                    <Grid item>
                      <ServicesAccordions />
                    </Grid>
                  ) : undefined}
                  {groupedResponses.cronJobs.length > 0 ? (
                    <Grid item>
                      <CronJobsAccordions />
                    </Grid>
                  ) : undefined}
                </Grid>
              </AccordionDetails>
            </Accordion>
          </PodNamesWithErrorsContext.Provider>
        </PodMetricsContext.Provider>
      </GroupedResponsesContext.Provider>
    </ClusterContext.Provider>
  );
};
