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

const LOADED_PACKAGE_ROLES = ['backend-plugin', 'backend-module'];

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
  constructor(private readonly config: RootConfigService) {}

  async getBackendFeatures(): Promise<{ features: Array<BackendFeature> }> {
    if (this.config.getOptionalString('backend.packages') !== 'all') {
      return { features: [] };
    }

    const packageDir = await findClosestPackageDir(process.argv[1]);
    if (!packageDir) {
      throw new Error('Package discovery failed to find package.json');
    }
    const { dependencies } = require(resolvePath(
      packageDir,
      'package.json',
    )) as BackstagePackageJson;
    const dependencyNames = Object.keys(dependencies || {});

    const features: BackendFeature[] = [];

    for (const name of dependencyNames) {
      const depPkg = require(require.resolve(`${name}/package.json`, {
        paths: [packageDir],
      })) as BackstagePackageJson;
      if (!LOADED_PACKAGE_ROLES.includes(depPkg?.backstage?.role ?? '')) {
        continue;
      }
      const depModule = require(require.resolve(name, { paths: [packageDir] }));
      for (const exportValue of Object.values(depModule)) {
        if (isBackendFeature(exportValue)) {
          features.push(exportValue);
        }
        if (isBackendFeatureFactory(exportValue)) {
          features.push(exportValue());
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
  },
  factory({ config }) {
    return new PackageDiscoveryService(config);
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
