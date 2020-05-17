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
import { Task, templatingTask } from '../../lib/tasks';
import { paths } from '../../lib/paths';
import { version } from '../../lib/version';
const exec = promisify(execCb);

// List of local packages that we need to modify as a part of an E2E test
const PATCH_PACKAGES = [
  'cli',
  'core',
  'dev-utils',
  'test-utils',
  'test-utils-core',
  'theme',
];

async function checkExists(rootDir: string, name: string) {
  await Task.forItem('checking', name, async () => {
    const destination = resolvePath(rootDir, name);

    if (await fs.pathExists(destination)) {
      const existing = chalk.cyan(destination.replace(`${rootDir}/`, ''));
      throw new Error(
        `A directory with the same name already exists: ${existing}\nPlease try again with a different app name`,
      );
    }
  });
}

export async function createTemporaryAppFolder(tempDir: string) {
  await Task.forItem('creating', 'temporary directory', async () => {
    try {
      await fs.mkdir(tempDir);
    } catch (error) {
      throw new Error(
        `Failed to create temporary app directory: ${error.message}`,
      );
    }
  });
}

async function cleanUp(tempDir: string) {
  await Task.forItem('remove', 'temporary directory', async () => {
    await fs.remove(tempDir);
  });
}

async function buildApp(appDir: string) {
  const runCmd = async (cmd: string) => {
    await Task.forItem('executing', cmd, async () => {
      process.chdir(appDir);

      await exec(cmd).catch((error) => {
        process.stdout.write(error.stderr);
        process.stdout.write(error.stdout);
        throw new Error(`Could not execute command ${chalk.cyan(cmd)}`);
      });
    });
  };

  // e2e testing needs special treatment
  if (process.env.BACKSTAGE_E2E_CLI_TEST) {
    Task.section('Linking packages locally for e2e tests');
    await patchPackageResolutions(appDir);
  }

  await runCmd('yarn install');

  if (process.env.BACKSTAGE_E2E_CLI_TEST) {
    Task.section('Patchling local dependencies for e2e tests');
    await patchLocalDependencies(appDir);
  }

  await runCmd('yarn tsc');
  await runCmd('yarn build');
}

export async function moveApp(
  tempDir: string,
  destination: string,
  id: string,
) {
  await Task.forItem('moving', id, async () => {
    await fs.move(tempDir, destination).catch((error) => {
      throw new Error(
        `Failed to move app from ${tempDir} to ${destination}: ${error.message}`,
      );
    });
  });
}

async function patchPackageResolutions(appDir: string) {
  const pkgJsonPath = resolvePath(appDir, 'package.json');
  const pkgJson = await fs.readJson(pkgJsonPath);

  pkgJson.resolutions = pkgJson.resolutions || {};
  pkgJson.dependencies = pkgJson.dependencies || {};

  for (const name of PATCH_PACKAGES) {
    await Task.forItem(
      'adding',
      `@backstage/${name} link to package.json`,
      async () => {
        const pkgPath = paths.resolveOwnRoot('packages', name);
        // Add to both resolutions and dependencies, or transitive dependencies will still be fetched from the registry.
        pkgJson.dependencies[`@backstage/${name}`] = `file:${pkgPath}`;
        pkgJson.resolutions[`@backstage/${name}`] = `file:${pkgPath}`;

        await fs
          .writeJSON(pkgJsonPath, pkgJson, { encoding: 'utf8', spaces: 2 })
          .catch((error) => {
            throw new Error(
              `Failed to add resolutions to package.json: ${error.message}`,
            );
          });
      },
    );
  }
}

async function patchLocalDependencies(appDir: string) {
  for (const name of PATCH_PACKAGES) {
    await Task.forItem(
      'patching',
      `node_modules/@backstage/${name} package.json`,
      async () => {
        const depJsonPath = resolvePath(
          appDir,
          'node_modules/@backstage',
          name,
          'package.json',
        );
        const depJson = await fs.readJson(depJsonPath);

        // We want dist to be used for e2e tests
        delete depJson['main:src'];
        depJson.types = 'dist/index.d.ts';

        await fs
          .writeJSON(depJsonPath, depJson, { encoding: 'utf8', spaces: 2 })
          .catch((error) => {
            throw new Error(
              `Failed to add resolutions to package.json: ${error.message}`,
            );
          });
      },
    );
  }
}

export default async () => {
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
            'App name must be kebab-cased and contain only letters, digits, and dashes.',
          );
        }
        return true;
      },
    },
  ];
  const answers: Answers = await inquirer.prompt(questions);

  const templateDir = paths.resolveOwn('templates/default-app');
  const tempDir = resolvePath(os.tmpdir(), answers.name);
  const appDir = resolvePath(paths.targetDir, answers.name);

  Task.log();
  Task.log('Creating the app...');

  try {
    Task.section('Checking if the directory is available');
    await checkExists(paths.targetDir, answers.name);

    Task.section('Creating a temporary app directory');
    await createTemporaryAppFolder(tempDir);

    Task.section('Preparing files');
    await templatingTask(templateDir, tempDir, { ...answers, version });

    Task.section('Moving to final location');
    await moveApp(tempDir, appDir, answers.name);

    Task.section('Building the app');
    await buildApp(appDir);

    Task.log();
    Task.log(
      chalk.green(`🥇  Successfully created ${chalk.cyan(answers.name)}`),
    );
    Task.log();
    Task.exit();
  } catch (error) {
    Task.error(error.message);

    Task.log('It seems that something went wrong when creating the app 🤔');
    Task.log('We are going to clean up, and then you can try again.');

    Task.section('Cleanup');
    await cleanUp(tempDir);
    Task.error('🔥  Failed to create app!');
    Task.exit(1);
  }
};
