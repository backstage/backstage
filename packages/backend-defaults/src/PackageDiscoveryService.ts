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

import fs from 'fs-extra';
import { resolve as resolvePath, dirname } from 'node:path';

import {
  BackendFeature,
  RootConfigService,
  RootLoggerService,
} from '@backstage/backend-plugin-api';
import { BackstagePackageJson } from '@backstage/cli-node';
import { isError } from '@backstage/errors';

// XXX(GabDug): Is this a supported/used pattern to backend.add() another backend or a node-library? Use-cases?
const DETECTED_PACKAGE_ROLES = [
  'node-library',
  'backend',
  'backend-plugin',
  'backend-plugin-module',
];

/** @internal */
function isBackendFeature(value: unknown): value is BackendFeature {
  return (
    !!value &&
    ['object', 'function'].includes(typeof value) &&
    (value as BackendFeature).$$type === '@backstage/BackendFeature'
  );
}

/** @internal */
function isBackendFeatureFactory(
  value: unknown,
): value is () => BackendFeature {
  return (
    !!value &&
    typeof value === 'function' &&
    (value as any).$$type === '@backstage/BackendFeatureFactory'
  );
}

/**
 * Checks if a package name (loosely) matches the Backstage backend naming convention.
 * @internal
 */
export function isBackendPackageName(name: string): boolean {
  return name.endsWith('-backend') || name.includes('-backend-module-');
}

/** @internal */
async function findClosestPackageDir(
  searchDir: string,
  deps: { pathExists: (path: string) => Promise<boolean> } = fs,
): Promise<string | undefined> {
  let path = searchDir;

  // Some confidence check to avoid infinite loop
  for (let i = 0; i < 1000; i++) {
    const packagePath = resolvePath(path, 'package.json');
    const exists = await deps.pathExists(packagePath);
    if (exists) {
      return path;
    }

    const newPath = dirname(path);
    if (newPath === path) {
      return undefined;
    }
    path = newPath;
  }

  throw new Error(
    `Iteration limit reached when searching for root package.json at ${searchDir}`,
  );
}
export interface PackageDiscoveryServiceOptions {
  alwaysExcludedPackages?: string[];
}
// XXX(GabDug): Should we make PackageDiscoveryService public?
/** @internal */
export class PackageDiscoveryService {
  private readonly config: RootConfigService;
  private readonly logger: RootLoggerService;
  private readonly options?: PackageDiscoveryServiceOptions;
  private readonly validPathExists: (path: string) => Promise<boolean>;

  constructor(
    config: RootConfigService,
    logger: RootLoggerService,
    options?: PackageDiscoveryServiceOptions,
    // TODO: This should probably be a generic fs interface/service
    pathExists?: (path: string) => Promise<boolean>,
  ) {
    this.config = config;
    this.logger = logger;
    this.options = options;
    this.validPathExists = pathExists ?? fs.pathExists;
  }

  getDependencyNames(path: string) {
    const { dependencies } = require(path) as BackstagePackageJson;
    const packagesConfig = this.config.getOptional('backend.packages');

    const dependencyNames = Object.keys(dependencies || {});

    if (packagesConfig === 'all') {
      const excludedPackagesSet = new Set<string>();
      if (this.options?.alwaysExcludedPackages) {
        for (const name of this.options.alwaysExcludedPackages) {
          excludedPackagesSet.add(name);
        }
      }
      return dependencyNames.filter(name => !excludedPackagesSet.has(name));
    }

    const excludedPackagesSet = new Set(
      this.config.getOptionalStringArray('backend.packages.exclude'),
    );
    if (this.options?.alwaysExcludedPackages) {
      for (const name of this.options.alwaysExcludedPackages) {
        excludedPackagesSet.add(name);
      }
    }

    const includedPackagesConfig = this.config.getOptionalStringArray(
      'backend.packages.include',
    );

    // Warn when explicitly included packages don't match backend naming convention
    if (includedPackagesConfig) {
      const nonMatchingNames = includedPackagesConfig.filter(
        name => !isBackendPackageName(name),
      );
      if (nonMatchingNames.length > 0) {
        this.logger.warn(
          `Packages in backend.packages.include don't match backend naming convention and will be skipped: ${nonMatchingNames.join(
            ', ',
          )}`,
        );
      }
    }

    const includedPackages = includedPackagesConfig
      ? new Set(includedPackagesConfig)
      : dependencyNames;

    return [...includedPackages].filter(name => !excludedPackagesSet.has(name));
  }

  async getBackendFeatures(): Promise<{ features: Array<BackendFeature> }> {
    const packagesConfig = this.config.getOptional('backend.packages');
    if (!packagesConfig || Object.keys(packagesConfig).length === 0) {
      return { features: [] };
    }

    const packageDir = await findClosestPackageDir(process.argv[1], {
      pathExists: this.validPathExists,
    });

    if (!packageDir) {
      throw new Error('Package discovery failed to find package.json');
    }
    const dependencyNames = this.getDependencyNames(
      resolvePath(packageDir, 'package.json'),
    );

    const features: BackendFeature[] = [];

    const candidateNames = dependencyNames.filter(isBackendPackageName);

    // XXX(GabDug): We ignore packages order from package.json
    for (const name of candidateNames) {
      let depPkg: BackstagePackageJson;
      try {
        const packageJsonPath = require.resolve(`${name}/package.json`, {
          paths: [packageDir],
        });
        depPkg = require(packageJsonPath) as BackstagePackageJson;
      } catch (error) {
        // Handle packages with "exports" field that don't export ./package.json
        if (isError(error) && error.code === 'ERR_PACKAGE_PATH_NOT_EXPORTED') {
          continue; // Skip packages that don't export package.json
        }
        throw error;
      }

      // XXX(GabDug): If we can skip loading modules when the plugin is not detected, we can avoid expensive require() of modules that are not used (can be behind a flag?)
      if (
        !depPkg?.backstage?.role ||
        !DETECTED_PACKAGE_ROLES.includes(depPkg.backstage.role)
      ) {
        continue; // Not a backstage backend package, ignore
      }

      const exportedModulePaths = [
        require.resolve(name, {
          paths: [packageDir],
        }),
      ];

      // Find modules exported as alpha
      try {
        exportedModulePaths.push(
          require.resolve(`${name}/alpha`, { paths: [packageDir] }),
        );
      } catch {
        /* ignore */
      }

      for (const modulePath of exportedModulePaths) {
        const mod = require(modulePath);

        if (isBackendFeature(mod.default)) {
          this.logger.info(`Detected: ${name}`);
          features.push(mod.default);
        }
        if (isBackendFeatureFactory(mod.default)) {
          this.logger.info(`Detected: ${name}`);
          features.push(mod.default());
        }
      }
    }

    return { features: Array.from(new Set(features)) };
  }
}
