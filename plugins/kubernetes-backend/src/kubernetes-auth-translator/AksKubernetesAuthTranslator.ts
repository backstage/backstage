/*
 * Copyright 2022 The Backstage Authors
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

import { KubernetesAuthTranslator } from './types';
import { AzureClusterDetails } from '../types/types';
import { KubernetesRequestAuth } from '@backstage/plugin-kubernetes-common';

/**
 *
 * @alpha
 */
export class AksKubernetesAuthTranslator implements KubernetesAuthTranslator {
  async decorateClusterDetailsWithAuth(
    clusterDetails: AzureClusterDetails,
    authConfig: KubernetesRequestAuth,
  ): Promise<AzureClusterDetails> {
    const clusterDetailsWithAuthToken: AzureClusterDetails = Object.assign(
      {},
      clusterDetails,
    );
    const authToken: string | undefined = authConfig.aks;

    if (authToken) {
      clusterDetailsWithAuthToken.serviceAccountToken = authToken;
    } else {
      throw new Error('AKS token not found under auth.aks in request body');
    }
    return clusterDetailsWithAuthToken;
  }
}
