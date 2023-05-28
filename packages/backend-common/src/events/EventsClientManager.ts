/*
 * Copyright 2023 The Backstage Authors
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

import { Config } from '@backstage/config';
import { LoggerService, EventsService } from '@backstage/backend-plugin-api';
import { getRootLogger } from '../logging';
import { PluginEventsManager, EventsClientManagerOptions } from './types';
import { DefaultEventsClient } from './EventsClient';
import { TokenManager } from '../tokens';

class NoopEventsClient implements EventsService {
  connect() {}
  disconnect() {}
  publish(_: unknown, __?: any) {}
  subscribe(_: string, __: (data: unknown) => void, ___?: string) {}
  unsubscribe(_: string, __?: string) {}
}

/**
 * Implements a events client manager which will automatically create new event clients
 * for plugins when requested.
 *
 * @public
 */
export class EventsClientManager {
  private readonly logger: LoggerService;
  private readonly endpoint: string;
  private readonly eventsEnabled: boolean;
  private tokenManager?: TokenManager;

  /**
   * Creates a new {@link EventsClientManager} instance by reading from the `backend`
   * config section, specifically the `.cache` key.
   *
   * @param config - The loaded application configuration.
   */
  static fromConfig(
    config: Config,
    options?: EventsClientManagerOptions,
  ): EventsClientManager {
    const { endpoint, enabled } = this.readConfig(config);
    const logger = (options?.logger || getRootLogger()).child({
      type: 'events-client',
    });
    return new EventsClientManager(
      enabled,
      endpoint,
      logger,
      options?.tokenManager,
    );
  }

  private static readConfig(config: Config) {
    const baseUrl =
      config.getOptionalString('backend.baseUrl') ?? 'http://localhost';
    const ws = config.getOptional('backend.events');
    if (ws === true) {
      const enabled = true;
      const url = new URL(baseUrl);
      const https = config.getOptional('backend.https');
      url.protocol = https ? 'wss' : 'ws';
      const endpoint = url.toString();
      return { endpoint, enabled };
    }

    const eventsConfig = config.getOptionalConfig('backend.events');
    if (eventsConfig) {
      const enabled = eventsConfig.getOptionalBoolean('enabled') || false;
      const endpoint = eventsConfig.getOptionalString('endpoint') ?? baseUrl;
      return { endpoint, enabled };
    }

    return { endpoint: '', enabled: false };
  }

  private constructor(
    enabled: boolean,
    endpoint: string,
    logger: LoggerService,
    tokenManager?: TokenManager,
  ) {
    this.eventsEnabled = enabled;
    this.endpoint = endpoint;
    this.logger = logger;
    this.tokenManager = tokenManager;
  }

  /**
   * Set token manager for this service manager
   *
   * @param tokenManager - Token manager
   */
  setTokenManager(tokenManager: TokenManager) {
    this.tokenManager = tokenManager;
    return this;
  }

  /**
   * Generates a PluginEventsManager for consumption by plugins.
   *
   * @param pluginId - The plugin that the events manager should be created for.
   *        Plugin names should be unique.
   */
  forPlugin(pluginId: string): PluginEventsManager {
    const endpoint = this.endpoint;
    const logger = this.logger;
    const eventsEnabled = this.eventsEnabled;
    const tokenManager = this.tokenManager;
    return {
      getClient(): EventsService {
        return eventsEnabled
          ? new DefaultEventsClient(endpoint, pluginId, logger, tokenManager)
          : new NoopEventsClient();
      },
    };
  }
}
