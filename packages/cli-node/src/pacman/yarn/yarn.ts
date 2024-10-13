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
import { PackageInfo, PackageManager } from '../pacman';
import { Lockfile } from '../lockfile';
import { fetchPackageInfo } from './packageInfo';
import { YarnVersion } from './types';
import { YarnLockfile } from './Lockfile';
import { paths } from '../../paths';
import { getHasYarnPlugin } from './plugin';
import fs from 'fs-extra';
import { run, execFile, SpawnOptionsPartialEnv } from '../../run';

export class Yarn implements PackageManager {
  private constructor(private readonly yarnVersion: YarnVersion) {}

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

  lockfilePath(): string {
    return 'yarn.lock';
  }

  async run(args: string[], options?: SpawnOptionsPartialEnv): Promise<void> {
    await run('yarn', args, options);
  }

  async fetchPackageInfo(name: string): Promise<PackageInfo> {
    return fetchPackageInfo(name, this.yarnVersion);
  }

  async loadLockfile(): Promise<Lockfile> {
    const lockfilePath = paths.resolveTargetRoot(this.lockfilePath());
    return this.parseLockfile(await fs.readFile(lockfilePath, 'utf8'));
  }

  async parseLockfile(lockfileContents: string): Promise<Lockfile> {
    return YarnLockfile.parse(lockfileContents);
  }

  async supportsBackstageVersionProtocol(): Promise<boolean> {
    return (await getHasYarnPlugin()) || false;
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
