/*
 * Copyright 2023 The Backstage Authors
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
import { promisify } from 'util';
import {
  ExecOptions,
  SpawnOptions,
  exec as execCb,
  spawn as spawnOriginal,
} from 'child_process';

const execPromise = promisify(execCb);

export const exec = (
  command: string,
  args: string[] = [],
  options?: ExecOptions,
) => {
  return execPromise(
    [
      command,
      ...args.filter(e => e).map(e => (e.startsWith('-') ? e : `"${e}"`)),
    ].join(' '),
    options,
  );
};

export const spawn = (
  command: string,
  args: string[],
  options?: SpawnOptions,
) => {
  return new Promise((resolve, reject) => {
    const cp = spawnOriginal(command, args, options ?? {});
    const error: string[] = [];
    const stdout: string[] = [];

    cp.stdout?.on('data', data => {
      stdout.push(data.toString());
    });

    cp.on('error', e => {
      error.push(e.toString());
    });

    cp.on('close', exitCode => {
      if (exitCode) reject(error.join(''));
      else resolve(stdout.join(''));
    });
  });
};
