/*
 * Copyright 2020 Spotify AB
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
import fs from 'fs-extra';
import { createLogPipeFactory } from './logger';
import { findAllDeps } from './packages';
import { startWatcher, startPackageWatcher } from './watcher';
import { startCompiler } from './compiler';
import { run } from '../run';
import { paths } from '../paths';

const PACKAGE_BLACKLIST = [
  // We never want to watch for changes in the cli, but all packages will depend on it.
  '@backstage/cli',
];

const WATCH_LOCATIONS = ['package.json', 'src', 'assets'];

export type Options = {
  build?: boolean;
};

// Start watching for dependency changes.
// The returned promise resolves when watchers have started for all current dependencies.
export async function watchDeps(options: Options = {}) {
  const localPackagePath = paths.resolveTarget('package.json');

  // Rotate through different prefix colors to make it easier to differenciate between different deps
  const createLogPipe = createLogPipeFactory([
    chalk.yellow,
    chalk.blue,
    chalk.magenta,
    chalk.green,
    chalk.cyan,
  ]);

  // Find all direct and transitive local dependencies of the current package.
  const packageData = await fs.readFile(localPackagePath, 'utf8');
  const packageJson = JSON.parse(packageData);
  const packageName = packageJson.name;

  const deps = await findAllDeps(packageName, PACKAGE_BLACKLIST);

  if (options.build) {
    await run('lerna', [
      'run',
      '--scope',
      packageName,
      '--include-dependencies',
      'build',
    ]);
  }

  // We lazily watch all our deps, as in we don't start the actual watch compiler until a change is detected
  const watcher = await startWatcher(deps, WATCH_LOCATIONS, (pkg) => {
    startCompiler(pkg, createLogPipe(pkg.name)).promise.catch((error) => {
      process.stderr.write(`${error}\n`);
    });
  });

  await startPackageWatcher(localPackagePath, async () => {
    const newDeps = await findAllDeps(packageName, PACKAGE_BLACKLIST);
    await watcher.update(newDeps);
  });
}
