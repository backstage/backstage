/*
 * Copyright 2022 The Backstage Authors
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
import {
    CatalogProcessor,
    CatalogProcessorEmit,
    LocationSpec,
  } from '@backstage/plugin-catalog-backend';
  import {
    ANNOTATION_KUBERNETES_API_SERVER,
    ANNOTATION_KUBERNETES_API_SERVER_CA,
    ANNOTATION_KUBERNETES_AUTH_PROVIDER,
  } from '@backstage/catalog-model';
  import * as container from '@google-cloud/container';
 

  export class GkeClusterProcessor implements CatalogProcessor {
  
    constructor() {
    }
  
    getProcessorName(): string {
      return 'gcp-gke';
    }
  
  
    async readLocation(
      location: LocationSpec,
      _optional: boolean,
      emit: CatalogProcessorEmit,
    ): Promise<boolean> {
      if (location.type !== 'gcp-gke') {
        return false;
      }

      const client = new container.v1.ClusterManagerClient();
      const [cluster] = await client.getCluster({
        name: location.target,
      })

      const entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Resource',
        metadata: {
          annotations: {
            // TODO add necessary params
            // [ACCOUNTID_ANNOTATION]: accountId,
            // [ARN_ANNOTATION]: describedCluster.cluster.arn || '',
            [ANNOTATION_KUBERNETES_API_SERVER]: cluster.endpoint || '',
            [ANNOTATION_KUBERNETES_API_SERVER_CA]: '',
            [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: 'google',
          },
          name: cluster.name ?? "",
          namespace: 'default',
        },
        spec: {
          type: 'kubernetes-cluster',
          owner: 'unknown',
        },
      };
      emit({
        type: 'entity',
        entity,
        location,
      });
      return true;
    }
  }
  