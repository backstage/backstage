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

import {
  AuthMetadata,
  AuthenticationStrategy,
  KubernetesCredential,
} from '@backstage/plugin-kubernetes-node';
import * as container from '@google-cloud/container';

/**
 *
 * @public
 */
export class GoogleServiceAccountStrategy implements AuthenticationStrategy {
  public async getCredential(): Promise<KubernetesCredential> {
    const client = new container.v1.ClusterManagerClient();
    const token = await client.auth.getAccessToken();

    if (!token) {
      throw new Error(
        'Unable to obtain access token for the current Google Application Default Credentials',
      );
    }
    return { type: 'bearer token', token };
  }

  public validateCluster(): Error[] {
    return [];
  }

  public presentAuthMetadata(_authMetadata: AuthMetadata): AuthMetadata {
    return {};
  }
}
