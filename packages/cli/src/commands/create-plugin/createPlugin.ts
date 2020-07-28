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
import { exec as execCb } from 'child_process';
import { resolve as resolvePath } from 'path';
import { Task } from '../../lib/tasks';

const exec = promisify(execCb);

export async function checkExists(rootDir: string, id: string) {
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

export async function cleanUp(tempDir: string) {
  await Task.forItem('remove', 'temporary directory', async () => {
    await fs.remove(tempDir);
  });
}

export async function buildPlugin(pluginFolder: string) {
  const commands = ['yarn install', 'yarn tsc', 'yarn build'];
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
