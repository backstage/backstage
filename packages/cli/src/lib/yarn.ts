/*
 * Copyright 2022 The Backstage Authors
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
import { execFile as execFileCb } from 'child_process';
import { promisify } from 'util';

const execFile = promisify(execFileCb);

const versions = new Map<string, Promise<'classic' | 'berry'>>();

export function detectYarnVersion(dir?: string): Promise<'classic' | 'berry'> {
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
      return stdout.trim().startsWith('1.') ? 'classic' : 'berry';
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
