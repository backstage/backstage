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
  AuthorizeRequestOptions,
  DiscoveryApi,
  PermissionClient,
} from '@backstage/plugin-permission-common';

/**
 * A server side {@link @backstage/plugin-permission-common#PermissionClient}
 * that allows all backend-to-backend requests.
 * @public
 */
export class ServerPermissionClient extends PermissionClient {
  private readonly serverTokenManager: TokenManager;

  constructor(options: {
    discoveryApi: DiscoveryApi;
    configApi: Config;
    serverTokenManager: TokenManager;
  }) {
    const { discoveryApi, configApi, serverTokenManager } = options;
    super({ discoveryApi, configApi });

    if (
      this.enabled &&
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

  async shouldBypass(options?: AuthorizeRequestOptions): Promise<boolean> {
    // Call super first in order to check if permissions are enabled before
    // validating the server token. That way when permissions are disabled, the
    // noop token manager can be used without fouling up the logic inside the
    // ServerPermissionClient, because the code path won't be reached.
    if (await super.shouldBypass(options)) {
      return true;
    }
    if (await this.isValidServerToken(options?.token)) {
      return true;
    }
    return false;
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
