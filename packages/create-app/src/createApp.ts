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
import { OptionValues } from 'commander';
import inquirer, { Answers } from 'inquirer';
import { resolve as resolvePath } from 'path';
import { findPaths } from '@backstage/cli-common';
import os from 'os';
import fs from 'fs-extra';
import {
  Task,
  buildAppTask,
  checkAppExistsTask,
  checkPathExistsTask,
  moveAppTask,
  templatingTask,
  tryInitGitRepository,
  readGitConfig,
  fetchYarnLockSeedTask,
} from './lib/tasks';

const DEFAULT_BRANCH = 'master';

export default async (opts: OptionValues): Promise<void> => {
  /* eslint-disable-next-line no-restricted-syntax */
  const paths = findPaths(__dirname);
  const answers: Answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      default: 'backstage',
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
      when: (a: Answers) => {
        const envName = process.env.BACKSTAGE_APP_NAME;
        if (envName) {
          a.name = envName;
          return false;
        }
        return true;
      },
    },
  ]);

  const templateDir = opts.templatePath
    ? paths.resolveTarget(opts.templatePath)
    : paths.resolveOwn('templates/default-app');

  // Use `--path` argument as application directory when specified, otherwise
  // create a directory using `answers.name`
  const appDir = opts.path
    ? resolvePath(paths.targetDir, opts.path)
    : resolvePath(paths.targetDir, answers.name);

  Task.log();
  Task.log('Creating the app...');

  try {
    const gitConfig = await readGitConfig();

    if (opts.path) {
      // Template directly to specified path

      Task.section('Checking that supplied path exists');
      await checkPathExistsTask(appDir);

      Task.section('Preparing files');
      await templatingTask(templateDir, opts.path, {
        ...answers,
        defaultBranch: gitConfig?.defaultBranch ?? DEFAULT_BRANCH,
      });
    } else {
      // Template to temporary location, and then move files

      Task.section('Checking if the directory is available');
      await checkAppExistsTask(paths.targetDir, answers.name);

      Task.section('Creating a temporary app directory');
      const tempDir = await fs.mkdtemp(resolvePath(os.tmpdir(), answers.name));

      Task.section('Preparing files');
      await templatingTask(templateDir, tempDir, {
        ...answers,
        defaultBranch: gitConfig?.defaultBranch ?? DEFAULT_BRANCH,
      });

      Task.section('Moving to final location');
      await moveAppTask(tempDir, appDir, answers.name);
    }

    const fetchedYarnLockSeed = await fetchYarnLockSeedTask(appDir);

    if (gitConfig) {
      if (await tryInitGitRepository(appDir)) {
        // Since we don't know whether we were able to init git before we
        // try, we can't track the actual task execution
        Task.forItem('init', 'git repository', async () => {});
      }
    }

    if (!opts.skipInstall) {
      Task.section('Installing dependencies');
      await buildAppTask(appDir);
    }

    Task.log();
    Task.log(
      chalk.green(`🥇  Successfully created ${chalk.cyan(answers.name)}`),
    );
    Task.log();

    if (!fetchedYarnLockSeed) {
      Task.log(
        chalk.yellow(
          [
            'Warning: Failed to fetch the yarn.lock seed file.',
            '         You may end up with incompatible dependencies that break the app.',
            '         If you run into any errors, please search the issues at',
            '         https://github.com/backstage/backstage/issues for potential solutions',
          ].join('\n'),
        ),
      );
    }

    Task.section('All set! Now you might want to');
    if (opts.skipInstall) {
      Task.log(
        `  Install the dependencies: ${chalk.cyan(
          `cd ${opts.path ?? answers.name} && yarn install`,
        )}`,
      );
    }
    Task.log(
      `  Run the app: ${chalk.cyan(
        `cd ${opts.path ?? answers.name} && yarn dev`,
      )}`,
    );
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
