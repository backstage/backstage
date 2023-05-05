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
import { Task } from '../../lib/tasks';
import { auth } from './auth';
import { integrations } from './integrations';
import { discover } from './discovery';

export async function command(): Promise<void> {
  const answers = await inquirer.prompt<{
    shouldSetupAuth: boolean;
    shouldSetupScaffolder: boolean;
    shouldDiscoverEntities: boolean;
  }>([
    {
      type: 'confirm',
      name: 'shouldSetupAuth',
      message: 'Do you want to set up Authentication for this project?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'shouldSetupScaffolder',
      message: 'Do you want to use Software Templates in this project?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'shouldDiscoverEntities',
      message:
        'Do you want to discover entities and add them to the Software Catalog?',
      default: true,
    },
  ]);

  const { shouldSetupAuth, shouldSetupScaffolder, shouldDiscoverEntities } =
    answers;

  let providerInfo;
  if (shouldSetupAuth) {
    providerInfo = await auth();
  }

  if (shouldSetupScaffolder) {
    await integrations(providerInfo);
  }

  if (shouldDiscoverEntities) {
    await discover(providerInfo);
  }

  if (!shouldSetupAuth && !shouldSetupScaffolder && !shouldDiscoverEntities) {
    Task.log(
      chalk.yellow(
        'If you change your mind, feel free to re-run this command.',
      ),
    );
    return;
  }

  Task.log();
  Task.log(
    `You can now start your app with ${chalk.inverse(
      chalk.italic('yarn dev'),
    )}`,
  );
  Task.log();
}
