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
import { LoggerService, SignalsService } from '@backstage/backend-plugin-api';
import { getRootLogger } from '../logging';
import { PluginSignalsManager, SignalsClientManagerOptions } from './types';
import { DefaultSignalsClient } from './SignalsClient';
import { TokenManager } from '../tokens';

class NoopSignalsClient implements SignalsService {
  connect() {}
  disconnect() {}
  publish(_: unknown, __?: any) {}
}

/**
 * Implements a signals client manager which will automatically create new signal clients
 * for plugins when requested.
 *
 * @public
 */
export class SignalsClientManager {
  private readonly logger: LoggerService;
  private readonly endpoint: string;
  private readonly signalsEnabled: boolean;
  private tokenManager?: TokenManager;

  /**
   * Creates a new {@link SignalsClientManager} instance by reading from the `backend`
   * config section, specifically the `.cache` key.
   *
   * @param config - The loaded application configuration.
   */
  static fromConfig(
    config: Config,
    options?: SignalsClientManagerOptions,
  ): SignalsClientManager {
    const { endpoint, enabled } = this.readConfig(config);
    const logger = (options?.logger || getRootLogger()).child({
      type: 'signals-client',
    });
    return new SignalsClientManager(
      enabled,
      endpoint,
      logger,
      options?.tokenManager,
    );
  }

  private static readConfig(config: Config) {
    const baseUrl =
      config.getOptionalString('backend.baseUrl') ?? 'http://localhost';
    const ws = config.getOptional('backend.signals');
    if (ws === true) {
      const enabled = true;
      return { endpoint: baseUrl, enabled };
    }

    const signalsConfig = config.getOptionalConfig('backend.signals');
    if (signalsConfig) {
      const enabled = signalsConfig.getOptionalBoolean('enabled') ?? false;
      const endpoint = signalsConfig.getOptionalString('endpoint') ?? baseUrl;
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
    this.signalsEnabled = enabled;
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
   * Generates a PluginSignalsManager for consumption by plugins.
   *
   * @param pluginId - The plugin that the signals manager should be created for.
   *        Plugin names should be unique.
   */
  forPlugin(pluginId: string): PluginSignalsManager {
    const endpoint = this.endpoint;
    const logger = this.logger;
    const signalsEnabled = this.signalsEnabled;
    const tokenManager = this.tokenManager;
    return {
      getClient(): SignalsService {
        return signalsEnabled
          ? new DefaultSignalsClient(endpoint, pluginId, logger, tokenManager)
          : new NoopSignalsClient();
      },
    };
  }
}
