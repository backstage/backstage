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

import {
  BackendFeature,
  RootConfigService,
  RootLoggerService,
  coreServices,
  createServiceFactory,
} from '@backstage/backend-plugin-api';
import {
  featureDiscoveryServiceRef,
  FeatureDiscoveryService,
} from '@backstage/backend-plugin-api/alpha';
import { resolve as resolvePath, dirname } from 'path';
import fs from 'fs-extra';
import { BackstagePackageJson } from '@backstage/cli-node';

const DETECTED_PACKAGE_ROLES = [
  'node-library',
  'backend',
  'backend-plugin',
  'backend-plugin-module',
];

/** @internal */
async function findClosestPackageDir(
  searchDir: string,
): Promise<string | undefined> {
  let path = searchDir;

  // Some confidence check to avoid infinite loop
  for (let i = 0; i < 1000; i++) {
    const packagePath = resolvePath(path, 'package.json');
    const exists = await fs.pathExists(packagePath);
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

/** @internal */
class PackageDiscoveryService implements FeatureDiscoveryService {
  constructor(
    private readonly config: RootConfigService,
    private readonly logger: RootLoggerService,
  ) {}

  getDependencyNames(path: string) {
    const { dependencies } = require(path) as BackstagePackageJson;
    const packagesConfig = this.config.getOptional('backend.packages');

    const dependencyNames = Object.keys(dependencies || {});

    if (packagesConfig === 'all') {
      return dependencyNames;
    }

    const includedPackagesConfig = this.config.getOptionalStringArray(
      'backend.packages.include',
    );

    const includedPackages = includedPackagesConfig
      ? new Set(includedPackagesConfig)
      : dependencyNames;
    const excludedPackagesSet = new Set(
      this.config.getOptionalStringArray('backend.packages.exclude'),
    );

    return [...includedPackages].filter(name => !excludedPackagesSet.has(name));
  }

  async getBackendFeatures(): Promise<{ features: Array<BackendFeature> }> {
    const packagesConfig = this.config.getOptional('backend.packages');
    if (!packagesConfig || Object.keys(packagesConfig).length === 0) {
      return { features: [] };
    }

    const packageDir = await findClosestPackageDir(process.argv[1]);
    if (!packageDir) {
      throw new Error('Package discovery failed to find package.json');
    }
    const dependencyNames = this.getDependencyNames(
      resolvePath(packageDir, 'package.json'),
    );

    const features: BackendFeature[] = [];

    for (const name of dependencyNames) {
      const depPkg = require(
        require.resolve(`${name}/package.json`, {
          paths: [packageDir],
        }),
      ) as BackstagePackageJson;
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

    return { features };
  }
}

/** @alpha */
export const featureDiscoveryServiceFactory = createServiceFactory({
  service: featureDiscoveryServiceRef,
  deps: {
    config: coreServices.rootConfig,
    logger: coreServices.rootLogger,
  },
  factory({ config, logger }) {
    return new PackageDiscoveryService(config, logger);
  },
});

function isBackendFeature(value: unknown): value is BackendFeature {
  return (
    !!value &&
    typeof value === 'object' &&
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
