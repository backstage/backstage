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
  DynamicPluginProvider,
  BackendDynamicPlugin,
  isBackendDynamicPluginInstaller,
  DynamicPlugin,
  FrontendDynamicPlugin,
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
  createBackendFeatureLoader,
  createServiceFactory,
  createServiceRef,
} from '@backstage/backend-plugin-api';
import { PackageRole, PackageRoles } from '@backstage/cli-node';
import { findPaths } from '@backstage/cli-common';
import * as fs from 'fs';
import {
  FeatureDiscoveryService,
  featureDiscoveryServiceRef,
} from '@backstage/backend-plugin-api/alpha';

/**
 * @public
 */
export interface DynamicPluginManagerOptions {
  config: Config;
  logger: LoggerService;
  preferAlpha?: boolean;
  moduleLoader?: ModuleLoader;
}

/**
 * @public
 */
export class DynamicPluginManager implements DynamicPluginProvider {
  static async create(
    options: DynamicPluginManagerOptions,
  ): Promise<DynamicPluginManager> {
    /* eslint-disable-next-line no-restricted-syntax */
    const backstageRoot = findPaths(__dirname).targetRoot;
    const scanner = PluginScanner.create({
      config: options.config,
      logger: options.logger,
      backstageRoot,
      preferAlpha: options.preferAlpha,
    });
    const scannedPlugins = (await scanner.scanRoot()).packages;
    await scanner.trackChanges();
    const moduleLoader =
      options.moduleLoader ||
      new CommonJSModuleLoader({ logger: options.logger });
    const manager = new DynamicPluginManager(
      options.logger,
      scannedPlugins,
      moduleLoader,
    );

    const scannedPluginManifestsPerRealPath = new Map(
      scannedPlugins.map(p => [
        fs.realpathSync(url.fileURLToPath(p.location)),
        p.manifest,
      ]),
    );

    await moduleLoader.bootstrap(
      backstageRoot,
      [...scannedPluginManifestsPerRealPath.keys()],
      scannedPluginManifestsPerRealPath,
    );

    scanner.subscribeToRootDirectoryChange(async () => {
      manager._availablePackages = (await scanner.scanRoot()).packages;
      // TODO: do not store _scannedPlugins again, but instead store a diff of the changes
    });
    manager._plugins.push(...(await manager.loadPlugins()));

    return manager;
  }

  private readonly _plugins: DynamicPlugin[];
  private _availablePackages: ScannedPluginPackage[];

  private constructor(
    private readonly logger: LoggerService,
    private readonly packages: ScannedPluginPackage[],
    private readonly moduleLoader: ModuleLoader,
  ) {
    this._plugins = [];
    this._availablePackages = packages;
  }

  get availablePackages(): ScannedPluginPackage[] {
    return this._availablePackages;
  }

  addBackendPlugin(plugin: BackendDynamicPlugin): void {
    this._plugins.push(plugin);
  }

  private async loadPlugins(): Promise<DynamicPlugin[]> {
    const loadedPlugins: DynamicPlugin[] = [];

    for (const scannedPlugin of this.packages) {
      const role = scannedPlugin.manifest.backstage.role;
      const platform = PackageRoles.getRoleInfo(role).platform;
      const isPlugin =
        role.endsWith('-plugin') ||
        role.endsWith('-plugin-module') ||
        role === ('frontend-dynamic-container' as PackageRole);

      if (!isPlugin) {
        this.logger.info(
          `skipping dynamic plugin package '${scannedPlugin.manifest.name}' from '${scannedPlugin.location}': incompatible role '${role}'`,
        );
        continue;
      }

      switch (platform) {
        case 'node':
          loadedPlugins.push(await this.loadBackendPlugin(scannedPlugin));
          break;

        case 'web':
          loadedPlugins.push({
            name: scannedPlugin.manifest.name,
            version: scannedPlugin.manifest.version,
            role: scannedPlugin.manifest.backstage.role,
            platform: 'web',
            // TODO(davidfestal): add required front-end plugin information here.
          });
          break;

        default:
          this.logger.info(
            `skipping dynamic plugin package '${scannedPlugin.manifest.name}' from '${scannedPlugin.location}': unrelated platform '${platform}'`,
          );
      }
    }
    return loadedPlugins;
  }

