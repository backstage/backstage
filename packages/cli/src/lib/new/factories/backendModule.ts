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
import { paths } from '../../paths';
import { addCodeownersEntry, getCodeownersFilePath } from '../../codeowners';
import { CreateContext, createFactory } from '../types';
import { addPackageDependency, Task } from '../../tasks';
import {
  moduleIdIdPrompt,
  ownerPrompt,
  pluginIdPrompt,
} from './common/prompts';
import { executePluginPackageTemplate } from './common/tasks';
import { resolvePackageName } from './common/util';

type Options = {
  id: string;
  moduleId: string;
  owner?: string;
  codeOwnersPath?: string;
};

export const backendModule = createFactory<Options>({
  name: 'backend-module',
  description: 'A new backend module',
  optionsDiscovery: async () => ({
    codeOwnersPath: await getCodeownersFilePath(paths.targetRoot),
  }),
  optionsPrompts: [pluginIdPrompt(), moduleIdIdPrompt(), ownerPrompt()],
  async create(options: Options, ctx: CreateContext) {
    const { id: pluginId, moduleId } = options;
    const dirName = `${pluginId}-backend-module-${moduleId}`;
    const name = resolvePackageName({
      baseName: dirName,
      scope: ctx.scope,
      plugin: true,
    });

    Task.log();
    Task.log(`Creating backend module ${chalk.cyan(name)}`);

    const targetDir = ctx.isMonoRepo
      ? paths.resolveTargetRoot('plugins', dirName)
      : paths.resolveTargetRoot(`backstage-plugin-${dirName}`);

    const moduleCamelCase = camelCase(moduleId);
    const modulePascalCase =
      moduleCamelCase[0].toUpperCase() + moduleCamelCase.slice(1);
    const moduleVar = `${camelCase(pluginId)}Module${modulePascalCase}`;
    await executePluginPackageTemplate(ctx, {
      targetDir,
      templateName: 'default-backend-module',
      values: {
        pluginId,
        moduleId,
        name,
        moduleVar,
        packageVersion: ctx.defaultVersion,
        privatePackage: ctx.private,
        npmRegistry: ctx.npmRegistry,
      },
    });

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

    if (options.owner) {
      await addCodeownersEntry(`/plugins/${dirName}`, options.owner);
    }

    await Task.forCommand('yarn install', { cwd: targetDir, optional: true });
    await Task.forCommand('yarn lint --fix', {
      cwd: targetDir,
      optional: true,
    });
  },
});
