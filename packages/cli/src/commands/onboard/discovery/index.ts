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

import fs from 'fs-extra';
import yaml from 'yaml';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { loadCliConfig } from '../../../lib/config';
import { updateConfigFile } from '../config';
import { APP_CONFIG_FILE, DISCOVERED_ENTITIES_FILE } from '../files';
import { Discovery } from './Discovery';
import { BasicRepositoryAnalyzer } from './analyzers/BasicRepositoryAnalyzer';
import { PackageJsonAnalyzer } from './analyzers/PackageJsonAnalyzer';
import { GithubDiscoveryProvider } from './providers/github/GithubDiscoveryProvider';
import { GitlabDiscoveryProvider } from './providers/gitlab/GitlabDiscoveryProvider';
import { GitHubAnswers, GitLabAnswers } from '../auth';
import { Task } from '../../../lib/tasks';

export async function discover(providerInfo?: {
  provider: string;
  answers: GitHubAnswers | GitLabAnswers;
}) {
  Task.log(`
    Would you like to scan for - and create - Software Catalog entities?

    You will need to select which SCM (Source Code Management) provider you are using, 
    and then which repository or organization you want to scan.

    This will generate a new file in the root of your project containing discovered entities,
    which will be included in the Software Catalog when you start up Backstage next time.

    Note that this command requires an access token, which can be either added through the integration config or
    provided as an environment variable.
  `);

  const answers = await inquirer.prompt<{
    shouldContinue: boolean;
    provider: string;
    url: string;
  }>([
    {
      type: 'confirm',
      name: 'shouldContinue',
      message: 'Do you want to continue?',
    },
    {
      type: 'list',
      name: 'provider',
      message: 'Please select which SCM provider you want to use:',
      choices: ['GitHub', 'GitLab'],
      default: providerInfo?.provider,
      when: ({ shouldContinue }) => shouldContinue,
    },
    {
      type: 'input',
      name: 'url',
      message: `Which repository do you want to scan?`,
      when: ({ shouldContinue }) => shouldContinue,
      filter: (input, { provider }) => {
        if (provider === 'GitLab') {
          return `https://gitlab.com/${input}`;
        }
        if (provider === 'GitHub') {
          return `https://github.com/${input}`;
        }
        return false;
      },
    },
  ]);

  if (!answers.shouldContinue) {
    Task.log(
      chalk.yellow(
        'If you change your mind, feel free to re-run this command.',
      ),
    );
    return;
  }

  const { fullConfig: config } = await loadCliConfig({ args: [] });

  const discovery = new Discovery();

  if (answers.provider === 'GitHub') {
    discovery.addProvider(GithubDiscoveryProvider.fromConfig(config));
  }
  if (answers.provider === 'GitLab') {
    discovery.addProvider(GitlabDiscoveryProvider.fromConfig(config));
  }

  discovery.addAnalyzer(new BasicRepositoryAnalyzer());
  discovery.addAnalyzer(new PackageJsonAnalyzer());

  const { entities } = await discovery.run(answers.url);

  if (!entities.length) {
    Task.log(
      chalk.yellow(`
      We could not find enough information to be able to generate any Software Catalog entities for you.
      Perhaps you can try again with a different repository?`),
    );
    return;
  }

  await Task.forItem('Creating', DISCOVERED_ENTITIES_FILE, async () => {
    const payload: string[] = [];
    for (const entity of entities) {
      payload.push('---\n', yaml.stringify(entity));
    }
    await fs.writeFile(DISCOVERED_ENTITIES_FILE, payload.join(''));
  });

  await Task.forItem(
    'Updating',
    APP_CONFIG_FILE,
    async () =>
      await updateConfigFile(APP_CONFIG_FILE, {
        catalog: {
          locations: [
            {
              type: 'file',
              target: DISCOVERED_ENTITIES_FILE,
            },
          ],
        },
      }),
  );
}
