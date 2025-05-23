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
  AuthService,
  BackstageCredentials,
  BackstageServicePrincipal,
  DiscoveryService,
  PermissionsService,
  PermissionsServiceRequestOptions,
} from '@backstage/backend-plugin-api';
import { Config } from '@backstage/config';
import {
  AuthorizePermissionRequest,
  AuthorizePermissionResponse,
  AuthorizeResult,
  DefinitivePolicyDecision,
  Permission,
  PermissionClient,
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
      auth: AuthService;
    },
  ) {
    const { auth, discovery } = options;
    const permissionClient = new PermissionClient({ discovery, config });
    const permissionEnabled =
      config.getOptionalBoolean('permission.enabled') ?? false;

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
    const credentials = await this.#getIncomingCredentials(options);
    if (credentials && this.#auth.isPrincipal(credentials, 'service')) {
      return this.#servicePrincipalDecision(queries, credentials);
    } else if (!this.#permissionEnabled) {
      return queries.map(_ => ({ result: AuthorizeResult.ALLOW }));
    }

    return this.#permissionClient.authorizeConditional(
      queries,
      await this.#getRequestOptions(options),
    );
  }

  async authorize(
    requests: AuthorizePermissionRequest[],
    options?: PermissionsServiceRequestOptions,
  ): Promise<AuthorizePermissionResponse[]> {
    const credentials = await this.#getIncomingCredentials(options);
    if (credentials && this.#auth.isPrincipal(credentials, 'service')) {
      return this.#servicePrincipalDecision(requests, credentials);
    } else if (!this.#permissionEnabled) {
      return requests.map(_ => ({ result: AuthorizeResult.ALLOW }));
    }

    return this.#permissionClient.authorize(
      requests,
      await this.#getRequestOptions(options),
    );
  }

  async #getRequestOptions(
    options?: PermissionsServiceRequestOptions,
  ): Promise<{ token?: string } | undefined> {
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

  async #getIncomingCredentials(
    options?: PermissionsServiceRequestOptions,
  ): Promise<BackstageCredentials | undefined> {
    if (options && 'credentials' in options) {
      return options.credentials;
    }

    return undefined;
  }

  /**
   * For service principals, we can always make an immediate definitive decision
   * based on their associated access restrictions (if any).
   */
  #servicePrincipalDecision(
    input: { permission: Permission }[],
    credentials: BackstageCredentials<BackstageServicePrincipal>,
  ): DefinitivePolicyDecision[] {
    const { permissionNames, permissionAttributes } =
      credentials.principal.accessRestrictions ?? {};

    return input.map(item => {
      if (permissionNames && !permissionNames.includes(item.permission.name)) {
        return { result: AuthorizeResult.DENY };
      }

      if (permissionAttributes?.action) {
        const action = item.permission.attributes?.action;
        if (!action || !permissionAttributes.action.includes(action)) {
          return { result: AuthorizeResult.DENY };
        }
      }

      return { result: AuthorizeResult.ALLOW };
    });
  }
}
