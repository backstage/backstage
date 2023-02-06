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
import { resolve as resolvePath, relative as relativePath } from 'path';
import { paths } from '../../../paths';
import { Task, templatingTask } from '../../../tasks';
import { Lockfile } from '../../../versioning';
import { createPackageVersionProvider } from '../../../version';
import { CreateContext } from '../../types';

// Inspired by https://github.com/xxorax/node-shell-escape/blob/master/shell-escape.js
function escapeShellArg(s: string) {
  let res = `'${s.replace(/'/g, "'\\''")}'`;
  res = res.replace(/^(?:'')+/g, '').replace(/\\'''/g, "\\'");
  return res;
}

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
  const shortPluginDir = relativePath(paths.targetRoot, targetDir);
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
    ctx.isMonoRepo,
  );

  // Format package.json if it exists
  const pkgJsonPath = resolvePath(tempDir, 'package.json');
  if (await fs.pathExists(pkgJsonPath)) {
    const pkgJson = await fs.readJson(pkgJsonPath);
    await fs.writeJson(pkgJsonPath, pkgJson, { spaces: 2 });
  }

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

export async function executePluginTemplateFromGitURL(
  ctx: CreateContext,
  options: {
    templateGitURL: string;
    targetDir: string;
    values: Record<string, unknown>;
  },
) {
  const { targetDir, templateGitURL } = options;

  let lockfile: Lockfile | undefined;
  try {
    lockfile = await Lockfile.load(paths.resolveTargetRoot('yarn.lock'));
  } catch {
    /* ignored */
  }

  Task.section('Checking Prerequisites');
  const shortPluginDir = relativePath(paths.targetRoot, targetDir);
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

  // construct clone command of passed url
  Task.section(`Cloning Template - ${templateGitURL}`);
  const gitCloneCommand = `git clone ${escapeShellArg(
    templateGitURL,
  )} ${tempDir}`;

  //
  await Task.forCommand(gitCloneCommand);

  await Task.forCommand('rm -rf .git', { cwd: tempDir });

  Task.section('Executing Template');
  await templatingTask(
    paths.resolveOwn(tempDir),
    tempDir,
    options.values,
    createPackageVersionProvider(lockfile),
    ctx.isMonoRepo,
  );

  // Format package.json if it exists
  const pkgJsonPath = resolvePath(tempDir, 'package.json');
  if (await fs.pathExists(pkgJsonPath)) {
    const pkgJson = await fs.readJson(pkgJsonPath);
    await fs.writeJson(pkgJsonPath, pkgJson, { spaces: 2 });
  }

  Task.section('Installing');
  await Task.forItem('moving', shortPluginDir, async () => {
    await fs.move(tempDir, targetDir).catch(error => {
      throw new Error(
        `Failed to move package from ${tempDir} to ${targetDir}, ${error.message}`,
      );
    });
  });

  Task.forCommand('yarn install', { cwd: paths.ownRoot });

  ctx.markAsModified();
}
