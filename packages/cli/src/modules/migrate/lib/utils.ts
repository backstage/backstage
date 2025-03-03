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

import ora from 'ora';
import chalk from 'chalk';
import { run } from '../../../lib/run';

export async function runYarnInstall() {
  const spinner = ora({
    prefixText: `Running ${chalk.blue('yarn install')} to install new versions`,
    spinner: 'arc',
    color: 'green',
  }).start();

  const installOutput = new Array<Buffer>();
  try {
    await run('yarn', ['install'], {
      env: {
        FORCE_COLOR: 'true',
        // We filter out all of the npm_* environment variables that are added when
        // executing through yarn. This works around an issue where these variables
        // incorrectly override local yarn or npm config in the project directory.
        ...Object.fromEntries(
          Object.entries(process.env).map(([name, value]) =>
            name.startsWith('npm_') ? [name, undefined] : [name, value],
          ),
        ),
      },
      stdoutLogFunc: data => installOutput.push(data),
      stderrLogFunc: data => installOutput.push(data),
    });
    spinner.succeed();
  } catch (error) {
    spinner.fail();
    process.stdout.write(Buffer.concat(installOutput));
    throw error;
  }
}
