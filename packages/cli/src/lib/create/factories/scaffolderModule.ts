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

import chalk from 'chalk';
import { paths } from '../../paths';
import { addCodeownersEntry, getCodeownersFilePath } from '../../codeowners';
import { createFactory, CreateContext } from '../types';
import { Task } from '../../tasks';
import { ownerPrompt } from './common/prompts';
import { executePluginPackageTemplate } from './common/tasks';

type Options = {
  id: string;
  owner?: string;
  codeOwnersPath?: string;
};

export const scaffolderModule = createFactory<Options>({
  name: 'scaffolder-module',
  description:
    'An module exporting custom actions for @backstage/plugin-scaffolder-backend',
  optionsDiscovery: async () => ({
    codeOwnersPath: await getCodeownersFilePath(paths.targetRoot),
  }),
  optionsPrompts: [
    {
      type: 'input',
      name: 'id',
      message: 'Enter the name of the module [required]',
      validate: (value: string) => {
        if (!value) {
          return 'Please enter the name of the module';
        } else if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(value)) {
          return 'Module names must be lowercase and contain only letters, digits, and dashes.';
        }
        return true;
      },
    },
    ownerPrompt(),
  ],
  async create(options: Options, ctx: CreateContext) {
    const { id } = options;
    const slug = `scaffolder-backend-module-${id}`;

    let name = `backstage-plugin-${slug}`;
    if (ctx.scope) {
      if (ctx.scope === 'backstage') {
        name = `@backstage/plugin-${slug}`;
      } else {
        name = `@${ctx.scope}/backstage-plugin-${slug}`;
      }
    }

    Task.log();
    Task.log(`Creating module ${chalk.cyan(name)}`);

    const targetDir = ctx.isMonoRepo
      ? paths.resolveTargetRoot('plugins', slug)
      : paths.resolveTargetRoot(`backstage-plugin-${slug}`);

    await executePluginPackageTemplate(ctx, {
      targetDir,
      templateName: 'scaffolder-module',
      values: {
        id,
        name,
        privatePackage: ctx.private,
        npmRegistry: ctx.npmRegistry,
        pluginVersion: ctx.defaultVersion,
      },
    });

    if (options.owner) {
      await addCodeownersEntry(`/plugins/${slug}`, options.owner);
    }

    await Task.forCommand('yarn install', { cwd: targetDir, optional: true });
    await Task.forCommand('yarn lint --fix', {
      cwd: targetDir,
      optional: true,
    });
  },
});
