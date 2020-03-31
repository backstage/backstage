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
import fse from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import inquirer, { Answers, Question } from 'inquirer';
import { realpathSync } from 'fs';
import ora from 'ora';
// import os from 'os';

const MARKER_SUCCESS = chalk.green(` ✔︎`);
const MARKER_FAILURE = chalk.red(` ✘`);
const BACKSTAGE = '@backstage';

export const checkExists = async (rootDir: string, pluginName: string) => {
  const destination = path.join(rootDir, 'plugins', pluginName);
  const spinner = ora({
    prefixText: `   Checking plugin exists.`,
    spinner: 'arc',
    color: 'green',
  }).start();
  try {
    let pathExist = await fse.pathExists(destination);
    if (pathExist) {
      spinner.succeed();
      console.log(
        chalk.green(
          `   Plugin ID ${chalk.cyan(
            pluginName,
          )} exists at: ${destination.replace(
            `${rootDir}`,
            '',
          )} ${MARKER_SUCCESS}`,
        ),
      );
    } else {
      throw new Error(
        chalk.red(`   Plugin ${chalk.cyan(pluginName)} does not exist!`),
      );
    }
  } catch (e) {
    spinner.fail();
    throw new Error(
      chalk.red(
        `   There was an error removing plugin ${chalk.cyan(pluginName)}: ${
          e.message
        }`,
      ),
    );
  }
};

export const removePluginDirectory = async (
  destination: string,
  pluginName: string,
) => {
  console.log(`   Removing plugin files ${chalk.cyan(destination)}.`);
  try {
    await fse.remove(destination);
    console.log(
      chalk.green(`   Plugin files removed successfully. ${MARKER_SUCCESS}`),
    );
  } catch (e) {
    throw Error(
      `   Could not remove Plugin\t${pluginName}. ${MARKER_FAILURE} \n Please try again. Error: ${e.message}`,
    );
  }
};

export const removeSymLink = async (destination: string) => {
  console.log(
    `   Removing symbolic link if it exists at:\t${chalk.cyan(destination)}.`,
  );
  const symLinkExists = fse.pathExists(destination);
  if (symLinkExists) {
    try {
      await fse.remove(destination);
      console.log(
        chalk.green(`   Symbolic link successfully removed. ${MARKER_SUCCESS}`),
      );
    } catch (e) {
      throw Error(
        `   Could not remove symbolic link\t${destination}. ${MARKER_FAILURE} \n Please try again. Error: ${e.message}`,
      );
    }
  }
};

export const removeStatementContainingID = async (file: string, ID: string) => {
  const originalContent = await fse.readFile(file, 'utf8');
  const contentAfterRemoval = originalContent
    .split('\n')
    .filter(Boolean) // get rid of empty lines
    .filter(statement => {
      return !statement.includes(`${ID}`);
    }) // get rid of lines with pluginName
    .sort()
    .concat(['']) // newline at end of line
    .join('\n');
  await fse.writeFile(file, contentAfterRemoval, 'utf8');
  const finalContent = await fse.readFile(file, 'utf8');
  if (finalContent === originalContent)
    throw new Error(`File was not modified.`);
};

export const removeExportStatementFromPlugins = async (
  pluginsFile: string,
  pluginName: string,
) => {
  const pluginNameCapitalized = pluginName
    .split('-')
    .map(name => capitalize(name))
    .join('');
  console.log(
    `   Removing export statement from ${chalk.cyan(
      pluginsFile.replace(pluginsFile.split('/app', 1)[0], ''),
    )}`,
  ); // remove long path
  try {
    await removeStatementContainingID(pluginsFile, pluginNameCapitalized);
    console.log(
      chalk.green(
        `   Successfully removed export statement from /app/src/plugin.ts ${MARKER_SUCCESS}`,
      ),
    );
  } catch (e) {
    throw new Error(
      chalk.red(
        `   There was an error removing export statement for plugin ${chalk.cyan(
          pluginNameCapitalized,
        )} ${MARKER_FAILURE} ${e.message}`,
      ),
    );
  }
};

