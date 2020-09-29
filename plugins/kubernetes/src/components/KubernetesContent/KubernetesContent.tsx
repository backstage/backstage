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
import { Grid } from '@material-ui/core';
import {
  CardTab,
  Content,
  Page,
  pageTheme,
  Progress,
  TabbedCard,
  useApi,
} from '@backstage/core';
import { Entity } from '@backstage/catalog-model';
import { kubernetesApiRef } from '../../api/types';
import {
  ClusterObjects,
  FetchResponse,
  ObjectsByServiceIdResponse,
} from '@backstage/plugin-kubernetes-backend';
import { DeploymentTables } from '../DeploymentTables';
import { DeploymentTriple } from '../../types/types';
import {
  ExtensionsV1beta1Ingress,
  V1ConfigMap,
  V1HorizontalPodAutoscaler,
  V1Service,
} from '@kubernetes/client-node';
import { Services } from '../Services';
import { ConfigMaps } from '../ConfigMaps';
import { Ingresses } from '../Ingresses';
import { HorizontalPodAutoscalers } from '../HorizontalPodAutoscalers';

interface GroupedResponses extends DeploymentTriple {
  services: V1Service[];
  configMaps: V1ConfigMap[];
  horizontalPodAutoscalers: V1HorizontalPodAutoscaler[];
  ingresses: ExtensionsV1beta1Ingress[];
}

// TODO this could probably be a lodash groupBy
const groupResponses = (fetchResponse: FetchResponse[]) => {
  return fetchResponse.reduce(
    (prev, next) => {
      switch (next.type) {
        case 'deployments':
          prev.deployments.push(...next.resources);
          break;
        case 'pods':
          prev.pods.push(...next.resources);
          break;
        case 'replicasets':
          prev.replicaSets.push(...next.resources);
          break;
        case 'services':
          prev.services.push(...next.resources);
          break;
        case 'configmaps':
          prev.configMaps.push(...next.resources);
          break;
        case 'horizontalpodautoscalers':
          prev.horizontalPodAutoscalers.push(...next.resources);
          break;
        case 'ingresses':
          prev.ingresses.push(...next.resources);
          break;
        default:
      }
      return prev;
    },
    {
      pods: [],
      replicaSets: [],
      deployments: [],
      services: [],
      configMaps: [],
      horizontalPodAutoscalers: [],
      ingresses: [],
    } as GroupedResponses,
  );
};

// TODO proper error handling

type KubernetesContentProps = { entity: Entity; children?: React.ReactNode };

export const KubernetesContent = ({ entity }: KubernetesContentProps) => {
  const kubernetesApi = useApi(kubernetesApiRef);

  const [kubernetesObjects, setKubernetesObjects] = useState<
    ObjectsByServiceIdResponse | undefined
  >(undefined);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    kubernetesApi
      .getObjectsByServiceId(entity.metadata.name)
      .then(result => {
        setKubernetesObjects(result);
      })
      .catch(e => {
        setError(e.message);
      });
  }, [entity.metadata.name, kubernetesApi]);

  return (
    <Page theme={pageTheme.tool}>
      <Content>
        <Grid container spacing={3} direction="column">
          {kubernetesObjects === undefined && <Progress />}
          {error !== undefined && <div>{error}</div>}
          {kubernetesObjects?.items.map((item, i) => (
            <Grid item key={i}>
              <Cluster clusterObjects={item} />
            </Grid>
          ))}
        </Grid>
      </Content>
    </Page>
  );
};

type ClusterProps = {
  clusterObjects: ClusterObjects;
  children?: React.ReactNode;
};

const Cluster = ({ clusterObjects }: ClusterProps) => {
  const [selectedTab, setSelectedTab] = useState<string | number>('one');

  const handleChange = (_ev: any, newSelectedTab: string | number) =>
    setSelectedTab(newSelectedTab);

  const groupedResponses = groupResponses(clusterObjects.resources);

  const configMaps = groupedResponses.configMaps;
  const hpas = groupedResponses.horizontalPodAutoscalers;
  const ingresses = groupedResponses.ingresses;

  return (
    <>
      <TabbedCard
        value={selectedTab}
        onChange={handleChange}
        title={clusterObjects.cluster.name}
      >
        <CardTab value="one" label="Deployments">
          <DeploymentTables
            deploymentTriple={{
              deployments: groupedResponses.deployments,
              replicaSets: groupedResponses.replicaSets,
              pods: groupedResponses.pods,
            }}
          />
        </CardTab>
        <CardTab value="two" label="Services">
          <Services services={groupedResponses.services} />
        </CardTab>
        {configMaps && (
          <CardTab value="three" label="Config Maps">
            <ConfigMaps configMaps={configMaps} />
          </CardTab>
        )}
        {hpas && (
          <CardTab value="four" label="Horizontal Pod Autoscalers">
            <HorizontalPodAutoscalers hpas={hpas} />
          </CardTab>
        )}
        {ingresses && (
          <CardTab value="five" label="Ingresses">
            <Ingresses ingresses={ingresses} />
          </CardTab>
        )}
      </TabbedCard>
    </>
  );
};
