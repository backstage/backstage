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
import { ModuleLoader } from './types';
import { LoggerService } from '@backstage/backend-plugin-api';
import path from 'node:path';
import { ScannedPluginManifest } from '../scanner';

/**
 * @public
 */
export type CommonJSModuleLoaderOptions = {
  logger: LoggerService;
  dynamicPluginPackageNameSuffixes?: String[];
  customResolveDynamicPackage?: (
    logger: LoggerService,
    searchedPackageName: string,
    scannedPluginManifests: Map<string, ScannedPluginManifest>,
  ) => string | undefined;
};

/**
 * @public
 */
export class CommonJSModuleLoader implements ModuleLoader {
  private module: any;
  public readonly options: CommonJSModuleLoaderOptions;

  constructor(options: CommonJSModuleLoaderOptions) {
    this.options = options;
    this.module = require('node:module');
  }

  async bootstrap(
    backstageRoot: string,
    dynamicPluginsPaths: string[],
    scannedPluginManifests: Map<string, ScannedPluginManifest>,
  ): Promise<void> {
    const backstageRootNodeModulesPath = `${backstageRoot}/node_modules`;
    const dynamicNodeModulesPaths = [
      ...dynamicPluginsPaths.map(p => path.resolve(p, 'node_modules')),
    ];
    const oldNodeModulePaths = this.module._nodeModulePaths;
    this.module._nodeModulePaths = (from: string): string[] => {
      const result: string[] = oldNodeModulePaths(from);
      if (!dynamicPluginsPaths.some(p => from.startsWith(p))) {
        return result;
      }
      const filtered = result.filter(nodeModulePath => {
        return (
          nodeModulePath === backstageRootNodeModulesPath ||
          dynamicNodeModulesPaths.some(p => nodeModulePath.startsWith(p))
        );
      });
      this.options.logger.debug(
        `Overriding node_modules search path for dynamic plugin ${from} to: ${filtered}`,
      );
      return filtered;
    };

    // The whole piece of code below is a way to accommodate the limitations of
    // the current `resolvePackagePath` implementation, which cannot be provided
    // some custom locations where it should find the assets of some given packages.
    //
    // Since the packages for dynamic plugins are not located in the main backstage
    // monorepo structure, and since dynamic plugins could also be repackaged
    // (typically renamed with a `-dynamic` suffix), for now we have to customize
    // module file name resolution here to support these use-cases.
    //
    // This might not be necessary anymore according to future enhancements to the
    // `resolvePackagePath` feature.
    const oldResolveFileName = this.module._resolveFilename;
    this.module._resolveFilename = (
      request: string,
      mod: NodeModule,
      _: boolean,
      options: any,
    ): any => {
      let errorToThrow: any;
      try {
        return oldResolveFileName(request, mod, _, options);
      } catch (e) {
        errorToThrow = e;
        this.options.logger.debug(
          `Could not resolve '${request}' inside the Core backstage backend application`,
          e instanceof Error ? e : undefined,
        );
      }

      // Is this a `resolvePackagePath` call from `@backstage/backend-plugin-api`?
      // This covers both the host application's copy and a bundled copy living
      // inside a dynamic plugin's own node_modules.
      // The regex matches mod.path against the various ways the package can be resolved on disk
      // (with optional subdirectory such as /src or /dist after the package name):
      //   - .../node_modules/@backstage/backend-plugin-api[/...]  (npm-installed)
      //   - .../<plugin>/node_modules/@backstage/backend-plugin-api[/...]  (bundled)
      //   - .../packages/backend-plugin-api[/...]  (symlinked workspace in monorepo)
      const resolvingPackageJsonViaResolvePackagePath =
        request?.endsWith('/package.json') &&
        /[/\\](?:@backstage|packages)[/\\]backend-plugin-api(?:[/\\]|$)/.test(
          mod?.path ?? '',
        );

      if (!resolvingPackageJsonViaResolvePackagePath) {
        throw errorToThrow;
      }

      this.options.logger.info(
        `Resolving '${request}' in the dynamic backend plugins`,
      );
      const searchedPackageName = request.replace(/\/package.json$/, '');

      // First search for a dynamic plugin package matching the expected package name,
      // taking in account accepted dynamic plugin package name suffixes
      // (suffix accepted by default is '-dynamic').
      const searchedPackageNamesWithSuffixes = (
        this.options.dynamicPluginPackageNameSuffixes ?? ['-dynamic']
      ).map(s => `${searchedPackageName}${s}`);
      for (const [realPath, pkg] of scannedPluginManifests.entries()) {
        if (
          [searchedPackageName, ...searchedPackageNamesWithSuffixes].includes(
            pkg.name,
          )
        ) {
          const resolvedPath = path.resolve(realPath, 'package.json');
          this.options.logger.info(`Resolved '${request}' at ${resolvedPath}`);
          return resolvedPath;
        }
      }

      // If a custom resolution is provided, use it.
      // This allows accommodating alternate ways to package dynamic plugins:
      // static plugin package wrapped inside a distinct dynamic plugin package for example.
      if (this.options.customResolveDynamicPackage) {
        const resolvedPath = this.options.customResolveDynamicPackage(
          this.options.logger,
          searchedPackageName,
          scannedPluginManifests,
        );
        if (resolvedPath) {
          return resolvedPath;
        }
      }
      throw errorToThrow;
    };
  }

  async load(packagePath: string): Promise<any> {
    return await this.module.prototype.require(packagePath);
  }
}
