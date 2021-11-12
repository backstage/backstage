/*
 * Copyright 2021 The Backstage Authors
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
import camelCase from 'lodash/camelCase';
import upperFirst from 'lodash/upperFirst';
import chalk from 'chalk';
import { paths } from '../../paths';
import {
  addCodeownersEntry,
  getCodeownersFilePath,
  parseOwnerIds,
} from '../../codeowners';
import { createFactory, CreateContext } from '../types';
import { Lockfile } from '../../versioning';
import { addPackageDependency, Task, templatingTask } from '../../tasks';
import { createPackageVersionProvider } from '../../version';

type Options = {
  id: string;
  owner?: string;
  codeOwnersPath?: string;
};

export const backendPlugin = createFactory<Options>({
  name: 'backend-plugin',
  description: 'A new backend plugin',
  optionsDiscovery: async () => ({
    codeOwnersPath: await getCodeownersFilePath(paths.targetRoot),
  }),
  optionsPrompts: [
    {
      type: 'input',
      name: 'id',
      message: 'Enter an ID for the plugin [required]',
      validate: (value: string) => {
        if (!value) {
          return 'Please enter an ID for the plugin';
        } else if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(value)) {
          return 'Plugin IDs must be lowercase and contain only letters, digits, and dashes.';
        }
        return true;
      },
    },
    {
      type: 'input',
      name: 'owner',
      message: 'Enter an owner of the plugin to add to CODEOWNERS [optional]',
      when: opts => Boolean(opts.codeOwnersPath),
      validate: (value: string) => {
        if (!value) {
          return true;
        }

        const ownerIds = parseOwnerIds(value);
        if (!ownerIds) {
          return 'The owner must be a space separated list of team names (e.g. @org/team-name), usernames (e.g. @username), or the email addresses (e.g. user@example.com).';
        }

        return true;
      },
    },
  ],
  async create(options: Options, ctx: CreateContext) {
    const id = `${options.id}-backend`;
    const name = ctx.scope ? `@${ctx.scope}/plugin-${id}` : `plugin-${id}`;

    const pluginDir = ctx.isMonoRepo
      ? paths.resolveTargetRoot('plugins', id)
      : paths.resolveTargetRoot(`backstage-plugin-${id}`);

    let lockfile: Lockfile | undefined;
    try {
      lockfile = await Lockfile.load(paths.resolveTargetRoot('yarn.lock'));
    } catch (error) {
      console.warn(`No yarn.lock available, ${error}`);
    }

    Task.section('Validating prerequisites');
    const shortPluginDir = pluginDir.replace(`${paths.targetRoot}/`, '');
    await Task.forItem('availability', shortPluginDir, async () => {
      if (await fs.pathExists(pluginDir)) {
        throw new Error(
          `A backend plugin with the same ID already exists at ${chalk.cyan(
            shortPluginDir,
          )}. Please try again with a different ID.`,
        );
      }
    });

    const tempDir = await Task.forItem('creating', 'temp dir', async () => {
      return await ctx.createTemporaryDirectory(`backstage-plugin-${id}`);
    });

    Task.section('Executing plugin template');
    await templatingTask(
      paths.resolveOwn('templates/default-backend-plugin'),
      tempDir,
      {
        id,
        name,
        pluginVar: `${camelCase(id)}Plugin`,
        pluginVersion: ctx.defaultVersion,
        privatePackage: ctx.private,
        npmRegistry: ctx.npmRegistry,
      },
      createPackageVersionProvider(lockfile),
    );

    Task.section('Installing plugin');
    await Task.forItem('moving', shortPluginDir, async () => {
      await fs.move(tempDir, pluginDir).catch(error => {
        throw new Error(
          `Failed to move plugin from ${tempDir} to ${pluginDir}, ${error.message}`,
        );
      });
    });

    ctx.markAsModified();

    if (await fs.pathExists(paths.resolveTargetRoot('packages/backend'))) {
      await Task.forItem('backend', 'adding dependency', async () => {
        await addPackageDependency(
          paths.resolveTargetRoot('packages/backend/package.json'),
          {
            dependencies: {
              [name]: `^${ctx.defaultVersion}`,
            },
          },
        );
      });
    }

    if (options.codeOwnersPath && options.owner) {
      const ownerIds = parseOwnerIds(options.owner);
      if (ownerIds && ownerIds.length > 0) {
        await addCodeownersEntry(
          options.codeOwnersPath,
          `/plugins/${id}`,
          ownerIds,
        );
      }
    }

    await Task.forCommand('yarn install', { cwd: pluginDir, optional: true });
    await Task.forCommand('yarn lint --fix', {
      cwd: pluginDir,
      optional: true,
    });
  },
});
