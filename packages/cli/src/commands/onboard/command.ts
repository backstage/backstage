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
import { integrations } from './integrations';

export async function command(): Promise<void> {
  try {
    // TODO(tudi2d): Is there a way to make this cleaner?
    const answers = await inquirer.prompt<{
      shouldSetupAuth: boolean;
    }>([
      {
        type: 'confirm',
        name: 'shouldSetupAuth',
        message: 'Do you want to set up Authentication for this project?',
        default: true,
      },
    ]);

    if (!answers.shouldSetupAuth) {
      console.log(
        chalk.yellow(
          'If you change your mind, feel free to re-run this command.',
        ),
      );
    } else {
      await auth();
    }

    // TODO(tudi2d): Select "Core Features" here such that we can determin if the integrations need to be setup for either Catalog, Scaffollder or both
    await inquirer
      .prompt<{
        setupScaffolder: boolean;
      }>([
        {
          type: 'confirm',
          name: 'setupScaffolder',
          message: 'Do you want to setup Sofware Templates?',
          default: true,
        },
      ])
      .then(async ({ setupScaffolder }) =>
        setupScaffolder
          ? await integrations()
          : console.log(
              chalk.yellow(
                'If you change your mind, feel free to re-run this command.',
              ),
            ),
      );
  } catch (err) {
    process.exit(-1);
  }
}
