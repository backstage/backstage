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
import { ownerPrompt, pluginIdPrompt } from './common/prompts';

type Options = {
  id: string;
  owner?: string;
  codeOwnersPath?: string;
};

export const frontendPlugin = createFactory<Options>({
  name: 'plugin',
  description: 'A new frontend plugin',
  optionsDiscovery: async () => ({
    codeOwnersPath: await getCodeownersFilePath(paths.targetRoot),
  }),
  optionsPrompts: [pluginIdPrompt(), ownerPrompt()],
  async create(options: Options, ctx: CreateContext) {
    const { id } = options;

    const name = ctx.scope ? `@${ctx.scope}/plugin-${id}` : `plugin-${id}`;
    const extensionName = `${upperFirst(camelCase(id))}Page`;

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
          `A plugin with the same ID already exists at ${chalk.cyan(
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
      paths.resolveOwn('templates/default-plugin'),
      tempDir,
      {
        id,
        pluginVar: `${camelCase(id)}Plugin`,
        pluginVersion: ctx.defaultVersion,
        extensionName,
        name,
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

    if (await fs.pathExists(paths.resolveTargetRoot('packages/app'))) {
      await Task.forItem('app', 'adding dependency', async () => {
        await addPackageDependency(
          paths.resolveTargetRoot('packages/app/package.json'),
          {
            dependencies: {
              [name]: `^${ctx.defaultVersion}`,
            },
          },
        );
      });

      await Task.forItem('app', 'adding import', async () => {
        const pluginsFilePath = paths.resolveTargetRoot(
          'packages/app/src/App.tsx',
        );
        if (!(await fs.pathExists(pluginsFilePath))) {
          return;
        }

        const content = await fs.readFile(pluginsFilePath, 'utf8');
        const revLines = content.split('\n').reverse();

        const lastImportIndex = revLines.findIndex(line =>
          line.match(/ from ("|').*("|')/),
        );
        const lastRouteIndex = revLines.findIndex(line =>
          line.match(/<\/FlatRoutes/),
        );

        if (lastImportIndex !== -1 && lastRouteIndex !== -1) {
          const importLine = `import { ${extensionName} } from '${name}';`;
          if (!content.includes(importLine)) {
            revLines.splice(lastImportIndex, 0, importLine);
          }

          const componentLine = `<Route path="/${id}" element={<${extensionName} />}/>`;
          if (!content.includes(componentLine)) {
            const [indentation] =
              revLines[lastRouteIndex + 1].match(/^\s*/) ?? [];
            revLines.splice(lastRouteIndex + 1, 0, indentation + componentLine);
          }

          const newContent = revLines.reverse().join('\n');
          await fs.writeFile(pluginsFilePath, newContent, 'utf8');
        }
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
