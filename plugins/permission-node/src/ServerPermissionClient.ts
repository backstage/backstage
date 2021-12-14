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

import { TokenManager, ServerTokenManager } from '@backstage/backend-common';
import { Config } from '@backstage/config';
import {
  AuthorizeRequest,
  AuthorizeRequestOptions,
  AuthorizeResponse,
  AuthorizeResult,
  DiscoveryApi,
  PermissionClient,
  PermissionClientInterface,
} from '@backstage/plugin-permission-common';

/**
 * A thin wrapper around
 * {@link @backstage/plugin-permission-common#PermissionClient} that allows all
 * backend-to-backend requests.
 * @public
 */
export class ServerPermissionClient implements PermissionClientInterface {
  private readonly serverTokenManager: TokenManager;
  private readonly permissionClient: PermissionClient;
  private readonly permissionEnabled: boolean;

  constructor(options: {
    discoveryApi: DiscoveryApi;
    configApi: Config;
    serverTokenManager: TokenManager;
  }) {
    const { discoveryApi, configApi, serverTokenManager } = options;
    this.permissionClient = new PermissionClient({ discoveryApi, configApi });
    this.permissionEnabled =
      options.configApi.getOptionalBoolean('permission.enabled') ?? false;

    if (
      this.permissionEnabled &&
      // TODO: Find a cleaner way of ensuring usage of SERVER token manager when
      // permissions are enabled.
      serverTokenManager instanceof ServerTokenManager.noop().constructor
    ) {
      throw new Error(
        'You must configure at least one key in backend.auth.keys if permissions are enabled.',
      );
    }
    this.serverTokenManager = serverTokenManager;
  }

  async authorize(
    requests: AuthorizeRequest[],
    options?: AuthorizeRequestOptions,
  ): Promise<AuthorizeResponse[]> {
    // Check if permissions are enabled before validating the server token. That
    // way when permissions are disabled, the noop token manager can be used
    // without fouling up the logic inside the ServerPermissionClient, because
    // the code path won't be reached.
    if (
      !this.permissionEnabled ||
      (await this.isValidServerToken(options?.token))
    ) {
      return requests.map(_ => ({ result: AuthorizeResult.ALLOW }));
    }
    return this.permissionClient.authorize(requests, options);
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
