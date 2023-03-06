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

type Answers = {
  isEnterprise: boolean;
  host: string;
  apiBaseUrl?: string;
  token: string;
};

const getConfig = ({ isEnterprise, host, apiBaseUrl, token }: Answers) => ({
  integrations: {
    github: isEnterprise
      ? [
          {
            host,
            apiBaseUrl,
            token,
          },
        ]
      : [
          {
            host,
            token,
          },
        ],
  },
});

export const github = async () => {
  let host = 'github.com';

  // TODO(tudi2d): Is GitHub Enterprise a valid setup if there is no Authentication?
  const {
    isEnterprise,
    host: _host,
    apiBaseUrl,
  } = await inquirer.prompt<{
    isEnterprise: Answers['isEnterprise'];
    apiBaseUrl: Answers['apiBaseUrl'];
    host: Answers['host'];
  }>([
    {
      type: 'confirm',
      name: 'isEnterprise',
      message: 'Are you using GitHub Enterprise?',
    },
    {
      type: 'input',
      name: 'apiBaseUrl',
      when: ({ isEnterprise: _isEnterprise }) => _isEnterprise,
      message:
        'What is your GitHub Enterprise REST API URL (e.g. https://ghe.example.net/api/v3)?',
      // TODO(tudi2d): Fetch API using OAuth Token if Auth was set up
      validate: (input: string) => Boolean(new URL(input)),
    },
    {
      type: 'input',
      name: 'host',
      when: ({ isEnterprise: _isEnterprise }) => _isEnterprise,
      message: 'What is your GitHub Enterprise Host (e.g. ghe.example.net)?',
      // TODO(tudi2d): validate: Must the host be part of the REST API URL?
    },
  ]);

  if (isEnterprise) {
    host = _host;
  }

  Task.log(`
      To create new repositories in GitHub using Software Templates you first need to create a personal access token: ${chalk.blue(
        `https://${host}/settings/tokens/new`,
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

  const { token } = await inquirer.prompt<{
    token: Answers['token'];
  }>([
    {
      type: 'input',
      name: 'token',
      message:
        'Please insert your personal access token to setup the GitHub Integration',
      // TODO(tudi2d): validate
    },
  ]);

  const config = getConfig({
    token,
    isEnterprise,
    host,
    apiBaseUrl,
  });

  Task.log('Setting up GitHub Integration for you...');

  await Task.forItem(
    'Updating',
    APP_CONFIG_FILE,
    async () => await updateConfigFile(APP_CONFIG_FILE, config),
  );
};
