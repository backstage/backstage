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
import { JsonObject } from '@backstage/types';
import {
  ANNOTATION_KUBERNETES_OIDC_TOKEN_PROVIDER,
  KubernetesRequestAuth,
} from '@backstage/plugin-kubernetes-common';
import {
  AuthMetadata,
  AuthenticationStrategy,
  ClusterDetails,
  KubernetesCredential,
} from '@backstage/plugin-kubernetes-node';

/**
 *
 * @public
 */
export class OidcStrategy implements AuthenticationStrategy {
  public async getCredential(
    clusterDetails: ClusterDetails,
    authConfig: KubernetesRequestAuth,
  ): Promise<KubernetesCredential> {
    const oidcTokenProvider =
      clusterDetails.authMetadata[ANNOTATION_KUBERNETES_OIDC_TOKEN_PROVIDER];

    if (!oidcTokenProvider || oidcTokenProvider === '') {
      throw new Error(
        `oidc authProvider requires a configured oidcTokenProvider`,
      );
    }

    const token = (authConfig.oidc as JsonObject | null)?.[oidcTokenProvider];

    if (!token) {
      throw new Error(
        `Auth token not found under oidc.${oidcTokenProvider} in request body`,
      );
    }
    return { type: 'bearer token', token: token as string };
  }

  public validateCluster(authMetadata: AuthMetadata): Error[] {
    const oidcTokenProvider =
      authMetadata[ANNOTATION_KUBERNETES_OIDC_TOKEN_PROVIDER];
    if (!oidcTokenProvider || oidcTokenProvider === '') {
      return [new Error(`Must specify a token provider for 'oidc' strategy`)];
    }
    return [];
  }

  public presentAuthMetadata(_authMetadata: AuthMetadata): AuthMetadata {
    return {};
  }
}
