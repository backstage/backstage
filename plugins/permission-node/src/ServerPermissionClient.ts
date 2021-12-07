/*
 * Copyright 2021 The Backstage Authors
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

import { ServerTokenManager } from '@backstage/backend-common';
import { Config } from '@backstage/config';
import {
  AuthorizeRequest,
  AuthorizeRequestOptions,
  AuthorizeResponse,
  AuthorizeResult,
  DiscoveryApi,
  PermissionClient,
} from '@backstage/plugin-permission-common';

/**
 * A server side {@link @backstage/plugin-permission-common#PermissionClient}
 * that allows all backend-to-backend requests.
 * @public
 */
export class ServerPermissionClient extends PermissionClient {
  private readonly serverTokenManager: ServerTokenManager;

  constructor(options: {
    discoveryApi: DiscoveryApi;
    configApi: Config;
    serverTokenManager: ServerTokenManager;
  }) {
    const { discoveryApi, configApi, serverTokenManager } = options;
    super({ discoveryApi, configApi });
    this.serverTokenManager = serverTokenManager;
  }

  async authorize(
    requests: AuthorizeRequest[],
    options?: AuthorizeRequestOptions,
  ): Promise<AuthorizeResponse[]> {
    if (await this.isValidServerToken(options?.token)) {
      return requests.map(_ => ({ result: AuthorizeResult.ALLOW }));
    }
    return super.authorize(requests, options);
  }

  private async isValidServerToken(
    token: string | undefined,
  ): Promise<boolean> {
    if (!token) {
      return false;
    }
    return this.serverTokenManager
      .authenticate(token)
      .then(() => true)
      .catch(() => false);
  }
}
