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
import { paths } from '../../../paths';
import { Task, templatingTask } from '../../../tasks';
import { Lockfile } from '../../../versioning';
import { createPackageVersionProvider } from '../../../version';
import { CreateContext } from '../../types';

export async function executePluginPackageTemplate(
  ctx: CreateContext,
  options: {
    templateName: string;
    targetDir: string;
    values: Record<string, unknown>;
  },
) {
  const { targetDir } = options;

  let lockfile: Lockfile | undefined;
  try {
    lockfile = await Lockfile.load(paths.resolveTargetRoot('yarn.lock'));
  } catch {
    /* ignored */
  }

  Task.section('Checking Prerequisites');
  const shortPluginDir = targetDir.replace(`${paths.targetRoot}/`, '');
  await Task.forItem('availability', shortPluginDir, async () => {
    if (await fs.pathExists(targetDir)) {
      throw new Error(
        `A package with the same plugin ID already exists at ${chalk.cyan(
          shortPluginDir,
        )}. Please try again with a different ID.`,
      );
    }
  });

  const tempDir = await Task.forItem('creating', 'temp dir', async () => {
    return await ctx.createTemporaryDirectory('backstage-create');
  });

  Task.section('Executing Template');
  await templatingTask(
    paths.resolveOwn('templates', options.templateName),
    tempDir,
    options.values,
    createPackageVersionProvider(lockfile),
  );

  Task.section('Installing');
  await Task.forItem('moving', shortPluginDir, async () => {
    await fs.move(tempDir, targetDir).catch(error => {
      throw new Error(
        `Failed to move package from ${tempDir} to ${targetDir}, ${error.message}`,
      );
    });
  });

  ctx.markAsModified();
}
