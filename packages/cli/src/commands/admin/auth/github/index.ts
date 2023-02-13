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

import inquirer from 'inquirer';
import { GithubAuthConfig, updateConfigFile, updateEnvFile } from '../file';
import { app } from './app';
import { oauth } from './oauth';

export const github = async () => {
  const answers = await inquirer.prompt<{
    useEnvForSecrets: boolean;
    type: string;
  }>([
    {
      type: 'confirm',
      name: 'useEnvForSecrets',
      message:
        'Would you like to store sensitive configuration details such as secrets as environment variables? (recommended)',
    },
    {
      type: 'list',
      name: 'type',
      message: 'Do you want to use a Github App or a Github OAuth?',
      choices: ['GitHub OAuth', 'GitHub App'],
    },
  ]);

  const { type, useEnvForSecrets } = answers;

  switch (type) {
    case 'GitHub OAuth': {
      const config: GithubAuthConfig = await oauth(useEnvForSecrets);
      await updateConfigFile(config);
      if (useEnvForSecrets) {
        await updateEnvFile(config);
      }
      break;
    }
    case 'GitHub App': {
      const { auth }: GithubAuthConfig = await app();
      // TODO(tudi2d): Also change integrations
      await updateConfigFile({ auth });
      if (useEnvForSecrets) {
        await updateEnvFile({ auth });
      }
      break;
    }
    default:
      throw new Error(`Unknown selection: ${type}.`);
  }
};
