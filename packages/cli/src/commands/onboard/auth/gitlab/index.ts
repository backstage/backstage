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
import * as fs from 'fs-extra';
import inquirer from 'inquirer';
import { Task } from '../../../../lib/tasks';
import { updateConfigFile } from '../../config';
import { APP_CONFIG_FILE, PATCH_FOLDER } from '../../files';
import { patch } from '../patch';

const getConfig = (answers: Answers) => {
  const { clientId, clientSecret, hasAudience, audience } = answers;

  return {
    auth: {
      providers: {
        gitlab: {
          development: {
            clientId,
            clientSecret,
            ...(hasAudience && {
              audience,
            }),
          },
        },
      },
    },
  };
};

type Answers = {
  clientSecret: string;
  clientId: string;
  hasAudience: boolean;
  audience?: string;
};

export const gitlab = async () => {
  Task.log(`
    To add GitLab authentication, you must create an Application from the GitLab Settings: ${chalk.blue(
      'https://gitlab.com/-/profile/applications',
    )}
    The Redirect URI should point to your Backstage backend auth handler.

    Settings for local development:
    ${chalk.cyan(`
        Name: Backstage (or your custom app name)
        Redirect URI: http://localhost:7007/api/auth/gitlab/handler/frame
        Scopes: read_api and read_user`)}

    You can find the full documentation page here: ${chalk.blue(
      'https://backstage.io/docs/auth/gitlab/provider',
    )}
    `);

  const answers = await inquirer.prompt<Answers>([
    {
      type: 'input',
      name: 'clientId',
      message: 'What is your Application Id?',
      validate: (input: string) => (input.length ? true : false),
    },
    {
      type: 'input',
      name: 'clientSecret',
      message: 'What is your Application Secret?',
      validate: (input: string) => (input.length ? true : false),
    },
    {
      type: 'confirm',
      name: 'hasAudience',
      message: 'Do you have a self-hosted instance of GitLab?',
    },
    {
      type: 'input',
      name: 'audience',
      message: 'What is the URL for your GitLab instance?',
      when: ({ hasAudience }) => hasAudience,
      validate: (input: string) => Boolean(new URL(input)),
    },
  ]);

  const config = getConfig(answers);

  Task.log('Setting up GitLab Authentication for you...');

  await Task.forItem(
    'Updating',
    APP_CONFIG_FILE,
    async () => await updateConfigFile(APP_CONFIG_FILE, config),
  );

  const patches = await fs.readdir(PATCH_FOLDER);
  for (const patchFile of patches.filter(p => p.includes('gitlab'))) {
    await Task.forItem('Patching', patchFile, async () => {
      await patch(patchFile);
    });
  }
};
