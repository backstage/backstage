/*
 * Copyright 2026 The Backstage Authors
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
  createBackendModule,
  coreServices,
} from '@backstage/backend-plugin-api';
import {
  CatalogModelLayer,
  CatalogModelSources,
} from '@backstage/catalog-model/alpha';
import { catalogModelExtensionPoint } from './extensions';
import { existsSync } from 'node:fs';
import { resolve as resolvePath, dirname } from 'node:path';
import { isError } from '@backstage/errors';

interface DepPackageJson {
  name?: string;
  dependencies?: Record<string, string>;
  backstage?: {
    role?: string;
  };
}

function isCatalogModelLayer(value: unknown): value is CatalogModelLayer {
  return (
    !!value &&
    typeof value === 'object' &&
    (value as CatalogModelLayer).$$type === '@backstage/CatalogModelLayer'
  );
}

function findClosestPackageDir(searchDir: string): string | undefined {
  let path = searchDir;
  for (let i = 0; i < 1000; i++) {
    if (existsSync(resolvePath(path, 'package.json'))) {
      return path;
    }
    const newPath = dirname(path);
    if (newPath === path) {
      return undefined;
    }
    path = newPath;
  }
  throw new Error(
    `Iteration limit reached when searching for package.json at ${searchDir}`,
  );
}

/** @internal */
export function discoverCatalogModelLayers(options: { packageDir: string }): {
  layers: CatalogModelLayer[];
  warnings: Array<{ package: string; message: string }>;
} {
  const { packageDir } = options;
  const pkg = require(resolvePath(
    packageDir,
    'package.json',
  )) as DepPackageJson;
  const dependencyNames = Object.keys(pkg.dependencies ?? {});

  const layers: CatalogModelLayer[] = [];
  const warnings: Array<{ package: string; message: string }> = [];

  for (const name of dependencyNames) {
    let depPkg: DepPackageJson;
    try {
      const packageJsonPath = require.resolve(`${name}/package.json`, {
        paths: [packageDir],
      });
      depPkg = require(packageJsonPath) as DepPackageJson;
    } catch (error) {
      if (isError(error) && error.code === 'ERR_PACKAGE_PATH_NOT_EXPORTED') {
        continue;
      }
      throw error;
    }

    if (depPkg?.backstage?.role !== 'catalog-model-layer') {
      continue;
    }

    try {
      const modulePath = require.resolve(name, { paths: [packageDir] });
      const mod = require(modulePath);
      const exported = mod.default;

      if (isCatalogModelLayer(exported)) {
        layers.push(exported);
      } else {
        warnings.push({
          package: name,
          message: `has role 'catalog-model-layer' but its default export is not a CatalogModelLayer`,
        });
      }
    } catch (error) {
      warnings.push({
        package: name,
        message: `failed to load: ${error}`,
      });
    }
  }

  return { layers, warnings };
}

/**
 * Creates a backend module that discovers and registers catalog model layers
 * from packages with the `catalog-model-layer` role.
 *
 * @alpha
 * @remarks
 *
 * This scans the backend application's dependencies for packages that have
 * `"backstage": { "role": "catalog-model-layer" }` in their package.json.
 * Each discovered package's default export is expected to be a
 * {@link @backstage/catalog-model#CatalogModelLayer | CatalogModelLayer}.
 *
 * @example
 * ```ts
 * backend.add(provideCatalogModelDiscovery());
 * ```
 */
export function provideCatalogModelDiscovery() {
  return createBackendModule({
    pluginId: 'catalog',
    moduleId: 'model-layer-discovery',
    register(reg) {
      reg.registerInit({
        deps: {
          model: catalogModelExtensionPoint,
          logger: coreServices.logger,
        },
        async init({ model, logger }) {
          const packageDir = findClosestPackageDir(process.argv[1]);
          if (!packageDir) {
            logger.warn(
              'Catalog model layer discovery could not find a package.json',
            );
            return;
          }

          const { layers, warnings } = discoverCatalogModelLayers({
            packageDir,
          });

          for (const warning of warnings) {
            logger.warn(
              `Catalog model layer package ${warning.package}: ${warning.message}`,
            );
          }

          for (const layer of layers) {
            logger.info(`Discovered catalog model layer: ${layer.layerId}`);
          }

          if (layers.length > 0) {
            model.addModelSource(CatalogModelSources.static(layers));
          }
        },
      });
    },
  });
}
