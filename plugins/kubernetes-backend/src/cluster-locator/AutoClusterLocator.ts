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
import * as k8s from '@kubernetes/client-node';
import { CoreV1Api, KubeConfig, V1Secret } from '@kubernetes/client-node';
import { Logger } from 'winston';
import { Config } from '@backstage/config';
import { ClusterDetails, KubernetesClustersSupplier } from '../types/types';

/**
 * The configuration parameters for Kubernetes clusters automatic locator.
 */
export type AutoClusterLocatorConfig = {
  /**
   * Kubernetes label and value to specify a selector for multi-cluster secrets to watch
   */
  labelSelector: string;
  /**
   * Kubernetes label exposing cluster name
   */
  labelClusterName: string;
};

/**
 * Reads configuration for automatic Kubernetes clusters locator.
 *
 * @param autoLocatorConfig The config object
 */
export function readFromConfig(
  autoLocatorConfig: Config,
): AutoClusterLocatorConfig {
  const labelSelector = autoLocatorConfig.getString('labelSelector');
  const labelClusterName = autoLocatorConfig.getString('labelClusterName');

  return { labelSelector, labelClusterName };
}

export class AutoClusterLocator implements KubernetesClustersSupplier {
  private readonly clusterDetails = new Map<string, ClusterDetails>();
  private readonly logger: Logger;
  private readonly locatorConfig: AutoClusterLocatorConfig;

  constructor({
    logger,
    locatorConfig,
  }: {
    logger: Logger;
    locatorConfig: AutoClusterLocatorConfig;
  }) {
    this.logger = logger;
    this.locatorConfig = locatorConfig;
  }

  static fromConfig({
    logger,
    clusterLocatorConfig,
  }: {
    logger: Logger;
    clusterLocatorConfig: Config;
  }): AutoClusterLocator {
    const locatorConfig = readFromConfig(clusterLocatorConfig);
    return new AutoClusterLocator({ logger, locatorConfig });
  }

  async start() {
    this.logger.info('Starting auto-supplier for Kubernetes clusters');
    this.logger.info('Start connecting to default cluster');

    const kubeConfig = new k8s.KubeConfig();
    kubeConfig.loadFromDefault();

    const k8sApi = kubeConfig.makeApiClient(k8s.CoreV1Api);
    await this.loadClusters(k8sApi);
    await this.startWatch(kubeConfig);
  }

  startWatch(kubeConfig: KubeConfig) {
    this.logger.info(
      'Registering Kubernetes watcher kubernetes multi-clusters',
    );
    const watch = new k8s.Watch(kubeConfig);
    watch
      .watch(
        '/api/v1/secrets',
        {
          labelSelector: this.locatorConfig.labelSelector,
        },
        (type, apiObj) => {
          switch (type) {
            case 'ADDED':
              this.onSecretAdded(apiObj);
              break;
            case 'MODIFIED':
              this.onSecretUpdated(apiObj);
              break;
            case 'DELETED':
              this.onSecretDeleted(apiObj);
              break;
            default:
              this.logger.info(`Skipping Multi-cluster secret ${type} event`);
          }
          this.logger.info(
            `Multi-cluster secret ${type} event successfully processed`,
          );
        },
        // done callback is called if the watch terminates normally
        error => {
          this.logger.error(`Error watching multi-cluster secrets`, error);
        },
      )
      .then(req => {
        // watch returns a request object which you can use to abort the watch.
        setTimeout(() => {
          req.abort();
        }, 10 * 1000);
      });
  }

  private async loadClusters(k8sApi: CoreV1Api) {
    this.logger.info('Start loading clusters from multi-cluster secrets');
    const response = await k8sApi.listSecretForAllNamespaces(
      false,
      '',
      '',
      this.locatorConfig.labelSelector,
    );
    response.body.items.forEach(secret => this.onSecretAdded(secret));
    this.logger.info('Clusters successfully loaded from multi-cluster secrets');
  }

  private extractCluster(secret: V1Secret): ClusterDetails | undefined {
    const clusterName =
      secret.metadata?.labels?.[this.locatorConfig.labelClusterName];
    if (clusterName) {
      this.logger.info(`Parsing cluster ${clusterName}`);
      const serviceAccountToken = secret.data?.token;
      const server = secret.data?.server;

      if (server && serviceAccountToken) {
        return {
          name: clusterName,
          url: this.decode(server),
          serviceAccountToken: this.decode(serviceAccountToken),
          skipTLSVerify: false,
          authProvider: 'serviceAccount',
        };
      }
    }
    return undefined;
  }

  async getClusters(): Promise<ClusterDetails[]> {
    return Array.from(this.clusterDetails.values());
  }

  private onSecretDeleted(secret: V1Secret) {
    const clusterName =
      secret.metadata?.labels?.[this.locatorConfig.labelClusterName];
    this.clusterDetails.delete(clusterName!!);
    this.logger.info(`Cluster ${clusterName} removed`);
  }

  private onSecretAdded(secret: V1Secret) {
    const cluster = this.extractCluster(secret);
    if (cluster) {
      this.clusterDetails.set(cluster.name, cluster);
      this.logger.info(`Cluster ${cluster.name} added`);
    }
  }

  private onSecretUpdated(secret: V1Secret) {
    const cluster = this.extractCluster(secret);
    if (cluster) {
      this.clusterDetails.set(cluster.name, cluster);
      this.logger.info(`Cluster ${cluster.name} updated`);
    }
  }

  private decode(base64Encoded: string): string {
    return Buffer.from(base64Encoded, 'base64').toString();
  }
}
