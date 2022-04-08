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
  PluginEndpointDiscovery,
} from '@backstage/backend-common';
import { Config } from '@backstage/config';
import {
  AuthorizeResult,
  PermissionClient,
  PermissionEvaluator,
  AuthorizePermissionRequest,
  EvaluatorRequestOptions,
  AuthorizePermissionResponse,
  PolicyDecision,
  QueryPermissionRequest,
} from '@backstage/plugin-permission-common';

/**
 * A thin wrapper around
 * {@link @backstage/plugin-permission-common#PermissionClient} that allows all
 * backend-to-backend requests.
 * @public
 */
export class ServerPermissionClient implements PermissionEvaluator {
  private readonly permissionClient: PermissionClient;
  private readonly tokenManager: TokenManager;
  private readonly permissionEnabled: boolean;

  static fromConfig(
    config: Config,
    options: {
      discovery: PluginEndpointDiscovery;
      tokenManager: TokenManager;
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
        'Backend-to-backend authentication must be configured before enabling permissions. Read more here https://backstage.io/docs/tutorials/backend-to-backend-auth',
      );
    }

    return new ServerPermissionClient({
      permissionClient,
      tokenManager,
      permissionEnabled,
    });
  }

  private constructor(options: {
    permissionClient: PermissionClient;
    tokenManager: TokenManager;
    permissionEnabled: boolean;
  }) {
    this.permissionClient = options.permissionClient;
    this.tokenManager = options.tokenManager;
    this.permissionEnabled = options.permissionEnabled;
  }

  async authorizeConditional(
    queries: QueryPermissionRequest[],
    options?: EvaluatorRequestOptions,
  ): Promise<PolicyDecision[]> {
    return (await this.isEnabled(options?.token))
      ? this.permissionClient.authorizeConditional(queries, options)
      : queries.map(_ => ({ result: AuthorizeResult.ALLOW }));
  }

  async authorize(
    requests: AuthorizePermissionRequest[],
    options?: EvaluatorRequestOptions,
  ): Promise<AuthorizePermissionResponse[]> {
    return (await this.isEnabled(options?.token))
      ? this.permissionClient.authorize(requests, options)
      : requests.map(_ => ({ result: AuthorizeResult.ALLOW }));
  }

  private async isValidServerToken(
    token: string | undefined,
  ): Promise<boolean> {
    if (!token) {
      return false;
    }
    return this.tokenManager
      .authenticate(token)
      .then(() => true)
      .catch(() => false);
  }

  private async isEnabled(token?: string) {
    // Check if permissions are enabled before validating the server token. That
    // way when permissions are disabled, the noop token manager can be used
    // without fouling up the logic inside the ServerPermissionClient, because
    // the code path won't be reached.
    return this.permissionEnabled && !(await this.isValidServerToken(token));
  }
}
