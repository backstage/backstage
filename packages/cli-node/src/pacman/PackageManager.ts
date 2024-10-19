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

import { Yarn } from './yarn';
import { Lockfile } from './Lockfile';
import { SpawnOptionsPartialEnv } from '../run';
import { paths } from '../paths';
import fs from 'fs-extra';
import chalk from 'chalk';

export interface PackageManager {
  name(): string;
  version(): string;
  lockfileName(): string;
  getMonorepoPackages(): Promise<string[]>;
  run(args: string[], options?: SpawnOptionsPartialEnv): Promise<void>;
  pack(output: string, packageDir: string): Promise<void>;
  fetchPackageInfo(name: string): Promise<PackageInfo>;
  loadLockfile(): Promise<Lockfile>;
  parseLockfile(contents: string): Promise<Lockfile>;
  supportsBackstageVersionProtocol(): Promise<boolean>;
  toString(): string;
}

export type PackageInfo = {
  name: string;
  'dist-tags': Record<string, string>;
  versions: string[];
  time: { [version: string]: string };
};

export async function detectPackageManager(): Promise<PackageManager> {
  const hasYarnLockfile = await fileExists(
    paths.resolveTargetRoot('yarn.lock'),
  );
  if (hasYarnLockfile) {
    return await Yarn.create();
  }

  try {
    const packageJson = await fs.readJson(
      paths.resolveTargetRoot('package.json'),
    );
    if (packageJson.workspaces) {
      // TODO this could be NPM as well
      return await Yarn.create();
    }

    const declaredPacman = packageJson.packageManager;
    if (declaredPacman) {
      const [name, _version] = declaredPacman.split('@');
      switch (name) {
        case 'yarn':
          return await Yarn.create();
        default:
          console.log(
            chalk.yellow(`Detected unsupported package manager: ${name}.`),
          );
          return await Yarn.create();
      }
    }
  } catch (error) {
    console.log(chalk.red(`Error during package manager detection: ${error}`));
  }

  // currently yarn is the only package manager supported so just log an error and use it anyway
  console.log(
    chalk.yellow(
      'Yarn was not detected, but is the only supported package manager.',
    ),
  );
  return await Yarn.create();
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch (error) {
    return false;
  }
}
