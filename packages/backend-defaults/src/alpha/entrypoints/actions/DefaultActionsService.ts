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
  MetricsService,
} from '@backstage/backend-plugin-api/alpha';
import { performance } from 'perf_hooks';
import { ATTR_ERROR_TYPE } from '@opentelemetry/semantic-conventions';
import { Attributes } from '@opentelemetry/api';

// todo: the start of Backstage metric names that could be in a semantic convention
export const METRIC_BACKSTAGE_ACTIONS_DURATION =
  'actions.request.duration' as const;
export const METRIC_BACKSTAGE_ACTIONS_COUNT = 'actions.request.count' as const;

// todo: the start of Backstage attributes that could be in a semantic convention
export const ATTR_BACKSTAGE_ACTION_ID = 'backstage.action.id' as const;
export const ATTR_BACKSTAGE_PLUGIN_SOURCE = 'backstage.plugin.source' as const;
export const ATTR_BACKSTAGE_ACTION_METHOD = 'backstage.action.method' as const;

export class DefaultActionsService implements ActionsService {
  private readonly discovery: DiscoveryService;
  private readonly config: RootConfigService;
  private readonly logger: LoggerService;
  private readonly auth: AuthService;

  private readonly requestCounter: ReturnType<MetricsService['createCounter']>;
  private readonly requestDuration: ReturnType<
    MetricsService['createHistogram']
  >;

  private constructor(
    discovery: DiscoveryService,
    config: RootConfigService,
    logger: LoggerService,
    auth: AuthService,
    metrics: MetricsService,
  ) {
    this.discovery = discovery;
    this.config = config;
    this.logger = logger;
    this.auth = auth;

    this.requestDuration = metrics.createHistogram(
      METRIC_BACKSTAGE_ACTIONS_DURATION,
      {
        description: 'Duration of action requests',
        unit: 'ms',
      },
    );

    this.requestCounter = metrics.createCounter(
      METRIC_BACKSTAGE_ACTIONS_COUNT,
      {
        description: 'Total number of action requests',
      },
    );
  }

  static create({
    discovery,
    config,
    logger,
    auth,
    metrics,
  }: {
    discovery: DiscoveryService;
    config: RootConfigService;
    logger: LoggerService;
    auth: AuthService;
    metrics: MetricsService;
  }) {
    return new DefaultActionsService(discovery, config, logger, auth, metrics);
  }

  async list({ credentials }: { credentials: BackstageCredentials }) {
    const startTime = performance.now();
    const attributes: Attributes = {
      [ATTR_BACKSTAGE_ACTION_METHOD]: 'list',
    };

    const pluginSources =
      this.config.getOptionalStringArray('backend.actions.pluginSources') ?? [];

    try {
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
    } catch (error) {
      attributes[ATTR_ERROR_TYPE] =
        error instanceof Error ? error.name : 'Error';
      throw error;
    } finally {
      const duration = performance.now() - startTime;
      this.requestCounter.add(1, attributes);
      this.requestDuration.record(duration, attributes);
    }
  }

  async invoke(opts: {
    id: string;
    input?: JsonObject;
    credentials: BackstageCredentials;
  }) {
    const startTime = performance.now();
    const method = 'invoke';
    const pluginId = this.pluginIdFromActionId(opts.id);

    const attributes: Attributes = {
      [ATTR_BACKSTAGE_ACTION_METHOD]: method,
      [ATTR_BACKSTAGE_ACTION_ID]: opts.id,
      [ATTR_BACKSTAGE_PLUGIN_SOURCE]: pluginId,
    };

    try {
      const response = await this.makeRequest({
        path: `/.backstage/actions/v1/actions/${encodeURIComponent(
          opts.id,
        )}/invoke`,
        pluginId,
        credentials: opts.credentials,
        options: {
          method: 'POST',
          body: JSON.stringify(opts.input),
          headers: { 'Content-Type': 'application/json' },
        },
      });

      if (!response.ok) {
        throw await ResponseError.fromResponse(response);
      }

      const { output } = await response.json();
      return { output };
    } catch (error) {
      // Add error.type attribute per OTEL spec
      attributes[ATTR_ERROR_TYPE] =
        error instanceof Error ? error.name : 'Error';

      throw error;
    } finally {
      const duration = performance.now() - startTime;

      this.requestCounter.add(1, attributes);
      this.requestDuration.record(duration, attributes);
    }
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
