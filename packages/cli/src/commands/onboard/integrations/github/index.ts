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

export const github = async () => {
  const host = 'https://github.com';
  const answers = await inquirer.prompt<{ hasEnterprise: boolean }>([
    {
      type: 'confirm',
      name: 'hasEnterprise',
      message: 'Are you using GitHub Enterprise?',
    },
  ]);

  if (answers.hasEnterprise) {
    await inquirer.prompt<{ hasEnterprise: boolean }>([
      {
        type: 'confirm',
        name: 'hasEnterprise',
        message: 'Are you using GitHub Enterprise?',
      },
      {
        type: 'input',
        name: 'enterpriseInstanceUrl',
        message: 'What is your GitHub Enterprise URL (e.g. ghe.example.net)?',
        when: ({ hasEnterprise }) => hasEnterprise,
        validate: (input: string) => Boolean(new URL(input)),
      },
    ]);
  }

  Task.log(`
      To create new repositories in GitHub using Software Templates you first need to create a personal access token: ${chalk.blue(
        `${host}/settings/tokens/new',
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
      `,
      )}`);
};
