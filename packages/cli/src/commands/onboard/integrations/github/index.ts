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
import { Task } from '../../../../lib/tasks';
import { updateConfigFile } from '../../config';
import { APP_CONFIG_FILE } from '../../files';
import { GitHubAnswers } from '../../auth';

type Answers = {
  hasEnterprise: boolean;
  enterpriseInstanceUrl: string;
  apiBaseUrl: string;
};

const getConfig = ({
  hasEnterprise,
  apiBaseUrl,
  host,
  token,
}: {
  hasEnterprise: boolean;
  apiBaseUrl: string;
  host: string;
  token: string;
}) => ({
  integrations: {
    github: [
      {
        host,
        token,
        ...(hasEnterprise && {
          apiBaseUrl,
        }),
      },
    ],
  },
});

export const github = async (providerAnswers?: GitHubAnswers) => {
  // TODO(tudi2d): Is GitHub Enterprise a valid setup if there is no Authentication?
  const answers = await inquirer.prompt<Answers>([
    {
      type: 'confirm',
      name: 'hasEnterprise',
      message: 'Are you using GitHub Enterprise?',
      when: () => typeof providerAnswers === 'undefined',
    },
    {
      type: 'input',
      name: 'enterpriseInstanceUrl',
      message: 'What is your URL for GitHub Enterprise?',
      when: ({ hasEnterprise }) => hasEnterprise,
      validate: (input: string) => Boolean(new URL(input)),
    },
    {
      type: 'input',
      name: 'apiBaseUrl',
      message: 'What is your GitHub Enterprise API path?',
      default: '/api/v3',
      when: ({ hasEnterprise }) =>
        hasEnterprise || providerAnswers?.hasEnterprise,
      // TODO(tudi2d): Fetch API using OAuth Token if Auth was set up
    },
  ]);

  const host = new URL(
    providerAnswers?.enterpriseInstanceUrl ??
      answers?.enterpriseInstanceUrl ??
      'http://github.com',
  );

  Task.log(`
      To create new repositories in GitHub using Software Templates you first need to create a personal access token: ${chalk.blue(
        `${host.origin}/settings/tokens/new`,
      )}
  
      Select the following scopes:

      Reading software components:${chalk.cyan(`
            - "repo"`)}
            
      Reading organization data:${chalk.cyan(`
            - "read:org"
            - "read:user"
            - "user:email"`)}

      Publishing software templates:${chalk.cyan(`
            - "repo"
            - "workflow"    (if templates include GitHub workflows)
    `)}

      You can find the full documentation page here: ${chalk.blue(
        'https://backstage.io/docs/integrations/github/locations',
      )}
      `);

  const { token } = await inquirer.prompt<{ token: string }>([
    {
      type: 'input',
      name: 'token',
      message:
        'Please insert your personal access token to setup the GitHub Integration',
      // TODO(tudi2d): validate
    },
  ]);

  const config = getConfig({
    hasEnterprise: providerAnswers?.hasEnterprise ?? answers.hasEnterprise,
    apiBaseUrl: host.origin + answers.apiBaseUrl,
    host: host.hostname,
    token,
  });

  Task.log('Setting up Software Templates using GitHub integration for you...');

  await Task.forItem(
    'Updating',
    APP_CONFIG_FILE,
    async () => await updateConfigFile(APP_CONFIG_FILE, config),
  );
};
