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

import { targetPaths } from '@backstage/cli-common';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve as resolvePath } from 'node:path';
import { pathToFileURL } from 'node:url';

export interface DiscoveredCliModule {
  name: string;
  path: string;
}

function isBackstageCliModulePackage(name: string): boolean {
  return (
    name === '@backstage/cli-defaults' ||
    name.startsWith('@backstage/cli-module-')
  );
}

function formatError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function findPackageJsonPath(
  dependencyName: string,
  modulePath: string,
): string | undefined {
  let directory = dirname(modulePath);
  for (;;) {
    const candidatePath = resolvePath(directory, 'package.json');
    if (fs.existsSync(candidatePath)) {
      try {
        const candidatePackage = JSON.parse(
          fs.readFileSync(candidatePath, 'utf8'),
        );
        if (candidatePackage.name === dependencyName) {
          return candidatePath;
        }
      } catch {
        return candidatePath;
      }
    }

    const parentDirectory = dirname(directory);
    if (parentDirectory === directory) {
      return undefined;
    }
    directory = parentDirectory;
  }
}

/**
 * Discovers CLI modules from the target repository's direct dependencies.
 */
export function discoverCliModules(): DiscoveredCliModule[] {
  const rootDir = targetPaths.rootDir;
  const packageJsonPath = resolvePath(rootDir, 'package.json');

  let projectPackage: {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };
  try {
    projectPackage = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  } catch (error) {
    throw new Error(
      `Failed to read the target repository package.json at "${packageJsonPath}": ${formatError(
        error,
      )}`,
    );
  }

  const dependencyNames = Object.keys({
    ...projectPackage.dependencies,
    ...projectPackage.devDependencies,
  }).sort();
  const targetRequire = createRequire(packageJsonPath);
  const modules: DiscoveredCliModule[] = [];

  for (const dependencyName of dependencyNames) {
    const isKnownCliModule = isBackstageCliModulePackage(dependencyName);
    let dependencyPackageJsonPath: string | undefined;
    let modulePath: string | undefined;
    try {
      dependencyPackageJsonPath = targetRequire.resolve(
        `${dependencyName}/package.json`,
      );
    } catch (error) {
      const directPackageJsonPath = resolvePath(
        rootDir,
        'node_modules',
        dependencyName,
        'package.json',
      );
      if (fs.existsSync(directPackageJsonPath)) {
        dependencyPackageJsonPath = directPackageJsonPath;
      } else {
        try {
          modulePath = targetRequire.resolve(dependencyName);
          dependencyPackageJsonPath = findPackageJsonPath(
            dependencyName,
            modulePath,
          );
        } catch {
          // The actionable error for known module package names is reported below.
        }
      }

      if (!dependencyPackageJsonPath && isKnownCliModule) {
        throw new Error(
          `Failed to resolve installed CLI module "${dependencyName}" from the target repository. ` +
            `Run your package manager's install command and verify the dependency can be resolved. ` +
            `Reason: ${formatError(error)}`,
        );
      }
      if (!dependencyPackageJsonPath) {
        continue;
      }
    }

    let dependencyPackage: {
      backstage?: { role?: string };
    };
    try {
      dependencyPackage = JSON.parse(
        fs.readFileSync(dependencyPackageJsonPath, 'utf8'),
      );
    } catch (error) {
      if (isKnownCliModule) {
        throw new Error(
          `Failed to read installed CLI module "${dependencyName}": ${formatError(
            error,
          )}`,
        );
      }
      continue;
    }

    const role = dependencyPackage.backstage?.role;
    if (role !== 'cli-module') {
      if (isKnownCliModule) {
        throw new Error(
          `Installed CLI module "${dependencyName}" is malformed: its package.json must declare ` +
            `"backstage.role" as "cli-module".`,
        );
      }
      continue;
    }

    if (!modulePath) {
      try {
        modulePath = targetRequire.resolve(dependencyName);
      } catch (error) {
        throw new Error(
          `Failed to resolve the entry point of installed CLI module "${dependencyName}" ` +
            `from the target repository: ${formatError(error)}`,
        );
      }
    }

    modules.push({
      name: dependencyName,
      path: pathToFileURL(modulePath).href,
    });
  }

  if (modules.length === 0) {
    throw new Error(
      `No CLI modules are installed in the target repository. Add ` +
        `"@backstage/cli-defaults" as a devDependency, or install selected ` +
        `"@backstage/cli-module-*" packages.`,
    );
  }

  return modules;
}
