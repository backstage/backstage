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
import { HostDiscovery } from '../../../../entrypoints/discovery';
import {
  RootSystemMetadataService,
  RootSystemMetadataServicePluginInfo,
} from '@backstage/backend-plugin-api/alpha';

/**
 * @alpha
 */
export class DefaultRootSystemMetadataService
  implements RootSystemMetadataService
{
  #hostDiscovery: HostDiscovery;
  #instanceMetadata: RootInstanceMetadataService;
  constructor(options: {
    logger: LoggerService;
    config: RootConfigService;
    instanceMetadata: RootInstanceMetadataService;
  }) {
    this.#hostDiscovery = HostDiscovery.fromConfig(options.config, {
      logger: options.logger,
    });
    options.config.subscribe?.(() => {
      this.#hostDiscovery = HostDiscovery.fromConfig(options.config, {
        logger: options.logger,
      });
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
    const resolutions = await this.#hostDiscovery.listResolutions();
    const plugins = [];
    for (const pluginId of resolutions.keys()) {
      plugins.push({ pluginId });
    }

    for (const plugin of await this.#instanceMetadata.getInstalledPlugins()) {
      plugins.push({ pluginId: plugin.pluginId });
    }

    return plugins;
  }
}
