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

import { KubernetesAuthTranslator } from './types';
import { ClusterDetails } from '../types/types';
import { KubernetesRequestAuth } from '@backstage/plugin-kubernetes-common';

export class OidcKubernetesAuthTranslator implements KubernetesAuthTranslator {
  async decorateClusterDetailsWithAuth(
    clusterDetails: ClusterDetails,
    authConfig: KubernetesRequestAuth,
  ): Promise<ClusterDetails> {
    const clusterDetailsWithAuthToken: ClusterDetails = Object.assign(
      {},
      clusterDetails,
    );

    const { oidcTokenProvider } = clusterDetails;

    if (!oidcTokenProvider || oidcTokenProvider === '') {
      throw new Error(
        `oidc authProvider requires a configured oidcTokenProvider`,
      );
    }

    const authToken: string | undefined = authConfig.oidc?.[oidcTokenProvider];

    if (authToken) {
      clusterDetailsWithAuthToken.serviceAccountToken = authToken;
    } else {
      throw new Error(
        `Auth token not found under oidc.${oidcTokenProvider} in request body`,
      );
    }
    return clusterDetailsWithAuthToken;
  }
}
