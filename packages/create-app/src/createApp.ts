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
import { resolve as resolvePath } from 'node:path';
import { targetPaths, findOwnPaths } from '@backstage/cli-common';
import os from 'node:os';
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
  tryCommandForVersion,
} from './lib/tasks';

const DEFAULT_BRANCH = 'master';
// Uses the same 'N.x' format as GitHub Actions node-version matrices for easy find-and-replace
const SUPPORTED_NODE_VERSIONS = ['22.x', '24.x'];

export default async (opts: OptionValues): Promise<void> => {
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

  // Pick the built-in template based on the --legacy flag
  /* eslint-disable-next-line no-restricted-syntax */
  const ownPaths = findOwnPaths(__dirname);
  const builtInTemplate = opts.legacy
    ? ownPaths.resolve('templates/legacy-app')
    : ownPaths.resolve('templates/default-app');

  // Use `--template-path` argument as template when specified. Otherwise, use the default template.
  const templateDir = opts.templatePath
    ? targetPaths.resolve(opts.templatePath)
    : builtInTemplate;

  // Use `--path` argument as application directory when specified, otherwise
  // create a directory using `answers.name`
  const appDir = opts.path
    ? resolvePath(targetPaths.dir, opts.path)
    : resolvePath(targetPaths.dir, answers.name);

  // Prerequisite check
  let hasPrerequisiteError = false;
  const supportedMajors = SUPPORTED_NODE_VERSIONS.map(v =>
    parseInt(v.split('.')[0], 10),
  );
  const [major, minor, patch] = process.versions.node.split('.').map(Number);
  const yarn = await tryCommandForVersion('yarn -v');
  let python = await tryCommandForVersion('python3 --version');
  if (python.error) {
    python = await tryCommandForVersion('python --version');
  }

  Task.log();
  Task.log('Prerequisites check...');
  Task.log();
  Task.log(`  Node version is: ${major}.${minor}.${patch}`);
  Task.log(`  Yarn version is: ${yarn.version}`);
  Task.log(`  Python version is: ${python.version}`);

  if (yarn.error) {
    Task.error(
      'Yarn was not found. Please install Yarn before creating a Backstage app.',
    );
    hasPrerequisiteError = true;
  }

  if (python.error) {
    Task.log(
      chalk.yellow(
        'Warning: Python not found. Python is required by node-gyp for some native dependencies.',
      ),
    );
  }

  if (major % 2 !== 0) {
    Task.error(
      `Node version ${major} is an odd-numbered release and is not a supported LTS version. Please use an even-numbered LTS version (${SUPPORTED_NODE_VERSIONS.join(
        ' or ',
      )}).`,
    );
    hasPrerequisiteError = true;
  } else if (major < Math.min(...supportedMajors)) {
    Task.error(
      `Node version ${major} is older than the oldest supported LTS version (Node ${Math.min(
        ...supportedMajors,
      )}), please upgrade.`,
    );
    hasPrerequisiteError = true;
  } else if (major > Math.max(...supportedMajors)) {
    Task.error(
      `Node version ${major} is newer than the latest supported LTS version (Node ${Math.max(
        ...supportedMajors,
      )}), please downgrade and try again.`,
    );
    hasPrerequisiteError = true;
  }

  if (hasPrerequisiteError) {
    Task.log(
      'It seems that something went wrong when validating the prerequisites 🤔',
    );
    Task.log(
      'For help with setting up prerequisites, see https://backstage.io/docs/getting-started/#prerequisites',
    );

    Task.error('🔥  Failed to validate needed prerequisites!');
    Task.exit(1);
  }

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
      await checkAppExistsTask(targetPaths.dir, answers.name);

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
        `cd ${opts.path ?? answers.name} && yarn start`,
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
