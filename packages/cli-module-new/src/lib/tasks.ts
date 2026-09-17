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

import chalk from 'chalk';
import ora from 'ora';

const TASK_NAME_MAX_LENGTH = 14;

export class Task {
  static log(name: string = '') {
    process.stderr.write(`${chalk.green(name)}\n`);
  }

  static error(message: string = '') {
    process.stderr.write(`\n${chalk.red(message)}\n\n`);
  }

  static section(name: string) {
    const title = chalk.green(`${name}:`);
    process.stderr.write(`\n ${title}\n`);
  }

  static exit(code: number = 0) {
    process.exit(code);
  }

  static async forItem<T = void>(
    task: string,
    item: string,
    taskFunc: () => Promise<T>,
  ): Promise<T> {
    const paddedTask = chalk.green(task.padEnd(TASK_NAME_MAX_LENGTH));

    const spinner = ora({
      prefixText: chalk.green(`  ${paddedTask}${chalk.cyan(item)}`),
      spinner: 'arc',
      color: 'green',
    }).start();

    try {
      const result = await taskFunc();
      spinner.succeed();
      return result;
    } catch (error) {
      spinner.fail();
      throw error;
    }
  }
}
