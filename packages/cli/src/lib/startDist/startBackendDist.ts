/*
 * Copyright 2023 The Backstage Authors
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

import { resolve as resolvePath, relative as relativePath } from 'path';
import fs from 'fs-extra';
import { tmpdir } from 'os';
import tar from 'tar';
import { paths } from '../paths';
import { run, waitForExit } from '../run';
import once from 'lodash/once';
import { spawn } from 'child_process';
import { detectYarnVersion } from '../yarn';

const YARN_FILES = ['.yarn', '.yarnrc', '.yarnrc.yml', 'yarn.lock'];

export interface BackendStartDistOptions {
  targetDir: string;
  inspectEnabled: boolean;
  inspectBrkEnabled: boolean;
}

function onExit(callback: () => void) {
  const cb = once(callback);
  process.on('SIGTERM', cb);
  process.on('SIGINT', cb);
  process.on('exit', cb);
}

async function createTmpAppDir() {
  const appDir = await fs.mkdtemp(
    resolvePath(tmpdir(), 'backstage-backend-start-'),
  );
  onExit(() => fs.removeSync(appDir));
  return appDir;
}

async function installBundle(appDir: string, options: BackendStartDistOptions) {
  const bundlePath = resolvePath(options.targetDir, 'dist/bundle.tar.gz');

  if (!(await fs.pathExists(bundlePath))) {
    throw new Error(
      `No backend bundle not found at ${bundlePath}, did you run 'yarn build' first?`,
    );
  }

  await tar.extract({
    cwd: appDir,
    file: bundlePath,
  });

  for (const yarnFile of YARN_FILES) {
    const fromPath = paths.resolveTargetRoot(yarnFile);
    const toPath = resolvePath(appDir, yarnFile);
    if (await fs.pathExists(fromPath)) {
      await fs.copy(fromPath, toPath);
    }
  }

  const yarnVersion = await detectYarnVersion(appDir);
  if (yarnVersion === 'berry') {
    // Tried caching the install, only speeds up by about 30% with gzip, by doubles non-cached installs
    await run('yarn', ['workspaces', 'focus', '--all', '--production'], {
      cwd: appDir,
    });
  } else {
    await run('yarn', ['install', '--production'], {
      cwd: appDir,
    });
  }
}

function runChild(appDir: string, options: BackendStartDistOptions) {
  const appDistDir = resolvePath(
    appDir,
    relativePath(paths.targetRoot, options.targetDir),
  );

  const optionArgs = new Array<string>();
  if (options.inspectEnabled) {
    optionArgs.push('--inspect');
  } else if (options.inspectBrkEnabled) {
    optionArgs.push('--inspect-brk');
  }

  const userArgs = process.argv
    .slice(['node', 'backstage-cli', 'package', 'start'].length)
    .filter(arg => !optionArgs.includes(arg) && arg !== '--dist');

  const child = spawn(
    process.execPath,
    [...optionArgs, appDistDir, ...userArgs],
    {
      cwd: options.targetDir,
      stdio: 'inherit',
    },
  );
  onExit(() => child.kill());

  return child;
}

export async function startBackendDist(options: BackendStartDistOptions) {
  const appDir = await createTmpAppDir();

  console.log(`Running app in ${appDir}`);

  await installBundle(appDir, options);

  const child = runChild(appDir, options);

  return async () => {
    await waitForExit(child);
  };
}
