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
import { ClusterDetails } from '../types';
import { KubernetesRequestAuth } from '@backstage/plugin-kubernetes-common';

/**
 *
 * @public
 */
export type KubernetesAuthTranslatorGeneratorOptions = {
  authTranslatorMap: {
    [key: string]: KubernetesAuthTranslator;
  };
};
/**
 * used to direct a KubernetesAuthProvider to its corresponding KubernetesAuthTranslator
 * @public
 */
export class DispatchingKubernetesAuthTranslator
  implements KubernetesAuthTranslator
{
  private readonly translatorMap: { [key: string]: KubernetesAuthTranslator };

  constructor(options: KubernetesAuthTranslatorGeneratorOptions) {
    this.translatorMap = options.authTranslatorMap;
  }

  public decorateClusterDetailsWithAuth(
    clusterDetails: ClusterDetails,
    auth: KubernetesRequestAuth,
  ) {
    if (this.translatorMap[clusterDetails.authProvider]) {
      return this.translatorMap[
        clusterDetails.authProvider
      ].decorateClusterDetailsWithAuth(clusterDetails, auth);
    }
    throw new Error(
      `authProvider "${clusterDetails.authProvider}" has no KubernetesAuthTranslator associated with it`,
    );
  }
}
