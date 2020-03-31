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
import path from 'path';
import { promisify } from 'util';
import handlebars from 'handlebars';
import chalk from 'chalk';
import inquirer, { Answers, Question } from 'inquirer';
import recursive from 'recursive-readdir';
import { exec as execCb } from 'child_process';
import { resolve as resolvePath } from 'path';
import os from 'os';
import {
  parseOwnerIds,
  addCodeownersEntry,
  getCodeownersFilePath,
} from './lib/codeowners';
import { Task } from '../../helpers/tasks';
const exec = promisify(execCb);

async function checkExists(rootDir: string, id: string) {
  Task.section('Checking if the plugin ID is available');

  await Task.forItem('checking', id, async () => {
    const destination = path.join(rootDir, 'plugins', id);

    if (await fs.pathExists(destination)) {
      const existing = chalk.cyan(destination.replace(`${rootDir}/`, ''));
      throw new Error(
        `A plugin with the same name already exists: ${existing}\nPlease try again with a different plugin ID`,
      );
    }
  });
}

export async function createTemporaryPluginFolder(tempDir: string) {
  Task.section('Creating a temporary plugin directory');

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

const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);

async function addExportStatement(file: string, exportStatement: string) {
  const contents = await fs.readFile(file, 'utf8');
  const newContents = contents
    .split('\n')
    .filter(Boolean) // get rid of empty lines
    .concat([exportStatement])
    .sort()
    .concat(['']) // newline at end of file
    .join('\n');

  await fs.writeFile(file, newContents, 'utf8');
}

export async function addPluginDependencyToApp(
  rootDir: string,
  pluginName: string,
  version: string,
) {
  Task.section('Adding plugin as dependency in app');

  const pluginPackage = `@backstage/plugin-${pluginName}`;
  const packageFilePath = 'packages/app/package.json';
  const packageFile = path.join(rootDir, packageFilePath);

  await Task.forItem('processing', packageFilePath, async () => {
    const packageFileContent = await fs.readFile(packageFile, 'utf-8');
    const packageFileJson = JSON.parse(packageFileContent);
    const dependencies = packageFileJson.dependencies;

    if (dependencies[pluginPackage]) {
      throw new Error(
        `Plugin ${pluginPackage} already exists in ${packageFile}`,
      );
    }

    dependencies[pluginPackage] = `^${version}`;
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
  Task.section('Import plugin in app');

  const pluginPackage = `@backstage/plugin-${pluginName}`;
  const pluginNameCapitalized = pluginName
    .split('-')
    .map(name => capitalize(name))
    .join('');
  const pluginExport = `export { default as ${pluginNameCapitalized} } from '${pluginPackage}';`;
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

export const createFromTemplateDir = async (
  templateFolder: string,
  destinationFolder: string,
  answers: Answers,
  version: string,
) => {
  Task.section('Setting up plugin files');
  const files = await recursive(templateFolder).catch(error => {
    throw new Error(`Failed to read template directory: ${error.message}`);
  });

  for (const file of files) {
    const destinationFile = file.replace(templateFolder, destinationFolder);
    path.dirname(file);
    await fs.ensureDir(path.dirname(file));

    if (file.endsWith('.hbs')) {
      await Task.forItem('templating', file, async () => {
        const destination = destinationFile.replace(/\.hbs$/, '');

        const template = await fs.readFile(path.basename(file));
        const compiled = handlebars.compile(template.toString());
        const contents = compiled({
          name: path.basename(destination),
          version,
          ...answers,
        });

        await fs.writeFile(destination, contents).catch(error => {
          throw new Error(
            `Failed to create file: ${destination}: ${error.message}`,
          );
        });
      });
    } else {
      await Task.forItem('copying', file, async () => {
        await fs.copyFile(file, destinationFile).catch(error => {
          const destination = destinationFile;
          throw new Error(
            `Failed to copy file to ${destination} : ${error.message}`,
          );
        });
      });
    }
  }
};

async function cleanUp(tempDir: string, id: string) {
  Task.log('It seems that something went wrong when creating the plugin 🤔');
  Task.log('We are going to clean up, and then you can try again.');

  await Task.forItem('Cleaning up', id, async () => {
    await fs.remove(tempDir);
  });
}

async function buildPlugin(pluginFolder: string) {
  Task.section('Building the plugin');

  const commands = ['yarn install', 'yarn build'];
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
  Task.section('Moving the plugin to final location');

  await Task.forItem('moving', id, async () => {
    await fs.move(tempDir, destination).catch(error => {
      throw new Error(
        `Failed to move plugin from ${tempDir} to ${destination}: ${error.message}`,
      );
    });
  });
}

export default async () => {
  const rootDir = await fs.realpath(process.cwd());
  const codeownersPath = await getCodeownersFilePath(rootDir);

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

  const appPackage = resolvePath(rootDir, 'packages', 'app');
  const cliPackage = resolvePath(__dirname, '..', '..', '..');
  const templateFolder = resolvePath(cliPackage, 'templates', 'default-plugin');
  const tempDir = path.join(os.tmpdir(), answers.id);
  const pluginDir = path.join(rootDir, 'plugins', answers.id);
  const version = require(resolvePath(cliPackage, 'package.json')).version;
  const ownerIds = parseOwnerIds(answers.owner);

  Task.log();
  Task.log('Creating the plugin...');

  try {
    await checkExists(rootDir, answers.id);
    await createTemporaryPluginFolder(tempDir);
    await createFromTemplateDir(templateFolder, tempDir, answers, version);
    await movePlugin(tempDir, pluginDir, answers.id);
    await buildPlugin(pluginDir);

    if (await fs.pathExists(appPackage)) {
      await addPluginDependencyToApp(rootDir, answers.id, version);
      await addPluginToApp(rootDir, answers.id);
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
  } catch (error) {
    console.log();
    console.log(`${chalk.red(error.message)}`);
    console.log();
    await cleanUp(tempDir, answers.id);
    console.log();
    console.log(`🔥  ${chalk.red('Failed to create plugin!')}`);
    console.log();
  }
};
