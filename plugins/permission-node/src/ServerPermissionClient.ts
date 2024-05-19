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
  DefinitivePolicyDecision,
} from '@backstage/plugin-permission-common';

/**
 * A thin wrapper around
 * {@link @backstage/plugin-permission-common#PermissionClient} that ensures the
 * proper short-circuit handling of service principals.
 *
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
    const maybeResponse = this.#decideBasedOnPrincipalAccessRestrictions(
      queries,
      options,
    );
    if (maybeResponse) {
      return maybeResponse;
    }

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
    const maybeResponse = this.#decideBasedOnPrincipalAccessRestrictions(
      requests,
      options,
    );
    if (maybeResponse) {
      return maybeResponse;
    }

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
        targetPluginId: 'permission',
      });
    }

    return options;
  }

  #decideBasedOnPrincipalAccessRestrictions(
    requests: Array<QueryPermissionRequest | AuthorizePermissionRequest>,
    options?: PermissionsServiceRequestOptions,
  ): DefinitivePolicyDecision[] | undefined {
    if (!options || !('credentials' in options)) {
      return undefined;
    }

    // Bail out to the old behavior if
    // - the principal is not a service
    // - the principal was apparently unrestricted
    const credentials = options.credentials;
    if (
      !this.#auth.isPrincipal(credentials, 'service') ||
      !credentials.principal.accessRestrictions
    ) {
      return undefined;
    }

    const { permissionNames, permissionAttributes } =
      credentials.principal.accessRestrictions;

    return requests.map(query => {
      if (permissionNames && !permissionNames.includes(query.permission.name)) {
        return { result: AuthorizeResult.DENY };
      }
      if (permissionAttributes?.action) {
        const action = query.permission.attributes?.action;
        if (!action || !permissionAttributes.action.includes(action)) {
          return { result: AuthorizeResult.DENY };
        }
      }
      return { result: AuthorizeResult.ALLOW };
    });
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
