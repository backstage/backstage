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
import { join as joinPath, resolve as resolvePath } from 'path';
import { ExtendedPackageJSON } from '../monorepo';
import { readEntryPoints } from '../monorepo/entryPoints';

const PKG_PATH = 'package.json';
const PKG_BACKUP_PATH = 'package.json-prepack';

const SKIPPED_KEYS = ['access', 'registry', 'tag', 'alphaTypes', 'betaTypes'];

interface ProductionPackOptions {
  packageDir: string;
  targetDir?: string;
}

export async function productionPack(options: ProductionPackOptions) {
  const { packageDir, targetDir } = options;
  const pkgPath = resolvePath(packageDir, PKG_PATH);
  const pkgContent = await fs.readFile(pkgPath, 'utf8');
  const pkg = JSON.parse(pkgContent) as ExtendedPackageJSON;

  // If we're making the update in-line, back up the package.json
  if (!targetDir) {
    await fs.writeFile(PKG_BACKUP_PATH, pkgContent);
  }

  const hasStageEntry =
    !!pkg.publishConfig?.alphaTypes || !!pkg.publishConfig?.betaTypes;
  if (pkg.exports && hasStageEntry) {
    throw new Error(
      'Combining both exports and alpha/beta types is not supported',
    );
  }

  // This mutates pkg to fill in index exports, so call it before applying publishConfig
  if (pkg.exports) {
    await writeExportsEntryPoints(pkg, targetDir ?? packageDir);
  }

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

  if (publishConfig.alphaTypes) {
    await writeReleaseStageEntrypoint(pkg, 'alpha', targetDir ?? packageDir);
  }
  if (publishConfig.betaTypes) {
    await writeReleaseStageEntrypoint(pkg, 'beta', targetDir ?? packageDir);
  }
}

// Reverts the changes made by productionPack when called without a targetDir.
export async function revertProductionPack(packageDir: string) {
  // postpack isn't called by yarn right now, so it needs to be called manually
  try {
    await fs.move(PKG_BACKUP_PATH, PKG_PATH, { overwrite: true });

    // Check if we're shipping types for other release stages, clean up in that case
    const pkg = await fs.readJson(PKG_PATH);
    if (pkg.publishConfig?.alphaTypes) {
      await fs.remove(resolvePath(packageDir, 'alpha'));
    }
    if (pkg.publishConfig?.betaTypes) {
      await fs.remove(resolvePath(packageDir, 'beta'));
    }

    // Remove any extra entrypoint backwards compatibility directories
    const entryPoints = readEntryPoints(pkg);
    for (const entryPoint of entryPoints) {
      if (entryPoint.mount !== '.') {
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

function resolveEntrypoint(pkg: any, name: string) {
  const targetEntry = pkg.publishConfig[name] || pkg[name];
  return targetEntry && joinPath('..', targetEntry);
}

// Writes e.g. alpha/package.json
async function writeReleaseStageEntrypoint(
  pkg: ExtendedPackageJSON,
  stage: 'alpha' | 'beta',
  targetDir: string,
) {
  await fs.ensureDir(resolvePath(targetDir, stage));
  await fs.writeJson(
    resolvePath(targetDir, stage, PKG_PATH),
    {
      name: pkg.name,
      version: pkg.version,
      main: resolveEntrypoint(pkg, 'main'),
      module: resolveEntrypoint(pkg, 'module'),
      browser: resolveEntrypoint(pkg, 'browser'),
      types: joinPath('..', pkg.publishConfig![`${stage}Types`]!),
    },
    { encoding: 'utf8', spaces: 2 },
  );
}

const EXPORT_MAP = {
  import: '.esm.js',
  require: '.cjs.js',
  types: '.d.ts',
};

/**
 * Rewrites the exports field in package.json to point to dist files, as
 * well as creating backwards compatibility entry points for importers
 * that don't support exports.
 */
async function writeExportsEntryPoints(
  pkg: ExtendedPackageJSON,
  targetDir: string,
) {
  const distFiles = await fs.readdir(resolvePath(targetDir, 'dist'));
  const outputExports = {} as Record<string, Record<string, string>>;

  const entryPoints = readEntryPoints(pkg);
  for (const entryPoint of entryPoints) {
    const exp = {} as Record<string, string>;
    for (const [key, ext] of Object.entries(EXPORT_MAP)) {
      const name = `${entryPoint.name}${ext}`;
      if (distFiles.includes(name)) {
        exp[key] = `./${joinPath(`dist`, name)}`;
      }
    }
    exp.default = exp.require ?? exp.import;

    // This creates a directory with a lone package.json for backwards compatibility
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
    } else {
      const entryPointDir = resolvePath(targetDir, entryPoint.name);
      await fs.ensureDir(entryPointDir);
      await fs.writeJson(
        resolvePath(entryPointDir, PKG_PATH),
        {
          name: pkg.name,
          version: pkg.version,
          ...(exp.default ? { main: joinPath('..', exp.default) } : {}),
          ...(exp.import ? { module: joinPath('..', exp.import) } : {}),
          ...(exp.types ? { types: joinPath('..', exp.types) } : {}),
        },
        { encoding: 'utf8', spaces: 2 },
      );
    }

    if (Object.keys(exp).length > 0) {
      outputExports[entryPoint.mount] = exp;
    }
  }

  pkg.exports = outputExports;
}
