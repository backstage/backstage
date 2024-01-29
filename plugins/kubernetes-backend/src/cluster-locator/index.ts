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

import { CatalogApi } from '@backstage/catalog-client';
import { Config } from '@backstage/config';
import { Duration } from 'luxon';
import { Logger } from 'winston';
import { ClusterDetails, KubernetesClustersSupplier } from '../types/types';
import { AuthenticationStrategy } from '../auth/types';
import { ConfigClusterLocator } from './ConfigClusterLocator';
import { GkeClusterLocator } from './GkeClusterLocator';
import { CatalogClusterLocator } from './CatalogClusterLocator';
import { LocalKubectlProxyClusterLocator } from './LocalKubectlProxyLocator';

class CombinedClustersSupplier implements KubernetesClustersSupplier {
  constructor(
    readonly clusterSuppliers: KubernetesClustersSupplier[],
    readonly logger: Logger,
  ) {}

  async getClusters(): Promise<ClusterDetails[]> {
    const clusters = await Promise.all(
      this.clusterSuppliers.map(supplier => supplier.getClusters()),
    )
      .then(res => {
        return res.flat();
      })
      .catch(e => {
        throw e;
      });
    return this.warnDuplicates(clusters);
  }

  private warnDuplicates(clusters: ClusterDetails[]): ClusterDetails[] {
    const clusterNames = new Set<string>();
    const duplicatedNames = new Set<string>();
    for (const clusterName of clusters.map(c => c.name)) {
      if (clusterNames.has(clusterName)) {
        duplicatedNames.add(clusterName);
      } else {
        clusterNames.add(clusterName);
      }
    }
    for (const clusterName of duplicatedNames) {
      this.logger.warn(`Duplicate cluster name '${clusterName}'`);
    }
    return clusters;
  }
}

export const getCombinedClusterSupplier = (
  rootConfig: Config,
  catalogClient: CatalogApi,
  authStrategy: AuthenticationStrategy,
  logger: Logger,
  refreshInterval: Duration | undefined = undefined,
): KubernetesClustersSupplier => {
  const clusterSuppliers = rootConfig
    .getConfigArray('kubernetes.clusterLocatorMethods')
    .map(clusterLocatorMethod => {
      const type = clusterLocatorMethod.getString('type');
      switch (type) {
        case 'catalog':
          return CatalogClusterLocator.fromConfig(catalogClient);
        case 'localKubectlProxy':
          return new LocalKubectlProxyClusterLocator();
        case 'config':
          return ConfigClusterLocator.fromConfig(
            clusterLocatorMethod,
            authStrategy,
          );
        case 'gke':
          return GkeClusterLocator.fromConfig(
            clusterLocatorMethod,
            refreshInterval,
          );
        default:
          throw new Error(
            `Unsupported kubernetes.clusterLocatorMethods: "${type}"`,
          );
      }
    });

  return new CombinedClustersSupplier(clusterSuppliers, logger);
};
