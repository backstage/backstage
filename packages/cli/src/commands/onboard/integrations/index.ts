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
import { Task } from '../../../lib/tasks';
import { GitHubAnswers, GitLabAnswers } from '../auth';
import { github } from './github';

enum Integration {
  GITHUB = 'GitHub',
}

const Integrations: Integration[] = [Integration.GITHUB];

export async function integrations(providerInfo?: {
  provider: string;
  answers: GitHubAnswers | GitLabAnswers;
}): Promise<void> {
  const answers = await inquirer.prompt<{
    integration?: Integration;
    shouldUsePreviousProvider: boolean;
  }>([
    {
      type: 'confirm',
      name: 'shouldUsePreviousProvider',
      message: `Do you want to keep using ${providerInfo?.provider} as your provider when setting up Software Templates?`,
      when: () =>
        providerInfo?.provider &&
        Object.values(Integrations).includes(
          providerInfo!.provider as Integration,
        ),
    },
    {
      // TODO(tudi2d): Let's start with one, but it should be multiple choice in the future
      type: 'list',
      name: 'integration',
      message: 'Please select an integration provider:',
      choices: Integrations,
      when: ({ shouldUsePreviousProvider }) => !shouldUsePreviousProvider,
    },
  ]);

  if (answers.shouldUsePreviousProvider) {
    answers.integration = providerInfo!.provider as Integration;
  }

  switch (answers.integration) {
    case Integration.GITHUB: {
      const providerAnswers =
        providerInfo?.provider === 'GitHub'
          ? (providerInfo!.answers as GitHubAnswers)
          : undefined;
      await github(providerAnswers);
      break;
    }
    default:
  }

  Task.log();
  Task.log(`Done setting up ${answers.integration} Integration!`);
  Task.log();
}
