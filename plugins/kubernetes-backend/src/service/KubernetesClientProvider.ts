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
import {
  AppsV1Api,
  AutoscalingV1Api,
  CoreV1Api,
  KubeConfig,
  NetworkingV1beta1Api,
} from '@kubernetes/client-node';

export class KubernetesClientProvider {
  private readonly coreClientMap: {
    [key: string]: CoreV1Api;
  };

  private readonly appsClientMap: {
    [key: string]: AppsV1Api;
  };

  private readonly autoscalingClientMap: {
    [key: string]: AutoscalingV1Api;
  };

  private readonly networkingBeta1ClientMap: {
    [key: string]: NetworkingV1beta1Api;
  };

  constructor() {
    this.coreClientMap = {};
    this.appsClientMap = {};
    this.autoscalingClientMap = {};
    this.networkingBeta1ClientMap = {};
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

  getAutoscalingClientByClusterDetails(clusterDetails: ClusterDetails) {
    const clientMapKey = clusterDetails.name;

    if (this.autoscalingClientMap.hasOwnProperty(clientMapKey)) {
      return this.autoscalingClientMap[clientMapKey];
    }

    const kc = this.getKubeConfig(clusterDetails);

    const client = kc.makeApiClient(AutoscalingV1Api);

    this.autoscalingClientMap[clientMapKey] = client;

    return client;
  }

  getNetworkingBeta1Client(clusterDetails: ClusterDetails) {
    const clientMapKey = clusterDetails.name;

    if (this.networkingBeta1ClientMap.hasOwnProperty(clientMapKey)) {
      return this.networkingBeta1ClientMap[clientMapKey];
    }

    const kc = this.getKubeConfig(clusterDetails);

    const client = kc.makeApiClient(NetworkingV1beta1Api);

    this.networkingBeta1ClientMap[clientMapKey] = client;

    return client;
  }
}
