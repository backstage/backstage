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

import { ANNOTATION_KUBERNETES_AUTH_PROVIDER } from '@backstage/plugin-kubernetes-common';
import {
  ClusterDetails,
  KubernetesClustersSupplier,
} from '@backstage/plugin-kubernetes-node';
import dns from 'node:dns';

export class LocalKubectlProxyClusterLocator
  implements KubernetesClustersSupplier
{
  private readonly clusterDetails: ClusterDetails[];
  // verbatim: when false, IPv4 addresses are placed before IPv6 addresses, ignoring the order from the DNS resolver
  // By default kubectl proxy listens on 127.0.0.1 instead of [::1]
  private lookupPromise = dns.promises.lookup('localhost', { verbatim: false });

  public constructor() {
    this.clusterDetails = [
      {
        name: 'local',
        url: 'http://localhost:8001',
        authMetadata: {
          [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: 'localKubectlProxy',
        },
        skipMetricsLookup: true,
      },
    ];
  }

  async getClusters(): Promise<ClusterDetails[]> {
    const lookupResolution = await this.lookupPromise;
    this.clusterDetails[0].url = `http://${lookupResolution.address}:8001`;
    return this.clusterDetails;
  }
}
