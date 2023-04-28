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
import { findPaths } from '@backstage/cli-common';
import chalk from 'chalk';
import { exec as execCb } from 'child_process';
import { Task } from './tasks';
import { promisify } from 'util';

// eslint-disable-next-line no-restricted-syntax
const paths = findPaths(__dirname);
const exec = promisify(execCb);

export const buildApp = async () => {
  process.chdir(paths.targetRoot);

  const runCmd = async (cmd: string) => {
    await Task.forItem('executing', cmd, async () => {
      await exec(cmd).catch(error => {
        process.stdout.write(error.stderr);
        process.stdout.write(error.stdout);
        throw new Error(`Could not execute command ${chalk.cyan(cmd)}`);
      });
    });
  };

  await runCmd('yarn tsc');
  await runCmd('yarn build:backend');
};
