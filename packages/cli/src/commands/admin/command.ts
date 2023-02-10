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
import { github } from './github';
import { updateConfigFile, updateEnvFile } from './file';
import ghAuth from './gh-auth';

export async function command(): Promise<void> {
  const answers = await inquirer.prompt<{
    shouldSetupAuth: boolean;
    useEnvForSecrets?: boolean;
    provider?: string;
  }>([
    {
      type: 'confirm',
      name: 'shouldSetupAuth',
      message: 'Do you want to set up Authentication for this project?',
    },
    {
      type: 'confirm',
      name: 'useEnvForSecrets',
      message:
        'Would you like to store sensitive configuration details such as secrets as environment variables? (recommended)',
      when: ({ shouldSetupAuth }) => shouldSetupAuth,
    },
    {
      type: 'list',
      name: 'provider',
      message: 'Please select a provider:',
      choices: ['GitHub OAuth', 'GitHub App'],
      when: ({ shouldSetupAuth }) => shouldSetupAuth,
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

  const { useEnvForSecrets } = answers;

  switch (answers.provider) {
    case 'GitHub OAuth': {
      const config = await github(useEnvForSecrets);
      await updateConfigFile(config);
      if (useEnvForSecrets) {
        await updateEnvFile(config);
      }
      break;
    }
    case 'GitHub App': {
      const config = await ghAuth();
      // TODO(tudi2d): Also change integrations
      if (useEnvForSecrets) {
        await updateEnvFile({
          auth: config.auth,
        });
        config.auth.providers.github.development.clientId =
          '${AUTH_GITHUB_CLIENT_ID}';
        config.auth.providers.github.development.clientSecret =
          '${AUTH_GITHUB_CLIENT_SECRET}';
        await updateConfigFile({
          auth: config.auth,
        });
      } else {
        await updateConfigFile({ auth: config.auth });
      }
      break;
    }
    default:
      throw new Error(`Provider ${answers.provider} not implemented yet.`);
  }

  Task.log(`Done setting up ${answers.provider}!`);
}
