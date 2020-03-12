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

import { spawn } from 'child_process';
import { Logger } from './logger';
import chalk from 'chalk';
import { Package } from './packages';

export function startCompiler(pkg: Package, log: Logger) {
  // First we figure out which yarn script is a available, falling back to "build --watch"
  const scriptName = ['build:watch', 'watch'].find(
    script => script in pkg.scripts,
  );
  const args = scriptName ? [scriptName] : ['build', '--watch'];

  // Start the watch script inside the dependency
  const watch = spawn('yarn', ['run', ...args], {
    cwd: pkg.location,
    env: { FORCE_COLOR: 'true', ...process.env },
    stdio: 'pipe',
  });

  watch.stdin.end();
  watch.stdout!.on('data', (data: Buffer) => {
    log.out(data.toString('utf8'));
  });
  watch.stderr!.on('data', data => {
    log.err(data.toString('utf8'));
  });

  const promise = new Promise<void>((resolve, reject) => {
    watch.on('error', error => {
      reject(error);
    });

    watch.on('close', (code: number) => {
      if (code !== 0) {
        const msg = `Compiler exited with code ${code}`;
        log.err(chalk.red(msg));
        reject(new Error(msg));
      } else {
        resolve();
      }
    });
  });

  return {
    promise,
    close() {
      watch.kill('SIGINT');
    },
  };
}
