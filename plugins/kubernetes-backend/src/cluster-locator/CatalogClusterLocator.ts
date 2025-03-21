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
  AuthService,
  BackstageCredentials,
} from '@backstage/backend-plugin-api';
import { ClusterDetails, KubernetesClustersSupplier } from '../types/types';
import { CATALOG_FILTER_EXISTS, CatalogApi } from '@backstage/catalog-client';
import {
  ANNOTATION_KUBERNETES_API_SERVER,
  ANNOTATION_KUBERNETES_API_SERVER_CA,
  ANNOTATION_KUBERNETES_AUTH_PROVIDER,
  ANNOTATION_KUBERNETES_SKIP_METRICS_LOOKUP,
  ANNOTATION_KUBERNETES_SKIP_TLS_VERIFY,
  ANNOTATION_KUBERNETES_DASHBOARD_URL,
  ANNOTATION_KUBERNETES_DASHBOARD_APP,
  ANNOTATION_KUBERNETES_DASHBOARD_PARAMETERS,
} from '@backstage/plugin-kubernetes-common';
import { JsonObject } from '@backstage/types';

function isObject(obj: unknown): obj is JsonObject {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
}

export class CatalogClusterLocator implements KubernetesClustersSupplier {
  private catalogClient: CatalogApi;
  private auth: AuthService;

  constructor(catalogClient: CatalogApi, auth: AuthService) {
    this.catalogClient = catalogClient;
    this.auth = auth;
  }

  static fromConfig(
    catalogApi: CatalogApi,
    auth: AuthService,
  ): CatalogClusterLocator {
    return new CatalogClusterLocator(catalogApi, auth);
  }

  async getClusters(options?: {
    credentials: BackstageCredentials;
  }): Promise<ClusterDetails[]> {
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

    const clusters = await this.catalogClient.getEntities(
      {
        filter: [filter],
      },
      options?.credentials
        ? {
            token: (
              await this.auth.getPluginRequestToken({
                onBehalfOf: options.credentials,
                targetPluginId: 'catalog',
              })
            ).token,
          }
        : undefined,
    );
    return clusters.items.map(entity => {
      const annotations = entity.metadata.annotations!;
      const clusterDetails: ClusterDetails = {
        name: entity.metadata.name,
        title: entity.metadata.title,
        url: annotations[ANNOTATION_KUBERNETES_API_SERVER],
        authMetadata: annotations,
        caData: annotations[ANNOTATION_KUBERNETES_API_SERVER_CA],
        skipMetricsLookup:
          annotations[ANNOTATION_KUBERNETES_SKIP_METRICS_LOOKUP] === 'true',
        skipTLSVerify:
          annotations[ANNOTATION_KUBERNETES_SKIP_TLS_VERIFY] === 'true',
        dashboardUrl: annotations[ANNOTATION_KUBERNETES_DASHBOARD_URL],
        dashboardApp: annotations[ANNOTATION_KUBERNETES_DASHBOARD_APP],
        dashboardParameters: this.getDashboardParameters(annotations),
      };

      return clusterDetails;
    });
  }

  private getDashboardParameters(
    annotations: Record<string, string>,
  ): JsonObject | undefined {
    const dashboardParamsString =
      annotations[ANNOTATION_KUBERNETES_DASHBOARD_PARAMETERS];
    if (dashboardParamsString) {
      try {
        const dashboardParams = JSON.parse(dashboardParamsString);
        return isObject(dashboardParams) ? dashboardParams : undefined;
      } catch {
        return undefined;
      }
    }
    return undefined;
  }
}
