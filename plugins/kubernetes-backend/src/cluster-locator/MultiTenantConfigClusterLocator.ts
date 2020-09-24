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

import { Config } from '@backstage/config';
import { ClusterDetails, KubernetesClusterLocator } from '..';

// This cluster locator assumes that every service is located on every cluster
// Therefore it will always return all clusters in an app configuration file
export class MultiTenantConfigClusterLocator
  implements KubernetesClusterLocator {
  private readonly clusterDetails: ClusterDetails[];

  constructor(clusterDetails: ClusterDetails[]) {
    this.clusterDetails = clusterDetails;
  }

  static fromConfig(config: Config[]): MultiTenantConfigClusterLocator {
    return new MultiTenantConfigClusterLocator(
      config.map(c => {
        return {
          name: c.getString('name'),
          url: c.getString('url'),
          serviceAccountToken: c.getOptionalString('serviceAccountToken'),
        };
      }),
    );
  }

  // As this implementation always returns all clusters serviceId is ignored here
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getClusterByServiceId(_serviceId: string): Promise<ClusterDetails[]> {
    return this.clusterDetails;
  }
}
