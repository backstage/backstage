/*
 * Copyright 2024 The Backstage Authors
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
  LoggerService,
  RootConfigService,
  RootInstanceMetadataService,
} from '@backstage/backend-plugin-api';
import {
  RootSystemMetadataService,
  RootSystemMetadataServicePluginInfo,
} from '@backstage/backend-plugin-api/alpha';
import { getEndpoints } from '../../../../entrypoints/discovery/parsing';
import { Config } from '@backstage/config';

function getPlugins(config: Config): string[] {
  const endpoints = getEndpoints(config);
  return Array.from(new Set(endpoints.flatMap(endpoint => endpoint.plugins)));
}

/**
 * @alpha
 */
export class DefaultRootSystemMetadataService
  implements RootSystemMetadataService
{
  #plugins: string[];
  #instanceMetadata: RootInstanceMetadataService;
  constructor(options: {
    logger: LoggerService;
    config: RootConfigService;
    instanceMetadata: RootInstanceMetadataService;
  }) {
    const { config } = options;
    this.#plugins = getPlugins(config);
    config.subscribe?.(() => {
      this.#plugins = getPlugins(config);
    });
    this.#instanceMetadata = options.instanceMetadata;
  }

  public static create(pluginEnv: {
    logger: LoggerService;
    config: RootConfigService;
    instanceMetadata: RootInstanceMetadataService;
  }) {
    return new DefaultRootSystemMetadataService(pluginEnv);
  }

  public async getInstalledPlugins(): Promise<
    RootSystemMetadataServicePluginInfo[]
  > {
    const plugins = this.#plugins.map(pluginId => ({ pluginId }));

    for (const plugin of await this.#instanceMetadata.getInstalledPlugins()) {
      plugins.push({ pluginId: plugin.pluginId });
    }

    return plugins;
  }
}
