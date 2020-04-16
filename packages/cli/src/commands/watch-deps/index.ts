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
import { createLoggerFactory } from './logger';
import { findAllDeps } from './packages';
import { startWatcher, startPackageWatcher } from './watcher';
import { startCompiler } from './compiler';
import { startChild } from './child';
import { waitForExit, run } from 'helpers/run';
import { paths } from 'helpers/paths';
import { Command } from 'commander';

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
  const logFactory = createLoggerFactory([
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
  const watcher = await startWatcher(deps, WATCH_LOCATIONS, pkg => {
    startCompiler(pkg, logFactory(pkg.name)).promise.catch(error => {
      process.stderr.write(`${error}\n`);
    });
  });

  await startPackageWatcher(localPackagePath, async () => {
    const newDeps = await findAllDeps(packageName, PACKAGE_BLACKLIST);
    await watcher.update(newDeps);
  });
}

/*
 * The watch-deps command is meant to improve iteration speed while working in a large monorepo
 * with packages that are built independently, meaning packages depends on each other's build output.
 *
 * The command traverses all dependencies of the current package within the monorepo, and starts
 * watching for updates in all those packages. If a change is detected, we stop listening for changes,
 * and instead start up watch mode for that package. Starting watch mode means running the first
 * available yarn script out of "build:watch", "watch", or "build" --watch.
 */
export default async (cmd: Command, args: string[]) => {
  const options: Options = {};

  if (cmd.build) {
    options.build = true;
  }

  await watchDeps(options);

  if (args?.length) {
    await waitForExit(startChild(args));
  }
};
