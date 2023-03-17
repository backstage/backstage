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
import { github, Answers as GitHubAnswers } from './providers/github';
import { gitlab, Answers as GitLabAnswers } from './providers/gitlab';

export { type GitHubAnswers, type GitLabAnswers };

export async function auth(): Promise<{
  provider: string;
  answers: GitHubAnswers | GitLabAnswers;
}> {
  const answers = await inquirer.prompt<{
    provider: string;
  }>([
    {
      type: 'list',
      name: 'provider',
      message: 'Please select an authentication provider:',
      choices: ['GitHub', 'GitLab'],
    },
  ]);

  const { provider } = answers;

  let providerAnswers;
  switch (provider) {
    case 'GitHub': {
      providerAnswers = await github();
      break;
    }
    case 'GitLab': {
      providerAnswers = await gitlab();
      break;
    }
    default:
      throw new Error(`Provider ${provider} not implemented yet.`);
  }

  Task.log();
  Task.log(`Done setting up ${provider} Authentication!`);
  Task.log();

  return {
    provider,
    answers: providerAnswers,
  };
}
