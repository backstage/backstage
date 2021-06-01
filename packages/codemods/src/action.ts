/*
 * Copyright 2020 Spotify AB
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

import { relative as relativePath } from 'path';
import { spawn } from 'child_process';
import { Command } from 'commander';
import { findPaths } from '@backstage/cli-common';
import { ExitCodeError } from './errors';

// eslint-disable-next-line no-restricted-syntax
const paths = findPaths(__dirname);

export function createCodemodAction(name: string) {
  return async (_: unknown, cmd: Command) => {
    const transformPath = relativePath(
      process.cwd(),
      paths.resolveOwn('transforms', `${name}.js`),
    );

    const args = [
      '--parser=tsx',
      '--extensions=tsx,js,ts,tsx',
      '--transform',
      transformPath,
      '--ignore-pattern=**/node_modules/**',
      ...cmd.args,
    ];

    console.log(`Running jscodeshift with these arguments: ${args.join(' ')}`);

    const jscodeshiftScript = require.resolve('.bin/jscodeshift');
    const child = spawn(process.argv0, [jscodeshiftScript, ...args], {
      stdio: 'inherit',
      shell: true,
      env: {
        ...process.env,
        FORCE_COLOR: 'true',
      },
    });

    if (typeof child.exitCode === 'number') {
      if (child.exitCode) {
        throw new ExitCodeError(child.exitCode, name);
      }
      return;
    }

    await new Promise<void>((resolve, reject) => {
      child.once('error', error => reject(error));
      child.once('exit', code => {
        if (code) {
          reject(new ExitCodeError(code, name));
        } else {
          resolve();
        }
      });
    });
  };
}
