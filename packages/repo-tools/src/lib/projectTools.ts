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

import { targetPaths } from '@backstage/cli-common';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve as resolvePath } from 'node:path';
import semver from 'semver';

/**
 * Tools that are loaded from the target project instead of being bundled
 * with repo-tools, so that the project's own version is always used.
 */
export type ProjectToolName = 'typescript' | 'prettier' | 'typedoc';

/**
 * The versions of each project tool that repo-tools is known to work with.
 */
export const supportedProjectToolVersions: Record<ProjectToolName, string> = {
  typescript: '> 3.0.0',
  prettier: '^2.8.1 || ^3.8.1',
  typedoc: '^0.28.0',
};

/**
 * A tool package installed in the target project.
 */
export interface ProjectTool {
  name: ProjectToolName;
  version: string;
  /** The directory that the package is installed in. */
  packageDir: string;
  /** Resolves a module request, such as `prettier`, from the project root. */
  resolve(request: string): string;
  /** Loads a module, such as `prettier`, from the project root. */
  require<T>(request: string): T;
  /** Returns the absolute path to one of the bin scripts of the package. */
  binPath(binName: string): string;
}

const warnedVersions = new Set<string>();

function warnIfUnsupportedVersion(name: ProjectToolName, version: string) {
  const range = supportedProjectToolVersions[name];
  if (semver.satisfies(version, range, { includePrerelease: true })) {
    return;
  }
  const key = `${name}@${version}`;
  if (warnedVersions.has(key)) {
    return;
  }
  warnedVersions.add(key);
  console.warn(
    `Warning: the project uses ${name}@${version}, but @backstage/repo-tools supports ${name} ${range}. Some commands may not work as expected.`,
  );
}

/**
 * Finds a tool package installed in the target project, resolving it from the
 * project root rather than from the location of repo-tools.
 *
 * @returns The tool, or `undefined` if it is not installed in the project.
 */
export function findProjectTool(
  name: ProjectToolName,
  rootDir: string = targetPaths.rootDir,
): ProjectTool | undefined {
  const projectRequire = createRequire(resolvePath(rootDir, 'package.json'));

  let packageJsonPath: string;
  try {
    packageJsonPath = projectRequire.resolve(`${name}/package.json`);
  } catch (error) {
    if ((error as NodeJS.ErrnoException)?.code === 'MODULE_NOT_FOUND') {
      return undefined;
    }
    throw error;
  }

  const packageDir = dirname(packageJsonPath);
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as {
    version: string;
    bin?: string | Record<string, string>;
  };

  warnIfUnsupportedVersion(name, packageJson.version);

  return {
    name,
    version: packageJson.version,
    packageDir,
    resolve: request => projectRequire.resolve(request),
    require: <T>(request: string) => projectRequire(request) as T,
    binPath(binName: string) {
      // A string bin field means the package has a single bin with its own name
      const bins =
        typeof packageJson.bin === 'string'
          ? { [name]: packageJson.bin }
          : packageJson.bin;
      const binFile = bins?.[binName];
      if (!binFile) {
        throw new Error(
          `The ${name} package installed at ${packageDir} does not provide a '${binName}' executable`,
        );
      }
      return resolvePath(packageDir, binFile);
    },
  };
}

/**
 * Finds a tool package installed in the target project, failing with an
 * error that explains how to install it if it is missing.
 */
export function requireProjectTool(
  name: ProjectToolName,
  rootDir: string = targetPaths.rootDir,
): ProjectTool {
  const tool = findProjectTool(name, rootDir);
  if (!tool) {
    throw new Error(
      `Could not find the '${name}' package in the project at ${rootDir}. ` +
        `@backstage/repo-tools uses the project's own ${name} installation, ` +
        `add '${name}' (${supportedProjectToolVersions[name]}) to the devDependencies ` +
        `of the root package.json and run 'yarn install'.`,
    );
  }
  return tool;
}
