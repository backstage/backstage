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
import {
  BackendPluginProvider,
  BackendDynamicPlugin,
  isBackendDynamicPluginInstaller,
  DynamicPlugin,
} from './types';
import { ScannedPluginPackage } from '../scanner';
import { PluginScanner } from '../scanner/plugin-scanner';
import { ModuleLoader } from '../loader';
import { CommonJSModuleLoader } from '../loader/CommonJSModuleLoader';
import * as url from 'url';
import {
  BackendFeature,
  LoggerService,
  coreServices,
  createServiceFactory,
  createServiceRef,
} from '@backstage/backend-plugin-api';
import { PackageRoles } from '@backstage/cli-node';
import { findPaths } from '@backstage/cli-common';
import path from 'path';
import * as fs from 'fs';
import {
  FeatureDiscoveryService,
  featureDiscoveryServiceRef,
} from '@backstage/backend-plugin-api/alpha';

/**
 * @public
 */
export class PluginManager implements BackendPluginProvider {
  static async fromConfig(
    config: Config,
    logger: LoggerService,
    preferAlpha: boolean = false,
    moduleLoader: ModuleLoader = new CommonJSModuleLoader(logger),
  ): Promise<PluginManager> {
    /* eslint-disable-next-line no-restricted-syntax */
    const backstageRoot = findPaths(__dirname).targetRoot;
    const scanner = new PluginScanner(
      config,
      logger,
      backstageRoot,
      preferAlpha,
    );
    const scannedPlugins = await scanner.scanRoot();
    scanner.trackChanges();
    const manager = new PluginManager(logger, scannedPlugins, moduleLoader);

    const dynamicPluginsPaths = scannedPlugins.map(p =>
      fs.realpathSync(
        path.dirname(
          path.dirname(
            path.resolve(url.fileURLToPath(p.location), p.manifest.main),
          ),
        ),
      ),
    );

    moduleLoader.bootstrap(backstageRoot, dynamicPluginsPaths);

    scanner.subscribeToRootDirectoryChange(async () => {
      manager._availablePackages = await scanner.scanRoot();
      // TODO: do not store _scannedPlugins again, but instead store a diff of the changes
    });
    manager.plugins.push(...(await manager.loadPlugins()));

    return manager;
  }

  readonly plugins: DynamicPlugin[];
  private _availablePackages: ScannedPluginPackage[];

  private constructor(
    private readonly logger: LoggerService,
    private packages: ScannedPluginPackage[],
    private readonly moduleLoader: ModuleLoader,
  ) {
    this.plugins = [];
    this._availablePackages = packages;
  }

  get availablePackages(): ScannedPluginPackage[] {
    return this._availablePackages;
  }

  addBackendPlugin(plugin: BackendDynamicPlugin): void {
    this.plugins.push(plugin);
  }

  private async loadPlugins(): Promise<DynamicPlugin[]> {
    const loadedPlugins: DynamicPlugin[] = [];

    for (const scannedPlugin of this.packages) {
      const platform = PackageRoles.getRoleInfo(
        scannedPlugin.manifest.backstage.role,
      ).platform;

      if (
        platform === 'node' &&
        scannedPlugin.manifest.backstage.role.includes('-plugin')
      ) {
        const plugin = await this.loadBackendPlugin(scannedPlugin);
        if (plugin !== undefined) {
          loadedPlugins.push(plugin);
        }
      } else {
        loadedPlugins.push({
          name: scannedPlugin.manifest.name,
          version: scannedPlugin.manifest.version,
          role: scannedPlugin.manifest.backstage.role,
          platform: 'web',
          // TODO(davidfestal): add required front-end plugin information here.
        });
      }
    }
    return loadedPlugins;
  }

  private async loadBackendPlugin(
    plugin: ScannedPluginPackage,
  ): Promise<BackendDynamicPlugin | undefined> {
    const packagePath = url.fileURLToPath(
      `${plugin.location}/${plugin.manifest.main}`,
    );
    try {
      const { dynamicPluginInstaller } = await this.moduleLoader.load(
        packagePath,
      );
      if (!isBackendDynamicPluginInstaller(dynamicPluginInstaller)) {
        this.logger.error(
          `dynamic backend plugin '${plugin.manifest.name}' could not be loaded from '${plugin.location}': the module should export a 'const dynamicPluginInstaller: BackendDynamicPluginInstaller' field.`,
        );
        return undefined;
      }
      this.logger.info(
        `loaded dynamic backend plugin '${plugin.manifest.name}' from '${plugin.location}'`,
      );
      return {
        name: plugin.manifest.name,
        version: plugin.manifest.version,
        platform: 'node',
        role: plugin.manifest.backstage.role,
        installer: dynamicPluginInstaller,
      };
    } catch (error) {
      this.logger.error(
        `an error occured while loading dynamic backend plugin '${plugin.manifest.name}' from '${plugin.location}'`,
        error,
      );
      return undefined;
    }
  }

  backendPlugins(): BackendDynamicPlugin[] {
    return this.plugins.filter(
      (p): p is BackendDynamicPlugin => p.platform === 'node',
    );
  }
}

/**
 * @public
 */
export const dynamicPluginsServiceRef = createServiceRef<BackendPluginProvider>(
  {
    id: 'core.dynamicplugins',
    scope: 'root',
  },
);

/**
 * @public
 */
export interface DynamicPluginsFactoryOptions {
  moduleLoader?(logger: LoggerService): ModuleLoader;
}

/**
 * @public
 */
export const dynamicPluginsServiceFactory = createServiceFactory(
  (options?: DynamicPluginsFactoryOptions) => ({
    service: dynamicPluginsServiceRef,
    deps: {
      config: coreServices.rootConfig,
      logger: coreServices.rootLogger,
    },
    async factory({ config, logger }) {
      if (options?.moduleLoader) {
        return await PluginManager.fromConfig(
          config,
          logger,
          true,
          options.moduleLoader(logger),
        );
      }
      return await PluginManager.fromConfig(config, logger, true);
    },
  }),
);

class DynamicPluginsEnabledFeatureDiscoveryService
  implements FeatureDiscoveryService
{
  constructor(
    private readonly dynamicPlugins: BackendPluginProvider,
    private readonly featureDiscoveryService?: FeatureDiscoveryService,
  ) {}

  async getBackendFeatures(): Promise<{ features: Array<BackendFeature> }> {
    const staticFeatures =
      (await this.featureDiscoveryService?.getBackendFeatures())?.features ??
      [];

    return {
      features: [
        ...this.dynamicPlugins
          .backendPlugins()
          .flatMap((plugin): BackendFeature[] => {
            if (plugin.installer.kind === 'new') {
              const installed = plugin.installer.install();
              if (Array.isArray(installed)) {
                return installed;
              }
              return [installed];
            }
            return [];
          }),
        ...staticFeatures,
      ],
    };
  }
}

/**
 * @public
 */
export const dynamicPluginsFeatureDiscoveryServiceFactory =
  createServiceFactory({
    service: featureDiscoveryServiceRef,
    deps: {
      config: coreServices.rootConfig,
      dynamicPlugins: dynamicPluginsServiceRef,
    },
    factory({ dynamicPlugins }) {
      return new DynamicPluginsEnabledFeatureDiscoveryService(dynamicPlugins);
    },
  });
