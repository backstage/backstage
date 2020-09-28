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

import { ClusterDetails } from '..';
import { AppsV1Api, CoreV1Api, KubeConfig } from '@kubernetes/client-node';

export class KubernetesClientProvider {
  private readonly coreClientMap: {
    [key: string]: CoreV1Api;
  };

  private readonly appsClientMap: {
    [key: string]: AppsV1Api;
  };

  constructor() {
    this.coreClientMap = {};
    this.appsClientMap = {};
  }

  // visible for testing
  getKubeConfig(clusterDetails: ClusterDetails) {
    const cluster = {
      name: clusterDetails.name,
      server: clusterDetails.url,
      // TODO configure this
      skipTLSVerify: true,
    };

    // TODO configure
    const user = {
      name: 'service-account',
      token: clusterDetails.serviceAccountToken,
    };

    const context = {
      name: `${clusterDetails.name}`,
      user: user.name,
      cluster: cluster.name,
    };

    const kc = new KubeConfig();
    kc.loadFromOptions({
      clusters: [cluster],
      users: [user],
      contexts: [context],
      currentContext: context.name,
    });
    return kc;
  }

  getCoreClientByClusterDetails(clusterDetails: ClusterDetails) {
    const clientMapKey = clusterDetails.name;

    if (this.coreClientMap.hasOwnProperty(clientMapKey)) {
      return this.coreClientMap[clientMapKey];
    }

    const kc = this.getKubeConfig(clusterDetails);

    const client = kc.makeApiClient(CoreV1Api);

    this.coreClientMap[clientMapKey] = client;

    return client;
  }

  getAppsClientByClusterDetails(clusterDetails: ClusterDetails) {
    const clientMapKey = clusterDetails.name;

    if (this.appsClientMap.hasOwnProperty(clientMapKey)) {
      return this.appsClientMap[clientMapKey];
    }

    const kc = this.getKubeConfig(clusterDetails);

    const client = kc.makeApiClient(AppsV1Api);

    this.appsClientMap[clientMapKey] = client;

    return client;
  }
}
