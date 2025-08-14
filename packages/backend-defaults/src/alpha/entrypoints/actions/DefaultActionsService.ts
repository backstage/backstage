/*
 * Copyright 2025 The Backstage Authors
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
  DiscoveryService,
  LoggerService,
  RootConfigService,
} from '@backstage/backend-plugin-api';
import { ResponseError } from '@backstage/errors';
import { JsonObject } from '@backstage/types';
import {
  ActionsService,
  ActionsServiceAction,
} from '@backstage/backend-plugin-api/alpha';

export class DefaultActionsService implements ActionsService {
  private constructor(
    private readonly discovery: DiscoveryService,
    private readonly config: RootConfigService,
    private readonly logger: LoggerService,
    private readonly auth: AuthService,
  ) {}

  static create({
    discovery,
    config,
    logger,
    auth,
  }: {
    discovery: DiscoveryService;
    config: RootConfigService;
    logger: LoggerService;
    auth: AuthService;
  }) {
    return new DefaultActionsService(discovery, config, logger, auth);
  }

  async list({ credentials }: { credentials: BackstageCredentials }) {
    const pluginSources =
      this.config.getOptionalStringArray('backend.actions.pluginSources') ?? [];

    const remoteActionsList = await Promise.all(
      pluginSources.map(async source => {
        try {
          const response = await this.makeRequest({
            path: `/.backstage/actions/v1/actions`,
            pluginId: source,
            credentials,
          });
          if (!response.ok) {
            throw await ResponseError.fromResponse(response);
          }
          const { actions } = (await response.json()) as {
            actions: ActionsServiceAction;
          };

          return actions;
        } catch (error) {
          this.logger.warn(`Failed to fetch actions from ${source}`, error);
          return [];
        }
      }),
    );

    return { actions: remoteActionsList.flat() };
  }

  async invoke(opts: {
    id: string;
    input?: JsonObject;
    credentials: BackstageCredentials;
  }) {
    const pluginId = this.pluginIdFromActionId(opts.id);
    const response = await this.makeRequest({
      path: `/.backstage/actions/v1/actions/${encodeURIComponent(
        opts.id,
      )}/invoke`,
      pluginId,
      credentials: opts.credentials,
      options: {
        method: 'POST',
        body: JSON.stringify(opts.input),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    });

    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    const { output } = await response.json();
    return { output };
  }

  private async makeRequest(opts: {
    path: string;
    pluginId: string;
    options?: RequestInit;
    credentials: BackstageCredentials;
  }) {
    const { path, pluginId, credentials, options } = opts;
    const baseUrl = await this.discovery.getBaseUrl(pluginId);

    const { token } = await this.auth.getPluginRequestToken({
      onBehalfOf: credentials,
      targetPluginId: opts.pluginId,
    });

    return fetch(`${baseUrl}${path}`, {
      ...options,
      headers: {
        ...options?.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  }

  private pluginIdFromActionId(id: string): string {
    const colonIndex = id.indexOf(':');
    if (colonIndex === -1) {
      throw new Error(`Invalid action id: ${id}`);
    }
    return id.substring(0, colonIndex);
  }
}
