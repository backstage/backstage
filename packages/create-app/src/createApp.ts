/*
 * Copyright 2020 The Backstage Authors
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
import { Command } from 'commander';
import inquirer, { Answers, Question } from 'inquirer';
import { resolve as resolvePath } from 'path';
import { findPaths } from '@backstage/cli-common';
import os from 'os';
import {
  Task,
  buildAppTask,
  checkAppExistsTask,
  checkPathExistsTask,
  createTemporaryAppFolderTask,
  moveAppTask,
  templatingTask,
} from './lib/tasks';

export default async (cmd: Command, version: string): Promise<void> => {
  /* eslint-disable-next-line no-restricted-syntax */
  const paths = findPaths(__dirname);

  const questions: Question[] = [
    {
      type: 'input',
      name: 'name',
      message: chalk.blue('Enter a name for the app [required]'),
      validate: (value: any) => {
        if (!value) {
          return chalk.red('Please enter a name for the app');
        } else if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(value)) {
          return chalk.red(
            'App name must be lowercase and contain only letters, digits, and dashes.',
          );
        }
        return true;
      },
    },
    {
      type: 'list',
      name: 'dbType',
      message: chalk.blue('Select database for the backend [required]'),
      // @ts-ignore
      choices: ['SQLite', 'PostgreSQL'],
    },
  ];
  const answers: Answers = await inquirer.prompt(questions);
  answers.dbTypePG = answers.dbType === 'PostgreSQL';
  answers.dbTypeSqlite = answers.dbType === 'SQLite';

  const templateDir = paths.resolveOwn('templates/default-app');
  const tempDir = resolvePath(os.tmpdir(), answers.name);

  // Use `--path` argument as applicaiton directory when specified, otherwise
  // create a directory using `answers.name`
  const appDir = cmd.path
    ? resolvePath(paths.targetDir, cmd.path)
    : resolvePath(paths.targetDir, answers.name);

  Task.log();
  Task.log('Creating the app...');

  try {
    if (cmd.path) {
      // Template directly to specified path

      Task.section('Checking that supplied path exists');
      await checkPathExistsTask(appDir);

      Task.section('Preparing files');
      await templatingTask(templateDir, cmd.path, answers, version);
    } else {
      // Template to temporary location, and then move files

      Task.section('Checking if the directory is available');
      await checkAppExistsTask(paths.targetDir, answers.name);

      Task.section('Creating a temporary app directory');
      await createTemporaryAppFolderTask(tempDir);

      Task.section('Preparing files');
      await templatingTask(templateDir, tempDir, answers, version);

      Task.section('Moving to final location');
      await moveAppTask(tempDir, appDir, answers.name);
    }

    if (!cmd.skipInstall) {
      Task.section('Building the app');
      await buildAppTask(appDir);
    }

    Task.log();
    Task.log(
      chalk.green(`🥇  Successfully created ${chalk.cyan(answers.name)}`),
    );
    Task.log();
    Task.section('All set! Now you might want to');
    Task.log(`  Run the app: ${chalk.cyan(`cd ${answers.name} && yarn dev`)}`);
    Task.log(
      '  Set up the software catalog: https://backstage.io/docs/features/software-catalog/configuration',
    );
    Task.log('  Add authentication: https://backstage.io/docs/auth/');
    Task.log();
    Task.exit();
  } catch (error) {
    Task.error(String(error));

    Task.log('It seems that something went wrong when creating the app 🤔');

    Task.error('🔥  Failed to create app!');
    Task.exit(1);
  }
};
