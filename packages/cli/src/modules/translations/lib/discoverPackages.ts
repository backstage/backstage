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
  BackstagePackageJson,
  PackageGraph,
  PackageRole,
} from '@backstage/cli-node';
import { resolve as resolvePath } from 'node:path';
import fs from 'fs-extra';

/**
 * Package roles that can contain frontend translation refs.
 */
const FRONTEND_ROLES: PackageRole[] = [
  'frontend',
  'frontend-plugin',
  'frontend-plugin-module',
  'web-library',
  'common-library',
];

/** A discovered package with its entry points resolved to file paths. */
export interface DiscoveredPackage {
  /** The package name, e.g. '@backstage/plugin-org' */
  name: string;
  /** The directory of the package */
  dir: string;
  /** Map of export subpath (e.g. '.', './alpha') to the resolved file path */
  entryPoints: Map<string, string>;
}

/**
 * Reads the package.json from the given directory and validates that it
 * is a workspace package (not the repo root).
 */
export async function readTargetPackage(
  packageDir: string,
  repoRoot: string,
): Promise<BackstagePackageJson> {
  const packageJsonPath = resolvePath(packageDir, 'package.json');

  if (!(await fs.pathExists(packageJsonPath))) {
    throw new Error(
      'No package.json found in the current directory. ' +
        'The translations commands must be run from within a package directory.',
    );
  }

  if (resolvePath(packageDir) === resolvePath(repoRoot)) {
    throw new Error(
      'The translations commands must be run from within a package directory, ' +
        'not from the repository root. For example: cd packages/app && backstage-cli translations export',
    );
  }

  return fs.readJson(packageJsonPath);
}

/**
 * Discovers frontend packages that are dependencies of the given target
 * package and resolves their entry point file paths.
 */
export async function discoverFrontendPackages(
  targetPackageJson: BackstagePackageJson,
): Promise<DiscoveredPackage[]> {
  const allPackages = await PackageGraph.listTargetPackages();
  const packagesByName = new Map(allPackages.map(p => [p.packageJson.name, p]));

  // Collect all direct dependencies of the target package
  const depNames = new Set<string>([
    ...Object.keys(targetPackageJson.dependencies ?? {}),
    ...Object.keys((targetPackageJson as any).devDependencies ?? {}),
  ]);

  const result: DiscoveredPackage[] = [];

  for (const depName of depNames) {
    const pkg = packagesByName.get(depName);
    if (!pkg) {
      continue;
    }

    const role = pkg.packageJson.backstage?.role;
    if (!role || !FRONTEND_ROLES.includes(role)) {
      continue;
    }

    const entryPoints = resolveEntryPoints(pkg.packageJson, pkg.dir);
    if (entryPoints.size > 0) {
      result.push({
        name: pkg.packageJson.name,
        dir: pkg.dir,
        entryPoints,
      });
    }
  }

  return result;
}

/**
 * Resolves the entry points of a package to absolute file paths.
 * Uses the `exports` field from package.json, falling back to `main`/`types`.
 */
function resolveEntryPoints(
  packageJson: BackstagePackageJson,
  packageDir: string,
): Map<string, string> {
  const entryPoints = new Map<string, string>();

  const exports = (packageJson as any).exports as
    | Record<string, string | Record<string, string>>
    | undefined;

  if (exports) {
    for (const [subpath, target] of Object.entries(exports)) {
      // Skip package.json entry
      if (subpath === './package.json') {
        continue;
      }

      // The target can be a string or a conditions map
      const filePath =
        typeof target === 'string'
          ? target
          : target?.import ?? target?.types ?? target?.default;

      if (typeof filePath === 'string') {
        entryPoints.set(subpath, resolvePath(packageDir, filePath));
      }
    }
  } else {
    // Fallback to main/types
    const main = packageJson.types ?? packageJson.main;
    if (main) {
      entryPoints.set('.', resolvePath(packageDir, main));
    }
  }

  return entryPoints;
}
