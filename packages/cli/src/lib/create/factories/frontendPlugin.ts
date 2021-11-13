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
import chalk from 'chalk';
import camelCase from 'lodash/camelCase';
import upperFirst from 'lodash/upperFirst';
import { paths } from '../../paths';
import { addCodeownersEntry, getCodeownersFilePath } from '../../codeowners';
import { createFactory, CreateContext } from '../types';
import { addPackageDependency, Task } from '../../tasks';
import { ownerPrompt, pluginIdPrompt } from './common/prompts';
import { executePluginPackageTemplate } from './common/tasks';

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

    Task.log();
    Task.log(`Creating backend plugin ${chalk.cyan(name)}`);

    const targetDir = ctx.isMonoRepo
      ? paths.resolveTargetRoot('plugins', id)
      : paths.resolveTargetRoot(`backstage-plugin-${id}`);

    await executePluginPackageTemplate(ctx, {
      targetDir,
      templateName: 'default-plugin',
      values: {
        id,
        name,
        extensionName,
        pluginVar: `${camelCase(id)}Plugin`,
        pluginVersion: ctx.defaultVersion,
        privatePackage: ctx.private,
        npmRegistry: ctx.npmRegistry,
      },
    });

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

          const componentLine = `<Route path="/${id}" element={<${extensionName} />} />`;
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

    if (options.owner) {
      await addCodeownersEntry(`/plugins/${id}`, options.owner);
    }

    await Task.forCommand('yarn install', { cwd: targetDir, optional: true });
    await Task.forCommand('yarn lint --fix', {
      cwd: targetDir,
      optional: true,
    });
  },
});
