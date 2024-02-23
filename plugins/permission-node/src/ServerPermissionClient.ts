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

import {
  TokenManager,
  createLegacyAuthAdapters,
} from '@backstage/backend-common';
import {
  AuthService,
  BackstageCredentials,
  DiscoveryService,
  PermissionsService,
  PermissionsServiceRequestOptions,
} from '@backstage/backend-plugin-api';
import { Config } from '@backstage/config';
import {
  AuthorizeResult,
  PermissionClient,
  AuthorizePermissionRequest,
  AuthorizePermissionResponse,
  PolicyDecision,
  QueryPermissionRequest,
} from '@backstage/plugin-permission-common';

/**
 * A thin wrapper around
 * {@link @backstage/plugin-permission-common#PermissionClient} that allows all
 * service-to-service requests.
 * @public
 */
export class ServerPermissionClient implements PermissionsService {
  readonly #auth: AuthService;
  readonly #permissionClient: PermissionClient;
  readonly #permissionEnabled: boolean;

  static fromConfig(
    config: Config,
    options: {
      discovery: DiscoveryService;
      tokenManager: TokenManager;
      auth?: AuthService;
    },
  ) {
    const { discovery, tokenManager } = options;
    const permissionClient = new PermissionClient({ discovery, config });
    const permissionEnabled =
      config.getOptionalBoolean('permission.enabled') ?? false;

    if (
      permissionEnabled &&
      (tokenManager as any).isInsecureServerTokenManager
    ) {
      throw new Error(
        'Service-to-service authentication must be configured before enabling permissions. Read more here https://backstage.io/docs/auth/service-to-service-auth',
      );
    }

    const { auth } = createLegacyAuthAdapters(options);

    return new ServerPermissionClient({
      auth,
      permissionClient,
      permissionEnabled,
    });
  }

  private constructor(options: {
    auth: AuthService;
    permissionClient: PermissionClient;
    permissionEnabled: boolean;
  }) {
    this.#auth = options.auth;
    this.#permissionClient = options.permissionClient;
    this.#permissionEnabled = options.permissionEnabled;
  }

  async authorizeConditional(
    queries: QueryPermissionRequest[],
    options?: PermissionsServiceRequestOptions,
  ): Promise<PolicyDecision[]> {
    if (await this.#shouldPermissionsBeApplied(options)) {
      return this.#permissionClient.authorizeConditional(
        queries,
        await this.#getRequestOptions(options),
      );
    }

    return queries.map(_ => ({ result: AuthorizeResult.ALLOW }));
  }

  async authorize(
    requests: AuthorizePermissionRequest[],
    options?: PermissionsServiceRequestOptions,
  ): Promise<AuthorizePermissionResponse[]> {
    if (await this.#shouldPermissionsBeApplied(options)) {
      return this.#permissionClient.authorize(
        requests,
        await this.#getRequestOptions(options),
      );
    }

    return requests.map(_ => ({ result: AuthorizeResult.ALLOW }));
  }

  async #getRequestOptions(options?: PermissionsServiceRequestOptions) {
    if (options && 'credentials' in options) {
      if (this.#auth.isPrincipal(options.credentials, 'none')) {
        return {};
      }

      return this.#auth.getPluginRequestToken({
        onBehalfOf: options.credentials,
        targetPluginId: 'permissions',
      });
    }

    return options;
  }

  async #shouldPermissionsBeApplied(
    options?: PermissionsServiceRequestOptions,
  ) {
    if (!this.#permissionEnabled) {
      return false;
    }

    let credentials: BackstageCredentials;
    if (options && 'credentials' in options) {
      credentials = options.credentials;
    } else {
      if (!options?.token) {
        return true;
      }
      try {
        credentials = await this.#auth.authenticate(options.token);
      } catch {
        return true;
      }
    }

    if (this.#auth.isPrincipal(credentials, 'service')) {
      return false;
    }
    return true;
  }
}
