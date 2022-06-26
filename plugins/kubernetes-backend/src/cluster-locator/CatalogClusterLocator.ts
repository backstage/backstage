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

import { ClusterDetails, KubernetesClustersSupplier } from '../types/types';
import { CATALOG_FILTER_EXISTS, CatalogApi } from '@backstage/catalog-client';
import {
  ANNOTATION_KUBERNETES_API_SERVER,
  ANNOTATION_KUBERNETES_API_SERVER_CA,
  ANNOTATION_KUBERNETES_AUTH_PROVIDER,
} from '@backstage/catalog-model';

export class CatalogClusterLocator implements KubernetesClustersSupplier {
  private catalogClient: CatalogApi;

  constructor(catalogClient: CatalogApi) {
    this.catalogClient = catalogClient;
  }

  static fromConfig(catalogApi: CatalogApi): CatalogClusterLocator {
    return new CatalogClusterLocator(catalogApi);
  }

  async getClusters(): Promise<ClusterDetails[]> {
    const clusters = await this.catalogClient.getEntities({
      filter: [
        {
          kind: 'Resource',
          'spec.type': 'kubernetes-cluster',
          'metadata.annotations.kubernetes.io/api-server':
            CATALOG_FILTER_EXISTS,
          'metadata.annotations.kubernetes.io/api-server-certificate-authority':
            CATALOG_FILTER_EXISTS,
          'metadata.annotations.kubernetes.io/auth-provider':
            CATALOG_FILTER_EXISTS,
        },
      ],
    });
    return clusters.items.map(entity => {
      const clusterDetails: ClusterDetails = {
        name: entity.metadata.name,
        url: entity.metadata.annotations![ANNOTATION_KUBERNETES_API_SERVER]!,
        caData:
          entity.metadata.annotations![ANNOTATION_KUBERNETES_API_SERVER_CA]!,
        authProvider:
          entity.metadata.annotations![ANNOTATION_KUBERNETES_AUTH_PROVIDER]!,
      };

      return clusterDetails;
    });
  }
}
