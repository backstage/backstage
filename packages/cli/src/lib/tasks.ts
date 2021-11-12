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
import fs from 'fs-extra';
import handlebars from 'handlebars';
import ora from 'ora';
import { promisify } from 'util';
import { basename, dirname } from 'path';
import recursive from 'recursive-readdir';
import { exec as execCb } from 'child_process';
import { paths } from './paths';
import { assertError } from '@backstage/errors';

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

  static async forItem<T = void>(
    task: string,
    item: string,
    taskFunc: () => Promise<T>,
  ): Promise<T> {
    const paddedTask = chalk.green(task.padEnd(TASK_NAME_MAX_LENGTH));

    const spinner = ora({
      prefixText: chalk.green(`  ${paddedTask}${chalk.cyan(item)}`),
      spinner: 'arc',
      color: 'green',
    }).start();

    try {
      const result = await taskFunc();
      spinner.succeed();
      return result;
    } catch (error) {
      spinner.fail();
      throw error;
    }
  }

  static async forCommand(
    command: string,
    options?: { cwd?: string; optional?: boolean },
  ) {
    try {
      await Task.forItem('executing', command, async () => {
        await exec(command, { cwd: options?.cwd });
      });
    } catch (error) {
      assertError(error);
      if (error.stderr) {
        process.stdout.write(error.stderr as Buffer);
      }
      if (error.stdout) {
        process.stdout.write(error.stdout as Buffer);
      }
      if (options?.optional) {
        Task.error(`Warning: Failed to execute command ${chalk.cyan(command)}`);
      } else {
        throw new Error(
          `Failed to execute command '${chalk.cyan(command)}', ${error}`,
        );
      }
    }
  }
}

export async function templatingTask(
  templateDir: string,
  destinationDir: string,
  context: any,
  versionProvider: (name: string, versionHint?: string) => string,
) {
  const files = await recursive(templateDir).catch(error => {
    throw new Error(`Failed to read template directory: ${error.message}`);
  });
  const isMonoRepo = await fs.pathExists(paths.resolveTargetRoot('lerna.json'));

  for (const file of files) {
    const destinationFile = file.replace(templateDir, destinationDir);
    await fs.ensureDir(dirname(destinationFile));

    if (file.endsWith('.hbs')) {
      await Task.forItem('templating', basename(file), async () => {
        const destination = destinationFile.replace(/\.hbs$/, '');

        const template = await fs.readFile(file);
        const compiled = handlebars.compile(template.toString());
        const contents = compiled(
          { name: basename(destination), ...context },
          {
            helpers: {
              versionQuery(name: string, versionHint: string | unknown) {
                return versionProvider(
                  name,
                  typeof versionHint === 'string' ? versionHint : undefined,
                );
              },
            },
          },
        );

        await fs.writeFile(destination, contents).catch(error => {
          throw new Error(
            `Failed to create file: ${destination}: ${error.message}`,
          );
        });
      });
    } else {
      if (isMonoRepo && file.match('tsconfig.json')) {
        continue;
      }

      await Task.forItem('copying', basename(file), async () => {
        await fs.copyFile(file, destinationFile).catch(error => {
          const destination = destinationFile;
          throw new Error(
            `Failed to copy file to ${destination} : ${error.message}`,
          );
        });
      });
    }
  }
}

export async function addPackageDependency(
  path: string,
  options: {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
  },
) {
  try {
    const pkgJson = await fs.readJson(path);

    const normalize = (obj: Record<string, string>) => {
      if (Object.keys(obj).length === 0) {
        return undefined;
      }
      return Object.fromEntries(
        Object.keys(obj)
          .sort()
          .map(key => [key, obj[key]]),
      );
    };

    pkgJson.dependencies = normalize({
      ...pkgJson.dependencies,
      ...options.dependencies,
    });
    pkgJson.devDependencies = normalize({
      ...pkgJson.devDependencies,
      ...options.devDependencies,
    });
    pkgJson.peerDependencies = normalize({
      ...pkgJson.peerDependencies,
      ...options.peerDependencies,
    });

    await fs.writeJson(path, pkgJson, { spaces: 2 });
  } catch (error) {
    throw new Error(`Failed to add package dependencies, ${error}`);
  }
}
