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

import { execFile as execFileCb } from 'child_process';
import { ExitCodeError } from './errors';
import { promisify } from 'util';
import { assertError, ForwardedError } from '@backstage/errors';

export const execFile = promisify(execFileCb);

export async function runPlain(cmd: string, ...args: string[]) {
  try {
    const { stdout } = await execFile(cmd, args, { shell: true });
    return stdout.trim();
  } catch (error) {
    assertError(error);
    if ('stderr' in error) {
      process.stderr.write(error.stderr as Buffer);
    }
    if (typeof error.code === 'number') {
      throw new ExitCodeError(error.code, [cmd, ...args].join(' '));
    }
    throw new ForwardedError('Unknown execution error', error);
  }
}

export async function runCheck(cmd: string, ...args: string[]) {
  try {
    await execFile(cmd, args, { shell: true });
    return true;
  } catch (error) {
    return false;
  }
}
