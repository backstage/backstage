/*
 * Copyright 2021 Spotify AB
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
import * as container from '@google-cloud/container';
import { ClusterDetails, KubernetesClustersSupplier } from '../types/types';

export class GkeClusterLocator implements KubernetesClustersSupplier {
  private readonly projectId: string;
  private readonly region: string | undefined;
  private readonly client: container.v1.ClusterManagerClient;

  constructor(
    projectId: string,
    client: container.v1.ClusterManagerClient,
    region?: string,
  ) {
    this.projectId = projectId;
    this.region = region;
    this.client = client;
  }

  static fromConfigWithClient(
    config: Config,
    client: container.v1.ClusterManagerClient,
  ): GkeClusterLocator {
    const projectId = config.getString('projectId');
    const region = config.getOptionalString('region');
    return new GkeClusterLocator(projectId, client, region);
  }

  static fromConfig(config: Config): GkeClusterLocator {
    return GkeClusterLocator.fromConfigWithClient(
      config,
      new container.v1.ClusterManagerClient(),
    );
  }

  async getClusters(): Promise<ClusterDetails[]> {
    const region = this.region ?? '-';
    const request = {
      parent: `projects/${this.projectId}/locations/${region}`,
    };

    try {
      const [response] = await this.client.listClusters(request);
      return (response.clusters ?? []).map(r => ({
        // TODO filter out clusters which don't have name or endpoint
        name: r.name ?? 'unknown',
        url: `https://${r.endpoint ?? ''}`,
        authProvider: 'google',
      }));
    } catch (e) {
      throw new Error(
        `There was an error retrieving clusters from GKE for projectId=${this.projectId} region=${region} : [${e.message}]`,
      );
    }
  }
}
