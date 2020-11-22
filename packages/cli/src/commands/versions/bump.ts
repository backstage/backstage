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

import fs from 'fs-extra';
import semver from 'semver';
import { resolve as resolvePath } from 'path';
import { run } from '../../lib/run';
import { paths } from '../../lib/paths';
import {
  mapDependencies,
  fetchPackageInfo,
  Lockfile,
} from '../../lib/versioning';

const DEP_TYPES = [
  'dependencies',
  'devDependencies',
  'peerDependencies',
  'optionalDependencies',
];

type PkgVersionInfo = {
  range: string;
  name: string;
  location: string;
};

export default async () => {
  // First we discover all Backstage dependencies within our own repo
  const dependencyMap = await mapDependencies();

  // Next check with the package registry what the latest version of all of those dependencies are
  const targetVersions = new Map<string, string>();
  await workerThreads(16, dependencyMap.keys(), async name => {
    console.log(`Checking for updates of ${name}`);
    const info = await fetchPackageInfo(name);
    const latest = info['dist-tags'].latest;
    if (!latest) {
      throw new Error(`No latest version found for ${name}`);
    }

    targetVersions.set(name, latest);
  });

  // Then figure out which local packages need to have their dependencies bumped
  const versionBumps = new Map<string, PkgVersionInfo[]>();
  for (const [name, pkgs] of dependencyMap) {
    const targetVersion = targetVersions.get(name)!;
    for (const pkg of pkgs) {
      if (semver.satisfies(targetVersion, pkg.range)) {
        continue;
      }

      versionBumps.set(
        pkg.name,
        (versionBumps.get(pkg.name) ?? []).concat({
          name,
          location: pkg.location,
          range: `^${targetVersion}`, // TODO(Rugvip): Option to use something else than ^?
        }),
      );
    }
  }

  console.log();

  // Write all discovered version bumps to package.json in this repo
  if (versionBumps.size === 0) {
    console.log('All Backstage packages are up to date!');
  } else {
    console.log('Some packages are outdated, updating');
    console.log();

    await workerThreads(16, versionBumps.entries(), async ([name, deps]) => {
      const pkgPath = resolvePath(deps[0].location, 'package.json');
      const pkgJson = await fs.readJson(pkgPath);

      for (const dep of deps) {
        console.log(`Bumping ${dep.name} in ${name} to ${dep.range}`);

        for (const depType of DEP_TYPES) {
          if (depType in pkgJson && dep.name in pkgJson[depType]) {
            pkgJson[depType][dep.name] = dep.range;
          }
        }
      }

      await fs.writeJson(pkgPath, pkgJson, { spaces: 2 });
    });

    console.log();
    console.log("Running 'yarn install' to install new versions");
    console.log();
    await run('yarn', ['install']);
  }

  console.log();

  // Finally we make sure the new lockfile doesn't have any duplicates
  const lockfile = await Lockfile.load(paths.resolveTargetRoot('yarn.lock'));
  const result = lockfile.analyze({
    filter: name => dependencyMap.has(name),
  });

  if (result.newVersions.length > 0) {
    console.log();
    console.log('Removing duplicate dependencies from yarn.lock');
    lockfile.replaceVersions(result.newVersions);
    await lockfile.save();

    console.log(
      "Running 'yarn install' to remove duplicates from node_modules",
    );
    console.log();
    await run('yarn', ['install']);

    console.log();
  }

  if (result.newRanges.length > 0) {
    throw new Error(
      `Version bump failed for ${result.newRanges.map(i => i.name).join(', ')}`,
    );
  }
};

async function workerThreads<T>(
  count: number,
  items: IterableIterator<T>,
  fn: (item: T) => Promise<void>,
) {
  const queue = Array.from(items);

  async function pop() {
    const item = queue.pop()!;
    if (!item) {
      return;
    }

    await fn(item);
    await pop();
  }

  return Promise.all(
    Array(count)
      .fill(0)
      .map(pop),
  );
}
