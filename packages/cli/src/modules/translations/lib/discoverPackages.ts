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
  PackageRoles,
} from '@backstage/cli-node';
import { dirname, resolve as resolvePath } from 'node:path';
import fs from 'fs-extra';

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
 * Discovers frontend packages that are transitive dependencies of the given
 * target package and resolves their entry point file paths. Walks both
 * workspace packages (source) and npm-installed packages (declaration files).
 */
export async function discoverFrontendPackages(
  targetPackageJson: BackstagePackageJson,
  targetDir: string,
): Promise<DiscoveredPackage[]> {
  // Build a lookup of workspace packages for preferring source over dist
  let workspaceByName: Map<
    string,
    { packageJson: BackstagePackageJson; dir: string }
  >;
  try {
    const workspacePackages = await PackageGraph.listTargetPackages();
    workspaceByName = new Map(
      workspacePackages.map(p => [p.packageJson.name, p]),
    );
  } catch {
    workspaceByName = new Map();
  }

  const visited = new Set<string>();
  const result: DiscoveredPackage[] = [];

  async function visit(
    packageJson: BackstagePackageJson,
    pkgDir: string,
    includeDevDeps: boolean,
  ) {
    const deps: Record<string, string> = {
      ...packageJson.dependencies,
      ...(includeDevDeps ? (packageJson as any).devDependencies : {}),
    };

    for (const depName of Object.keys(deps)) {
      if (visited.has(depName)) {
        continue;
      }
      visited.add(depName);

      let depPkgJson: BackstagePackageJson;
      let depDir: string;
      let isWorkspace: boolean;

      // Prefer workspace package (has source files) over npm-installed
      const workspacePkg = workspaceByName.get(depName);
      if (workspacePkg) {
        depPkgJson = workspacePkg.packageJson;
        depDir = workspacePkg.dir;
        isWorkspace = true;
      } else {
        try {
          const pkgJsonPath = require.resolve(`${depName}/package.json`, {
            paths: [pkgDir],
          });
          depPkgJson = await fs.readJson(pkgJsonPath);
          depDir = dirname(pkgJsonPath);
          isWorkspace = false;
        } catch {
          continue;
        }
      }

      // Only recurse into Backstage ecosystem packages
      if (!depPkgJson.backstage) {
        continue;
      }

      const role = depPkgJson.backstage?.role;
      if (role && isFrontendRole(role)) {
        const entryPoints = resolveEntryPoints(depPkgJson, depDir, isWorkspace);
        if (entryPoints.size > 0) {
          result.push({ name: depName, dir: depDir, entryPoints });
        }
      }

      // Walk this package's production dependencies for transitive refs
      await visit(depPkgJson, depDir, false);
    }
  }

  // Start from the target, including its devDependencies
  await visit(targetPackageJson, targetDir, true);

  return result;
}

/**
 * Resolves the entry points of a package to absolute file paths.
 * For workspace packages, prefers source entry points (import/default).
 * For npm packages, prefers type declaration entry points (.d.ts).
 */
function resolveEntryPoints(
  packageJson: BackstagePackageJson,
  packageDir: string,
  isWorkspace: boolean,
): Map<string, string> {
  const entryPoints = new Map<string, string>();

  const exports = (packageJson as any).exports as
    | Record<string, string | Record<string, string>>
    | undefined;

  if (exports) {
    for (const [subpath, target] of Object.entries(exports)) {
      if (subpath === './package.json') {
        continue;
      }

      let filePath: string | undefined;
      if (typeof target === 'string') {
        filePath = target;
      } else if (isWorkspace) {
        // Workspace: exports point to source .ts files
        filePath = target?.import ?? target?.types ?? target?.default;
      } else {
        // npm: prefer .d.ts for type-based extraction
        filePath = target?.types ?? target?.import ?? target?.default;
      }

      if (typeof filePath === 'string') {
        entryPoints.set(subpath, resolvePath(packageDir, filePath));
      }
    }
  } else {
    // Fallback: prefer types for npm, source for workspace
    const main = isWorkspace
      ? packageJson.main ?? packageJson.types
      : packageJson.types ?? packageJson.main;
    if (main) {
      entryPoints.set('.', resolvePath(packageDir, main));
    }
  }

  return entryPoints;
}

function isFrontendRole(role: string): boolean {
  try {
    return PackageRoles.getRoleInfo(role).platform === 'web';
  } catch {
    return false;
  }
}
