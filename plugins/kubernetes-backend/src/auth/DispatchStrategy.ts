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

import {
  ANNOTATION_KUBERNETES_AUTH_PROVIDER,
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
export type DispatchStrategyOptions = {
  authStrategyMap: {
    [key: string]: AuthenticationStrategy;
  };
};
/**
 * used to direct a KubernetesAuthProvider to its corresponding AuthenticationStrategy
 * @public
 */
export class DispatchStrategy implements AuthenticationStrategy {
  private readonly strategyMap: { [key: string]: AuthenticationStrategy };

  constructor(options: DispatchStrategyOptions) {
    this.strategyMap = options.authStrategyMap;
  }

  public getCredential(
    clusterDetails: ClusterDetails,
    auth: KubernetesRequestAuth,
  ): Promise<KubernetesCredential> {
    const authProvider =
      clusterDetails.authMetadata[ANNOTATION_KUBERNETES_AUTH_PROVIDER];
    if (this.strategyMap[authProvider]) {
      return this.strategyMap[authProvider].getCredential(clusterDetails, auth);
    }
    throw new Error(
      `authProvider "${authProvider}" has no AuthenticationStrategy associated with it`,
    );
  }

  public validateCluster(authMetadata: AuthMetadata): Error[] {
    const authProvider = authMetadata[ANNOTATION_KUBERNETES_AUTH_PROVIDER];
    const strategy = this.strategyMap[authProvider];
    if (!strategy) {
      return [
        new Error(
          `authProvider "${authProvider}" has no config associated with it`,
        ),
      ];
    }
    return strategy.validateCluster(authMetadata);
  }

  public presentAuthMetadata(_authMetadata: AuthMetadata): AuthMetadata {
    return {};
  }
}
