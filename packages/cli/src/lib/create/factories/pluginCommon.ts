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
import { ownerPrompt, pluginIdPrompt } from './common/prompts';
import { executePluginPackageTemplate } from './common/tasks';

type Options = {
  id: string;
  owner?: string;
  codeOwnersPath?: string;
};

export const pluginCommon = createFactory<Options>({
  name: 'plugin-common',
  description: 'A new isomorphic common plugin package',
  optionsDiscovery: async () => ({
    codeOwnersPath: await getCodeownersFilePath(paths.targetRoot),
  }),
  optionsPrompts: [pluginIdPrompt(), ownerPrompt()],
  async create(options: Options, ctx: CreateContext) {
    const id = `${options.id}-common`;
    const name = ctx.scope ? `@${ctx.scope}/plugin-${id}` : `plugin-${id}`;

    Task.log();
    Task.log(`Creating backend plugin ${chalk.cyan(name)}`);

    const targetDir = ctx.isMonoRepo
      ? paths.resolveTargetRoot('plugins', id)
      : paths.resolveTargetRoot(`backstage-plugin-${id}`);

    await executePluginPackageTemplate(ctx, {
      targetDir,
      templateName: 'default-common-plugin-package',
      values: {
        id,
        name,
        privatePackage: ctx.private,
        npmRegistry: ctx.npmRegistry,
        pluginVersion: ctx.defaultVersion,
      },
    });

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
