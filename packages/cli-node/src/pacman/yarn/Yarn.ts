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

import { assertError, ForwardedError } from '@backstage/errors';
import { PackageInfo, PackageManager } from '../PackageManager';
import { Lockfile } from '../Lockfile';
import { YarnVersion } from './types';
import fs from 'fs-extra';
import { paths, run, execFile, SpawnOptionsPartialEnv } from '../../util';
import { fetchPackageInfo } from './packageInfo';
import { YarnLockfile } from './YarnLockfile';
import { getHasYarnPlugin } from './plugin';

export class Yarn implements PackageManager {
  constructor(private readonly yarnVersion: YarnVersion) {}

  static async create(dir?: string): Promise<Yarn> {
    const yarnVersion = await detectYarnVersion(dir);
    return new Yarn(yarnVersion);
  }

  name() {
    return 'yarn';
  }

  version() {
    return this.yarnVersion.version;
  }

  lockfileName(): string {
    return 'yarn.lock';
  }

  async getMonorepoPackages() {
    const rootPackageJsonPath = paths.resolveTargetRoot('package.json');
    try {
      const pkg = await fs.readJson(rootPackageJsonPath);
      return pkg?.workspaces?.packages || [];
    } catch (error) {
      return [];
    }
  }

  async pack(out: string, packageDir: string) {
    const outArg =
      this.yarnVersion.codename === 'classic' ? '--filename' : '--out';
    await this.run(['pack', outArg, out], {
      cwd: packageDir,
    });
  }

  async run(args: string[], options?: SpawnOptionsPartialEnv) {
    await run('yarn', args, options);
  }

  async fetchPackageInfo(name: string): Promise<PackageInfo> {
    return fetchPackageInfo(name, this.yarnVersion);
  }

  async loadLockfile(): Promise<Lockfile> {
    const lockfilePath = paths.resolveTargetRoot(this.lockfileName());
    return this.parseLockfile(await fs.readFile(lockfilePath, 'utf8'));
  }

  async parseLockfile(lockfileContents: string): Promise<Lockfile> {
    return YarnLockfile.parse(lockfileContents);
  }

  async supportsBackstageVersionProtocol(): Promise<boolean> {
    return (await getHasYarnPlugin()) || false;
  }

  toString(): string {
    return `${this.name()}@${this.yarnVersion.version}`;
  }
}

const versions = new Map<string, Promise<YarnVersion>>();

function detectYarnVersion(dir?: string): Promise<YarnVersion> {
  const cwd = dir ?? process.cwd();
  if (versions.has(cwd)) {
    return versions.get(cwd)!;
  }

  const promise = Promise.resolve().then(async () => {
    try {
      const { stdout } = await execFile('yarn', ['--version'], {
        shell: true,
        cwd,
      });
      const versionString = stdout.trim();
      const codename: 'classic' | 'berry' = versionString.startsWith('1.')
        ? 'classic'
        : 'berry';
      return { version: versionString, codename };
    } catch (error) {
      assertError(error);
      if ('stderr' in error) {
        process.stderr.write(error.stderr as Buffer);
      }
      throw new ForwardedError('Failed to determine yarn version', error);
    }
  });

  versions.set(cwd, promise);
  return promise;
}
