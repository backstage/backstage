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

import fs from 'fs-extra';
import chalk from 'chalk';
import { Answers, Question } from 'inquirer';
import { Command } from 'commander';
import { resolve as resolvePath } from 'path';
import os from 'os';
import {
  parseOwnerIds,
  addCodeownersEntry,
  getCodeownersFilePath,
} from '../../lib/codeowners';
import {
  createTemporaryPluginFolder,
  addPluginDependencyToApp,
  addPluginToApp,
  movePlugin,
  checkExists,
  buildPlugin,
  cleanUp,
} from './createPlugin';
import { mapInqueryAnswersFromCommanderOptions } from '../../lib/mapping';
import { paths } from '../../lib/paths';
import { version } from '../../lib/version';
import { Task, templatingTask } from '../../lib/tasks';

export default async (cmd: Command): Promise<void> => {
  const codeownersPath = await getCodeownersFilePath(paths.targetRoot);

  const questions: Question[] = [
    {
      type: 'input',
      name: 'id',
      message: chalk.blue('Enter an ID for the plugin [required]'),
      validate: (value: any) => {
        if (!value) {
          return chalk.red('Please enter an ID for the plugin');
        } else if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(value)) {
          return chalk.red(
            'Plugin IDs must be kebab-cased and contain only letters, digits, and dashes.',
          );
        }
        return true;
      },
    },
  ];

  if (codeownersPath) {
    questions.push({
      type: 'input',
      name: 'owner',
      message: chalk.blue(
        'Enter the owner(s) of the plugin. If specified, this will be added to CODEOWNERS for the plugin path. [optional]',
      ),
      validate: (value: any) => {
        if (!value) {
          return true;
        }

        const ownerIds = parseOwnerIds(value);
        if (!ownerIds) {
          return chalk.red(
            'The owner must be a space separated list of team names (e.g. @org/team-name), usernames (e.g. @username), or the email addresses of users (e.g. user@example.com).',
          );
        }

        return true;
      },
    });
  }

  const answers: Answers = await mapInqueryAnswersFromCommanderOptions(
    questions,
    cmd,
  );

  const appPackage = paths.resolveTargetRoot('packages/app');
  const templateDir = paths.resolveOwn('templates/default-plugin');
  const tempDir = resolvePath(os.tmpdir(), answers.id);
  const pluginDir = paths.resolveTargetRoot('plugins', answers.id);
  const ownerIds = parseOwnerIds(answers.owner);

  Task.log();
  Task.log('Creating the plugin...');

  try {
    Task.section('Checking if the plugin ID is available');
    await checkExists(paths.targetRoot, answers.id);

    Task.section('Creating a temporary plugin directory');
    await createTemporaryPluginFolder(tempDir);

    Task.section('Preparing files');
    await templatingTask(templateDir, tempDir, { ...answers, version });

    Task.section('Moving to final location');
    await movePlugin(tempDir, pluginDir, answers.id);

    Task.section('Building the plugin');
    await buildPlugin(pluginDir);

    if (await fs.pathExists(appPackage)) {
      Task.section('Adding plugin as dependency in app');
      await addPluginDependencyToApp(paths.targetRoot, answers.id, version);

      Task.section('Import plugin in app');
      await addPluginToApp(paths.targetRoot, answers.id);
    }

    if (ownerIds && ownerIds.length) {
      await addCodeownersEntry(
        codeownersPath!,
        `/plugins/${answers.id}`,
        ownerIds,
      );
    }

    Task.log();
    Task.log(
      `🥇  Successfully created ${chalk.cyan(
        `@backstage/plugin-${answers.id}`,
      )}`,
    );
    Task.log();
    Task.exit();
  } catch (error) {
    Task.error(error.message);

    Task.log('It seems that something went wrong when creating the plugin 🤔');
    Task.log('We are going to clean up, and then you can try again.');

    Task.section('Cleanup');
    await cleanUp(tempDir);
    Task.error('🔥  Failed to create plugin!');
    Task.exit(1);
  }
};
