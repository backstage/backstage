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
import { Task } from '../../lib/tasks';

export type GithubAuthConfig = {
  auth: {
    providers: {
      github: {
        development: {
          clientId: string;
          clientSecret: string;
          enterpriseInstanceUrl?: string;
        };
      };
    };
  };
};

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

export const github = async (
  useEnvForSecrets?: boolean,
): Promise<GithubAuthConfig> => {
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
      name: 'hasGithubEnterprise',
      message: 'Are you using Github Enterprise?',
    },
    {
      type: 'input',
      name: 'enterpriseInstanceUrl',
      message: 'What is your URL for Github Enterprise?',
      when: ({ hasGithubEnterprise }) => hasGithubEnterprise,
      validate: (input: string) => Boolean(new URL(input)),
    },
  ]);

  await validateCredentials(answers.clientId, answers.clientSecret);

  return {
    auth: {
      providers: {
        github: {
          development: {
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
    },
  };
};
