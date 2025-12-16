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
import { Minimatch } from 'minimatch';

export class DefaultActionsService implements ActionsService {
  private readonly discovery: DiscoveryService;
  private readonly config: RootConfigService;
  private readonly logger: LoggerService;
  private readonly auth: AuthService;

  private constructor(
    discovery: DiscoveryService,
    config: RootConfigService,
    logger: LoggerService,
    auth: AuthService,
  ) {
    this.discovery = discovery;
    this.config = config;
    this.logger = logger;
    this.auth = auth;
  }

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

    return { actions: this.applyFilters(remoteActionsList.flat()) };
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

  private applyFilters(
    actions: ActionsServiceAction[],
  ): ActionsServiceAction[] {
    const includePatterns = this.config.getOptionalStringArray(
      'backend.actions.filter.include',
    ) ?? ['*'];
    const excludePatterns =
      this.config.getOptionalStringArray('backend.actions.filter.exclude') ??
      [];
    const attributesConfig = this.config.getOptionalConfig(
      'backend.actions.filter.attributes',
    );

    // Pre-compile matchers for efficiency
    const includeMatchers = includePatterns.map(p => new Minimatch(p));
    const excludeMatchers = excludePatterns.map(p => new Minimatch(p));

    // Build attribute constraints
    const attributeConstraints: Array<{
      key: 'destructive' | 'readOnly' | 'idempotent';
      value: boolean;
    }> = [];
    if (attributesConfig) {
      for (const key of ['destructive', 'readOnly', 'idempotent'] as const) {
        const value = attributesConfig.getOptionalBoolean(key);
        if (value !== undefined) {
          attributeConstraints.push({ key, value });
        }
      }
    }

    return actions.filter(action => {
      // Must match at least one include pattern
      const included = includeMatchers.some(m => m.match(action.id));
      if (!included) {
        return false;
      }

      // Must not match any exclude pattern
      const excluded = excludeMatchers.some(m => m.match(action.id));
      if (excluded) {
        return false;
      }

      // Must satisfy all attribute constraints
      for (const { key, value } of attributeConstraints) {
        if (action.attributes[key] !== value) {
          return false;
        }
      }

      return true;
    });
  }
}
