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

import { resolve as resolvePath } from 'path';
import chalk from 'chalk';
import chokidar from 'chokidar';
import { Package } from './packages';
import { createLogger } from './logger';

export type Watcher = {
  update(newPackages: Package[]): Promise<void>;
};

/*
 * Watch for changes inside a collection of packages. When a change is detected, stop
 * watching and call the callback with the package the change occured in.
 *
 * The returned promise is resolved once all watchers are ready.
 */
export async function startWatcher(
  packages: Package[],
  paths: string[],
  callback: (pkg: Package) => void,
): Promise<Watcher> {
  const watchedPackageLocations = new Set<string>();
  const logger = createLogger();

  const watchPackage = async (pkg: Package) => {
    let signalled = false;
    watchedPackageLocations.add(pkg.location);

    const watchLocations = paths.map(path => resolvePath(pkg.location, path));
    const watcher = chokidar
      .watch(watchLocations, {
        cwd: pkg.location,
        ignoreInitial: true,
        disableGlobbing: true,
      })
      .on('all', () => {
        if (!signalled) {
          signalled = true;
          callback(pkg);
        }
        watcher.close();
      });

    return new Promise((resolve, reject) => {
      watcher.on('ready', resolve);
      watcher.on('error', reject);
    });
  };

  const update = async (newPackages: Package[]) => {
    const promises = new Array<Promise<unknown>>();

    for (const pkg of newPackages) {
      if (watchedPackageLocations.has(pkg.location)) {
        continue;
      }

      logger.out(chalk.green(`Starting watch of new dependency ${pkg.name}`));
      promises.push(watchPackage(pkg));
    }

    await Promise.all(promises);
  };

  await Promise.all(packages.map(watchPackage));

  return { update };
}

/**
 * Watch a package.json for updates
 */
export function startPackageWatcher(packagePath: string, callback: () => void) {
  let changed = false;
  let working = false;

  const notifyDeps = async () => {
    changed = true;
    if (working) {
      return;
    }
    working = true;
    changed = false;

    try {
      await callback();
    } finally {
      working = false;
      // Keep going if a change was emitted while working
      if (changed) {
        notifyDeps();
      }
    }
  };

  const watcher = chokidar
    .watch(packagePath, {
      ignoreInitial: true,
      disableGlobbing: true,
    })
    .on('all', () => {
      notifyDeps();
    });

  return new Promise((resolve, reject) => {
    watcher.on('ready', resolve);
    watcher.on('error', reject);
  });
}
