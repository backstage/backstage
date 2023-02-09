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

export type GithubAuthConfig = {
  auth: {
    providers: {
      github: {
        clientId: string;
        clientSecret: string;
        enterpriseInstanceUrl?: string;
      };
    };
  };
};

export const github = async (
  useEnvForSecrets?: boolean,
): Promise<GithubAuthConfig> => {
  Task.log(`
    To add GitHub authentication, you must create an OAuth App from the GitHub developer settings: ${chalk.blue(
      'https://github.com/settings/developers',
    )}
    The Homepage URL should point to Backstage's frontend, while the Authorization callback URL will point to the auth backend.

    You can find the full documentation page here: ${chalk.blue(
      'https://backstage.io/docs/auth/github/provider',
    )}
    `);

  const answers = await inquirer.prompt<{
    clientSecret: string;
    clientId: string;
    hasGithubEnterprise: boolean;
    enterpriseInstanceUrl?: string;
  }>([
    {
      type: 'input',
      name: 'clientSecret',
      message: 'What is your Client Secret?',
      // TODO(eide): Is there another way to validate?
      //   validate(input) {
      //     if (/([a-f0-9]{40})/g.test(input)) {
      //       return true;
      //     }

      //     throw Error('Please provide a valid client secret.');
      //   },
    },
    {
      type: 'input',
      name: 'clientId',
      message: 'What is your Client Id?',
    },
    {
      type: 'confirm',
      name: 'hasGithubEnterprise',
      message: 'Are you using Github Enterprise?',
    },
    {
      type: 'input',
      name: 'enterpriseInstanceUrl',
      message: 'What is your URL for Github Enterprise?',
      when: ({ hasGithubEnterprise }) => hasGithubEnterprise,
      validate(input: string) {
        return Boolean(new URL(input));
      },
    },
  ]);

  return {
    auth: {
      providers: {
        github: {
          clientId: useEnvForSecrets
            ? '${AUTH_GITHUB_CLIENT_ID}'
            : answers.clientId,
          clientSecret: useEnvForSecrets
            ? '${AUTH_GITHUB_CLIENT_SECRET}'
            : answers.clientSecret,
          ...(answers.hasGithubEnterprise && {
            enterpriseInstanceUrl: answers.enterpriseInstanceUrl,
          }),
        },
      },
    },
  };
};
