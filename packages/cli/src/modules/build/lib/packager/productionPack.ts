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

import fs from 'fs-extra';
import npmPackList from 'npm-packlist';
import { resolve as resolvePath, posix as posixPath } from 'path';
import { BackstagePackageJson } from '@backstage/cli-node';
import { readEntryPoints } from '../../../../lib/entryPoints';
import { getEntryPointDefaultFeatureType } from '../../../../lib/typeDistProject';
import { Project } from 'ts-morph';

const PKG_PATH = 'package.json';
const PKG_BACKUP_PATH = 'package.json-prepack';

const SKIPPED_KEYS = ['access', 'registry', 'tag'];
const SCRIPT_EXTS = ['.js', '.jsx', '.ts', '.tsx'];

interface ProductionPackOptions {
  packageDir: string;
  targetDir?: string;
  /**
   * Enables package feature detection using this TS-morph project.
   */
  featureDetectionProject?: Project;
}

export async function productionPack(options: ProductionPackOptions) {
  const { packageDir, targetDir } = options;
  const pkgPath = resolvePath(packageDir, PKG_PATH);
  const pkgContent = await fs.readFile(pkgPath, 'utf8');
  const pkg = JSON.parse(pkgContent) as BackstagePackageJson;

  // If we're making the update in-line, back up the package.json
  if (!targetDir) {
    await fs.writeFile(PKG_BACKUP_PATH, pkgContent);
  }

  // This mutates pkg to fill in index exports, so call it before applying publishConfig
  await rewriteEntryPoints(pkg, packageDir, options.featureDetectionProject);

  // TODO(Rugvip): Once exports are rolled out more broadly we should deprecate and remove this behavior
  const publishConfig = pkg.publishConfig ?? {};
  for (const key of Object.keys(publishConfig)) {
    if (!SKIPPED_KEYS.includes(key)) {
      (pkg as any)[key] = publishConfig[key as keyof typeof publishConfig];
    }
  }

  // We remove the dependencies from package.json of packages that are marked
  // as bundled, so that yarn doesn't try to install them.
  if (pkg.bundled) {
    delete pkg.dependencies;
    delete pkg.devDependencies;
    delete pkg.peerDependencies;
    delete pkg.optionalDependencies;
  }

  if (targetDir) {
    // Lists all dist files, respecting .npmignore, files field in package.json, etc.
    const filePaths = await npmPackList({
      path: packageDir,
      // This makes sure we use the updated package.json when listing files
      packageJsonCache: new Map([
        [resolvePath(packageDir, PKG_PATH), pkg],
      ]) as any, // Seems like this parameter type is wrong,
    });

    await fs.ensureDir(targetDir);
    for (const filePath of filePaths.sort()) {
      const target = resolvePath(targetDir, filePath);
      if (filePath === PKG_PATH) {
        await fs.writeJson(target, pkg, { encoding: 'utf8', spaces: 2 });
      } else {
        await fs.copy(resolvePath(packageDir, filePath), target);
      }
    }
  } else {
    await fs.writeJson(pkgPath, pkg, { encoding: 'utf8', spaces: 2 });
  }
}

// Reverts the changes made by productionPack when called without a targetDir.
export async function revertProductionPack(packageDir: string) {
  // postpack isn't called by yarn right now, so it needs to be called manually
  try {
    await fs.move(PKG_BACKUP_PATH, PKG_PATH, { overwrite: true });

    // Check if we're shipping types for other release stages, clean up in that case
    const pkg = await fs.readJson(PKG_PATH);

    // Remove any extra entrypoint backwards compatibility directories
    const entryPoints = readEntryPoints(pkg);
    for (const entryPoint of entryPoints) {
      if (entryPoint.mount !== '.' && SCRIPT_EXTS.includes(entryPoint.ext)) {
        await fs.remove(resolvePath(packageDir, entryPoint.name));
      }
    }
  } catch (error) {
    console.warn(
      `Failed to restore package.json, ${error}. ` +
        'Your package will be fine but you may have ended up with some garbage in the repo.',
    );
  }
}

