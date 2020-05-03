/*
 * Copyright 2020 Spotify AB
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
import { readTemplateFiles } from './read';
import { handlers, handleAllFiles } from './handlers';
import { PromptFunc } from './types';

const fileHandlers = [
  {
    patterns: ['package.json'],
    handler: handlers.packageJson,
  },
  {
    patterns: ['tsconfig.json'],
    handler: handlers.exactMatch,
  },
  {
    // make sure files in 1st level of src/ and dev/ exist
    patterns: ['.eslintrc.js', /^(src|dev)\/[^/]+$/],
    handler: handlers.exists,
  },
  {
    patterns: ['README.md', /^src\//],
    handler: handlers.skip,
  },
];

const inquirerPromptFunc: PromptFunc = async msg => {
  const { result } = await inquirer.prompt({
    type: 'confirm',
    name: 'result',
    message: chalk.blue(msg),
  });
  return result;
};

export default async () => {
  const templateFiles = await readTemplateFiles('default-plugin');
  await handleAllFiles(fileHandlers, templateFiles, inquirerPromptFunc);
};
