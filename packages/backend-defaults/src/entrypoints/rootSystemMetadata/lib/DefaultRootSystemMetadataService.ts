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
  RootSystemMetadataService,
  RootSystemMetadataServicePluginInfo,
} from '@backstage/backend-plugin-api';
import { HostDiscovery } from '../../discovery';
import {} from '@backstage/backend-plugin-api';

/**
 * @alpha
 */
export class DefaultRootSystemMetadataService
  implements RootSystemMetadataService
{
  #hostDiscovery: HostDiscovery;
  #instanceMetadata: RootInstanceMetadataService;
  #config: RootConfigService;
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
    this.#config = options.config;
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
    const instanceAddress = this.#hostDiscovery.getInstanceAddress(
      this.#config,
    );
    const currentInstance = await this.#instanceMetadata.getInstalledPlugins();
    for (const plugin of currentInstance) {
      if (!resolutions.has(plugin.pluginId)) {
        resolutions.set(plugin.pluginId, []);
      }
      resolutions.get(plugin.pluginId)?.push(instanceAddress);
    }
    return Array.from(resolutions.entries()).map(([pluginId, targets]) => ({
      pluginId,
      hosts: Array.from(targets).filter(
        (target): target is { external: string; internal: string } =>
          Object.keys(target).length > 0,
      ),
    }));
  }

  public async getHosts(): Promise<
    ReadonlyArray<string | { external: string; internal: string }>
  > {
    const resolutions = await this.#hostDiscovery.listResolutions();
    const hosts = new Set<string | { external: string; internal: string }>();
    for (const [_, targets] of resolutions.entries()) {
      for (const target of targets) {
        hosts.add(target as string | { external: string; internal: string });
      }
    }
    return Array.from(hosts);
  }
}
