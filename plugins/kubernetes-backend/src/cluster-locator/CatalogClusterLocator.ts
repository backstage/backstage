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
  ANNOTATION_KUBERNETES_OIDC_TOKEN_PROVIDER,
  ANNOTATION_KUBERNETES_SKIP_METRICS_LOOKUP,
  ANNOTATION_KUBERNETES_SKIP_TLS_VERIFY,
  ANNOTATION_KUBERNETES_DASHBOARD_URL,
  ANNOTATION_KUBERNETES_DASHBOARD_APP,
} from '@backstage/plugin-kubernetes-common';

export class CatalogClusterLocator implements KubernetesClustersSupplier {
  private catalogClient: CatalogApi;

  constructor(catalogClient: CatalogApi) {
    this.catalogClient = catalogClient;
  }

  static fromConfig(catalogApi: CatalogApi): CatalogClusterLocator {
    return new CatalogClusterLocator(catalogApi);
  }

  async getClusters(): Promise<ClusterDetails[]> {
    const apiServerKey = `metadata.annotations.${ANNOTATION_KUBERNETES_API_SERVER}`;
    const apiServerCaKey = `metadata.annotations.${ANNOTATION_KUBERNETES_API_SERVER_CA}`;
    const authProviderKey = `metadata.annotations.${ANNOTATION_KUBERNETES_AUTH_PROVIDER}`;

    const filter: Record<string, symbol | string> = {
      kind: 'Resource',
      'spec.type': 'kubernetes-cluster',
      [apiServerKey]: CATALOG_FILTER_EXISTS,
      [apiServerCaKey]: CATALOG_FILTER_EXISTS,
      [authProviderKey]: CATALOG_FILTER_EXISTS,
    };

    const clusters = await this.catalogClient.getEntities({
      filter: [filter],
    });
    return clusters.items.map(entity => {
      const clusterDetails: ClusterDetails = {
        name: entity.metadata.name,
        url: entity.metadata.annotations![ANNOTATION_KUBERNETES_API_SERVER]!,
        caData:
          entity.metadata.annotations![ANNOTATION_KUBERNETES_API_SERVER_CA]!,
        authProvider:
          entity.metadata.annotations![ANNOTATION_KUBERNETES_AUTH_PROVIDER]!,
        oidcTokenProvider:
          entity.metadata.annotations![
            ANNOTATION_KUBERNETES_OIDC_TOKEN_PROVIDER
          ]!,
        skipMetricsLookup:
          entity.metadata.annotations![
            ANNOTATION_KUBERNETES_SKIP_METRICS_LOOKUP
          ]! === 'true'
            ? true
            : false,
        skipTLSVerify:
          entity.metadata.annotations![
            ANNOTATION_KUBERNETES_SKIP_TLS_VERIFY
          ]! === 'true'
            ? true
            : false,
        dashboardUrl:
          entity.metadata.annotations![ANNOTATION_KUBERNETES_DASHBOARD_URL]!,
        dashboardApp:
          entity.metadata.annotations![ANNOTATION_KUBERNETES_DASHBOARD_APP]!,
      };

      return clusterDetails;
    });
  }
}
