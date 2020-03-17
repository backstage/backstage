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

import chalk from 'chalk';
import { Command } from 'commander';
import { spawnSync } from 'child_process';

export default async (cmd: Command) => {
  const args = ['lint'];
  if (cmd.fix) {
    args.push('--fix');
  }

  try {
    const result = spawnSync('web-scripts', args, { stdio: 'inherit', shell: true });
    if (result.error) {
      throw result.error;
    }
    process.exit(result.status ?? 0);
  } catch (error) {
    process.stderr.write(`${chalk.red(error.message)}\n`);
    process.exit(1);
  }
};
