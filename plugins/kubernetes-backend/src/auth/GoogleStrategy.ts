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

import { KubernetesRequestAuth } from '@backstage/plugin-kubernetes-common';
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
export class GoogleStrategy implements AuthenticationStrategy {
  public async getCredential(
    _: ClusterDetails,
    requestAuth: KubernetesRequestAuth,
  ): Promise<KubernetesCredential> {
    const token = requestAuth.google;
    if (!token) {
      throw new Error(
        'Google token not found under auth.google in request body',
      );
    }
    return { type: 'bearer token', token: token as string };
  }

  public validateCluster(): Error[] {
    return [];
  }

  public presentAuthMetadata(_authMetadata: AuthMetadata): AuthMetadata {
    return {};
  }
}
