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
import { promisify } from 'util';
import chalk from 'chalk';
import inquirer, { Answers, Question } from 'inquirer';
import { exec as execCb } from 'child_process';
import { resolve as resolvePath } from 'path';
import os from 'os';
import {
  parseOwnerIds,
  addCodeownersEntry,
  getCodeownersFilePath,
} from '../../lib/codeowners';
import { paths } from '../../lib/paths';
import { version } from '../../lib/version';
import { Task, templatingTask, installWithLocalDeps } from '../../lib/tasks';

const exec = promisify(execCb);

async function checkExists(rootDir: string, id: string) {
  await Task.forItem('checking', id, async () => {
    const destination = resolvePath(rootDir, 'plugins', id);

    if (await fs.pathExists(destination)) {
      const existing = chalk.cyan(destination.replace(`${rootDir}/`, ''));
      throw new Error(
        `A plugin with the same name already exists: ${existing}\nPlease try again with a different plugin ID`,
      );
    }
  });
}

export async function createTemporaryPluginFolder(tempDir: string) {
  await Task.forItem('creating', 'temporary directory', async () => {
    try {
      await fs.mkdir(tempDir);
    } catch (error) {
      throw new Error(
        `Failed to create temporary plugin directory: ${error.message}`,
      );
    }
  });
}

const sortObjectByKeys = (obj: { [name in string]: string }) => {
  return Object.keys(obj)
    .sort()
    .reduce((result, key: string) => {
      result[key] = obj[key];
      return result;
    }, {} as { [name in string]: string });
};

export const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const addExportStatement = async (
  file: string,
  exportStatement: string,
) => {
  const newContents = fs
    .readFileSync(file, 'utf8')
    .split('\n')
    .filter(Boolean) // get rid of empty lines
    .concat([exportStatement])
    .concat(['']) // newline at end of file
    .join('\n');

  await fs.writeFile(file, newContents, 'utf8');
};

export async function addPluginDependencyToApp(
  rootDir: string,
  pluginName: string,
  versionStr: string,
) {
  const pluginPackage = `@backstage/plugin-${pluginName}`;
  const packageFilePath = 'packages/app/package.json';
  const packageFile = resolvePath(rootDir, packageFilePath);

  await Task.forItem('processing', packageFilePath, async () => {
    const packageFileContent = await fs.readFile(packageFile, 'utf-8');
    const packageFileJson = JSON.parse(packageFileContent);
    const dependencies = packageFileJson.dependencies;

    if (dependencies[pluginPackage]) {
      throw new Error(
        `Plugin ${pluginPackage} already exists in ${packageFile}`,
      );
    }

    dependencies[pluginPackage] = `^${versionStr}`;
    packageFileJson.dependencies = sortObjectByKeys(dependencies);
    const newContents = `${JSON.stringify(packageFileJson, null, 2)}\n`;

    await fs.writeFile(packageFile, newContents, 'utf-8').catch(error => {
      throw new Error(
        `Failed to add plugin as dependency to app: ${packageFile}: ${error.message}`,
      );
    });
  });
}

export async function addPluginToApp(rootDir: string, pluginName: string) {
  const pluginPackage = `@backstage/plugin-${pluginName}`;
  const pluginNameCapitalized = pluginName
    .split('-')
    .map(name => capitalize(name))
    .join('');
  const pluginExport = `export { plugin as ${pluginNameCapitalized} } from '${pluginPackage}';`;
  const pluginsFilePath = 'packages/app/src/plugins.ts';
  const pluginsFile = resolvePath(rootDir, pluginsFilePath);

  await Task.forItem('processing', pluginsFilePath, async () => {
    await addExportStatement(pluginsFile, pluginExport).catch(error => {
      throw new Error(
        `Failed to import plugin in app: ${pluginsFile}: ${error.message}`,
      );
    });
  });
}

async function cleanUp(tempDir: string) {
  await Task.forItem('remove', 'temporary directory', async () => {
    await fs.remove(tempDir);
  });
}

async function buildPlugin(pluginFolder: string) {
  await installWithLocalDeps(paths.targetRoot);

  const commands = ['yarn tsc', 'yarn build'];
  for (const command of commands) {
    await Task.forItem('executing', command, async () => {
      process.chdir(pluginFolder);

      await exec(command).catch(error => {
        process.stdout.write(error.stderr);
        process.stdout.write(error.stdout);
        throw new Error(`Could not execute command ${chalk.cyan(command)}`);
      });
    });
  }
}

export async function movePlugin(
  tempDir: string,
  destination: string,
  id: string,
) {
  await Task.forItem('moving', id, async () => {
    await fs.move(tempDir, destination).catch(error => {
      throw new Error(
        `Failed to move plugin from ${tempDir} to ${destination}: ${error.message}`,
      );
    });
  });
}

export default async () => {
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

  const answers: Answers = await inquirer.prompt(questions);

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
