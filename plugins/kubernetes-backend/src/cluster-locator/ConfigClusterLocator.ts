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

import { Config } from '@backstage/config';
import {
  ANNOTATION_KUBERNETES_AWS_ASSUME_ROLE,
  ANNOTATION_KUBERNETES_AWS_EXTERNAL_ID,
  ANNOTATION_KUBERNETES_OIDC_TOKEN_PROVIDER,
} from '@backstage/plugin-kubernetes-common';
import { ClusterDetails, KubernetesClustersSupplier } from '../types/types';

export class ConfigClusterLocator implements KubernetesClustersSupplier {
  private readonly clusterDetails: ClusterDetails[];

  constructor(clusterDetails: ClusterDetails[]) {
    this.clusterDetails = clusterDetails;
  }

  static fromConfig(config: Config): ConfigClusterLocator {
    return new ConfigClusterLocator(
      config.getConfigArray('clusters').map(c => {
        const authProvider = c.getString('authProvider');
        const clusterDetails: ClusterDetails = {
          name: c.getString('name'),
          url: c.getString('url'),
          skipTLSVerify: c.getOptionalBoolean('skipTLSVerify') ?? false,
          skipMetricsLookup: c.getOptionalBoolean('skipMetricsLookup') ?? false,
          caData: c.getOptionalString('caData'),
          caFile: c.getOptionalString('caFile'),
          authProvider: authProvider,
          ...ConfigClusterLocator.parseAuthMetadata(c),
        };

        const customResources = c.getOptionalConfigArray('customResources');
        if (customResources) {
          clusterDetails.customResources = customResources.map(cr => {
            return {
              group: cr.getString('group'),
              apiVersion: cr.getString('apiVersion'),
              plural: cr.getString('plural'),
            };
          });
        }

        const dashboardUrl = c.getOptionalString('dashboardUrl');
        if (dashboardUrl) {
          clusterDetails.dashboardUrl = dashboardUrl;
        }
        const dashboardApp = c.getOptionalString('dashboardApp');
        if (dashboardApp) {
          clusterDetails.dashboardApp = dashboardApp;
        }
        if (c.has('dashboardParameters')) {
          clusterDetails.dashboardParameters = c.get('dashboardParameters');
        }

        switch (authProvider) {
          case 'google': {
            return clusterDetails;
          }
          case 'aws': {
            return clusterDetails;
          }
          case 'azure': {
            return clusterDetails;
          }
          case 'oidc': {
            if (
              !clusterDetails.authMetadata?.[
                ANNOTATION_KUBERNETES_OIDC_TOKEN_PROVIDER
              ]
            ) {
              throw new Error(
                `Cluster '${clusterDetails.name}' missing required config value for 'oidcTokenProvider'`,
              );
            }
            return clusterDetails;
          }
          case 'serviceAccount': {
            return clusterDetails;
          }
          case 'googleServiceAccount': {
            return clusterDetails;
          }
          case 'aks': {
            return clusterDetails;
          }
          default: {
            throw new Error(
              `authProvider "${authProvider}" has no config associated with it`,
            );
          }
        }
      }),
    );
  }

  private static parseAuthMetadata(
    clusterConfig: Config,
  ): { authMetadata: Record<string, string> } | undefined {
    const serviceAccountToken = clusterConfig.getOptionalString(
      'serviceAccountToken',
    );
    const assumeRole = clusterConfig.getOptionalString('assumeRole');
    const externalId = clusterConfig.getOptionalString('externalId');
    const oidcTokenProvider =
      clusterConfig.getOptionalString('oidcTokenProvider');

    return serviceAccountToken || assumeRole || externalId
      ? {
          authMetadata: {
            ...(serviceAccountToken && { serviceAccountToken }),
            ...(assumeRole && {
              [ANNOTATION_KUBERNETES_AWS_ASSUME_ROLE]: assumeRole,
            }),
            ...(externalId && {
              [ANNOTATION_KUBERNETES_AWS_EXTERNAL_ID]: externalId,
            }),
            ...(oidcTokenProvider && {
              [ANNOTATION_KUBERNETES_OIDC_TOKEN_PROVIDER]: oidcTokenProvider,
            }),
          },
        }
      : undefined;
  }

  async getClusters(): Promise<ClusterDetails[]> {
    return this.clusterDetails;
  }
}
