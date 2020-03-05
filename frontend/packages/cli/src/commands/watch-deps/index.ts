import { resolve as resolvePath } from 'path';
import chalk from 'chalk';

import { createLoggerFactory } from './logger';
import { getPackageDeps } from './packages';
import { startWatcher, startPackageWatcher } from './watcher';
import { startCompiler } from './compiler';
import { startChild } from './child';

const PACKAGE_BLACKLIST = [
  // We never want to watch for changes in the cli, but all packages will depend on it.
  '@spotify-backstage/cli',
];

const WATCH_LOCATIONS = ['package.json', 'src', 'assets'];

/*
 * The watch-deps command is meant to improve iteration speed while working in a large monorepo
 * with packages that are built independently, meaning packages depends on each other's build output.
 *
 * The command traverses all dependencies of the current package within the monorepo, and starts
 * watching for updates in all those packages. If a change is detected, we stop listening for changes,
 * and instead start up watch mode for that package. Starting watch mode means running the first
 * available yarn script out of "build:watch", "watch", or "build" --watch.
 */
export default async (_command: any, args: string[]) => {
  const localPackagePath = resolvePath('package.json');

  // Rotate through different prefix colors to make it easier to differenciate between different deps
  const logFactory = createLoggerFactory([
    chalk.yellow,
    chalk.blue,
    chalk.magenta,
    chalk.green,
    chalk.cyan,
  ]);

  // Find all direct and transitive local dependencies of the current package.
  const deps = await getPackageDeps(localPackagePath, PACKAGE_BLACKLIST);

  // We lazily watch all our deps, as in we don't start the actual watch compiler until a change is detected
  const watcher = await startWatcher(deps, WATCH_LOCATIONS, pkg => {
    startCompiler(pkg, logFactory(pkg.name)).promise.catch(error => {
      process.stderr.write(`${error}\n`);
    });
  });

  await startPackageWatcher(localPackagePath, async () => {
    const newDeps = await getPackageDeps(localPackagePath, PACKAGE_BLACKLIST);
    await watcher.update(newDeps);
  });

  if (args?.length) {
    startChild(args);
  }
};
