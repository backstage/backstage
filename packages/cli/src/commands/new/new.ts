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

import fs from 'fs-extra';
import camelCase from 'lodash/camelCase';
import upperFirst from 'lodash/upperFirst';
import { isMonoRepo } from '@backstage/cli-node';
import { assertError } from '@backstage/errors';

import { paths } from '../../lib/paths';
import { Task } from '../../lib/tasks';
import {
  addCodeownersEntry,
  getCodeownersFilePath,
} from '../../lib/codeowners';

import {
  readCliConfig,
  templateSelector,
  verifyTemplate,
} from '../../lib/new/templateSelector';
import { promptOptions } from '../../lib/new/prompts';
import {
  populateOptions,
  createDirName,
  resolvePackageName,
} from '../../lib/new/utils';
import { runAdditionalActions } from '../../lib/new/additionalActions';
import { executePluginPackageTemplate } from '../../lib/new/executeTemplate';
import { TemporaryDirectoryManager } from './TemporaryDirectoryManager';
import { OptionValues } from 'commander';

export default async (opts: OptionValues) => {
  const pkgJson = await fs.readJson(paths.resolveTargetRoot('package.json'));
  const cliConfig = pkgJson.backstage?.cli;

  const { templates, globals } = readCliConfig(cliConfig);
  const template = verifyTemplate(
    await templateSelector(templates, opts.select),
  );

  const codeOwnersFilePath = await getCodeownersFilePath(paths.targetRoot);

  const prompts = await promptOptions({
    prompts: template.prompts || [],
    globals,
    codeOwnersFilePath,
  });
  const options = populateOptions(prompts, template);

  const tmpDirManager = TemporaryDirectoryManager.create();

  const dirName = createDirName(template, options);
  const targetDir = paths.resolveTargetRoot(options.targetPath, dirName);

  const packageName = resolvePackageName({
    baseName: dirName,
    scope: options.scope,
    plugin: template.plugin ?? true,
  });

  const moduleVar =
    options.moduleId ??
    `${camelCase(options.id)}Module${camelCase(
      options.moduleId,
    )[0].toUpperCase()}${camelCase(options.moduleId).slice(1)}`; // used in default-backend-module template
  const extensionName = `${upperFirst(camelCase(options.id))}Page`; // used in default-plugin template
  const pluginVar = `${camelCase(options.id)}Plugin`; // used in default-backend-plugin and default-plugin template

  let modified = false;
  try {
    await executePluginPackageTemplate(
      {
        isMonoRepo: await isMonoRepo(),
        createTemporaryDirectory: tmpDirManager.createDir,
        markAsModified() {
          modified = true;
        },
      },
      {
        targetDir,
        templateDir: template.templatePath,
        values: {
          name: packageName,
          privatePackage: options.private,
          pluginVersion: options.baseVersion,
          moduleVar,
          extensionName,
          pluginVar,
          ...options,
        },
      },
    );

    if (template.additionalActions?.length) {
      await runAdditionalActions(template.additionalActions, {
        name: packageName,
        version: options.baseVersion,
        id: options.id, // for frontend legacy
        extensionName, // for frontend legacy
      });
    }

    if (options.owner) {
      await addCodeownersEntry(targetDir, options.owner);
    }

    await Task.forCommand('yarn install', {
      cwd: targetDir,
      optional: true,
    });
    await Task.forCommand('yarn lint --fix', {
      cwd: targetDir,
      optional: true,
    });

    Task.log();
    Task.log(`🎉  Successfully created ${template.id}`);
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

      Task.error(`🔥  Failed to create ${template.id}!`);
    }
  } finally {
    tmpDirManager.cleanup();
  }
};