  private async loadBackendPlugin(
    plugin: ScannedPluginPackage,
  ): Promise<BackendDynamicPlugin> {
    const usedPluginManifest =
      plugin.alphaManifest?.main ?? plugin.manifest.main;
    const usedPluginLocation = plugin.alphaManifest?.main
      ? `${plugin.location}/alpha`
      : plugin.location;
    const packagePath = url.fileURLToPath(
      `${usedPluginLocation}/${usedPluginManifest}`,
    );
    const dynamicPlugin: BackendDynamicPlugin = {
      name: plugin.manifest.name,
      version: plugin.manifest.version,
      platform: 'node',
      role: plugin.manifest.backstage.role,
    };

    try {
      const pluginModule = await this.moduleLoader.load(packagePath);

      if (isBackendFeature(pluginModule.default)) {
        dynamicPlugin.installer = {
          kind: 'new',
          install: () => pluginModule.default,
        };
      } else if (isBackendFeatureFactory(pluginModule.default)) {
        dynamicPlugin.installer = {
          kind: 'new',
          install: pluginModule.default,
        };
      } else if (
        isBackendDynamicPluginInstaller(pluginModule.dynamicPluginInstaller)
      ) {
        dynamicPlugin.installer = pluginModule.dynamicPluginInstaller;
      }
      if (dynamicPlugin.installer) {
        this.logger.info(
          `loaded dynamic backend plugin '${plugin.manifest.name}' from '${usedPluginLocation}'`,
        );
      } else {
        dynamicPlugin.failure = `the module should either export a 'BackendFeature' or 'BackendFeatureFactory' as default export, or export a 'const dynamicPluginInstaller: BackendDynamicPluginInstaller' field as dynamic loading entrypoint.`;
        this.logger.error(
          `dynamic backend plugin '${plugin.manifest.name}' could not be loaded from '${usedPluginLocation}': ${dynamicPlugin.failure}`,
        );
      }
      return dynamicPlugin;
    } catch (error) {
      const typedError =
        typeof error === 'object' && 'message' in error && 'name' in error
          ? error
          : new Error(error);
      dynamicPlugin.failure = `${typedError.name}: ${typedError.message}`;
      this.logger.error(
        `an error occurred while loading dynamic backend plugin '${plugin.manifest.name}' from '${usedPluginLocation}'`,
        typedError,
      );
      return dynamicPlugin;
    }
  }

  backendPlugins(options?: {
    includeFailed?: boolean;
  }): BackendDynamicPlugin[] {
    return this.plugins(options).filter(
      (p): p is BackendDynamicPlugin => p.platform === 'node',
    );
  }

  frontendPlugins(options?: {
    includeFailed?: boolean;
  }): FrontendDynamicPlugin[] {
    return this.plugins(options).filter(
      (p): p is FrontendDynamicPlugin => p.platform === 'web',
    );
  }

  plugins(options?: { includeFailed?: boolean }): DynamicPlugin[] {
    return this._plugins.filter(p => options?.includeFailed || !p.failure);
  }

  getScannedPackage(plugin: DynamicPlugin): ScannedPluginPackage {
    const pkg = this.packages.find(
      p =>
        p.manifest.name === plugin.name &&
        p.manifest.version === plugin.version,
    );
    if (pkg === undefined) {
      throw new Error(
        `The scanned package of a dynamic plugin should always be available: ${plugin.name}/${plugin.version}`,
      );
    }
    return pkg;
  }
}

/**
 * @public
 */
export const dynamicPluginsServiceRef = createServiceRef<DynamicPluginProvider>(
  {
    id: 'core.dynamicplugins',
    scope: 'root',
  },
);

/**
 * @public
 */
export interface DynamicPluginsFactoryOptions {
  moduleLoader?(logger: LoggerService): ModuleLoader | Promise<ModuleLoader>;
}

/**
 * @public
 * @deprecated Use {@link dynamicPluginsFeatureLoader} instead, which gathers all services and features required for dynamic plugins.
 */
export const dynamicPluginsServiceFactoryWithOptions = (
  options?: DynamicPluginsFactoryOptions,
) =>
  createServiceFactory({
    service: dynamicPluginsServiceRef,
    deps: {
      config: coreServices.rootConfig,
      logger: coreServices.rootLogger,
    },
    async factory({ config, logger }) {
      return await DynamicPluginManager.create({
        config,
        logger,
        preferAlpha: true,
        moduleLoader: await options?.moduleLoader?.(logger),
      });
    },
  });

/**
 * @public
 * @deprecated Use {@link dynamicPluginsFeatureLoader} instead, which gathers all services and features required for dynamic plugins.
 */
export const dynamicPluginsServiceFactory = Object.assign(
  dynamicPluginsServiceFactoryWithOptions,
  dynamicPluginsServiceFactoryWithOptions(),
);

class DynamicPluginsEnabledFeatureDiscoveryService
  implements FeatureDiscoveryService
{
  constructor(
    private readonly dynamicPlugins: DynamicPluginProvider,
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
            if (plugin.installer?.kind === 'new') {
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
 * @deprecated Use {@link dynamicPluginsFeatureLoader} instead, which gathers all services and features required for dynamic plugins.
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

/**
 * @public
 * @deprecated Use {@link dynamicPluginsFeatureLoader} instead, which gathers all services and features required for dynamic plugins.
 */
export const dynamicPluginsFeatureDiscoveryLoader = createBackendFeatureLoader({
  deps: {
    dynamicPlugins: dynamicPluginsServiceRef,
  },
  async loader({ dynamicPlugins }) {
    const service = new DynamicPluginsEnabledFeatureDiscoveryService(
      dynamicPlugins,
    );
    const { features } = await service.getBackendFeatures();
    return features;
  },
});

function isBackendFeature(value: unknown): value is BackendFeature {
  return (
    !!value &&
    (typeof value === 'object' || typeof value === 'function') &&
    (value as BackendFeature).$$type === '@backstage/BackendFeature'
  );
}

function isBackendFeatureFactory(
  value: unknown,
): value is () => BackendFeature {
  return (
    !!value &&
    typeof value === 'function' &&
    (value as any).$$type === '@backstage/BackendFeatureFactory'
  );
}
