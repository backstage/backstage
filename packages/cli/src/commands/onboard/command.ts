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

import chalk from 'chalk';
import inquirer from 'inquirer';
import { auth } from './auth';

export async function command(): Promise<void> {
  const answers = await inquirer.prompt<{
    shouldSetupAuth: boolean;
    provider?: string;
  }>([
    {
      type: 'confirm',
      name: 'shouldSetupAuth',
      message: 'Do you want to set up Authentication for this project?',
    },
  ]);

  if (!answers.shouldSetupAuth) {
    console.log(
      chalk.yellow(
        'If you change your mind, feel free to re-run this command.',
      ),
    );
    process.exit(1);
  }

  await auth();
}
