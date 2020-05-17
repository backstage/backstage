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
import fs from 'fs-extra';
import handlebars from 'handlebars';
import ora from 'ora';
import { resolve as resolvePath, basename, dirname } from 'path';
import recursive from 'recursive-readdir';
import { promisify } from 'util';
import { exec as execCb } from 'child_process';
import { paths } from './paths';
const exec = promisify(execCb);

const TASK_NAME_MAX_LENGTH = 14;

export class Task {
  static log(name: string = '') {
    process.stdout.write(`${chalk.green(name)}\n`);
  }

  static error(message: string = '') {
    process.stdout.write(`\n${chalk.red(message)}\n\n`);
  }

  static section(name: string) {
    const title = chalk.green(`${name}:`);
    process.stdout.write(`\n ${title}\n`);
  }

  static exit(code: number = 0) {
    process.exit(code);
  }

  static async forItem(
    task: string,
    item: string,
    taskFunc: () => Promise<void>,
  ): Promise<void> {
    const paddedTask = chalk.green(task.padEnd(TASK_NAME_MAX_LENGTH));

    const spinner = ora({
      prefixText: chalk.green(`  ${paddedTask}${chalk.cyan(item)}`),
      spinner: 'arc',
      color: 'green',
    }).start();

    try {
      await taskFunc();
      spinner.succeed();
    } catch (error) {
      spinner.fail();
      throw error;
    }
  }
}

export async function templatingTask(
  templateDir: string,
  destinationDir: string,
  context: any,
) {
  const files = await recursive(templateDir).catch((error) => {
    throw new Error(`Failed to read template directory: ${error.message}`);
  });

  for (const file of files) {
    const destinationFile = file.replace(templateDir, destinationDir);
    await fs.ensureDir(dirname(destinationFile));

    if (file.endsWith('.hbs')) {
      await Task.forItem('templating', basename(file), async () => {
        const destination = destinationFile.replace(/\.hbs$/, '');

        const template = await fs.readFile(file);
        const compiled = handlebars.compile(template.toString());
        const contents = compiled({ name: basename(destination), ...context });

        await fs.writeFile(destination, contents).catch((error) => {
          throw new Error(
            `Failed to create file: ${destination}: ${error.message}`,
          );
        });
      });
    } else {
      await Task.forItem('copying', basename(file), async () => {
        await fs.copyFile(file, destinationFile).catch((error) => {
          const destination = destinationFile;
          throw new Error(
            `Failed to copy file to ${destination} : ${error.message}`,
          );
        });
      });
    }
  }
}

// List of local packages that we need to modify as a part of an E2E test
const PATCH_PACKAGES = [
  'cli',
  'core',
  'dev-utils',
  'test-utils',
  'test-utils-core',
  'theme',
];

export async function installWithLocalDeps(dir: string) {
  // e2e testing needs special treatment
  if (process.env.BACKSTAGE_E2E_CLI_TEST) {
    Task.section('Linking packages locally for e2e tests');

    const pkgJsonPath = resolvePath(dir, 'package.json');
    const pkgJson = await fs.readJson(pkgJsonPath);

    pkgJson.resolutions = pkgJson.resolutions || {};
    pkgJson.dependencies = pkgJson.dependencies || {};

    if (!pkgJson.resolutions[`@backstage/${PATCH_PACKAGES[0]}`]) {
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
  }

  await Task.forItem('executing', 'yarn install', async () => {
    await exec('yarn install', { cwd: dir }).catch((error) => {
      process.stdout.write(error.stderr);
      process.stdout.write(error.stdout);
      throw new Error(
        `Could not execute command ${chalk.cyan('yarn install')}`,
      );
    });
  });

  if (process.env.BACKSTAGE_E2E_CLI_TEST) {
    Task.section('Patchling local dependencies for e2e tests');

    for (const name of PATCH_PACKAGES) {
      await Task.forItem(
        'patching',
        `node_modules/@backstage/${name} package.json`,
        async () => {
          const depJsonPath = resolvePath(
            dir,
            'node_modules/@backstage',
            name,
            'package.json',
          );
          console.log('DEBUG: depJsonPath =', depJsonPath);
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
}
