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
  Content,
  InfoCard,
  Page,
  pageTheme,
  Progress,
  useApi,
} from '@backstage/core';
import { Entity } from '@backstage/catalog-model';
import { kubernetesApiRef } from '../../api/types';
import {
  FetchResponse,
  ObjectsByServiceIdResponse,
} from '@backstage/plugin-kubernetes-backend';
import { DeploymentTables } from '../DeploymentTables';
import { DeploymentTriple } from '../../types/types';

const findDeployments = (fetchResponse: FetchResponse[]): DeploymentTriple => {
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
        default:
      }
      return prev;
    },
    {
      pods: [],
      replicaSets: [],
      deployments: [],
    } as DeploymentTriple,
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
              <InfoCard title={item.cluster.name} subheader="Cluster">
                <DeploymentTables
                  deploymentTriple={findDeployments(item.resources)}
                />
              </InfoCard>
            </Grid>
          ))}
        </Grid>
      </Content>
    </Page>
  );
};