export const removePluginFromCodeOwners = async (
  codeOwnersFile: string,
  pluginName: string,
) => {
  console.log(
    `   Removing teams and owners from ${chalk.cyan(
      codeOwnersFile.replace(codeOwnersFile.split('/.git', 1)[0], ''),
    )}`,
  ); // remove long path
  try {
    await removeStatementContainingID(codeOwnersFile, pluginName);
    console.log(
      chalk.green(
        `   Successfully removed codeowners statement from /.git/CODEOWNERS ${MARKER_SUCCESS}`,
      ),
    );
  } catch (e) {
    throw new Error(
      chalk.red(
        `   There was an error removing code owners statement for plugin ${chalk.cyan(
          pluginName,
        )} ${MARKER_FAILURE} ${e.message}`,
      ),
    );
  }
};

export const removePluginDependencyFromApp = async (
  packageFile: string,
  pluginName: string,
) => {
  const pluginPackage = `${BACKSTAGE}/plugin-${pluginName}`;

  console.log(
    `   Removing plugin from app dependencies ${chalk.cyan(
      packageFile.replace(`${packageFile}/packages`, ''),
    )}:`,
  );

  try {
    const packageFileContent = await fse.readFile(packageFile, 'utf-8');
    const packageFileContentJSON = JSON.parse(packageFileContent);
    const dependencies = packageFileContentJSON.dependencies;

    if (!dependencies[pluginPackage]) {
      throw new Error(
        chalk.red(
          ` Plugin ${chalk.cyan(
            pluginPackage,
          )} does not exist in ${chalk.yellow(packageFile)}`,
        ),
      );
    }

    delete dependencies[pluginPackage];
    await fse.writeFile(
      packageFile,
      `${JSON.stringify(packageFileContentJSON, null, 2)}\n`,
      'utf-8',
    );

    console.log(
      chalk.green(
        `   Successfully removed plugin from app dependencies. ${MARKER_SUCCESS}`,
      ),
    );
  } catch (e) {
    throw new Error(
      `${chalk.red(
        `  Failed to remove plugin as dependency in app: ${chalk.cyan(
          packageFile,
        )}:`,
      )} ${e.message}`,
    );
  }
};

const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);

const removePlugin = async () => {
  const questions: Question[] = [
    {
      type: 'input',
      name: 'pluginName',
      message: chalk.blue(
        'Enter the ID of the plugin to be removed [required]',
      ),
      validate: (value: any) => {
        if (!value) {
          return chalk.red('Please enter an ID for the plugin');
        } else if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(value)) {
          return chalk.red(
            'Plugin IDs must be kehbab-cased and contain only letters, digits and dashes.',
          );
        }
        return true;
      },
    },
  ];

  const answers: Answers = await inquirer.prompt(questions);

  const rootDir = realpathSync(process.cwd());
  const codeOwnersFile = path.join(rootDir, '.github', 'CODEOWNERS');
  const pluginName: string = answers.pluginName;
  const packageFile = path.join(rootDir, 'packages', 'app', 'package.json');
  const pluginsFile = path.join(
    rootDir,
    'packages',
    'app',
    'src',
    'plugins.ts',
  );
  const pluginDirectory = path.join(rootDir, 'plugins', pluginName);
  const pluginScopedDirectory = path.join(
    rootDir,
    `node_modules/${BACKSTAGE}/plugin-${pluginName}`,
  );
  console.log(pluginScopedDirectory);
  try {
    await checkExists(rootDir, pluginName);
    await removeExportStatementFromPlugins(pluginsFile, pluginName);
    await removePluginDependencyFromApp(packageFile, pluginName);
    await removePluginDirectory(pluginDirectory, pluginName);
    await removeSymLink(pluginScopedDirectory);
    await removePluginFromCodeOwners(codeOwnersFile, pluginName);
    console.log(
      chalk.green(
        `Successfully removed plugin ${chalk.cyan(pluginName)} from app.`,
      ),
    );
  } catch (e) {
    // If error, restore files
    console.log(e);
    throw new Error(
      chalk.red(
        `Failed to remove plugin: ${chalk.cyan(pluginName)}: ${e.message}`,
      ),
    );
  }
};

export default removePlugin;
