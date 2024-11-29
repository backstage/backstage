/*
 * Copyright 2021 The Backstage Authors
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

import { ANNOTATION_KUBERNETES_AUTH_PROVIDER } from '@backstage/plugin-kubernetes-common';
import { Config } from '@backstage/config';
import { ForwardedError } from '@backstage/errors';
import * as container from '@google-cloud/container';
import { Duration } from 'luxon';
import { runPeriodically } from '../service/runPeriodically';
import { ClusterDetails, KubernetesClustersSupplier } from '../types/types';
import packageinfo from '../../package.json';

interface MatchResourceLabelEntry {
  key: string;
  value: string;
}

type GkeClusterLocatorOptions = {
  projectId: string;
  authProvider: string;
  region?: string;
  skipTLSVerify?: boolean;
  skipMetricsLookup?: boolean;
  exposeDashboard?: boolean;
  matchingResourceLabels?: MatchResourceLabelEntry[];
};

export class GkeClusterLocator implements KubernetesClustersSupplier {
  constructor(
    private readonly options: GkeClusterLocatorOptions,
    private readonly client: container.v1.ClusterManagerClient,
    private clusterDetails: ClusterDetails[] | undefined = undefined,
    private hasClusterDetails: boolean = false,
  ) {}

  static fromConfigWithClient(
    config: Config,
    client: container.v1.ClusterManagerClient,
    refreshInterval?: Duration,
  ): GkeClusterLocator {
    const matchingResourceLabels: MatchResourceLabelEntry[] =
      config.getOptionalConfigArray('matchingResourceLabels')?.map(mrl => {
        return { key: mrl.getString('key'), value: mrl.getString('value') };
      }) ?? [];

    const storeAuthProviderString =
      config.getOptionalString('authProvider') === 'googleServiceAccount'
        ? 'googleServiceAccount'
        : 'google';

    const options = {
      projectId: config.getString('projectId'),
      authProvider: storeAuthProviderString,
      region: config.getOptionalString('region') ?? '-',
      skipTLSVerify: config.getOptionalBoolean('skipTLSVerify') ?? false,
      skipMetricsLookup:
        config.getOptionalBoolean('skipMetricsLookup') ?? false,
      exposeDashboard: config.getOptionalBoolean('exposeDashboard') ?? false,
      matchingResourceLabels,
    };
    const gkeClusterLocator = new GkeClusterLocator(options, client);
    if (refreshInterval) {
      runPeriodically(
        () => gkeClusterLocator.refreshClusters(),
        refreshInterval.toMillis(),
      );
    }
    return gkeClusterLocator;
  }

  // Added an `x-goog-api-client` header to API requests made by the GKE cluster locator to clearly identify API requests from this plugin.
  static fromConfig(
    config: Config,
    refreshInterval: Duration | undefined = undefined,
  ): GkeClusterLocator {
    return GkeClusterLocator.fromConfigWithClient(
      config,
      new container.v1.ClusterManagerClient({
        libName: `backstage/kubernetes-backend.GkeClusterLocator`,
        libVersion: packageinfo.version,
      }),
      refreshInterval,
    );
  }

  async getClusters(): Promise<ClusterDetails[]> {
    if (!this.hasClusterDetails) {
      // refresh at least once when first called, when retries are disabled and in tests
      await this.refreshClusters();
    }
    return this.clusterDetails ?? [];
  }

  // TODO pass caData into the object
  async refreshClusters(): Promise<void> {
    const {
      projectId,
      region,
      authProvider,
      skipTLSVerify,
      skipMetricsLookup,
      exposeDashboard,
      matchingResourceLabels,
    } = this.options;
    const request = {
      parent: `projects/${projectId}/locations/${region}`,
    };

    try {
      const [response] = await this.client.listClusters(request);
      this.clusterDetails = (response.clusters ?? [])
        .filter(r => {
          return matchingResourceLabels?.every(mrl => {
            if (!r.resourceLabels) {
              return false;
            }
            return r.resourceLabels[mrl.key] === mrl.value;
          });
        })
        .map(r => ({
          // TODO filter out clusters which don't have name or endpoint
          name: r.name ?? 'unknown',
          url: `https://${r.endpoint ?? ''}`,
          authMetadata: { [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: authProvider },
          skipTLSVerify,
          skipMetricsLookup,
          ...(exposeDashboard
            ? {
                dashboardApp: 'gke',
                dashboardParameters: {
                  projectId,
                  region,
                  clusterName: r.name,
                },
              }
            : {}),
        }));
      this.hasClusterDetails = true;
    } catch (e) {
      throw new ForwardedError(
        `There was an error retrieving clusters from GKE for projectId=${projectId} region=${region}`,
        e,
      );
    }
  }
}