const EXPORT_MAP = {
  import: '.esm.js',
  require: '.cjs.js',
  types: '.d.ts',
};

/**
 * Rewrites the exports field in package.json to point to dist files, as
 * well as returning a function that creates backwards compatibility
 * entry points for importers that don't support exports.
 */
async function rewriteEntryPoints(
  pkg: BackstagePackageJson,
  packageDir: string,
  featureDetectionProject?: Project,
) {
  const distPath = resolvePath(packageDir, 'dist');
  if (!(await fs.pathExists(distPath))) {
    return undefined;
  }
  const distFiles = await fs.readdir(distPath);
  const outputExports = {} as Record<string, string | Record<string, string>>;

  const entryPoints = readEntryPoints(pkg);

  // Clear to ensure a clean slate before adding entries back in further down
  if (pkg.typesVersions) {
    pkg.typesVersions = undefined;
  }

  for (const entryPoint of entryPoints) {
    if (!SCRIPT_EXTS.includes(entryPoint.ext)) {
      outputExports[entryPoint.mount] = entryPoint.path;
      continue;
    }

    let exp = {} as Record<string, string>;

    for (const [key, ext] of Object.entries(EXPORT_MAP)) {
      const name = `${entryPoint.name}${ext}`;
      if (distFiles.includes(name)) {
        exp[key] = `./${posixPath.join(`dist`, name)}`;
      }
    }

    // Our current tooling relies on the typesVersions field rather than export.*.types
    if (exp.types) {
      if (!pkg.typesVersions) {
        pkg.typesVersions = { '*': {} };
      }
      const mount = entryPoint.name === 'index' ? '*' : entryPoint.name;
      pkg.typesVersions['*'][mount] = [`dist/${entryPoint.name}.d.ts`];
    }

    exp.default = exp.require ?? exp.import;

    // Find the default export type for the entry point, if feature detection is active
    if (exp.types && featureDetectionProject) {
      const defaultFeatureType =
        pkg.backstage?.role &&
        getEntryPointDefaultFeatureType(
          pkg.backstage?.role,
          packageDir,
          featureDetectionProject,
          exp.types,
        );

      if (defaultFeatureType) {
        // This ensures that the `backstage` field is at the top of the
        // `exports` field in the package.json because order is important.
        // https://nodejs.org/docs/latest-v20.x/api/packages.html#conditional-exports
        //
        // Adding this to the `exports` field in the package.json is to temporarily
        // support any existing behavior that relies on this, however not all packages
        // have exports field in their package.json.
        exp = { backstage: defaultFeatureType, ...exp };

        // Add the default feature type to the backstage metadata in the package.json
        pkg.backstage = pkg.backstage ?? {};
        pkg.backstage.features = pkg.backstage.features ?? {};
        pkg.backstage.features[entryPoint.mount] = defaultFeatureType;
      }
    }

    if (entryPoint.mount === '.') {
      if (exp.default) {
        pkg.main = exp.default;
      }
      if (exp.import) {
        pkg.module = exp.import;
      }
      if (exp.types) {
        pkg.types = exp.types;
      }
    }

    if (Object.keys(exp).length > 0) {
      outputExports[entryPoint.mount] = exp;
    }
  }

  // Clean up the typesVersions field if it only contains a wildcard
  if (pkg.typesVersions?.['*']) {
    const keys = Object.keys(pkg.typesVersions['*']);
    if (keys.length === 1 && keys[0] === '*') {
      delete pkg.typesVersions;
    }
  }

  if (pkg.exports) {
    pkg.exports = outputExports;
    // We treat package.json as a fixed export that is always available in the published package
    pkg.exports['./package.json'] = './package.json';
  }

  return undefined;
}
