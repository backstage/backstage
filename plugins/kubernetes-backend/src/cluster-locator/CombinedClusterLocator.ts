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
import { ClusterDetails, KubernetesClustersSupplier } from '../types/types';
import { Config } from '@backstage/config';
import { ConfigClusterLocator } from './ConfigClusterLocator';
import { GkeClusterLocator } from './GkeClusterLocator';
import { Logger } from 'winston';
import { AutoClusterLocator } from './AutoClusterLocator';

export class CombinedClusterLocator implements KubernetesClustersSupplier {
  private readonly logger: Logger;
  private readonly config: Config;
  private readonly clusterSuppliers: KubernetesClustersSupplier[];

  constructor({ logger, config }: { logger: Logger; config: Config }) {
    this.logger = logger;
    this.config = config;
    this.clusterSuppliers = [];
    this.init();
  }

  private init() {
    this.logger.info(
      'Initializing combined Kubernetes cluster locator from configurations',
    );
    this.config
      .getConfigArray('kubernetes.clusterLocatorMethods')
      .forEach(clusterLocatorConfig => {
        const type = clusterLocatorConfig.getString('type');
        switch (type) {
          case 'config':
            this.clusterSuppliers.push(
              ConfigClusterLocator.fromConfig(clusterLocatorConfig),
            );
            break;
          case 'gke':
            this.clusterSuppliers.push(
              GkeClusterLocator.fromConfig(clusterLocatorConfig),
            );
            break;
          case 'auto':
            this.clusterSuppliers.push(
              AutoClusterLocator.fromConfig({
                logger: this.logger,
                clusterLocatorConfig,
              }),
            );
            break;
          default:
            throw new Error(
              `Unsupported kubernetes.clusterLocatorMethods: "${type}"`,
            );
        }
      });
    this.logger.info(
      `Combined cluster locator loaded with ${this.clusterSuppliers.length} suppliers`,
    );
  }

  async getClusters(): Promise<ClusterDetails[]> {
    const clusters = await Promise.all(
      this.clusterSuppliers.flatMap(clusterSupplier =>
        clusterSupplier.getClusters(),
      ),
    );
    return clusters.flatMap(cluster => cluster);
  }

  async getLocators(): Promise<KubernetesClustersSupplier[]> {
    return this.clusterSuppliers;
  }
}
