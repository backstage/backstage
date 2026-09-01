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
import { toError } from '@backstage/errors';
import { Duration } from 'luxon';
import { ConfigClusterLocator } from './ConfigClusterLocator';
import { GkeClusterLocator } from './GkeClusterLocator';
import { CatalogClusterLocator } from './CatalogClusterLocator';
import { LocalKubectlProxyClusterLocator } from './LocalKubectlProxyLocator';
import {
  AuthService,
  BackstageCredentials,
  LoggerService,
} from '@backstage/backend-plugin-api';
import {
  AuthenticationStrategy,
  ClusterDetails,
  KubernetesClustersSupplier,
} from '@backstage/plugin-kubernetes-node';
import { CatalogService } from '@backstage/plugin-catalog-node';

class CombinedClustersSupplier implements KubernetesClustersSupplier {
  readonly clusterSuppliers: KubernetesClustersSupplier[];
  readonly logger: LoggerService;
  readonly continueOnError: boolean;

  constructor(
    clusterSuppliers: KubernetesClustersSupplier[],
    logger: LoggerService,
    continueOnError: boolean = false,
  ) {
    this.clusterSuppliers = clusterSuppliers;
    this.logger = logger;
    this.continueOnError = continueOnError;
  }

  async getClusters(options: {
    credentials: BackstageCredentials;
  }): Promise<ClusterDetails[]> {
    const clusters = this.continueOnError
      ? await this.getClustersSettled(options)
      : await Promise.all(
          this.clusterSuppliers.map(supplier => supplier.getClusters(options)),
        ).then(res => res.flat());
    return this.warnDuplicates(clusters);
  }

  private async getClustersSettled(options: {
    credentials: BackstageCredentials;
  }): Promise<ClusterDetails[]> {
    const results = await Promise.allSettled(
      this.clusterSuppliers.map(supplier => supplier.getClusters(options)),
    );
    const clusters: ClusterDetails[] = [];
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      if (result.status === 'fulfilled') {
        clusters.push(...result.value);
      } else {
        this.logger.error(
          `Failed to retrieve clusters from cluster locator method #${i + 1}`,
          toError(result.reason),
        );
      }
    }
    return clusters;
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
  catalogService: CatalogService,
  authStrategy: AuthenticationStrategy,
  logger: LoggerService,
  refreshInterval: Duration | undefined = undefined,
  auth: AuthService,
): KubernetesClustersSupplier => {
  const clusterSuppliers = rootConfig
    .getConfigArray('kubernetes.clusterLocatorMethods')
    .map(clusterLocatorMethod => {
      const type = clusterLocatorMethod.getString('type');
      switch (type) {
        case 'catalog':
          return CatalogClusterLocator.fromConfig(catalogService, auth);
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
            logger,
            refreshInterval,
          );
        default:
          throw new Error(
            `Unsupported kubernetes.clusterLocatorMethods: "${type}"`,
          );
      }
    });

  const continueOnError =
    rootConfig.getOptionalBoolean('kubernetes.clusterLocatorContinueOnError') ??
    false;

  return new CombinedClustersSupplier(
    clusterSuppliers,
    logger,
    continueOnError,
  );
};
