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

import os from 'os';
import fs from 'fs-extra';
import { join as joinPath } from 'path';
import { Command } from 'commander';
import { FactoryRegistry } from '../../lib/create/FactoryRegistry';
import { paths } from '../../lib/paths';
import { assertError } from '@backstage/errors';
import { Task } from '../../lib/tasks';

function parseOptions(optionStrings: string[]): Record<string, string> {
  const options: Record<string, string> = {};

  for (const str of optionStrings) {
    const [key] = str.split('=', 1);
    const value = str.slice(key.length + 1);
    if (!key || str[key.length] !== '=') {
      throw new Error(
        `Invalid option '${str}', must be of the format <key>=<value>`,
      );
    }
    options[key] = value;
  }

  return options;
}

export default async (cmd: Command) => {
  const cmdOpts = cmd.opts();

  const factory = await FactoryRegistry.interactiveSelect(cmdOpts.select);

  const providedOptions = parseOptions(cmdOpts.option);
  const options = await FactoryRegistry.populateOptions(
    factory,
    providedOptions,
  );

  const rootPackageJson = await fs.readJson(
    paths.resolveTargetRoot('package.json'),
  );
  const isMonoRepo = Boolean(rootPackageJson.workspaces);

  let defaultVersion = '0.1.0';
  try {
    const rootLernaJson = await fs.readJson(
      paths.resolveTargetRoot('lerna.json'),
    );
    if (rootLernaJson.version) {
      defaultVersion = rootLernaJson.version;
    }
  } catch (error) {
    assertError(error);
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }

  const tempDirs = new Array<string>();
  async function createTemporaryDirectory(name: string): Promise<string> {
    const dir = await fs.mkdtemp(joinPath(os.tmpdir(), name));
    tempDirs.push(dir);
    return dir;
  }

  let modified = false;
  try {
    Task.log();
    Task.log(`Creating new ${factory.name}`);

    await factory.create(options, {
      isMonoRepo,
      defaultVersion,
      scope: cmdOpts.scope?.replace(/^@/, ''),
      npmRegistry: cmdOpts.npmRegistry,
      private: Boolean(cmdOpts.private),
      createTemporaryDirectory,
      markAsModified() {
        modified = true;
      },
    });

    Task.log();
    Task.log(`🎉  Successfully created ${factory.name}`);
    Task.log();
  } catch (error) {
    assertError(error);
    Task.error(error.message);

    if (modified) {
      Task.log('It seems that something went wrong in the creation process 🤔');
      Task.log();
      Task.log(
        'We have left the changes that were made intact in case you want to',
      );
      Task.log(
        'continue manually, but you can also revert the changes and try again.',
      );

      Task.error(`🔥  Failed to create ${factory.name}!`);
    }
  } finally {
    for (const dir of tempDirs) {
      try {
        await fs.remove(dir);
      } catch (error) {
        console.error(
          `Failed to remove temporary directory '${dir}', ${error}`,
        );
      }
    }
  }
};
