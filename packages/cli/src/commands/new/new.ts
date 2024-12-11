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
import camelCase from 'lodash/camelCase';
import upperFirst from 'lodash/upperFirst';
import { isMonoRepo } from '@backstage/cli-node';
import { paths } from '../../lib/paths';
import { assertError } from '@backstage/errors';

import { Task } from '../../lib/tasks';
import {
  addCodeownersEntry,
  getCodeownersFilePath,
} from '../../lib/codeowners';
import { resolvePackageName } from '../../lib/new/factories/common/util';

import { executePluginPackageTemplate } from '../../lib/new/factories/common/tasks';
import {
  readCliConfig,
  templateSelector,
  verifyTemplate,
  promptOptions,
  populateOptions,
  createDirName,
} from './util';

export default async () => {
  const pkgJson = await fs.readJson(paths.resolveTargetRoot('package.json'));
  const cliConfig = pkgJson.backstage?.cli;

  const { templates, globals } = await readCliConfig(cliConfig);
  const template = await verifyTemplate(await templateSelector(templates));

  const codeOwnersFilePath = await getCodeownersFilePath(paths.targetRoot);

  const prompts = await promptOptions({
    prompts: template.prompts || [],
    globals,
    codeOwnersFilePath,
  });
  const options = await populateOptions(prompts, template);

  const tempDirs = new Array<string>();
  async function createTemporaryDirectory(name: string): Promise<string> {
    const dir = await fs.mkdtemp(joinPath(os.tmpdir(), name));
    tempDirs.push(dir);
    return dir;
  }

  const dirName = createDirName(template, options);
  const targetDir = paths.resolveTargetRoot(options.targetPath, dirName);

  let modified = false;
  try {
    await executePluginPackageTemplate(
      {
        private: options.private,
        defaultVersion: options.baseVersion,
        license: options.license,
        isMonoRepo: await isMonoRepo(),
        createTemporaryDirectory,
        markAsModified() {
          modified = true;
        },
      },
      {
        targetDir,
        templateDir: template.templatePath,
        values: {
          name: resolvePackageName({
            baseName: dirName,
            scope: options.scope,
            plugin: template.plugin ?? true,
          }),
          pluginVersion: options.baseVersion,
          moduleVar: `${camelCase(options.id)}Module${camelCase(
            options.moduleId,
          )[0].toUpperCase()}${camelCase(options.moduleId).slice(1)}`, // used in default-backend-module template
          extension: `${upperFirst(camelCase(options.id))}Page`, // used in default-plugin template
          pluginVar: `${camelCase(options.id)}Plugin`, // used in default-backend-plugin and default-plugin template
          ...options,
        },
      },
    );

    // create additional actions
    // install to app
    // install to backend
    // add to backend/index.ts

    if (options.install) {
      // 🚨 temporary
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
    }

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
