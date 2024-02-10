/*
 * Copyright 2020 The Backstage Authors
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
  BackstagePackage,
  BackstagePackageJson,
  PackageGraph,
  PackageRoles,
} from '@backstage/cli-node';
import { OptionValues } from 'commander';
import fs from 'fs-extra';
import {
  resolve as resolvePath,
  join as joinPath,
  relative as relativePath,
} from 'path';
import { paths } from '../../lib/paths';

/**
 * A mutable object representing a package.json file with potential fixes.
 */
export interface FixablePackage extends BackstagePackage {
  changed: boolean;
}

export async function readFixablePackages(): Promise<FixablePackage[]> {
  const packages = await PackageGraph.listTargetPackages();
  return packages.map(pkg => ({ ...pkg, changed: false }));
}

export function printPackageFixHint(packages: FixablePackage[]) {
  const changed = packages.filter(pkg => pkg.changed);
  if (changed.length > 0) {
    const rootPkg = require(paths.resolveTargetRoot('package.json'));
    const fixCmd =
      rootPkg.scripts?.fix === 'backstage-cli repo fix'
        ? 'fix'
        : 'backstage-cli repo fix';
    console.log(
      `The following packages are out of sync, run 'yarn ${fixCmd}' to fix them:`,
    );
    for (const pkg of changed) {
      console.log(`  ${pkg.packageJson.name}`);
    }
    return true;
  }
  return false;
}

export async function writeFixedPackages(
  packages: FixablePackage[],
): Promise<void> {
  await Promise.all(
    packages.map(async pkg => {
      if (!pkg.changed) {
        return;
      }

      await fs.writeJson(
        resolvePath(pkg.dir, 'package.json'),
        pkg.packageJson,
        {
          spaces: 2,
        },
      );
    }),
  );
}

function trimRelative(path: string): string {
  if (path.startsWith('./')) {
    return path.slice(2);
  }
  return path;
}

export function fixPackageExports(pkg: FixablePackage) {
  let { exports: exp } = pkg.packageJson;
  if (!exp) {
    return;
  }
  if (Array.isArray(exp)) {
    throw new Error('Unexpected array in package.json exports field');
  }

  // If exports is a string we rewrite it to an object to add package.json
  if (typeof exp === 'string') {
    pkg.changed = true;
    exp = { '.': exp };
    pkg.packageJson.exports = exp;
  } else if (typeof exp !== 'object') {
    return;
  }

  if (!exp['./package.json']) {
    pkg.changed = true;
    exp['./package.json'] = './package.json';
  }

  const existingTypesVersions = JSON.stringify(pkg.packageJson.typesVersions);

  const typeEntries: Record<string, [string]> = {};
  for (const [path, value] of Object.entries(exp)) {
    // Main entry point does not need to be listed
    if (path === '.') {
      continue;
    }
    const newPath = trimRelative(path);

    if (typeof value === 'string') {
      typeEntries[newPath] = [trimRelative(value)];
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      if (typeof value.types === 'string') {
        typeEntries[newPath] = [trimRelative(value.types)];
      } else if (typeof value.default === 'string') {
        typeEntries[newPath] = [trimRelative(value.default)];
      }
    }
  }

  const typesVersions = { '*': typeEntries };
  if (existingTypesVersions !== JSON.stringify(typesVersions)) {
    const newPkgEntries = Object.entries(pkg.packageJson).filter(
      ([name]) => name !== 'typesVersions',
    );
    newPkgEntries.splice(
      newPkgEntries.findIndex(([name]) => name === 'exports') + 1,
      0,
      ['typesVersions', typesVersions],
    );

    pkg.packageJson = Object.fromEntries(newPkgEntries) as BackstagePackageJson;
    pkg.changed = true;
  }

  // Remove the legacy fields from publishConfig, which are no longer needed
  const publishConfig = pkg.packageJson.publishConfig as
    | Record<string, string>
    | undefined;
  if (publishConfig) {
    for (const field of ['main', 'module', 'browser', 'types']) {
      if (publishConfig[field]) {
        delete publishConfig[field];
        pkg.changed = true;
      }
    }
  }
}

export function fixSideEffects(pkg: FixablePackage) {
  const role = PackageRoles.getRoleFromPackage(pkg.packageJson);
  if (!role) {
    return;
  }

  const roleInfo = PackageRoles.getRoleInfo(role);

  // Only web and common packages benefit from being marked as side effect free
  if (roleInfo.platform === 'node') {
    return;
  }
  // Bundled packages don't need to mark themselves as having no side effects
  if (roleInfo.output.length === 1 && roleInfo.output[0] === 'bundle') {
    return;
  }

  // Already declared
  if ('sideEffects' in pkg.packageJson) {
    return;
  }

  const pkgEntries = Object.entries(pkg.packageJson);
  pkgEntries.splice(
    // Place it just above the scripts field
    pkgEntries.findIndex(([name]) => name === 'scripts'),
    0,
    ['sideEffects', false],
  );
  pkg.packageJson = Object.fromEntries(pkgEntries) as BackstagePackageJson;
  pkg.changed = true;
}

export function createRepositoryFieldFixer() {
  const rootPkg = require(paths.resolveTargetRoot('package.json'));
  const rootRepoField = rootPkg.repository;
  if (!rootRepoField) {
    return () => {};
  }

  const rootType = rootRepoField.type || 'git';
  const rootUrl = rootRepoField.url;
  const rootDir = rootRepoField.directory || '';

  return (pkg: FixablePackage) => {
    const expectedPath = joinPath(
      rootDir,
      relativePath(paths.targetRoot, pkg.dir),
    );
    const repoField = pkg.packageJson.repository;

    if (!repoField || typeof repoField === 'string') {
      const pkgEntries = Object.entries(pkg.packageJson);
      pkgEntries.splice(
        // Place it just above the backstage field
        pkgEntries.findIndex(([name]) => name === 'backstage'),
        0,
        [
          'repository',
          {
            type: rootType,
            url: rootUrl,
            directory: expectedPath,
          },
        ],
      );
      pkg.packageJson = Object.fromEntries(pkgEntries) as BackstagePackageJson;
      pkg.changed = true;
      return;
    }

    // If there's a type or URL mismatch, leave the field as is
    if (repoField.type !== rootType || repoField.url !== rootUrl) {
      return;
    }

    if (repoField.directory !== expectedPath) {
      repoField.directory = expectedPath;
      pkg.changed = true;
    }
  };
}

export async function command(opts: OptionValues): Promise<void> {
  const packages = await readFixablePackages();
  const fixRepositoryField = createRepositoryFieldFixer();

  for (const pkg of packages) {
    fixPackageExports(pkg);
    fixSideEffects(pkg);
    fixRepositoryField(pkg);
  }

  if (opts.check) {
    if (printPackageFixHint(packages)) {
      process.exit(1);
    }
  } else {
    await writeFixedPackages(packages);
  }
}
