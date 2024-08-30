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
    scanner.trackChanges();
    const moduleLoader =
      options.moduleLoader || new CommonJSModuleLoader(options.logger);
    const manager = new DynamicPluginManager(
      options.logger,
      scannedPlugins,
      moduleLoader,
    );

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
    private packages: ScannedPluginPackage[],
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
      const pluginModule = await this.moduleLoader.load(packagePath);

      let dynamicPluginInstaller;
      if (isBackendFeature(pluginModule.default)) {
        dynamicPluginInstaller = {
          kind: 'new',
          install: () => pluginModule.default,
        };
      } else if (isBackendFeatureFactory(pluginModule.default)) {
        dynamicPluginInstaller = {
          kind: 'new',
          install: pluginModule.default,
        };
      } else {
        dynamicPluginInstaller = pluginModule.dynamicPluginInstaller;
      }
      if (!isBackendDynamicPluginInstaller(dynamicPluginInstaller)) {
        this.logger.error(
          `dynamic backend plugin '${plugin.manifest.name}' could not be loaded from '${plugin.location}': the module should either export a 'BackendFeature' or 'BackendFeatureFactory' as default export, or export a 'const dynamicPluginInstaller: BackendDynamicPluginInstaller' field as dynamic loading entrypoint.`,
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
        `an error occurred while loading dynamic backend plugin '${plugin.manifest.name}' from '${plugin.location}'`,
        error,
      );
      return undefined;
    }
  }

  backendPlugins(): BackendDynamicPlugin[] {
    return this._plugins.filter(
      (p): p is BackendDynamicPlugin => p.platform === 'node',
    );
  }

  frontendPlugins(): FrontendDynamicPlugin[] {
    return this._plugins.filter(
      (p): p is FrontendDynamicPlugin => p.platform === 'web',
    );
  }

  plugins(): DynamicPlugin[] {
    return this._plugins;
  }
}

/**
 * @public
 * @deprecated The `featureDiscoveryService` is deprecated in favor of using {@link dynamicPluginsFeatureDiscoveryLoader} instead.
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
  moduleLoader?(logger: LoggerService): ModuleLoader;
}

/**
 * @public
 * @deprecated Use {@link dynamicPluginsFeatureDiscoveryLoader} instead.
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
        moduleLoader: options?.moduleLoader?.(logger),
      });
    },
  });

/**
 * @public
 * @deprecated Use {@link dynamicPluginsFeatureDiscoveryLoader} instead.
 */
export const dynamicPluginsServiceFactory =
  dynamicPluginsServiceFactoryWithOptions();

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
 * @deprecated The `featureDiscoveryService` is deprecated in favor of using {@link dynamicPluginsFeatureDiscoveryLoader} instead.
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

const dynamicPluginsFeatureDiscoveryLoaderWithOptions = (
  options?: DynamicPluginsFactoryOptions,
) =>
  createBackendFeatureLoader({
    deps: {
      config: coreServices.rootConfig,
      logger: coreServices.rootLogger,
    },
    async loader({ config, logger }) {
      const manager = await DynamicPluginManager.create({
        config,
        logger,
        preferAlpha: true,
        moduleLoader: options?.moduleLoader?.(logger),
      });
      const service = new DynamicPluginsEnabledFeatureDiscoveryService(manager);
      const { features } = await service.getBackendFeatures();
      return features;
    },
  });

/**
 * A backend feature loader that uses the dynamic plugins system to discover features.
 *
 * @public
 *
 * @example
 * Using the `dynamicPluginsFeatureDiscoveryLoader` loader in a backend instance:
 * ```ts
 * //...
 * import { createBackend } from '@backstage/backend-defaults';
 * import { dynamicPluginsFeatureDiscoveryLoader } from '@backstage/backend-dynamic-feature-service';
 *
 * const backend = createBackend();
 * backend.add(dynamicPluginsFeatureDiscoveryLoader);
 * //...
 * backend.start();
 * ```
 *
 * @example
 * Passing options to the `dynamicPluginsFeatureDiscoveryLoader` loader in a backend instance:
 * ```ts
 * //...
 * import { createBackend } from '@backstage/backend-defaults';
 * import { dynamicPluginsFeatureDiscoveryLoader } from '@backstage/backend-dynamic-feature-service';
 * import { myCustomModuleLoader } from './myCustomModuleLoader';
 *
 * const backend = createBackend();
 * backend.add(dynamicPluginsFeatureDiscoveryLoader({
 *   moduleLoader: myCustomModuleLoader
 * }));
 * //...
 * backend.start();
 * ```
 */
export const dynamicPluginsFeatureDiscoveryLoader = Object.assign(
  dynamicPluginsFeatureDiscoveryLoaderWithOptions,
  dynamicPluginsFeatureDiscoveryLoaderWithOptions(),
);

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
