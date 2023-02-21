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
import { Task } from '../../../lib/tasks';
import { github } from './github';

export async function auth(): Promise<void> {
  const answers = await inquirer.prompt<{
    provider?: string;
  }>([
    {
      type: 'list',
      name: 'provider',
      message: 'Please select a provider:',
      choices: ['GitHub'],
    },
  ]);

  const { provider } = answers;

  switch (provider) {
    case 'GitHub': {
      await github();
      break;
    }
    default:
      throw new Error(`Provider ${provider} not implemented yet.`);
  }

  Task.log(`Done setting up ${provider}!`);
  Task.log(
    `You can now start you app with ${chalk.inverse(chalk.italic('yarn dev'))}`,
  );
}
