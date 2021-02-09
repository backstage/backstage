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

import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  Grid,
  Typography,
} from '@material-ui/core';
import { Config } from '@backstage/config';
import {
  configApiRef,
  Content,
  Page,
  Progress,
  StatusError,
  StatusOK,
  useApi,
} from '@backstage/core';
import { Entity } from '@backstage/catalog-model';
import { kubernetesApiRef } from '../../api/types';
import {
  ClusterObjects,
  KubernetesRequestBody,
  ObjectsByEntityResponse,
} from '@backstage/plugin-kubernetes-backend';
import { kubernetesAuthProvidersApiRef } from '../../kubernetes-auth-provider/types';
import { ErrorPanel } from './ErrorPanel';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { DeploymentsAccordions } from '../DeploymentsAccordions';
import { ErrorReporting } from '../ErrorReporting';
import { groupResponses } from '../../utils/response';
import { DetectedError, detectErrors } from '../../error-detection';
import { IngressesAccordions } from '../IngressesAccordions';
import { ServicesAccordions } from '../ServicesAccordions';

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
      justify="flex-start"
      alignItems="flex-start"
    >
      <Grid
        xs={2}
        item
        direction="column"
        justify="flex-start"
        alignItems="flex-start"
        spacing={0}
      >
        <Grid item xs>
          <Typography variant="h3">{clusterName}</Typography>
          <Typography color="textSecondary" variant="body1">
            Cluster
          </Typography>
        </Grid>
      </Grid>
      <Grid item xs={1}>
        <Divider style={{ height: '4em' }} orientation="vertical" />
      </Grid>
      <Grid
        item
        container
        xs={3}
        direction="column"
        justify="flex-start"
        alignItems="flex-start"
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

type ClusterProps = {
  clusterObjects: ClusterObjects;
  detectedErrors?: DetectedError[];
  children?: React.ReactNode;
};

const Cluster = ({ clusterObjects, detectedErrors }: ClusterProps) => {
  const groupedResponses = groupResponses(clusterObjects.resources);

  const podsWithErrors = new Set<string>(
    detectedErrors
      ?.filter(de => de.kind === 'Pod')
      .map(de => de.names)
      .flat() ?? [],
  );

  return (
    <>
      <Accordion TransitionProps={{ unmountOnExit: true }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <ClusterSummary
            clusterName={clusterObjects.cluster.name}
            totalNumberOfPods={groupedResponses.pods.length}
            numberOfPodsWithErrors={podsWithErrors.size}
          />
        </AccordionSummary>
        <AccordionDetails>
          <Grid container direction="column">
            <Grid item>
              <DeploymentsAccordions
                deploymentResources={groupedResponses}
                clusterPodNamesWithErrors={podsWithErrors}
              />
            </Grid>

            <Grid item>
              <IngressesAccordions deploymentResources={groupedResponses} />
            </Grid>

            <Grid item>
              <ServicesAccordions deploymentResources={groupedResponses} />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

type KubernetesContentProps = { entity: Entity; children?: React.ReactNode };

export const KubernetesContent = ({ entity }: KubernetesContentProps) => {
  const kubernetesApi = useApi(kubernetesApiRef);

  const [kubernetesObjects, setKubernetesObjects] = useState<
    ObjectsByEntityResponse | undefined
  >(undefined);
  const [error, setError] = useState<string | undefined>(undefined);

  const configApi = useApi(configApiRef);
  const clusters: Config[] = configApi.getConfigArray('kubernetes.clusters');
  const allAuthProviders: string[] = clusters.map(c =>
    c.getString('authProvider'),
  );
  const authProviders: string[] = [...new Set(allAuthProviders)];

  const kubernetesAuthProvidersApi = useApi(kubernetesAuthProvidersApiRef);

  useEffect(() => {
    (async () => {
      // For each auth type, invoke decorateRequestBodyForAuth on corresponding KubernetesAuthProvider
      let requestBody: KubernetesRequestBody = {
        entity,
      };
      for (const authProviderStr of authProviders) {
        // Multiple asyncs done sequentially instead of all at once to prevent same requestBody from being modified simultaneously
        requestBody = await kubernetesAuthProvidersApi.decorateRequestBodyForAuth(
          authProviderStr,
          requestBody,
        );
      }

      // TODO: Add validation on contents/format of requestBody
      kubernetesApi
        .getObjectsByEntity(requestBody)
        .then(result => {
          setKubernetesObjects(result);
        })
        .catch(e => {
          setError(e.message);
        });
    })();
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [entity.metadata.name, kubernetesApi, kubernetesAuthProvidersApi]);
  /* eslint-enable react-hooks/exhaustive-deps */

  const clustersWithErrors =
    kubernetesObjects?.items.filter(r => r.errors.length > 0) ?? [];

  const detectedErrors =
    kubernetesObjects !== undefined
      ? detectErrors(kubernetesObjects)
      : new Map<string, DetectedError[]>();

  return (
    <Page themeId="tool">
      <Content>
        {kubernetesObjects === undefined && error === undefined && <Progress />}

        {/* errors retrieved from the kubernetes clusters */}
        {clustersWithErrors.length > 0 && (
          <Grid container spacing={3} direction="column">
            <Grid item>
              <ErrorPanel
                entityName={entity.metadata.name}
                clustersWithErrors={clustersWithErrors}
              />
            </Grid>
          </Grid>
        )}

        {/* other errors */}
        {error !== undefined && (
          <Grid container spacing={3} direction="column">
            <Grid item>
              <ErrorPanel
                entityName={entity.metadata.name}
                errorMessage={error}
              />
            </Grid>
          </Grid>
        )}

        {kubernetesObjects && (
          <Grid container spacing={3} direction="column">
            <Grid item>
              <ErrorReporting detectedErrors={detectedErrors} />
            </Grid>
            <Grid item>
              <Divider />
            </Grid>
            <Grid item>
              <Typography variant="h3">Your Clusters</Typography>
            </Grid>
            <Grid item container>
              {kubernetesObjects?.items.map((item, i) => (
                <Grid item key={i} xs={12}>
                  <Cluster
                    clusterObjects={item}
                    detectedErrors={detectedErrors.get(item.cluster.name)}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        )}
      </Content>
    </Page>
  );
};
