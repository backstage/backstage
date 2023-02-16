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

import { OAuthApp } from '@octokit/oauth-app';
import chalk from 'chalk';
import inquirer from 'inquirer';
import fetch from 'node-fetch';
import { Task } from '../../../../lib/tasks';
import { addUserEntity, updateConfigFile, updateEnvFile } from '../config';
import {
  APP_CONFIG_FILE,
  APP_TSX_FILE,
  AUTH_BACKEND_PLUGIN_FILE,
  ENV_CONFIG_FILE,
  USER_ENTITY_FILE,
} from '../files';
import { patch } from '../patch';
import { addSignInPageDiff, replaceSignInResolverDiff } from './diffs';

const validateCredentials = async (clientId: string, clientSecret: string) => {
  try {
    const app = new OAuthApp({
      clientId,
      clientSecret,
    });
    await app.createToken({
      code: '%NOT-VALID-CODE%',
    });
  } catch (error) {
    // @octokit/request returns a error.response object when a request is rejected.
    // We can check it to see what kind of error we received.

    // If error.response is successful we can double-check that the error itself was due to the bad code.
    // If that's the case then we can assume that the client id and secret exists as we otherwise would
    // have gotten a 400/404.
    if (
      error.response.status !== 200 &&
      error.response.data.error !== 'bad_verification_code'
    ) {
      throw new Error(`Validating Github Credentials failed.`);
    }
  }
};

const getConfig = (answers: Answers, useEnvForSecrets: boolean) => {
  const { clientId, clientSecret, hasEnterprise, enterpriseInstanceUrl } =
    answers;

  return {
    auth: {
      providers: {
        github: {
          development: {
            clientId: useEnvForSecrets ? '${AUTH_GITHUB_CLIENT_ID}' : clientId,
            clientSecret: useEnvForSecrets
              ? '${AUTH_GITHUB_CLIENT_SECRET}'
              : clientSecret,
            ...(hasEnterprise && {
              enterpriseInstanceUrl: enterpriseInstanceUrl,
            }),
          },
        },
      },
    },
    catalog: {
      locations: [
        {
          type: 'file',
          target: '../../user-info.yaml',
          rules: [{ allow: ['User'] }],
        },
      ],
    },
  };
};

type Answers = {
  username: string;
  clientSecret: string;
  clientId: string;
  hasEnterprise: boolean;
  enterpriseInstanceUrl?: string;
};

export const oauth = async (useEnvForSecrets: boolean) => {
  Task.log(`
    To add GitHub authentication, you must create an OAuth App from the GitHub developer settings: ${chalk.blue(
      'https://github.com/settings/developers',
    )}
    The Homepage URL should point to Backstage's frontend, while the Authorization callback URL will point to the auth backend.

    Settings for local development:
    ${chalk.cyan(`
      Homepage URL: http://localhost:3000
      Authorization callback URL: http://localhost:7007/api/auth/github/handler/frame`)}

    You can find the full documentation page here: ${chalk.blue(
      'https://backstage.io/docs/auth/github/provider',
    )}`);

  const answers = await inquirer.prompt<Answers>([
    {
      type: 'input',
      name: 'username',
      message: 'What is your Github username?',
      validate: async (input: string) => {
        const response = await fetch(`https://api.github.com/users/${input}`);
        if (!response.ok) {
          return chalk.red('Unknown user. Please try again.');
        }
        return true;
      },
    },
    {
      type: 'input',
      name: 'clientId',
      message: 'What is your Client Id?',
      validate: (input: string) => (input.length ? true : false),
    },
    {
      type: 'input',
      name: 'clientSecret',
      message: 'What is your Client Secret?',
      validate: (input: string) => (input.length ? true : false),
    },
    {
      type: 'confirm',
      name: 'hasEnterprise',
      message: 'Are you using Github Enterprise?',
    },
    {
      type: 'input',
      name: 'enterpriseInstanceUrl',
      message: 'What is your URL for Github Enterprise?',
      when: ({ hasEnterprise }) => hasEnterprise,
      validate: (input: string) => Boolean(new URL(input)),
    },
  ]);

  const { username, clientId, clientSecret } = answers;

  await validateCredentials(clientId, clientSecret);

  const config = getConfig(answers, useEnvForSecrets);
  await updateConfigFile(APP_CONFIG_FILE, config);

  if (useEnvForSecrets) {
    await updateEnvFile(ENV_CONFIG_FILE, clientId, clientSecret);
  }

  await addUserEntity(USER_ENTITY_FILE, username);

  await patch(APP_TSX_FILE, addSignInPageDiff);
  await patch(AUTH_BACKEND_PLUGIN_FILE, replaceSignInResolverDiff);
};
