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

import { ClusterDetails, KubernetesClustersSupplier } from '../types/types';
import {
  CATALOG_FILTER_EXISTS,
  CatalogClient,
} from '@backstage/catalog-client';
import { DiscoveryApi } from '@backstage/core-plugin-api';

export class CatalogClusterLocator implements KubernetesClustersSupplier {
  private catalogClient: CatalogClient;

  constructor(catalogClient: CatalogClient) {
    this.catalogClient = catalogClient;
  }

  static fromConfig(discoveryApi: DiscoveryApi): CatalogClusterLocator {
    return new CatalogClusterLocator(new CatalogClient({ discoveryApi }));
  }

  async getClusters(): Promise<ClusterDetails[]> {
    const clusters = await this.catalogClient.getEntities({
      filter: [
        { 'spec.type': 'kubernetes-cluster' },
        {
          'metadata.annotations.kubernetes.io/api-server':
            CATALOG_FILTER_EXISTS,
        },
        {
          'metadata.annotations.kubernetes.io/api-server-certificate-authority':
            CATALOG_FILTER_EXISTS,
        },
        {
          'metadata.annotations.kubernetes.io/auth-provider':
            CATALOG_FILTER_EXISTS,
        },
      ],
    });
    return clusters.items.map(entity => {
      const clusterDetails: ClusterDetails = {
        name: entity.metadata.name,
        // @ts-ignore filtered out by catalog-client query.
        url: entity.metadata.annotations['kubernetes.io/api-server'],
        // @ts-ignore filtered out by catalog-client query.
        caData:
          entity.metadata.annotations[
            'kubernetes.io/api-server-certificate-authority'
          ],
        // @ts-ignore filtered out by catalog-client query.
        authProvider:
          entity.metadata.annotations['kubernetes.io/auth-provider'],
      };

      return clusterDetails;
    });
  }
}
